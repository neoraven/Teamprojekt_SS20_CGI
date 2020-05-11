from django.conf import settings
from django.db import models
from stocks.models import Stock

# 10xAAPL @$150 01/01/2020
# 20xAAPL @$100 02/01/2020
# 30xAAPL (02/01/2020): $3,000
# (10 x $150) + (20 x $100) / 30
# weighted avg. $122


# 25x$122
# 25xAAPL $100

#TODO: add verification of amount > 0!
class Portfolio(models.Model):
	user			= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	symbol			= models.ForeignKey(Stock, on_delete=models.CASCADE)
	amount			= models.PositiveIntegerField(default=0)

	def __str__(self):
		return f'{self.user} > {self.amount} of {self.symbol.symbol}'

	class Meta:
		unique_together = (('user', 'symbol'),)


class Transaction(models.Model):
	# redundancy
	pass
