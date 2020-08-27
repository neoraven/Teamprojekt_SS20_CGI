from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from .validators import (
    AgentValidator,
    MarketValidator,
    SimulationValidator,
    PreferencesValidator,
)

_PREFS_LOWER_UPPER_THRESHOLDS = (0, 100)


class Simulation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    strategy = models.CharField(max_length=64)
    starting_year = models.IntegerField(default=2010)
    end_year = models.IntegerField(default=2020)
    agent_starting_capital = models.DecimalField(max_digits=15, decimal_places=2,)
    time_elapsed = models.DurationField(blank=True, null=True)

    def save(self, *args, **kwargs):
        super(Simulation, self).save(*args, **kwargs)
        self.clean()

    def clean(self):
        SimulationValidator.validate_strategy(name=self.strategy)
        MarketValidator.validate_date_range(
            starting_year=self.starting_year, end_year=self.end_year
        )
        AgentValidator.validate_starting_capital(self.agent_starting_capital)

    def __str__(self):
        return f"{self.user}@{self.created_at}, {self.strategy}, starting_capital={self.agent_starting_capital} | prefs = {self.preferences}"


class Preferences(models.Model):
    simulation = models.OneToOneField(
        to=Simulation, on_delete=models.CASCADE, primary_key=True
    )
    risk_affinity = models.SmallIntegerField()
    diversification = models.SmallIntegerField()
    placeholder = models.SmallIntegerField()

    def save(self, *args, **kwargs):
        super(Preferences, self).save(*args, **kwargs)
        self.clean()

    def clean(self):
        for field_value in (self.risk_affinity, self.diversification, self.placeholder):
            PreferencesValidator.validate_range(
                field_value, *_PREFS_LOWER_UPPER_THRESHOLDS
            )

    def __str__(self):
        return f"[RA={self.risk_affinity}, DIV={self.diversification}, PH={self.placeholder}]"
