from django.conf import settings
from django.db import models
from stocks.models import Stock
from django.core.validators import ValidationError


class Portfolio(models.Model):
	user			= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	symbol			= models.ForeignKey(Stock, on_delete=models.CASCADE)
	amount			= models.PositiveIntegerField()

	def __str__(self):
		return f'{self.user} > {self.amount} of {self.symbol.symbol}'

	def clean(self, *args, **kwargs):
		if self.amount <= 0:
			raise ValidationError('Amount in portfolio needs to be >0!')
		super(Portfolio, self).clean(*args, **kwargs)

	def save(self, *args, **kwargs):
		self.full_clean()
		super(Portfolio, self).save(*args, **kwargs)

	class Meta:
		unique_together = (('user', 'symbol'),)


class Transaction(models.Model):
	# redundancy
	pass
