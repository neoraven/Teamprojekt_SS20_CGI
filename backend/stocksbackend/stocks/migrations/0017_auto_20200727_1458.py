# Generated by Django 3.0.6 on 2020-07-27 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0016_auto_20200629_1150'),
    ]

    operations = [
        migrations.AddField(
            model_name='price',
            name='dividend_amount',
            field=models.DecimalField(decimal_places=3, default=0.0, max_digits=8),
        ),
        migrations.AddField(
            model_name='price',
            name='split_coefficient',
            field=models.DecimalField(decimal_places=3, default=1.0, max_digits=8),
        ),
    ]
