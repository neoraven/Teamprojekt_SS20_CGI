import time
from itertools import cycle

from datetime import datetime
import pandas as pd
from alpha_vantage.timeseries import TimeSeries
from django.contrib.auth.models import User

from .models import Price, Stock

_AV_API_KEY = "6CYJ430CSUYT2B19"
_AV_API_KEY_LIST = ["1077F37TLBGNSVY2", "H73WEF95O0IAME5U", "6CYJ430CSUYT2B19"]
_AV_OUTPUT_FORMAT = "pandas"
_AV_OUTPUT_SIZE = "full"
_AV_TIME_PER_CALL = 60 / 5  # 5 calls per minute

_DEFAULT_RETRY_WAIT_DURATION = 5.0

SP_500_STOCKLIST_URL = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"

STOCK_ALIAS_DICT = {
    "BF.B": "BFB",
}


def get_companies(start_from=None):
    print(start_from)
    payload = pd.read_html(SP_500_STOCKLIST_URL)
    df = payload[0]  # there are 2 tables on this site
    df["Symbol"].replace(STOCK_ALIAS_DICT, inplace=True)

    symbols, names = df["Symbol"].tolist(), df["Security"].tolist()
    # check if custom symbol start location is set > slice symbol list
    if start_from is not None:
        assert start_from in symbols, f"Invalid start_from symbol `{start_from}`."
        start_from_idx = symbols.index(start_from)
        symbols, names = symbols[start_from_idx:], names[start_from_idx:]
    return zip(symbols, names)


def initial_load(**kwargs):
    companies = get_companies(**kwargs)

    print("Symbols and names loaded")
    print("-------------------------------------")

    av_api_key_timers = {key: 0 for key in _AV_API_KEY_LIST}
    av_api_key_cycler = cycle(av_api_key_timers.keys())

    ts = TimeSeries(key="demo", output_format=_AV_OUTPUT_FORMAT)

    for company_symbol, company_name in companies:
        stock, stock_created = Stock.objects.get_or_create(
            symbol=company_symbol, defaults={"company_name": company_name}
        )
        append_str = "created." if stock_created else "already exists."
        print(f"Stock symbol {company_symbol} {append_str}.")
        print("> Working on prices...")

        av_curr_key = next(av_api_key_cycler)
        av_curr_key_time_elapsed = time.time() - av_api_key_timers[av_curr_key]
        av_time_to_wait = _AV_TIME_PER_CALL - av_curr_key_time_elapsed
        if av_time_to_wait > 0:
            print(
                f"Not enough time has passed since last Alphavantage API call.\n"
                f"Waiting an additional {av_time_to_wait} seconds..."
            )
            time.sleep(av_time_to_wait)

        ts.key = av_curr_key
        pull_write_prices_for_symbol(ts=ts, symbol=company_symbol)
        av_api_key_timers[av_curr_key] = time.time()


def pull_write_prices_for_symbol(ts: TimeSeries, symbol: str, interval: str = "1d"):
    price_data = None
    while price_data is None:
        try:
            price_data, _ = ts.get_daily_adjusted(
                symbol=symbol, outputsize=_AV_OUTPUT_SIZE
            )
        except ValueError:
            print(
                f"Encountered error requesting data from API at symbol {symbol}."
                f"Retrying in {_DEFAULT_RETRY_WAIT_DURATION}s..."
            )
            time.sleep(_DEFAULT_RETRY_WAIT_DURATION)
    for idx, price in enumerate(price_data.itertuples()):
        django_price, price_created = Price.objects.update_or_create(
            symbol=Stock.objects.get(symbol=symbol),
            interval=interval,
            date=price.Index.date(),
            defaults={
                "p_low": price._3,
                "p_open": price._1,
                "p_high": price._2,
                "p_close": price._4,
                "p_adjusted_close": price._5,
                "volume": price._6,
                "dividend_amount": price._7,
                "split_coefficient": price._8,
            },
        )
        if not price_created:
            print(f"Encountered duplicate price object on {price.Index.date()}.")
            break

    print(f"Finished writing {idx} new prices of {symbol}.")
