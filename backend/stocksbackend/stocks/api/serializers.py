from collections import OrderedDict
from rest_framework import serializers
from stocks.models import Stock, Company, Price


class StocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = [
            "symbol",
            "company_name",
        ]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "symbol",
            "company_name",
            "market_cap",
            "industry",
            "sector",
            "description",
            "website_url",
            "image_url",
            "ceo",
        ]


class StockMetaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "symbol",
            "company_name",
            "market_cap",
            "industry",
            "sector",
            "description",
            "website_url",
            "image_url",
            "ceo",
        ]

    def to_representation(self, instance):
        data = super(StockMetaDataSerializer, self).to_representation(instance)
        full_data = OrderedDict()
        standard_fields = ["symbol", "company_name"]
        for field in standard_fields:
            full_data[field] = data.pop(field)

        meta_data = {"meta_data": {}}
        for key, value in data.items():
            meta_data["meta_data"][key] = value

        full_data.update(meta_data)

        return full_data


class PricesSerializer(serializers.ModelSerializer):
    p_low = serializers.DecimalField(
        max_digits=8, decimal_places=3, coerce_to_string=False
    )
    p_open = serializers.DecimalField(
        max_digits=8, decimal_places=3, coerce_to_string=False
    )
    p_high = serializers.DecimalField(
        max_digits=8, decimal_places=3, coerce_to_string=False
    )
    p_close = serializers.DecimalField(
        max_digits=8, decimal_places=3, coerce_to_string=False
    )

    class Meta:
        model = Price
        fields = [
            "date",
            "exchange_time",
            "p_low",
            "p_open",
            "p_high",
            "p_close",
            "p_adjusted_close",
            "volume",
        ]
