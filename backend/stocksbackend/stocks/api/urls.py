from django.urls import path
from .views import StockRudView, StockAllView, StockCreateView

app_name = "stocks"

urlpatterns = [
    path("list/", StockAllView.as_view(), name="all-stocks"),
    path("", StockAllView.as_view(), name="all-stocks"),
    path("<symbol>", StockRudView.as_view(), name="stock-rud"),
    path("new/", StockCreateView.as_view(), name="create-new-stock"),
]
