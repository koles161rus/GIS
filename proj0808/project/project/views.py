from django.shortcuts import render

INDEX_TEMPLATE_PATH = 'project/index.html'

def index(request):
    return render(request, INDEX_TEMPLATE_PATH)