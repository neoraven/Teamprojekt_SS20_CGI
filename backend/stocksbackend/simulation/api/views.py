from typing import Dict, Union

from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.throttling import UserRateThrottle
from django.http import JsonResponse

from .. import simulation_dispatcher
from ..classes import strategies, market

_SIM_REQUEST_KWD_VALIDATION = {
    "risk_affinity": lambda ra: 0 <= ra <= 100,
    "diversification": lambda d: 0 <= d <= 100,
    "placeholder": lambda ph: 0 <= ph <= 100,
    "strategy": lambda s: isinstance(s, str) and strategies.verify_strategy(s),
    "starting_capital": lambda sc: isinstance(sc, (float, int)),
}


class OncePerMinuteThrottle(UserRateThrottle):
    rate = "1/min"


class StartSimulationView(APIView):
    permission_classes = (AllowAny,)
    # throttle_classes = (OncePerMinuteThrottle,)

    def post(self, request):
        payload = request.data
        # NOTE(jonas): `request.user` always returns `AnonymousUser`!
        self._verify_payload(payload=payload)
        print(payload)
        # data this point should get
        # 1. risk affinity (0 - 100)
        # 2. diversification (0 - 100)
        # 3. anything (0 - 100)
        # 4. strategy (str)
        # 5. cash: (float)

        simulation_results = simulation_dispatcher.start(
            strategy_name=payload["strategy"],
            starting_year=2015,
            end_year=2020,
            agent_starting_capital=payload["starting_capital"],
            market_name="simulation_market",
        )
        return JsonResponse(data=simulation_results, safe=False)

    @staticmethod
    def _verify_payload(payload: Dict[str, Union[str, float]]) -> None:
        for keyword, validation_function in _SIM_REQUEST_KWD_VALIDATION.items():
            if keyword not in payload.keys():
                raise ValidationError(
                    f"`{keyword}` needs to be a parameter of the POST request payload!"
                )
            if not validation_function(payload.get(keyword)):
                raise ValidationError(
                    f"`{keyword}` does not have valid input value! (Validation Failed)"
                )
