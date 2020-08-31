from django.contrib import admin
from .models import Simulation, Preferences, Evaluation

admin.site.register(Simulation)
admin.site.register(Preferences)
admin.site.register(Evaluation)
