from django.shortcuts import render

from django.http import (
    HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse
)

from .models import Layer, Feature, Vector

import json

def index(request):
    # import pdb; pdb.set_trace()
    response_data = []
    layers = Layer.objects.all()
    for layer in layers:
        response_data.append(layer.as_dict())
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def addGeom(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'text': 'ONLY POST REQUEST'}, status = 400)
    name = request.POST['name']
    geomType = request.POST['geomType']
    coord = request.POST['coord']
    prop = request.POST['prop']
    feature = Feature(name = name, geomType = geomType, coord = coord, prop = prop)
    feature.save()
    return JsonResponse({ 'status': 'ok', 'id': feature.id })

def getGeom(request):
    response_data = []
    features = Feature.objects.all()
    for feature in features:
        response_data.append(feature.as_dict())
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def removeGeom(request, feature_id):
    if request.method != "DELETE":
        return JsonResponse({'status': 'error', 'text': 'ONLY DELETE REQUEST' + str(request.method)}, status = 400)
    Feature.objects.get(id = feature_id).delete()
    return JsonResponse({ 'status': 'ok' })

def addTiles(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'text': 'ONLY DELETE REQUEST' + str(request.method)}, status = 400)
    name = request.POST['name']
    url = request.POST['url']
    layer = Layer(name = name, url = url)
    layer.save()
    return JsonResponse({ 'status': 'ok', 'id': layer.id })

def removeTiles(request, tile_id):
    if request.method != "DELETE":
        return JsonResponse({'status': 'error', 'text': 'ONLY DELETE REQUEST' + str(request.method)}, status = 400)
    Layer.objects.get(id = tile_id).delete()
    return JsonResponse({ 'status': 'ok' })

def addVector(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'text': 'ONLY POST REQUEST'}, status = 400)
    name = request.POST['name']
    red = request.POST['red']
    green = request.POST['green']
    blue = request.POST['blue']
    alpha = request.POST['alpha']
    width = request.POST['width']
    radius = request.POST['radius']
    vector = Vector(name = name, red = red, green = green, blue = blue, alpha = alpha, width = width, radius = radius)
    vector.save()
    return JsonResponse({ 'status': 'ok', 'id': vector.id })

def getVector(request):
    response_data = []
    vectors = Vector.objects.all()
    for vector in vectors:
        response_data.append(vector.as_dict())
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def removeVector(request, vector_id):
    if request.method != "DELETE":
        return JsonResponse({'status': 'error', 'text': 'ONLY DELETE REQUEST' + str(request.method)}, status = 400)
    Vector.objects.get(id = vector_id).delete()
    return JsonResponse({ 'status': 'ok' })