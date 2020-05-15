from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from stocks.models import Stock
from .serializers import StocksSerializer

class StockRudView(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = [IsAuthenticatedOrReadOnly]
	lookup_field = 'symbol'
	serializer_class = StocksSerializer

	def get_queryset(self):
		return Stock.objects.all()


class StockAllView(generics.ListAPIView):
	permission_classes = [AllowAny]
	serializer_class = StocksSerializer

	def get_queryset(self):
		return Stock.objects.all()