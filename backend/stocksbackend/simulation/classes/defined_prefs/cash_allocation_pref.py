from typing import Dict, Tuple
import pandas as pd

from ..base_pref import BasePreference


class CashAllocationPreference(BasePreference):
    def __init__(self, value: float):
        super().__init__()
        self.value = value / 100

    def apply(self, old_weights: Dict[str, float], **kwargs) -> Dict[str, float]:
        total_planned_cash_allocation = sum([v for v in old_weights.values() if v > 0])
        if total_planned_cash_allocation <= self.value:
            if kwargs.get("also_give_reasons", False):
                return (
                    old_weights,
                    self.give_reasons(old_weights=old_weights, new_weights=old_weights),
                )
            else:
                return old_weights
        multiply_with = self.value / total_planned_cash_allocation
        for symbol, weight in old_weights.items():
            if weight > 0:
                old_weights[symbol] = weight * multiply_with

        new_weights = super().rebalance(old_weights=old_weights)

        if kwargs.get("also_give_reasons", False):
            return (
                new_weights,
                self.give_reasons(old_weights=old_weights, new_weights=new_weights),
            )

        return new_weights

    def give_reasons(
        self, old_weights: Dict[str, float], new_weights: Dict[str, float]
    ) -> Dict[str, str]:
        reasons = {}
        for symbol, new_weight in new_weights.items():
            change = new_weight - old_weights[symbol]
            if change == 0:
                reasons[
                    symbol
                ] = f"The {self.__class__.__name__} preference did not change this weight further as the user wanted all his capital to be invested."
            else:
                reasons[
                    symbol
                ] = f"The {self.__class__.__name__} preference rescaled this further to keep the user's cash investments below {round(self.value, 2)}%."

        return reasons
