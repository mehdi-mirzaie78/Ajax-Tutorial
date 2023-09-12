from django.shortcuts import render
from .models import Todo

def index_view(request):
    return render(request, 'index.html')
