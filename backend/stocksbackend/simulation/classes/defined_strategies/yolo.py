from typing import Dict, Tuple

import pandas as pd
from dateutil.relativedelta import relativedelta

from ..base_strategy import BaseStrategy


class Yolo(BaseStrategy):
    def __init__(
        self,
        increments: str = "1weeks",
        top_n_stocks: int = 10,
        is_rising: bool = False,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self.increments = increments
        self.number, self.unit = self.parse_increments(increments)
        self.top_n_stocks = top_n_stocks
        self.is_rising = is_rising
        self.template_str = (
            "User selected strategy {} recommends {} with {}% confidence"
            " because it is within the top {} highest % {} stocks"
            " of the past {} {}."
        )

    def give_reasons(self, weights: Dict[str, float]) -> Dict[str, str]:
        reasons = {}
        for symbol, weight in weights.items():
            reasons[symbol] = self.template_str.format(
                self.__class__.__name__,
                symbol,
                round(weight * 100, 2),
                self.top_n_stocks,
                "rising" if self.is_rising else "falling",
                self.number,
                self.unit,
            )

        return reasons

    @staticmethod
    def parse_increments(increments) -> Tuple[int, str]:
        number = int("".join([c for c in increments if c.isdigit()]))
        unit = "".join([c for c in increments if c.isalpha()])
        return number, unit

    def weight(
        self,
        market_state: pd.DataFrame,
        agent_portfolio: Dict[str, int],
        is_recommendation: bool = False,
    ) -> Dict[str, float]:
        weights = {}
        current_date = market_state.date.max()
        period_start_date = current_date - relativedelta(**{self.unit: self.number})
        # print(period_start_date, current_date)

        period_market = market_state.loc[
            (period_start_date <= market_state.date)
            & (market_state.date < current_date)
        ]
        if not is_recommendation:
            if period_market.empty:
                return weights
        else:
            while (
                period_market.empty
                or period_market.date.min() == period_market.date.max()
            ):
                period_start_date -= relativedelta(days=1)
                period_market = market_state.loc[
                    (period_start_date <= market_state.date)
                    & (market_state.date < current_date)
                ]

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
            if abs_sum_of_rel_changes == 0.0:
                # we are not looking at an active trading period
                weights[symbol] = 0
            else:
                weights[symbol] = change / abs_sum_of_rel_changes

        return self.rebalance(current_portfolio=agent_portfolio, weights=weights)

    @staticmethod
    def rebalance(
        current_portfolio: Dict[str, int], weights: Dict[str, float]
    ) -> Dict[str, float]:
        for symbol in current_portfolio:
            if symbol not in weights.keys():
                weights[symbol] = -1

        return weights

    def recommend(self, market_state: pd.DataFrame) -> Dict[str, float]:
        return self.weight(
            market_state=market_state, agent_portfolio={}, is_recommendation=True
        )
