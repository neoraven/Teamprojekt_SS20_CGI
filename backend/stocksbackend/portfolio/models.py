from django.conf import settings
from django.db import models
from stocks.models import Stock
from django.core.validators import ValidationError


class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    symbol = models.ForeignKey(Stock, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user} > {self.amount} of {self.symbol.symbol}"

    class Meta:
        unique_together = (("user", "symbol"),)


class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    symbol = models.ForeignKey(Stock, on_delete=models.CASCADE)
    amount = models.IntegerField()
    date_posted = models.DateTimeField(auto_now=True)

    def __str__(self):
        purchase_type = "sold" if self.amount < 0 else "bought"
        return (
            f"{self.user} {purchase_type} {abs(self.amount)} of {self.symbol} at "
            f"{self.date_posted.strftime('%Y-%m-%d %H:%M:%S')}"
        )

    def clean(self, *args, **kwargs):
        created = self.pk is None
        if not created:
            raise ValidationError(
                f"Instances of the ``{self.__class__.__name__}`` model cannot be altered!"
            )
        if self.amount == 0:
            raise ValidationError(
                "Instances of Transaction cannot have an amount of 0!"
            )

    def save(self, *args, **kwargs):
        super(Transaction, self).save(*args, **kwargs)
        try:
            portfolio = Portfolio.objects.get(user=self.user, symbol=self.symbol)
            portfolio.amount += self.amount
        except Portfolio.DoesNotExist:
            portfolio = Portfolio(
                user=self.user, symbol=self.symbol, amount=self.amount
            )

        if portfolio.amount < 0:
            # a negative amount is invalid
            raise ValidationError(
                f"You do not have enough stocks of {self.symbol} to perform this action "
                f"(missing amount: {abs(portfolio.amount)})."
            )
        elif portfolio.amount == 0:
            # The user sold all his stocks > delete the portfolio
            portfolio.delete()
        else:
            # Positive amount: save the model
            portfolio.save()
