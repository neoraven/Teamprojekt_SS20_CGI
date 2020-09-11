"""This module serves as the hook for all other modules
trying to fetch any given defined strategy.
ANY strategy should be grabbed from here via the `get_strategy` function.  

Given defined strategies (classes that subclass the BaseStrategy)
should be imported from within the `defined_strategies` folder.
"""

import sys

# Do NOT remove these imports, as they are used by this module
# to dynamically fetch and return available V--defined strategies--V class instances.
from .defined_strategies.dogs_of_the_stocks import DogsOfTheStocks
from .defined_strategies.yolo import Yolo
from .base_strategy import BaseStrategy

# from .defined_strategies.markowitz import Markowitz


def verify_strategy(strategy_name: str) -> bool:
    """Verifies that a given `strategy_name` is a valid, defined strategy
    import by this module.

    Args:
        strategy_name (str): The name of the strategy to verify. CASE SENSITIVE!

    Any defined strategy needs to fulfill these criteria:
        > Is imported from the defined_strategies folder.
        > has a function called "weight".
        > That function "weight" is callable.

    Returns:
        bool:
            > True, if the strategy_name is a valid defined strategy
            > False, if it is not.
    """
    if not isinstance(strategy_name, str):
        return False
    try:
        current_module = sys.modules[__name__]
        strategy = getattr(current_module, strategy_name)
        return hasattr(strategy, "weight") and hasattr(
            getattr(strategy, "weight"), "__call__"
        )
    except AttributeError:
        # any of the above checks fail > strategy does not fulfill requirements to be valid.
        return False


def get_strategy(strategy_name: str) -> BaseStrategy:
    """Returns an (uninstantiated) class object of a given `strategy_name` after verifying it.

    Args:
        strategy_name (str): the given strategy to fetch the class object for.

    Raises:
        NotImplementedError: Raised when the strategy_name is not a valid strategy imported by this module.

    Returns:
        BaseStrategy: The (uninstantiated) class object.
    """
    if not verify_strategy(strategy_name=strategy_name):
        # The strategy is not imported in this module.
        raise NotImplementedError(
            f"The strategy `{strategy_name}` is not a valid strategy!"
        )
    # strategy_name is a valid defined strategy
    # > fetch the class object and return it
    current_module = sys.modules[__name__]
    return getattr(current_module, strategy_name)
