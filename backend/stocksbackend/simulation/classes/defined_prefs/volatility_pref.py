from typing import Dict, Tuple
import pandas as pd
from dateutil.relativedelta import relativedelta

from ..base_pref import BasePreference


class VolatilityPreference(BasePreference):
    def __init__(
        self,
        value: float,
        length_of_period: str = "91days",
        global_over_local: bool = True,
    ):
        # 91 days := 1 quarter
        super().__init__()
        self.value = super().rescale_pref_value(value=value)
        self.neutral_value = 0
        self.number, self.unit = self.parse_increments(length_of_period)
        self.global_over_local = global_over_local

    @staticmethod
    def parse_increments(increments) -> Tuple[int, str]:
        number = int("".join([c for c in increments if c.isdigit()]))
        unit = "".join([c for c in increments if c.isalpha()])
        return number, unit

    def get_weighted_rel_std_shares(
        self, old_weights: Dict[str, float], market_state: pd.DataFrame, current_date
    ) -> float:
        if self.value == self.neutral_value:
            return old_weights
        from_date = current_date - relativedelta(**{self.unit: self.number},)
        if self.global_over_local:
            mean_vals = (
                market_state.loc[
                    (from_date <= market_state.date)
                    & (market_state.date < current_date)
                ]
                .groupby("symbol")
                .agg({"adjusted_close": ["std", "mean"]})
                .mean()
            )
        else:
            mean_vals = (
                market_state.loc[
                    (from_date <= market_state.date)
                    & (market_state.date <= current_date)
                    & (market_state.symbol.isin(old_weights.keys()))
                ]
                .groupby("symbol")
                .agg({"adjusted_close": ["std", "mean"]})
            )

        mean_std = (
            mean_vals[("adjusted_close", "std")] / mean_vals[("adjusted_close", "mean")]
        ).mean()

        rel_std_shares = {}
        agg_market_state = (
            market_state.loc[
                (from_date <= market_state.date)
                & (market_state.date < current_date)
                & (market_state.symbol.isin(old_weights.keys()))
            ]
            .groupby("symbol")
            .agg({"adjusted_close": ["std", "mean"]})
        )
        for symbol, weight in old_weights.items():
            if weight == 0:
                rel_std_shares[symbol] = weight
            std = agg_market_state.loc[agg_market_state.index == symbol][
                ("adjusted_close", "std")
            ].values[0]
            mean = agg_market_state.loc[agg_market_state.index == symbol][
                ("adjusted_close", "mean")
            ].values[0]
            rel_std_share = std / mean / mean_std - 1
            rel_std_shares[symbol] = rel_std_share

        return rel_std_shares

    def apply(
        self,
        old_weights: Dict[str, float],
        market_state: pd.DataFrame,
        current_date,
        also_give_reasons: bool = False,
    ) -> Dict[str, float]:
        original_weights = old_weights.copy()
        if self.value == self.neutral_value:
            if also_give_reasons:
                return (
                    super().rebalance(old_weights=old_weights),
                    self.give_reasons(
                        old_weights=original_weights, new_weights=original_weights
                    ),
                )
            else:
                return super().rebalance(old_weights=old_weights)
        rel_std_shares = self.get_weighted_rel_std_shares(
            old_weights=old_weights,
            market_state=market_state,
            current_date=current_date,
        )

        for symbol, weight in old_weights.items():
            change = weight * rel_std_shares[symbol] * self.value
            if weight < 0:
                old_weights[symbol] = min(0, weight + change)
            elif weight > 0:
                old_weights[symbol] = weight - change
            else:
                old_weights[symbol] = 0

        new_weights = super().rebalance(old_weights=old_weights)

        if also_give_reasons:

            return (
                new_weights,
                self.give_reasons(
                    old_weights=original_weights, new_weights=new_weights
                ),
            )

        return new_weights

    def give_reasons(
        self, old_weights: Dict[str, float], new_weights: Dict[str, float]
    ) -> Dict[str, str]:
        reasons = {}
        for symbol, old_weight in old_weights.items():
            change = new_weights[symbol] - old_weight
            reasons[symbol] = self.prepare_reason_string(change=change)

        return reasons

    def prepare_reason_string(self, change: float) -> str:
        increased_or_decreased = "increased" if change > 0 else "decreased"
        user_prefers = "volatility" if self.value > 0 else "invariability"
        prefers_by = f"{abs(self.value * 100)}%"
        if change == 0:
            local_or_global = (
                "all stocks available in the stock pool"
                if self.global_over_local
                else "the stocks in this recommendation set"
            )
            reason_why_not = (
                "a neutral value was selected for this preference"
                if self.value == 0
                else f"the volatility of the stock was neutral compared to {local_or_global}."
            )
            return f"The {self.__class__.__name__} preference did not change this weight because {reason_why_not}"

        return f"The {self.__class__.__name__} preference {increased_or_decreased} this weight by {round(change * 100, 2)}% because the user prefers more {user_prefers} stocks!"
