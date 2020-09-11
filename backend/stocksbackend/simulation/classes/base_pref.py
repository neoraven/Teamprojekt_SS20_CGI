"""
This file defines a class interface for preferences
within the `defined_prefences` folder to implement.
Raises:
    NotImplementedError: Raised when the methods / functions of the `BasePreference` interface are called.
"""

from typing import Dict, Tuple
import pandas as pd


class BasePreference:
    """
    Interface for actual preferences to subclass.
    Every defined preference needs to implement `ALL` of the following functions:
        > apply()
    The following functions are optional, but should be implemented
    to make modifications of weights more understandable to the user:
        > give_reasons()
    """

    def __init__(
        self,
        feature_range: Tuple[float, float] = (-1, 1),
        value_range: Tuple[float, float] = (0, 100),
    ) -> float:
        """Initializes the BasePreference.
        This function will also be called by its subclasses.

        Args:
            feature_range (Tuple[float, float], optional): The value range that will be used in the actual, internal calculations. Defaults to (-1, 1).
            value_range (Tuple[float, float], optional): The value range the frontend uses for this preference. Defaults to (0, 100).
        """
        self.feature_range = feature_range
        self.value_range = value_range

    def rescale_pref_value(self, value: float):
        """Rescales an external value within `self.value_range`
        to an internal value with same relative positioning within `self.feature_range`.

        Args:
            value (float): The value to rescale.

        Returns:
            float: The value that was rescaled.
        
        Example calculation:
            > value_range: (0, 100)
            > feature_range: (-1, 1)
            > value: 25

            > result: -0.5
        """
        # formula from:
        # https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html
        min_max_scaled = (value - self.value_range[0]) / (
            self.value_range[1] - self.value_range[0]
        )
        return (
            min_max_scaled * (self.feature_range[1] - self.feature_range[0])
            + self.feature_range[0]
        )

    def rebalance(self, old_weights: Dict[str, float]) -> Dict[str, float]:
        """Rebalances positive and negative weights for the agent.
        Called after every defined_preference is applied!

        Args:
            old_weights (Dict[str, float]): Map of {symbol: weight}

        Returns:
            Dict[str, float]: Rebalanced map of {symbol: weight}

        Cases in which rebalancing takes place:
            > sum of positive weights > 1: rebalance such that the new sum of positives weights := 1.
            > a single negative weight is < -1: negative weight := -1
        """
        positive_weights_sum = sum([v for (k, v) in old_weights.items() if v > 0])
        for symbol, weight in old_weights.items():
            if positive_weights_sum > 1 and weight > 0:
                # The agent can't spend more than 100% of his capital,
                # so the positive weights need to rebalanced such that their sum is 1(00% of the agent's capital)
                old_weights[symbol] = weight / positive_weights_sum
            elif weight < 0:
                # The agent can't sell more stocks than he has > negative weights are capped (floor) by -1.
                old_weights[symbol] = max(weight, -1)
            else:
                continue

        return old_weights

    def apply(
        self,
        old_weights: Dict[str, float],
        market_state: pd.DataFrame,
        also_give_reasons: bool = False,
    ) -> Dict[str, float]:
        """Applies a given preference to incoming weights, according to its own parameters.
        Modifies the incoming weights / "applies a mask to them".

        Args:
            old_weights (Dict[str, float]): The weights to apply this preference to.
            market_state (pd.DataFrame): The market state to use for generating modified weights.
            also_give_reasons (bool, optional): Whether to also give a dictionary of reasons along with the new weights. Defaults to False.

        Raises:
            NotImplementedError: If this method (of the interface) is called.

        Returns:
            Dict[str, float]: A modified weight map of form {symbol: weight}
        """
        raise NotImplementedError(
            "This function needs to be overwritten by the subclass!"
        )
