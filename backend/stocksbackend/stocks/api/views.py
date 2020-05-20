from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
    IsAdminUser,
)
from stocks.models import Stock
from .serializers import StocksSerializer


class StockRudView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser | IsAuthenticatedOrReadOnly]
    lookup_field = "symbol"
    serializer_class = StocksSerializer

    def get_queryset(self):
        queryset = Stock.objects.filter(
            symbol__iexact=self.kwargs.get("symbol").upper()
        )
        return queryset


class StockAllView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = StocksSerializer

    def get_queryset(self):
        return Stock.objects.all()
