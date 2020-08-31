from typing import Dict
import pandas as pd

from ..base_strategy import BaseStrategy


class DogsOfTheStocks(BaseStrategy):
    def __init__(self, top_n_stocks: int = 10, increments="1days", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.top_n_stocks = top_n_stocks
        self.increments = increments
        self.last_date = None
        self.year_offsets = (-1, 0)
        self.template_str = (
            "User selected strategy {} recommends {} with {}% confidence"
            " because it is within the top {} (relative) dividend yielding stocks"
            " of the previous calendar year."
        )

    def give_reasons(self, weights: Dict[str, float]) -> Dict[str, str]:
        reasons = {}
        for symbol, weight in weights.items():
            reasons[symbol] = self.template_str.format(
                self.__class__.__name__,
                symbol,
                round(weight * 100, 2),
                self.top_n_stocks,
            )
        return reasons

    def did_skip(self, current_date, market_state: pd.DataFrame):
        if current_date.month != 1:
            return False
        if self.last_date is None:
            return (
                market_state.date.max().year - market_state.date.min().year == 1
                and self.increments == "1years"
            )

        did_we_skip = (
            self.last_date
            <= market_state.loc[
                market_state.date.dt.year == current_date.year
            ].date.min()
            <= current_date
        )
        # print(f"{current_date}: did we skip? => {did_we_skip}")
        return did_we_skip

    def weight(
        self,
        market_state: pd.DataFrame,
        agent_portfolio: Dict[str, float],
        is_recommendation: bool = False,
    ) -> Dict[str, float]:
        # make default weight map
        weights = {}
        stocks = set(market_state.symbol.unique())
        for stock in stocks:
            weights[stock] = 0.0

        current_date = market_state.date.max()
        if current_date.year == market_state.date.min().year:
            # there is no previous year
            self.last_date = current_date
            return weights
        if not is_recommendation:
            if current_date != market_state.loc[
                market_state.date.dt.year == current_date.year
            ].date.min() and not self.did_skip(
                current_date=current_date, market_state=market_state
            ):
                self.last_date = current_date
                # it's not the first trading day of the current year
                return weights

        prev_year = current_date.year - 1
        last_paid_divs = {}
        # all dividends paid last year
        dividends_paid_last_year_mask = (market_state.dividend_amount != 0.0) & (
            market_state.date.dt.year == prev_year
        )
        divs = market_state.loc[dividends_paid_last_year_mask].sort_values(by="date")
        div_yields = []
        for stock in stocks:
            # for every stock:
            # > get last paid dividend of prev. year
            # > get amount of times dividends were paid last year
            last_paid_divs[stock] = {}
            try:
                # if there were dividends paid last year, grab the last one
                last_paid_divs[stock]["amount"] = divs.loc[
                    divs.symbol == stock
                ].dividend_amount.values[-1]
            except IndexError:
                # there were no dividends paid last year
                last_paid_divs[stock]["amount"] = 0
            last_paid_divs[stock]["times_paid"] = len(divs.loc[divs.symbol == stock])

        for stock, dividend_data in last_paid_divs.items():
            # for every stock: multiply last paid dividend by number of times div
            # were paid last year,
            # and divide by the current stock price
            current_price_mask = (market_state.date == current_date) & (
                market_state.symbol == stock
            )
            current_price = market_state.loc[current_price_mask].adjusted_close.values[
                0
            ]
            current_stock = (
                stock,
                dividend_data["amount"] * dividend_data["times_paid"] / current_price,
            )
            div_yields.append(current_stock)

        # assign weights based on relative share of total yields
        div_yields.sort(key=lambda t: t[1], reverse=True)
        div_yields = div_yields[: self.top_n_stocks]
        total_yield_sum = sum([t[1] for t in div_yields])
        for symbol, div_yield in div_yields:
            weights[symbol] = div_yield / total_yield_sum

        # rebalancing
        weights = self.rebalance(current_portfolio=agent_portfolio, weights=weights)
        self.last_date = current_date
        return weights

    @staticmethod
    def rebalance(
        current_portfolio: Dict[str, int], weights: Dict[str, int]
    ) -> Dict[str, int]:
        # Are my current stocks no longer the highest dividend yield stocks? > sell them
        for symbol in current_portfolio.keys():
            if weights.get(symbol, 0) <= 0:
                weights[symbol] = -1

        return weights

    def recommend(self, market_state: pd.DataFrame):
        return self.weight(
            market_state=market_state, agent_portfolio={}, is_recommendation=True
        )
