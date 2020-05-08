from django.urls import path
from .views import StockRudView

app_name = 'stocks'

urlpatterns = [
	path('<symbol>', StockRudView.as_view(), name='stock-rud')
]