from django.urls import path

from .views import StartSimulationView, SimulationListView, RetrieveSimulationView

app_name = "api-simulation"

urlpatterns = [
    path("start/", StartSimulationView.as_view(), name="start-simulation"),
    path("list/", SimulationListView.as_view(), name="list-simulations"),
    path("<sim_id>/", RetrieveSimulationView.as_view(), name="simulation-recap"),
]
