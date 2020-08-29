from typing import Dict, Any

from datetime import date, datetime, timedelta
import json
import time

from django.core.serializers.json import DjangoJSONEncoder

from .classes.agent import Agent
from .classes.market import Market
from .classes import strategies
from .classes.evaluator import TotalValueEvaluator, MovingValueChangeEvaluator

from portfolio.models import Transaction
from stocks.models import Stock
from .models import Simulation, Preferences


def start(
    user,
    strategy_name: str,
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
    strategy = strategy_class(top_n_stocks=10)
    agent = Agent(
        starting_capital=agent_starting_capital,
        market=market,
        strategy=strategy,
        evaluator=TotalValueEvaluator(),
    )
    started_simulation_at = time.time()
    agent.run_simulation()
    write_agent_trades_to_db(agent=agent, user=user, simulation=simulation)
    simulation.time_elapsed = timedelta(seconds=time.time() - started_simulation_at)
    simulation.save()

    return get_response_object(
        agent=agent, simulation=simulation, preferences=preferences
    )


def write_agent_trades_to_db(agent: Agent, user, simulation: Simulation):
    for transaction in agent.trading_history:
        transaction_dict = transaction._asdict()
        stock_instance = Stock.objects.get(symbol__iexact=transaction_dict["symbol"])
        instance = Transaction(
            user=user,
            symbol=stock_instance,
            amount=transaction_dict["amount"],
            date_posted=transaction_dict["date"],
            price_at=transaction_dict["stock_price"],
            simulation=simulation,
        )
        instance.save()


def get_response_object(
    agent: Agent, simulation: Simulation, preferences: Preferences
) -> Dict[Any, Any]:
    results = {}
    results["transactions"] = [trade._asdict() for trade in agent.trading_history]
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
    return json.dumps(results, sort_keys=True, default=str)
