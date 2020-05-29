from django.contrib import admin
from .models import Stock, Price, Company

admin.site.register(Stock)
admin.site.register(Price)
admin.site.register(Company)
