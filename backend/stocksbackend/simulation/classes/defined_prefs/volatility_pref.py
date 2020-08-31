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
        self, old_weights: Dict[str, float], market_state: pd.DataFrame, current_date
    ) -> Dict[str, float]:
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
        return super().rebalance(old_weights=old_weights)
