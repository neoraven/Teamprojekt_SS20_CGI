import sys
from .defined_prefs.volatility_pref import VolatilityPreference
from .defined_prefs.cash_allocation_pref import CashAllocationPreference

_REQUEST_PARAM_TO_CLASS_MAP = {
    "risk_affinity": "VolatilityPreference",
    "diversification": "DiversityPreference",
    "placeholder": "CashAllocationPreference",
}


def verify_preference(preference_name: str) -> bool:
    if not isinstance(preference_name, str):
        return False
    if not preference_name in _REQUEST_PARAM_TO_CLASS_MAP.keys():
        return False
    try:
        current_module = sys.modules[__name__]
        preference = getattr(
            current_module, _REQUEST_PARAM_TO_CLASS_MAP[preference_name]
        )
        return hasattr(preference, "apply") and hasattr(
            getattr(preference, "weight"), "__call__"
        )
    except AttributeError:
        return False


def get_preference(preference_name: str):
    current_module = sys.modules[__name__]
    return getattr(current_module, _REQUEST_PARAM_TO_CLASS_MAP[preference_name])
