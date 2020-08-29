from django.conf import settings
from django.db import models

from portfolio.models import Portfolio, Transaction

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
    agent_cash_left = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    agent_end_portfolio_value = models.DecimalField(
        max_digits=15, decimal_places=2, default=0.0
    )
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
        #  | prefs = {self.preferences}
        return f"{self.user}@{self.created_at}, {self.strategy}, starting_capital={self.agent_starting_capital}"

    def fetch_my_transactions(self):
        return Transaction.objects.filter(simulation=self.id)

    def load_all_transactions_to_list(self):
        transaction_list = []
        transaction_models = self.fetch_my_transactions()

        for transaction in transaction_models:
            transaction_list.append(transaction.to_dict())
        return transaction_list

    def fetch_my_portfolios(self):
        return Portfolio.objects.filter(simulation=self)

    def load_portfolios_to_single_dict(self):
        portfolio_dict = {}
        portfolio_models = self.fetch_my_portfolios()

        for portfolio in portfolio_models:
            portfolio_dict[portfolio.symbol.symbol] = float(portfolio.amount)
        return portfolio_dict

    def fetch_my_recommendations(self):
        return Recommendation.objects.filter(simulation=self)

    def load_recommendations_to_single_dict(self):
        recommendations_dict = {}
        recommendation_models = self.fetch_my_recommendations()

        for recommendation in recommendation_models:
            recommendations_dict[recommendation.symbol] = recommendation.weight
        return recommendations_dict

    def fetch_my_evaluations(self):
        return Evaluation.objects.filter(simulation=self)

    def load_all_evaluations_to_list(self):
        evaluation_list = []
        evaluation_models = self.fetch_my_evaluations()

        for evaluation in evaluation_models:
            evaluation_list.append(evaluation.to_dict())
        return evaluation_list

    def fetch_my_preferences(self):
        return Preferences.objects.get(simulation=self)

    def load_inputs_to_dict(self):
        inputs = {}
        inputs["dates"] = {"from": self.starting_year, "to": self.end_year}
        prefs = self.fetch_my_preferences()
        inputs["preferences"] = {
            "risk_affinity": prefs.risk_affinity,
            "diversification": prefs.diversification,
            "placeholder": prefs.placeholder,
        }
        inputs["strategy"] = self.strategy

        return inputs

    def to_results_dict(self):
        response = {}
        response["current_cash"] = float(self.agent_cash_left)
        response["current_portfolio"] = self.load_portfolios_to_single_dict()
        response["evaluation_history"] = self.load_all_evaluations_to_list()
        response["transactions"] = self.load_all_transactions_to_list()
        response["recommendations"] = self.load_recommendations_to_single_dict()
        response["performance"] = {
            "current_portfolio_value": float(self.agent_end_portfolio_value),
            "percent_change": float(
                self.agent_end_portfolio_value / self.agent_starting_capital - 1
            ),
            "starting_capital": float(self.agent_starting_capital),
        }
        response["sim_id"] = self.id
        response["input"] = self.load_inputs_to_dict()

        return response


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


class Evaluation(models.Model):
    date = models.DateField()
    score = models.FloatField()
    simulation = models.ForeignKey(to=Simulation, on_delete=models.CASCADE)

    def __str__(self):
        return f"<{self.simulation.id}> {self.date}: {self.score}"

    def to_dict(self):
        return {"date": self.date, "score": self.score}


class Recommendation(models.Model):
    symbol = models.CharField(max_length=5)
    weight = models.FloatField()
    simulation = models.ForeignKey(to=Simulation, on_delete=models.CASCADE)
