from django.urls import path
from .views import (
    PortfolioListView,
    TransactionPutView,
    TransactionsListView,
    AllTransactionsAdminListView,
    AllPortfoliosAdminListView,
)

app_name = "api-portfolios"

urlpatterns = [
    path("list/", PortfolioListView.as_view(), name="get-my-portfolios"),
    path("transaction/new/", TransactionPutView.as_view(), name="add-new-transaction"),
    path(
        "transaction/list/", TransactionsListView.as_view(), name="get-my-transactions",
    ),
    path(
        "transaction/list/all/",
        AllTransactionsAdminListView.as_view(),
        name="get-all-user-transactions",
    ),
    path(
        "list/all/",
        AllPortfoliosAdminListView.as_view(),
        name="get-all-user-portfolios",
    ),
]
