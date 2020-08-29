from rest_framework import serializers
from simulation.models import Simulation, Preferences


class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preferences
        fields = ("risk_affinity", "diversification", "placeholder")


class SimulationSerializer(serializers.ModelSerializer):
    preferences = PreferencesSerializer(read_only=True)

    class Meta:
        model = Simulation
        fields = (
            "created_at",
            "strategy",
            "starting_year",
            "end_year",
            "agent_starting_capital",
            "time_elapsed",
            "preferences",
        )
