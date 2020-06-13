import requests
from stocks.models import Stock, Company

_FMP_URL = "https://financialmodelingprep.com/api/v3/profile/{}?apikey={}"
_FMP_API_KEY = "447876378e3214df3a505dc9299bb653"
_FMP_DELIM = ","


def create_company_meta_data_models():
    all_stocks = Stock.objects.all()
    all_stock_symbols = _FMP_DELIM.join([s.symbol for s in all_stocks])

    endpoint_url = _FMP_URL.format(all_stock_symbols, _FMP_API_KEY)
    response = requests.get(url=endpoint_url)
    response.raise_for_status()
    data = response.json()

    for company in data:
        try:
            stock = Stock.objects.get(symbol=company["symbol"])
        except Stock.DoesNotExist:
            print(f"Encountered error parsing symbol {company['symbol']}. Skipping...")
            continue

        company_obj, created = Company.objects.update_or_create(
            symbol=stock,
            defaults={
                "company_name": company["companyName"],
                "market_cap": company["mktCap"],
                "industry": company["industry"],
                "sector": company["sector"],
                "description": company["description"],
                "website_url": company["website"],
                "image_url": company["image"],
                "ceo": company["ceo"],
            },
        )

        if not created:
            print(f"Company {company_obj.symbol} already existed. Updating...")
