from django.conf import settings
from django.db import models


class Stock(models.Model):
    symbol 			= models.CharField(primary_key=True, max_length=5)
    company_name 	= models.TextField(max_length=50, null=True, blank=True)
    creator 		= models.ForeignKey(
    	settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_added 		= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.company_name:
            return f'{self.symbol} ({self.company_name})'
        else:
            return self.symbol


class Price(models.Model):
    symbol 			= models.ForeignKey(Stock, on_delete=models.CASCADE)
    # max_length case: '180m' (180 minutes)
    interval 		= models.CharField(max_length=4)
    date 			= models.DateField()
    # leave blank / null if data is daily
    exchange_time 	= models.TimeField(null=True, blank=True)
    # Highest stock price ever traded is BRK.A at $305,085 (six digits)
    # source:
    # https://www.investopedia.com/ask/answers/081314/whats-most-expensive-stock-all-time.asp
    p_low 			= models.DecimalField(max_digits=8, decimal_places=3)
    p_open 			= models.DecimalField(max_digits=8, decimal_places=3)
    p_high 			= models.DecimalField(max_digits=8, decimal_places=3)
    p_close 		= models.DecimalField(max_digits=8, decimal_places=3)
    volume 			= models.BigIntegerField(null=True, blank=True)

    def __str__(self):
        return (
            f'{self.symbol.symbol}@{str(self.date)}: '
            f'[{self.p_open} | {self.p_high} | {self.p_low} | {self.p_close}]'
            f' -- Volume = {self.volume:,}'
        )
