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
            return old_weights
        multiply_with = self.value / total_planned_cash_allocation
        for symbol, weight in old_weights.items():
            if weight > 0:
                old_weights[symbol] = weight * multiply_with

        return super().rebalance(old_weights=old_weights)
