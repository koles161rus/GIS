# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class Marker(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128)
    x = models.FloatField()
    y = models.FloatField()

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "x": self.x,
            "y": self.y
        }