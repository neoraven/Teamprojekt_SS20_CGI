# Generated by Django 3.0.6 on 2020-05-17 15:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0008_auto_20200515_1756'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('portfolio', '0004_delete_transaction'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_posted', models.DateTimeField(auto_now=True)),
                ('amount', models.IntegerField()),
                ('symbol', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stocks.Stock')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
