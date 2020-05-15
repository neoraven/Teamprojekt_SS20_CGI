from django.urls import path
from .views import StockRudView, StockAllView

app_name = 'stocks'

urlpatterns = [
	path('', StockAllView.as_view(), name='all-stocks'),
	path('<symbol>', StockRudView.as_view(), name='stock-rud')
]