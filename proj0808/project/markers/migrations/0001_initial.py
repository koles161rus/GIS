# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-09 06:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Marker',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128)),
                ('x', models.FloatField()),
                ('y', models.FloatField()),
            ],
        ),
    ]
