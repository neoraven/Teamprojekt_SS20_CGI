import sys
from .defined_strategies.dogs_of_the_stocks import DogsOfTheStocks


def verify_strategy(strategy_name: str) -> bool:

    try:
        current_module = sys.modules[__name__]
        strategy = getattr(current_module, strategy_name)
        return hasattr(strategy, "weight")
    except AttributeError:
        return False


def get_strategy(strategy_name: str):
    current_module = sys.modules[__name__]
    return getattr(current_module, strategy_name)
