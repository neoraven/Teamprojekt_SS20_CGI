from typing import Dict, Any

from datetime import date, datetime
import json
from django.core.serializers.json import DjangoJSONEncoder

from .classes.agent import Agent
from .classes.market import Market
from .classes import strategies


def start(
    strategy_name: str,
    starting_year: int,
    end_year: int,
    agent_starting_capital: float,
    market_name: str,
):
    market = Market(starting_year=starting_year, end_year=end_year, name=market_name)
    strategy_class = strategies.get_strategy(strategy_name=strategy_name)
    strategy = strategy_class()
    agent = Agent(
        starting_capital=agent_starting_capital,
        market=market,
        strategy=strategy,
        name="default",
    )
    agent.run_simulation()
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
