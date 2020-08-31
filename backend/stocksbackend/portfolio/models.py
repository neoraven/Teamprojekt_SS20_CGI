from django.conf import settings
from django.db import models
from stocks.models import Stock, Price
from django.core.validators import ValidationError
import django.utils.timezone
from datetime import datetime


class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    symbol = models.ForeignKey(Stock, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()
    simulation = models.ForeignKey(
        to="simulation.Simulation",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        default=None,
    )

    def __str__(self):
        return f"{self.user} > {self.amount} of {self.symbol.symbol}"

    class Meta:
        unique_together = (("user", "symbol", "simulation"),)


class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    symbol = models.ForeignKey(Stock, on_delete=models.CASCADE)
    amount = models.IntegerField()
    date_posted = models.DateTimeField(default=django.utils.timezone.now)
    price_at = models.DecimalField(max_digits=8, decimal_places=3)
    simulation = models.ForeignKey(
        to="simulation.Simulation",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        default=None,
    )

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

    def save(self, is_simulation: bool = False, *args, **kwargs):
        if not is_simulation:
            most_recent_price = (
                Price.objects.filter(symbol=self.symbol)
                .order_by("-date", "-exchange_time", "-interval")
                .first()
            )
            if most_recent_price is None:
                raise ValidationError("No valid price found for this transaction!")
            self.price_at = most_recent_price.p_close

        super(Transaction, self).save(*args, **kwargs)
        try:
            portfolio = Portfolio.objects.get(
                user=self.user, symbol=self.symbol, simulation=self.simulation
            )
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
            portfolio.simulation = self.simulation
            # Positive amount: save the model
            portfolio.save()

    @property
    def total_value(self):
        return self.amount * self.price_at

    def to_dict(self):
        return {
            "amount": float(self.amount),
            "date": self.date_posted,
            "stock_price": float(self.price_at),
            "symbol": self.symbol.symbol,
            "total_value": float(self.total_value),
        }

