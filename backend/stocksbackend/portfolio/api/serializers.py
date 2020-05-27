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


class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    date_posted = serializers.DateTimeField(default=timezone.now())
    price_at = serializers.DecimalField(
        max_digits=8, decimal_places=3, coerce_to_string=False
    )

    class Meta:
        model = Transaction
        fields = ["user", "symbol", "amount", "date_posted", "price_at"]

    def create(self, validated_data):
        """
        Overwrites the create() method to return a ``Portfolio`` object 
        after the POSTED ``Transaction`` has occured 
        (instead of a ``Transaction`` object).
        """
        transaction = Transaction(
            user=validated_data["user"],
            symbol=validated_data["symbol"],
            amount=validated_data["amount"],
            date_posted=validated_data["date_posted"],
        )
        transaction.save()
        try:
            portfolio = Portfolio.objects.get(
                user=validated_data["user"], symbol=validated_data["symbol"]
            )
            return portfolio
        except Portfolio.DoesNotExist:
            #
            return Portfolio(symbol=validated_data["symbol"], amount=0)
