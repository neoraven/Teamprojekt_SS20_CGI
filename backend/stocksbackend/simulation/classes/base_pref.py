from typing import Dict, Tuple
import pandas as pd


class BasePreference:
    def __init__(
        self,
        feature_range: Tuple[float, float] = (-1, 1),
        value_range: Tuple[float, float] = (0, 100),
    ):
        self.feature_range = feature_range
        self.value_range = value_range

    def rescale_pref_value(self, value: float):
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
        positive_weights_sum = sum([v for (k, v) in old_weights.items() if v > 0])
        for symbol, weight in old_weights.items():
            if positive_weights_sum > 1 and weight > 0:
                old_weights[symbol] = weight / positive_weights_sum
            elif weight < 0:
                old_weights[symbol] = max(weight, -1)
            else:
                continue

        return old_weights

    def apply(
        self, old_weights: Dict[str, float], market_state: pd.DataFrame
    ) -> Dict[str, float]:
        pass
