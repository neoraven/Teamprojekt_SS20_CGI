import re
import time
from itertools import cycle

import pandas as pd
from alpha_vantage.timeseries import TimeSeries
from django.contrib.auth.models import User

from .models import Price, Stock

# SPECIFY THE KEYS
# Two api keys because of the limited amount of API Calls per day (500). Stocks# in S&P 500: 505

KEY_LIST = cycle(['1077F37TLBGNSVY2', 'H73WEF95O0IAME5U'])

OUTPUT_FORMAT = 'pandas'
OUTPUT_SIZE = 'full'

USERNAME = 'emre'
user = User.objects.filter(username=USERNAME).first()


# TODO: Check wikipedia list for updates automatically, eventually: ask before adding symbol (manual check)
def load():
    payload = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
    df = payload[0]

    company_symbols = df['Symbol'].values.tolist()

    for symbol in company_symbols:
        pattern = re.compile('[\W_]+')
        company_symbols[company_symbols.index(symbol)] = pattern.sub('', symbol)

    company_names = df['Security'].values.tolist()

    print("Symbols and names loaded")
    print("-------------------------------------")

    ts = TimeSeries(key=next(KEY_LIST), output_format=OUTPUT_FORMAT)

    for i in range(2):
        print(f'save {company_symbols[i]} instances...')
        data, meta_data = ts.get_daily(symbol=company_symbols[i], outputsize='full')
        date = data.index.tolist()
        Stock(symbol=company_symbols[i],
              company_name=company_names[i],
              ).save()
        for j in range(len(date)):
            if Price.objects.filter(
                    symbol=Stock.objects.get(symbol=company_symbols[i]),
                    date=date[j].date()
            ).exists():
                continue
            else:
                Price(symbol=Stock.objects.get(symbol=company_symbols[i]),
                      interval="1d",
                      date=date[j].date(),
                      p_low=data['3. low'][j],
                      p_open=data['1. open'][j],
                      p_high=data['2. high'][j],
                      p_close=data['4. close'][j],
                      volume=data['5. volume'][j]
                      ).save()
        print(f"{company_symbols[i]} instances saved")
        print(f"-------------------")
        time.sleep(2)

        ts = TimeSeries(key=next(KEY_LIST), output_format=OUTPUT_FORMAT)

