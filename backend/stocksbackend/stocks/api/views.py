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
    """READ / PUT / PATCH / DELETE endpoint for stocks.

    Permissions:
        IsAdminUser -- for PUT / PATCH / DELETE
    
    Request data:
        symbol {str} -- from URI. Stock symbol to look up in database.
        company_name {str} (optional) -- for PUT / PATCH / DELETE.
    """

    permission_classes = [IsAdminUser | IsAuthenticatedOrReadOnly]
    lookup_field = "symbol"
    serializer_class = StocksSerializer

    def get_queryset(self):
        queryset = Stock.objects.filter(symbol__iexact=self.kwargs.get("symbol"))
        return queryset


class StockCreateView(generics.CreateAPIView):
    """POST endpoint to create new stocks.
    
    Permissions:
        IsAdminUser
    
    Request data:
        symbol {str} -- Stock symbol (max_length=5)
        company_name {str} -- Name of company for given symbol (max_length=5 | nullable)  
    """

    queryset = Stock.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = StocksSerializer


class StockAllView(generics.ListAPIView):
    """GET endpoint to get a list of all stock objects.

    Permissions:
        AllowAny
    
    Request data:
        None
    
    Response data:
        List[
            {symbol: ""},
            {company_name: ""},
        ]
    """

    permission_classes = [AllowAny]
    serializer_class = StocksSerializer

    def get_queryset(self):
        return Stock.objects.all()
