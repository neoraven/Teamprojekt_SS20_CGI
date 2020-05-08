from django.contrib import admin
from .models import Stock, Price

admin.site.register(Stock)
admin.site.register(Price)