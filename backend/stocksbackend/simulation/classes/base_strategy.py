"""
This file defines a class interface for strategies
within the `defined_strategies` folder to implement.
Raises:
    NotImplementedError: Raised when the methods / functions of the `BaseStrategy` interface are called.
"""

from typing import Dict
from pandas import DataFrame


class BaseStrategy:
    """
    Interface for actual strategies to subclass.
    Every defined strategy needs to implement `ALL` of the following functions:
        > weight()
        > recommend()
    The following functions are optional, but should be implemented
    to make recommendations more understandable to the user:
        > give_reasons()
    """

    def __init__(self, name: str = None, **kwargs):
        """Instantiates the BaseStrategy. Attaches a string-like name to the strategy.
        Subclasses can have a variety of specified extra kwargs.

        Args:
            name (str, optional): Name of the strategy. Defaults to the name of the class.
        """
        self.name = name or type(self).__name__

    def weight(
        self, market_state: DataFrame, agent_portfolio: Dict[str, float], **kwargs
    ) -> Dict[str, float]:
        """This function returns stock_symbols weights between [-1, 1].
        The definitions for what the values mean are as follows:
            - [-1, 0):  the agent should sell this much % of that symbol
                        of what he currently has in his portfolio
            - 0:        neutral weight
            - (0, 1]:   the agent should expend this much % of his current capital
                        to buy as many stocks of that symbol he can buy.             

        Args:
            market_state (DataFrame): Current market state that contains all the prices up until a certain date
            agent_portfolio (Dict[str, float]): The current {symbol: amount} the agent currently has in his portfolio

        Raises:
            NotImplementedError: Defined strategy should overwrite this

        Returns:
            Dict[str, float]: A map of {symbol: weight}.
        
        Sample output:
            weights = {
                "EXA": -0.7,
                "MPL": 0.75,
                "E": 0.1,
            }
        """
        raise NotImplementedError("Subclass needs to overwrite this function!")

    def recommend(self, market_state: DataFrame, **kwargs) -> Dict[str, float]:
        """Gives the actual stock purchase / sell recommendations to the user.
         This should be called at the end of the market's iteration,
         and gives similarly formatted output as the `weight` function.

        Args:
            market_state (DataFrame): Current market state that contains all the prices up until a certain date

        Raises:
            NotImplementedError: Defined strategy should overwrite this

        Returns:
            Dict[str, float]: A map of {symbol: weight}.
        
        Sample output:
            weights = {
                "EXA": -0.7,
                "MPL": 0.75,
                "E": 0.1,
            }
        """
        raise NotImplementedError("Subclass needs to overwrite this function!")

    def give_reasons(self, weights: Dict[str, float], **kwargs) -> Dict[str, str]:
        """This function returns a map of reasons for the weights.

        Args:
            weights (Dict[str, float]): Should be the output of the `recommend()` function.

        Raises:
            NotImplementedError: Defined strategy should overwrite this

        Returns:
            Dict[str, str]: A map of {symbol: reason}

        Sample output:
            {
                "EXA": "User should buy because [x].",
                "MPL": "User should sell because [y].",
            }
        """
        raise NotImplementedError("Subclass needs to overwrite this function!")
