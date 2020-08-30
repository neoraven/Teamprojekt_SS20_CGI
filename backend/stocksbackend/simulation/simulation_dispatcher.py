from typing import Dict, Any

from datetime import date, datetime, timedelta
import json
import time

from django.core.serializers.json import DjangoJSONEncoder
from django.utils import dateparse, timezone

from .classes.agent import Agent
from .classes.market import Market
from .classes import strategies
from .classes.evaluator import TotalValueEvaluator, MovingValueChangeEvaluator

from portfolio.models import Transaction
from stocks.models import Stock
from .models import Simulation, Preferences, Evaluation, Recommendation


def start(
    user,
    strategy_name: str,
    strategy_kwargs: Dict[str, Any],
    starting_year: int,
    end_year: int,
    agent_starting_capital: float,
    risk_affinity: int,
    diversification: int,
    placeholder: int,
    debug_subset: int = None,
):
    if strategy_name == "DogsOfTheStocks":
        starting_year -= 1

    simulation = Simulation(
        user=user,
        strategy=strategy_name,
        starting_year=starting_year,
        end_year=end_year,
        agent_starting_capital=agent_starting_capital,
        agent_cash_left=agent_starting_capital,
    )
    simulation.save()

    preferences = Preferences(
        simulation=simulation,
        risk_affinity=risk_affinity,
        diversification=diversification,
        placeholder=placeholder,
    )
    preferences.save()

    market = Market(
        starting_year=starting_year, end_year=end_year, debug_subset=debug_subset
    )
    strategy_class = strategies.get_strategy(strategy_name=strategy_name)
    if strategy_kwargs:
        for kwarg in strategy_kwargs:
            if kwarg not in strategy_class.__init__.__code__.co_varnames:
                return {
                    "error": f"{kwarg} is not a valid input for strategy {strategy_name}"
                }
        strategy = strategy_class(**strategy_kwargs)
    else:
        try:
            strategy = strategy_class()
        except TypeError as e:
            missing_kwargs = [
                arg
                for arg in strategy_class.__init__.__code__.co_varnames
                if arg not in ["self", "args", "kwargs"]
            ]
            return {
                "error": f"Missing kwarg for strategy {strategy_name}: {missing_kwargs}"
            }

    agent = Agent(
        starting_capital=agent_starting_capital,
        market=market,
        strategy=strategy,
        evaluator=TotalValueEvaluator(),
    )
    started_simulation_at = time.time()
    agent.run_simulation()
    write_agent_trades_to_db(agent=agent, user=user, simulation=simulation)
    write_evaluation_results_to_db(agent=agent, simulation=simulation)
    write_recommendations_to_db(agent=agent, simulation=simulation)
    simulation.time_elapsed = timedelta(seconds=time.time() - started_simulation_at)
    simulation.agent_cash_left = agent.cash
    simulation.agent_end_portfolio_value = agent.get_own_total_value()
    simulation.save()

    return get_response_object(
        agent=agent, simulation=simulation, preferences=preferences
    )


def write_agent_trades_to_db(agent: Agent, user, simulation: Simulation):
    for transaction in agent.trading_history:
        transaction_dict = transaction._asdict()
        stock_instance = Stock.objects.get(symbol__iexact=transaction_dict["symbol"])
        t_date = datetime.utcfromtimestamp(
            transaction_dict["date"].astype(datetime) / 1e9
        )
        t_date = timezone.make_aware(value=t_date)
        instance = Transaction(
            user=user,
            symbol=stock_instance,
            amount=transaction_dict["amount"],
            date_posted=t_date,
            price_at=transaction_dict["stock_price"],
            simulation=simulation,
        )
        instance.save(is_simulation=True)


def write_evaluation_results_to_db(agent: Agent, simulation: Simulation):
    for evaluation_result in agent.evaluation_history:
        instance = Evaluation(
            date=evaluation_result["date"],
            score=evaluation_result["score"],
            simulation=simulation,
        )
        instance.save()


def write_recommendations_to_db(agent: Agent, simulation: Simulation):
    recommendations = agent.recommend()
    for symbol, weight in recommendations.items():
        instance = Recommendation(symbol=symbol, weight=weight, simulation=simulation)
        instance.save()


def get_response_object(
    agent: Agent, simulation: Simulation, preferences: Preferences
) -> Dict[Any, Any]:
    results = {}
    transactions = [trade._asdict() for trade in agent.trading_history]
    for transaction in transactions:
        t_date = datetime.utcfromtimestamp(transaction["date"].astype(datetime) / 1e9)
        transaction["date"] = timezone.make_aware(value=t_date)
    results["transactions"] = transactions
    results["current_portfolio"] = agent.portfolio
    starting_capital, current_portfolio_value = (
        agent.starting_capital,
        agent.get_own_total_value(),
    )
    results["current_cash"] = agent.cash
    results["performance"] = {
        "starting_capital": starting_capital,
        "current_portfolio_value": current_portfolio_value,
        "percent_change": current_portfolio_value / starting_capital - 1,
    }
    results["recommendation"] = agent.recommend()
    results["evaluation_history"] = agent.evaluation_history
    results["input"] = {
        "strategy": simulation.strategy,
        "dates": {"from": simulation.starting_year, "to": simulation.end_year},
        "preferences": {
            "risk_affinity": preferences.risk_affinity,
            "diversification": preferences.diversification,
            "placeholder": preferences.placeholder,
        },
    }
    results["sim_id"] = simulation.id
    return results
    return json.dumps(results, sort_keys=True, cls=DjangoJSONEncoder)
