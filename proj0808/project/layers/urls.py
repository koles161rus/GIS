from django.conf.urls import url

from . import views

urlpatterns = [
  url(r'^$', views.index, name='index'),
  url(r'add/', views.addGeom),
  url(r'get/', views.getGeom),
  url(r'remove/(?P<feature_id>[0-9a-z_]+)', views.removeGeom),
  url(r'tiles/', views.addTiles),
  url(r'delete/(?P<tile_id>[0-9a-z_]+)', views.removeTiles),
  url(r'addvector/', views.addVector),
  url(r'getvector/', views.getVector),
  url(r'delvector/(?P<vector_id>[0-9a-z_]+)', views.removeVector),
]