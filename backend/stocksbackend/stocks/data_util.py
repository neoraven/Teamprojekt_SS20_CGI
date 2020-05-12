import json
import time
from urllib.request import urlopen

import pandas as pd
from alpha_vantage.timeseries import TimeSeries
from django.shortcuts import render
from pytickersymbols import PyTickerSymbols

from .models import Price, Stock


KEY = '1077F37TLBGNSVY2'
OUTPUT_FORMAT = 'pandas'


# Create your views here.
def index(request):
    return render(request, 'stocks/index.html')


def get_jsonparsed_data(url):
    """
    Receive the content of ``url``, parse it as JSON and return the object.

    Parameters
    ----------
    url : str

    Returns
    -------
    dict
    """
    response = urlopen(url)
    data = response.read().decode("utf-8")
    return json.loads(data)


def load_symbols_and_names(indices):
    company_symbols = []
    ticker = PyTickerSymbols()
    for i in indices:
        symbols_index_object = ticker.get_stocks_by_index(i)
        symbols_index_list = list(pd.DataFrame(symbols_index_object)['symbol'])
        for j in symbols_index_list:
            if j not in company_symbols:
                company_symbols.append(j)

    company_symbols.sort()

    company_names = []
    for i in company_symbols:
        company_profile_url = "https://financialmodelingprep.com/api/v3/company/profile/"
        company_profile_url += i

        company_profile = get_jsonparsed_data(company_profile_url)
        company_names.append(company_profile["profile"]["companyName"])

    return company_symbols, company_names


def save_data():

    ts = TimeSeries(key=KEY, output_format=OUTPUT_FORMAT)

    indices = ['NASDAQ 100']
    company_symbols, company_names = load_symbols_and_names(indices)

    for i in range(len(company_symbols)):
        data, meta_data = ts.get_daily(symbol=company_symbols[i], outputsize='full')
        date = data.index.tolist()
        for j in range(len(date)):
            Stock(symbol=company_symbols[i],
                  company_names=company_names[i]).save()

            Price(symbol=[company_symbols[i]],
                  date=date[j],
                  p_low=data['3. low'][j],
                  p_open=data['1. open'][j],
                  p_high=data['2. high'][j],
                  p_close=data['4. close'][j],
                  volume=data['5. volume'][j],
                  ).save()

        time.sleep(15)


'''
schedule.every().day.at("01:00").do(save_data(), "It is 01:00")  # Run's code everyday at 01:00 a.m

while True:
    schedule.run_pending()  # Run all jobs that are scheduled to run
    time.sleep(60)  # Wait one minute
'''
