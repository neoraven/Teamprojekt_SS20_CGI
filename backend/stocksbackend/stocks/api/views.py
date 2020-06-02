import dateutil.parser

from django.core.exceptions import ValidationError
from django.http import Http404
from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticatedOrReadOnly,
    IsAdminUser,
)
from rest_framework.pagination import PageNumberPagination
from stocks.models import Stock, Company, Price
from .serializers import (
    StocksSerializer,
    CompanySerializer,
    PricesSerializer,
    StockMetaDataSerializer,
)


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

    queryset = Stock.objects.all()
    permission_classes = [AllowAny]
    serializer_class = StocksSerializer


class StockAllDetailView(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = StockMetaDataSerializer


class StockDetailView(generics.RetrieveAPIView):
    queryset = Company.objects.all()
    permission_classes = [AllowAny]
    lookup_field = "symbol"
    serializer_class = CompanySerializer


class PriceResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 1000


class PriceListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    pagination_class = PriceResultsSetPagination
    lookup_field = "symbol"
    serializer_class = PricesSerializer

    def get_queryset(self):
        symbol = self.kwargs.get("symbol")
        interval, date_from, date_to = (
            self.request.query_params.get("interval", "1d"),
            self.request.query_params.get("from"),
            self.request.query_params.get("to"),
        )
        queryset = Price.objects.filter(symbol__symbol__iexact=symbol)
        if not queryset:
            raise ValidationError(f"Stock `{symbol}` does not exist!")
        queryset = queryset.filter(interval=interval)
        if not queryset:
            raise ValidationError(f"Interval `{interval}` does not exist!")
        if date_from:
            date_from = dateutil.parser.parse(date_from)
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            date_to = dateutil.parser.parse(date_to, ignoretz=False)
            queryset = queryset.filter(date__lte=date_to)

        if queryset:
            return queryset.order_by("date", "exchange_time")
        else:
            raise Http404


class PriceListNoPaginationView(generics.ListAPIView):
    permission_classes = [AllowAny]
    lookup_field = "symbol"
    serializer_class = PricesSerializer

    def get_queryset(self):
        symbol = self.kwargs.get("symbol")
        interval, date_from, date_to = (
            self.request.query_params.get("interval", "1d"),
            self.request.query_params.get("from"),
            self.request.query_params.get("to"),
        )
        queryset = Price.objects.filter(symbol__symbol__iexact=symbol)
        if not queryset:
            raise ValidationError(f"Stock `{symbol}` does not exist!")
        queryset = queryset.filter(interval=interval)
        if not queryset:
            raise ValidationError(f"Interval `{interval}` does not exist!")
        if date_from:
            date_from = dateutil.parser.parse(date_from)
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            date_to = dateutil.parser.parse(date_to, ignoretz=False)
            queryset = queryset.filter(date__lte=date_to)

        if queryset:
            return queryset.order_by("date", "exchange_time")
        else:
            raise Http404


class MostRecentPriceView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    lookup_field = "symbol"
    serializer_class = PricesSerializer

    def get_object(self):
        interval = self.request.query_params.get("interval", "1d")
        queryset = Price.objects.filter(
            symbol__symbol__iexact=self.kwargs.get("symbol"), interval__iexact=interval
        ).order_by("-date", "-exchange_time", "-interval")
        if not queryset:
            raise Http404

        return queryset.first()
