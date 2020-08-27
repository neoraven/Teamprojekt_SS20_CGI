from django.core.exceptions import ValidationError

from stocks.models import Price
from .classes import strategies


class SimulationValidator:
    @staticmethod
    def validate_strategy(name):
        if not strategies.verify_strategy(name):
            raise ValidationError(f"{name} is not an available strategy!")


class AgentValidator:
    @staticmethod
    def validate_starting_capital(cash):
        if not isinstance(cash, (float, int)):
            raise ValidationError(f"{cash} needs to one of (float, int)!")
        if cash <= 0:
            raise ValidationError(
                f"{cash} is not a valid starting capital value! (cannot be negative)"
            )


class MarketValidator:
    @staticmethod
    def validate_date_range(starting_year, end_year):
        if not isinstance(starting_year, int) or not isinstance(end_year, int):
            raise ValidationError("Year range needs to be int!")
        queryset = Price.objects.filter(
            date__year__gte=starting_year, date__year__lte=end_year
        )
        if not queryset.exists():
            raise ValidationError(
                f"No prices recorded for time period [{starting_year}, {end_year}]"
            )


class PreferencesValidator:
    @staticmethod
    def validate_range(value, lower, upper):
        if not isinstance(value, (int, float)):
            raise ValidationError(
                f"Wrong type for preference! Needs to be one of (float, int)"
            )
        if not lower <= value <= upper:
            raise ValidationError(
                f"Preferences need to be in range [{lower}, {upper}]! (not: {value})"
            )

