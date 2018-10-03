from django.db import models

class Layer(models.Model):
    name = models.CharField(max_length=255)
    url = models.CharField(max_length=255)

    def as_dict(self):
      return {
        "id": self.id,
        "name": self.name,
        "url": self.url,
      }

class Feature(models.Model):
    name = models.CharField(max_length=255)
    geomType = models.CharField(max_length=255)
    coord = models.TextField()
    prop = models.TextField()

    def as_dict(self):
      return {
        "id": self.id,
        "name": self.name,
        "geomType": self.geomType,
        "coord": self.coord,
        "prop": self.prop
      }

class Vector(models.Model):
    name = models.CharField(max_length=255)
    red = models.IntegerField(default=0)
    green = models.IntegerField(default=0)
    blue = models.IntegerField(default=0)
    alpha = models.FloatField(default=0)
    width = models.FloatField(default=0)
    radius = models.FloatField(default=0)

    def as_dict(self):
      return {
        "id": self.id,
        "name": self.name,
        "red": self.red,
        "green": self.green,
        "blue": self.blue,
        "alpha": self.alpha,
        "width": self.width,
        "radius": self.radius
      }
