from typing import Dict

import pandas as pd
from stocks.models import Price

_DJANGO_TO_PD_FIELDS = {"p_adjusted_close": "adjusted_close"}
_DJANGO_DECIMAL_COLS = ["adjusted_close", "dividend_amount"]


class Market:
    def __init__(self, starting_year: int, end_year: int, name: str = None):
        queryset = Price.objects.filter(
            date__year__gte=starting_year,
            date__year__lte=end_year,
            interval__iexact="1d",
        )
        list_of_columns = ["symbol", "date", "p_adjusted_close", "dividend_amount"]
        prices = pd.DataFrame.from_records(queryset.values_list(*list_of_columns))
        prices.columns = list_of_columns
        prices.rename(columns=_DJANGO_TO_PD_FIELDS, inplace=True)
        # sort by date ascending, then by symbol descending
        prices.date = pd.to_datetime(prices.date)
        for col in _DJANGO_DECIMAL_COLS:
            prices[col] = prices[col].apply(lambda x: float(x))
        prices.sort_values(by=["date", "symbol"], inplace=True, ascending=[True, False])
        self.prices = prices

        self.name = name or "default_market"
        self.max_date = None

    @property
    def available_symbols(self):
        return list(self.prices.symbol.unique())

    @property
    def current_date(self):
        return self.max_date or "Market has not yet started!"

    def get_most_recent_price(self, symbol: str) -> float:
        stock_mask = (self.prices.date == self.max_date) & (
            self.prices.symbol == symbol
        )
        return self.prices.loc[stock_mask].adjusted_close.values[0]

    def pay_dividends(self, stock_portfolio: Dict[str, float]) -> float:
        if not stock_portfolio:
            return 0.0
        dividend_amount = 0
        for stock, amount in stock_portfolio.items():
            dividend_mask = (self.prices.date == self.max_date) & (
                self.prices.symbol == stock
            )
            dividend_amount += (
                self.prices.loc[dividend_mask].dividend_amount.sum() * amount
            )
        if dividend_amount:
            print(f"Paid agents dividends of {dividend_amount}!")
        return dividend_amount

    def __iter__(self):
        self.curr = 1
        return self

    def __len__(self):
        return len(self.prices)

    def __next__(self) -> pd.DataFrame:
        if self.curr < len(self.prices.date.unique()):

            self.max_date = self.prices.date.sort_values().unique()[self.curr - 1]
            state = self.prices.loc[self.prices.date <= self.max_date]
            self.curr += 1
            return state
        #  we are on the last date of the prices > exit the iteration
        raise StopIteration

    def __str__(self):
        return f"Market [{self.name}] (current market_date: {self.max_date})"
