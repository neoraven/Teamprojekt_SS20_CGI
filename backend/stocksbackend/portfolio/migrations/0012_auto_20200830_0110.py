# Generated by Django 3.0.6 on 2020-08-29 23:10

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0011_auto_20200830_0057'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='date_posted',
            field=models.DateTimeField(default=datetime.datetime(2020, 8, 29, 23, 10, 34, 403811, tzinfo=utc)),
        ),
    ]
