from django.utils import timezone
from rest_framework import serializers
from stocks.models import Stock
from portfolio.models import Transaction


class StocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = [
            "symbol",
            "company_name",
        ]
