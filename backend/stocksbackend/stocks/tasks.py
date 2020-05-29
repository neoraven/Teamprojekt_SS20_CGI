from __future__ import absolute_import, unicode_literals

from celery import shared_task
from .data_util import initial_load

@shared_task
def load():
    initial_load()