# Generated by Django 3.0.6 on 2020-08-29 17:12

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('simulation', '0001_initial'),
        ('stocks', '0017_auto_20200727_1458'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('portfolio', '0008_auto_20200829_1907'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='portfolio',
            unique_together={('user', 'symbol', 'simulation')},
        ),
    ]
