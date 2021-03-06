from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stocksbackend.settings')

app = Celery('stocksbackend')

app.conf.update(
    broker_url='redis://localhost:6379',
    result_backend='redis://localhost:6379',
    task_serializer='json',
    accept_content=['json'],  # Ignore other content
    result_serializer='json',
    timezone='Europe/Berlin',
    beat_schedule={
        'load_data_daily': {
            'task' : 'stocks.tasks.load',
            'schedule' : crontab(minute=0, hour=1)
        }
    }
)


# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(packages=None)

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
