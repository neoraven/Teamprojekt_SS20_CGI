from rest_framework import generics
from stocks.models import Stock
from .serializers import StocksSerializer

class StockRudView(generics.RetrieveUpdateDestroyAPIView):
	lookup_field = 'symbol'
	serializer_class = StocksSerializer

	def get_queryset(self):
		return Stock.objects.all()