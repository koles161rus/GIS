# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-02-01 07:56
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('layers', '0002_layer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='layerurl',
            name='name',
        ),
        migrations.DeleteModel(
            name='LayerName',
        ),
        migrations.DeleteModel(
            name='LayerUrl',
        ),
    ]