import dateutil.parser
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from portfolio.models import Portfolio, Transaction
from .serializers import (
    PortfolioSerializer,
    TransactionPutSerializer,
    TransactionGetSerializer,
)


class PortfolioListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PortfolioSerializer

    def get_queryset(self):
        current_user = self.request.user
        queryset = Portfolio.objects.filter(user=current_user)

        symbol = self.request.query_params.get("symbol")
        if symbol is not None:
            return queryset.filter(symbol=symbol)
        else:
            return queryset


class AllPortfoliosAdminListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = PortfolioSerializer

    def get_queryset(self):
        queryset = Portfolio.objects.all()

        symbol = self.request.query_params.get("symbol")
        if symbol is not None:
            return queryset.filter(symbol=symbol)
        else:
            return queryset


class TransactionPutView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionPutSerializer


class AllTransactionsAdminListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = TransactionGetSerializer

    def get_queryset(self):
        queryset = Transaction.objects.all()

        symbol = self.request.query_params.get("symbol")
        if symbol is not None:
            return queryset.filter(symbol=symbol)
        else:
            return queryset


class TransactionsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionGetSerializer

    def get_queryset(self):
        current_user = self.request.user
        queryset = Transaction.objects.filter(user=current_user)

        symbol, date_from, date_to = (
            self.request.query_params.get("symbol"),
            self.request.query_params.get("from"),
            self.request.query_params.get("to"),
        )
        if symbol is not None:
            queryset = queryset.filter(symbol=symbol)
        if date_from is not None:
            date_from = dateutil.parser.parse(date_from, ignoretz=False)
            queryset = queryset.filter(date_posted__gte=date_from)
        if date_to is not None:
            date_to = dateutil.parser.parse(date_to, ignoretz=False)
            queryset = queryset.filter(date_posted__lte=date_to)
        if queryset:
            queryset = queryset.order_by("symbol", "-date_posted")

        return queryset
