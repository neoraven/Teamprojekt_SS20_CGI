from django.conf import settings
from django.db import models


class Stock(models.Model):
    symbol = models.CharField(primary_key=True, max_length=5)
    company_name = models.TextField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.symbol


class Company(models.Model):
    symbol = models.OneToOneField(Stock, on_delete=models.CASCADE, primary_key=True)
    company_name = models.TextField(max_length=50)
    market_cap = models.BigIntegerField(null=True, blank=True)
    industry = models.TextField(max_length=50, null=True, blank=True)
    sector = models.TextField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    website_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    ceo = models.TextField(max_length=50, null=True, blank=True)

    def __str__(self):
        return (
            f"{self.company_name} ({self.symbol}) does {self.industry} in {self.sector}"
        )


class Price(models.Model):
    class Interval(models.TextChoices):
        QUOTE = ("quote", "quote")
        ONE_MIN_INTERVAL = ("1min", "1min")
        QUARTER_HOUR_INTERVAL = ("15min", "15min")
        HALF_HOUR_INTERVAL = ("30min", "30min")
        HOUR_INTERVAL = ("60min", "60min")
        DAILY_INTERVAL = ("1d", "1d")

    symbol = models.ForeignKey(Stock, on_delete=models.CASCADE)
    # max_length case: '60min' ()
    interval = models.CharField(max_length=5, choices=Interval.choices)
    date = models.DateField(db_index=True)
    # leave blank / null if data is daily
    exchange_time = models.TimeField(null=True, blank=True, db_index=True)
    # Highest stock price ever traded is BRK.A at $305,085 (six digits)
    # source:
    # https://www.investopedia.com/ask/answers/081314/whats-most-expensive-stock-all-time.asp
    p_low = models.DecimalField(max_digits=8, decimal_places=3)
    p_open = models.DecimalField(max_digits=8, decimal_places=3)
    p_high = models.DecimalField(max_digits=8, decimal_places=3)
    p_close = models.DecimalField(max_digits=8, decimal_places=3)
    p_adjusted_close = models.DecimalField(max_digits=8, decimal_places=3)
    volume = models.BigIntegerField(null=True, blank=True)
    # Fields from the Alphavantage DAILY ADJUSTED endpoint
    dividend_amount = models.DecimalField(max_digits=8, decimal_places=3, default=0.0)
    split_coefficient = models.DecimalField(max_digits=8, decimal_places=3, default=1.0)

    def __str__(self):
        return (
            f"{self.symbol}@{str(self.date)}: "
            f"[{self.p_open} | {self.p_high} | {self.p_low} | {self.p_close}]"
            f" -- Volume = {self.volume:,} ({self.interval})"
        )
