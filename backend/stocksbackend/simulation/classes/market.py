from typing import Dict, Tuple, List, Optional
from pandas._typing import Timestamp as PandasTimestamp

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
        increments: str = "1months",
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
    def parse_increments(increments: str) -> Tuple[int, str]:
        """Parses a time increment string of form `{number}{unit(s)}.

        Args:
            increments (str): The string to extract (number, unit) from. NO WHITESPACE ALLOWED!

        Returns:
            Tuple[int, str]: (amount, unit)

        Example output:
            "2weeks" --> (2, "weeks")
        """
        number = int("".join([c for c in increments if c.isdigit()]))
        unit = "".join([c for c in increments if c.isalpha()])
        return number, unit

    @property
    def available_symbols(self) -> List[str]:
        """List all the unique stock symbols available in the market.
        Is a `property`, not a function!

        Returns:
            List[str]: The list of all unique stock symbols in the market.
        """
        return list(self.prices.symbol.unique())

    @property
    def current_date(self) -> PandasTimestamp:
        """Returns the current date of the market's iteration (max. date).

        Returns:
            PandasTimestamp: The current date of the market's iteration, or a str if it hasn't started yet.
        """
        return self.max_date or "Market has not yet started!"

    def get_most_recent_price(
        self, symbol: str, for_date: Optional[PandasTimestamp] = None
    ) -> float:
        """Gets the most recent price of a given symbol, optionally for a specific date.
        If there is no price for a stock at a given date, the most recent price before that date is returned.

        Args:
            symbol (str): The stock symbol to fetch the most recent price for.
            for_date (Optional[PandasTimestamp], optional): If this is not None, fetches the price for that date instead.
                If not set, fetches most recent date according to the market's `max_date`. Defaults to None.

        Returns:
            float: The stock symbol's most recent CLOSING price.
        """
        for_date = for_date or self.max_date
        most_recent_date_mask = (self.prices.date <= for_date) & (
            self.prices.symbol == symbol
        )
        most_recent_date = self.prices.loc[most_recent_date_mask].date.max()
        price = self.prices.loc[
            (self.prices.symbol == symbol) & (self.prices.date == most_recent_date)
        ].adjusted_close.values[0]
        # print(f"Price for {symbol}@{most_recent_date}/{self.max_date}: {price}")
        return price

    def pay_dividends(self, stock_portfolio: Dict[str, float]) -> float:
        """Returns a sum of all dividend's according to a stock_portfolio
        for the last given trading period (as determined by the market's increments).

        Args:
            stock_portfolio (Dict[str, float]): The portfolio to pay dividends for. Map of {symbol: amount}. 

        Returns:
            float: A sum of all dividends paid in the market's last interval for the given portfolio.
                If no dividends were paid, `0.0` is returned.
        """
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

    def __len__(self) -> int:
        return len(self.prices)

    def __next__(self) -> pd.DataFrame.mask:

        if self.max_date < self.prices.date.max():
            if self.last_date:
                if self.max_date.year - self.last_date.year == 1:
                    print("=" * 20, f"new year: {self.max_date}")
            self.last_date = self.max_date
            self.max_date += relativedelta(**{self.unit: self.number})
            self.max_date = min(self.max_date, self.prices.date.max())
            mask = self.prices.date <= self.max_date

            return mask
        #  we are on the last date of the prices > exit the iteration
        raise StopIteration

    def __str__(self) -> str:
        return f"Market [{self.name}] (current market_date: {self.max_date})"
