from django.conf import settings
from django.db import models

class Stock(models.Model):
	symbol 			= models.CharField(primary_key=True, max_length=5)
	company_name 	= models.TextField(max_length=50, null=True, blank=True)
	creator 		= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	date_added 		= models.DateTimeField(auto_now_add=True)
	
	def __str__(self):
		if self.company_name:
			return f'{self.symbol} ({self.company_name})'
		else:
			return self.symbol


class Price(models.Model):
	symbol 			= models.ForeignKey(Stock, on_delete=models.CASCADE)
	date 			= models.DateField()
	# leave blank / null if data is daily
	exchange_time	= models.TimeField(null=True, blank=True)
	# Highest stock price ever traded is BRK.A at $305,085 (six digits)
	# source: https://www.investopedia.com/ask/answers/081314/whats-most-expensive-stock-all-time.asp
	p_open			= models.DecimalField(max_digits=8, decimal_places=2)
	p_low			= models.DecimalField(max_digits=8, decimal_places=2)
	p_high			= models.DecimalField(max_digits=8, decimal_places=2)
	p_close			= models.DecimalField(max_digits=8, decimal_places=2)
	volume 			= models.BigIntegerField(null=True, blank=True)