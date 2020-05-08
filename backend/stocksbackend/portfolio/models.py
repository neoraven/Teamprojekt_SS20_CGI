from django.conf import settings
from django.db import models
from stocks.models import Stock

class Portfolio(models.Model):
	user			= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	symbol			= models.ForeignKey(Stock, on_delete=models.CASCADE)
	amount			= models.PositiveIntegerField(default=0)

	def __str__(self):
		return f'{self.user} > {self.amount} of {self.symbol.symbol}'

	class Meta:
		unique_together = (('user', 'symbol'),)

