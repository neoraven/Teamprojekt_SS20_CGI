from rest_framework import serializers
from stocks.models import Stock

class StocksSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Stock
		fields = [
			'symbol',
			'company_name',
		]