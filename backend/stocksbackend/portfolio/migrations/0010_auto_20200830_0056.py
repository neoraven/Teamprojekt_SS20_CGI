# Generated by Django 3.0.6 on 2020-08-29 22:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0009_auto_20200829_1912'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='date_posted',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
