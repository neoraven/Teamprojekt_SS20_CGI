from typing import Dict, Any

from datetime import date, datetime, timedelta
import json
import time

from django.core.serializers.json import DjangoJSONEncoder

from .classes.agent import Agent
from .classes.market import Market
from .classes import strategies

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
):
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

    market = Market(starting_year=starting_year, end_year=end_year)
    strategy_class = strategies.get_strategy(strategy_name=strategy_name)
    strategy = strategy_class()
    agent = Agent(
        starting_capital=agent_starting_capital, market=market, strategy=strategy,
    )
    started_simulation_at = time.time()
    agent.run_simulation()
    simulation.time_elapsed = timedelta(seconds=time.time() - started_simulation_at)
    simulation.save()

    return get_response_object(agent)


def get_response_object(agent: Agent) -> Dict[Any, Any]:
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
    return json.dumps(results, sort_keys=True, default=str)
