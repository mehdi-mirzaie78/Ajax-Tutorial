from django.shortcuts import render
from .models import Todo

def index_view(request):
    todo = Todo.objects.last()
    return render(request, 'index.html', {'todo': todo})
