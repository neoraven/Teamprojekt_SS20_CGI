from typing import Dict, Tuple

import pandas as pd
from dateutil.relativedelta import relativedelta

from ..base_strategy import BaseStrategy


class Yolo(BaseStrategy):
    def __init__(
        self,
        increments: str = "2days",
        top_n_stocks: int = 10,
        is_rising: bool = True,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self.increments = increments
        self.number, self.unit = self.parse_increments(increments)
        self.top_n_stocks = top_n_stocks
        self.is_rising = is_rising

    @staticmethod
    def parse_increments(increments) -> Tuple[int, str]:
        number = int("".join([c for c in increments if c.isdigit()]))
        unit = "".join([c for c in increments if c.isalpha()])
        return number, unit

    def weight(
        self, market_state: pd.DataFrame, agent_portfolio: Dict[str, int]
    ) -> Dict[str, float]:
        weights = {}
        current_date = market_state.date.max()
        period_start_date = current_date - relativedelta(**{self.unit: self.number})
        # print(period_start_date, current_date)

        period_market = market_state.loc[
            (period_start_date <= market_state.date)
            & (market_state.date < current_date)
        ]
        print(len(period_market))
        if period_market.empty:
            return weights

        start_of_period_market = period_market.loc[
            period_market.date == period_market.date.min()
        ]
        end_of_period_market = period_market.loc[
            period_market.date == period_market.date.max()
        ]

        rel_changes = []

        for symbol in end_of_period_market.symbol.unique():
            try:
                price_at_start = start_of_period_market.loc[
                    start_of_period_market.symbol == symbol
                ].adjusted_close.values[0]
            except IndexError:
                rel_changes.append((symbol, 0))
                continue

            price_at_end = end_of_period_market.loc[
                end_of_period_market.symbol == symbol
            ].adjusted_close.values[0]

            rel_change = price_at_end / price_at_start - 1
            rel_changes.append((symbol, rel_change))

        rel_changes = sorted(rel_changes, key=lambda v: v[1], reverse=self.is_rising)[
            : self.top_n_stocks
        ]
        if any([pd.isna(v) for k, v in rel_changes]):
            print(rel_changes)

        abs_sum_of_rel_changes = abs(sum([v for k, v in rel_changes]))
        for symbol, change in rel_changes:
            weights[symbol] = change / abs_sum_of_rel_changes
            if pd.isna(change / abs_sum_of_rel_changes):
                # Division by zero
                weights[symbol] = 0

        return self.rebalance(current_portfolio=agent_portfolio, weights=weights)

    def rebalance(
        self, current_portfolio: Dict[str, int], weights: Dict[str, float]
    ) -> Dict[str, float]:
        for symbol in current_portfolio:
            if symbol not in weights.keys():
                weights[symbol] = -1

        return weights

    def recommend(self, market_state: pd.DataFrame) -> Dict[str, float]:
        return self.weight(market_state=market_state, agent_portfolio={})
