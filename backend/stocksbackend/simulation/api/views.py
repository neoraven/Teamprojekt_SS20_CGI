from typing import Dict, Union

from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.throttling import UserRateThrottle
from django.http import HttpResponse

_SIM_REQUEST_MANDATORY_KWDS = [
    "risk_affinity",
    "diversification",
    "strategy",
]


class OncePerMinuteThrottle(UserRateThrottle):
    rate = "1/min"


class StartSimulationView(APIView):
    permission_classes = (AllowAny,)
    # throttle_classes = (OncePerMinuteThrottle,)

    def post(self, request):
        payload = request.data
        self._verify_payload(payload=payload)
        print(payload)
        # data this point should get
        # 1. risk affinity (0 - 100)
        # 2. diversification (0 - 100)
        # 3. anything (0 - 100)
        # 4. strategy (str)

        return HttpResponse(content="You did it :)")

    @staticmethod
    def _verify_payload(payload: Dict[str, Union[str, float]]) -> None:
        for keyword in _SIM_REQUEST_MANDATORY_KWDS:
            if keyword not in payload.keys():
                raise ValidationError(
                    f"`{keyword}` needs to be a parameter of the POST request payload!"
                )
