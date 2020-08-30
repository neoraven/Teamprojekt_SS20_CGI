from typing import Dict, Tuple

import pandas as pd
from dateutil.relativedelta import relativedelta
import random

from stocks.models import Stock, Price

_DJANGO_TO_PD_FIELDS = {"p_adjusted_close": "adjusted_close"}
_DJANGO_DECIMAL_COLS = ["adjusted_close", "dividend_amount"]


class Market:
    def __init__(
        self,
        starting_year: int,
        end_year: int,
        name: str = None,
        debug_subset: int = None,
        increments: str = "1days",
    ):
        queryset = Price.objects.filter(
            date__year__gte=starting_year,
            date__year__lte=end_year,
            interval__iexact="1d",
        )
        if debug_subset:
            all_symbols = [stock.symbol for stock in Stock.objects.all()]
            choices = random.choices(all_symbols, k=debug_subset)
            queryset = queryset.filter(symbol__symbol__in=choices)

        list_of_columns = ["symbol", "date", "p_adjusted_close", "dividend_amount"]
        prices = pd.DataFrame.from_records(queryset.values_list(*list_of_columns))
        prices.columns = list_of_columns
        prices.rename(columns=_DJANGO_TO_PD_FIELDS, inplace=True)
        # sort by date ascending, then by symbol descending
        prices.date = pd.to_datetime(prices.date)
        for col in _DJANGO_DECIMAL_COLS:
            prices[col] = prices[col].apply(float)
        prices.sort_values(by=["date", "symbol"], inplace=True, ascending=[True, False])
        self.prices = prices
        print("===========MARKET LOADED===========")
        print(f"Market lowest date: {self.prices.date.min()}")
        self.name = name or "default_market"
        self.max_date, self.last_date = None, None
        self.number, self.unit = self.parse_increments(increments=increments)

    @staticmethod
    def parse_increments(increments) -> Tuple[int, str]:
        number = int("".join([c for c in increments if c.isdigit()]))
        unit = "".join([c for c in increments if c.isalpha()])
        return number, unit

    @property
    def available_symbols(self):
        return list(self.prices.symbol.unique())

    @property
    def current_date(self):
        return self.max_date or "Market has not yet started!"

    def get_most_recent_price(self, symbol: str) -> float:
        most_recent_date_mask = (self.prices.date <= self.max_date) & (
            self.prices.symbol == symbol
        )
        most_recent_date = self.prices.loc[most_recent_date_mask].date.max()
        price = self.prices.loc[
            (self.prices.symbol == symbol) & (self.prices.date == most_recent_date)
        ].adjusted_close.values[0]
        # print(f"Price for {symbol}@{most_recent_date}/{self.max_date}: {price}")
        return price

    def pay_dividends(self, stock_portfolio: Dict[str, float]) -> float:
        # print(f"Paying dividends for period: {self.last_date} > {self.max_date}")
        if not stock_portfolio:
            return 0.0
        dividend_amount = 0
        for stock, amount in stock_portfolio.items():
            dividend_mask = (
                (self.prices.date <= self.max_date)
                & (self.prices.date > self.last_date)
                & (self.prices.symbol == stock)
            )
            dividend_amount += (
                self.prices.loc[dividend_mask].dividend_amount.sum() * amount
            )
        if dividend_amount:
            print(f"Paid agents dividends of {dividend_amount}!")
        return dividend_amount

    def __iter__(self):
        self.max_date = self.prices.date.min()
        return self

    def __len__(self):
        return len(self.prices)

    def __next__(self) -> pd.DataFrame:

        if self.max_date < self.prices.date.max():
            self.last_date = self.max_date
            self.max_date += relativedelta(**{self.unit: self.number})
            self.max_date = min(self.max_date, self.prices.date.max())
            mask = self.prices.date <= self.max_date

            return mask
        #  we are on the last date of the prices > exit the iteration
        raise StopIteration

    def __str__(self):
        return f"Market [{self.name}] (current market_date: {self.max_date})"
