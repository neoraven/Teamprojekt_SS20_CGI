from django.shortcuts import render
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

app_name = "api"

schema_view = get_schema_view(
    openapi.Info(
        title="Stocks API",
        default_version="v1",
        description="Documentation for all endpoints within the app",
    ),
    public=False,
    permission_classes=[permissions.AllowAny,],
)

urlpatterns = [
    path("stocks/", include("stocks.api.urls", namespace="api-stocks")),
    path("portfolio/", include("portfolio.api.urls", namespace="api-portfolios")),
    path(
        "docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
]
