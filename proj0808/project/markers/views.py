# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from django.http import (
    HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
)

from .models import Marker

import json

from django.views.decorators.csrf import csrf_protect


@csrf_protect
def index(request):
    if request.method == 'GET':
        # get all markers
        markers = Marker.objects.all()
        markers = [ marker.as_dict() for marker in markers ] 
        markers = json.dumps(markers)
        return HttpResponse(markers, content_type='application/json')

    elif request.method == 'POST': 
        # add new marker
        name = request.POST.get('name')
        if not name:
            return HttpResponseBadRequest('"name" parameter is required')

        x = request.POST.get('x')
        if not x:
            return HttpResponseBadRequest('"x" parameter is required')

        y = request.POST.get('y')
        if not y:
            return HttpResponseBadRequest('"y" parameter is required')

        try:
            x = float(x)
            y = float(y)
        except:
            return HttpResponseBadRequest(
                '"x" and "y" parameters should be numbers')

        marker = Marker(name=name, x=x, y=y)
        marker.save()
        return HttpResponse( json.dumps({ 'id': marker.id }) )
    
    elif request.method == 'DELETE':
        id = request.GET.get('id')
        if not id:
            return HttpResponseBadRequest('"id" parameter is required')
        try:
            id = int(id)
        except:
            return HttpResponseBadRequest(
                '"id" parameter should be an integer')
        
        marker = Marker.objects.get(id=id)
        
        if not marker:
            return HttpResponseBadRequest(
                'Marker with id %d was not found'.format(id))
        
        marker.delete()
        return HttpResponse(
            'Marker with id %d has been deleted successfully'.format(id))

    else:
        return HttpResponseNotAllowed(request.method)
