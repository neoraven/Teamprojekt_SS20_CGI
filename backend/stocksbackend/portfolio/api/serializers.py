from rest_framework import serializers
from portfolio.models import Portfolio, Transaction
from django.utils import timezone


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ["user", "symbol", "amount"]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["user"] = instance.user.username
        return ret


class TransactionGetSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    date_posted = serializers.DateTimeField()
    price_at = serializers.DecimalField(
        max_digits=8, decimal_places=3, coerce_to_string=False
    )

    class Meta:
        model = Transaction
        fields = ["user", "symbol", "amount", "date_posted", "price_at"]


class TransactionPutSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    date_posted = serializers.HiddenField(default=timezone.now())
    price_at = serializers.HiddenField(default=0.0)

    class Meta:
        model = Transaction
        fields = ["user", "symbol", "amount", "date_posted", "price_at"]

    def create(self, validated_data):
        """
        Overwrites the create() method to return a ``Portfolio`` object
        after the POSTED ``Transaction`` has occured
        (instead of a ``Transaction`` object).

        Note that the validation for the posted transaction
        is done in the .save() method of the model, not here.
        (Model raises ValidationError on errors.)
        """
        transaction = Transaction(
            user=validated_data["user"],
            symbol=validated_data["symbol"],
            amount=validated_data["amount"],
            date_posted=validated_data["date_posted"],
        )
        # this automatically adds to / substracts from
        # the user's Portfolio for given <symbol>
        # (see Portfolio's .save() method overwrite)
        transaction.save()
        try:
            portfolio = Portfolio.objects.get(
                user=validated_data["user"], symbol=validated_data["symbol"]
            )
            return portfolio
        except Portfolio.DoesNotExist:
            # user sold all his stocks
            #  > user's portfolio for given <symbol> was deleted
            #  > return a dummy portfolio
            return Portfolio(symbol=validated_data["symbol"], amount=0)
