from datetime import datetime

from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from django.http import JsonResponse
from django.contrib.auth.models import User

from .serializers import SimulationSerializer
from .. import simulation_dispatcher
from ..models import Simulation
from ..classes import strategies


_REQUEST_MANDATORY_ARGS = [
    "risk_affinity",
    "diversification",
    "placeholder",
    "strategy",
    "starting_capital",
]
DEFAULT_AMNT_YEARS_TO_RUN = 3


class OncePerMinuteThrottle(UserRateThrottle):
    rate = "1/min"


class StartSimulationView(APIView):
    permission_classes = (AllowAny,)
    # throttle_classes = (OncePerMinuteThrottle,)

    def post(self, request):
        payload = request.data
        self._verify_payload(payload)
        # NOTE(jonas): `request.user` always returns `AnonymousUser`!
        # NOTE(jonas): This is only the case when the Token isn't parsed
        # (or SessionAuth disabled)
        # data this point should get
        # 1. risk affinity (0 - 100)
        # 2. diversification (0 - 100)
        # 3. anything (0 - 100)
        # 4. strategy (str)
        # 5. cash: (float)
        current_year = datetime.today().year
        request.user = User.objects.filter(is_superuser=True).first()
        if request.user.is_superuser:
            debug_subset = payload.get("subset_stocks", None)
        simulation_results = simulation_dispatcher.start(
            user=request.user,
            strategy_name=payload["strategy"],
            strategy_kwargs=payload.get("strategy_kwargs", {}),
            starting_year=payload.get(
                "starting_year",
                payload.get("end_year", current_year) - DEFAULT_AMNT_YEARS_TO_RUN,
            ),
            end_year=payload.get("end_year", current_year),
            agent_starting_capital=payload["starting_capital"],
            risk_affinity=payload["risk_affinity"],
            diversification=payload["diversification"],
            placeholder=payload["placeholder"],
            debug_subset=debug_subset,
        )
        # return JsonResponse(data=simulation_results, safe=False)
        return simulation_results

    @staticmethod
    def _verify_payload(payload):
        for arg_name in _REQUEST_MANDATORY_ARGS:
            if arg_name not in payload:
                raise ValidationError(f"{arg_name} has to be part of the payload!")


class RetrieveSimulationView(APIView):
    def get(self, request, sim_id):
        try:
            simulation = Simulation.objects.get(id=sim_id)
            response = simulation.to_results_dict()
        except Simulation.DoesNotExist:
            response = {"error": f"Simulation id <{sim_id}> does not exist!"}

        return JsonResponse(data=response, safe=False)


class SimulationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SimulationSerializer

    def get_queryset(self):
        return Simulation.objects.filter(user=self.request.user).order_by("-id")
