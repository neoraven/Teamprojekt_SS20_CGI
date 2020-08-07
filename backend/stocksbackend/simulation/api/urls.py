from django.urls import path

from .views import StartSimulationView

app_name = "api-simulation"

urlpatterns = [
    path("start/", StartSimulationView.as_view(), name="start-simulation"),
]
