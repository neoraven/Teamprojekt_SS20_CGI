import time

from datetime import datetime
import pandas as pd
from alpha_vantage.timeseries import TimeSeries
from django.contrib.auth.models import User

from .models import Price, Stock

USERNAME = 'emre'

KEY = '1077F37TLBGNSVY2'
OUTPUT_FORMAT = 'pandas'
OUTPUT_SIZE = 'full'

user = User.objects.filter(username=USERNAME).first()


# Create your views here.

def initial_load():
    payload = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
    df = payload[0]

    company_symbols = df['Symbol'].values.tolist()
    company_names = df['Security'].values.tolist()

    print("Symbols and names loaded")
    print("-------------------------------------")

    ts = TimeSeries(key=KEY, output_format=OUTPUT_FORMAT)

    for i in range(len(company_symbols)):
        data, meta_data = ts.get_daily(symbol=company_symbols[i], outputsize='full')
        date = data.index.tolist()
        for j in range(len(date)):
            Stock(symbol=company_symbols[i],
                  company_name=company_names[i],
                  creator=user,
                  date_added=datetime.now()).save()
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
        time.sleep(3)
