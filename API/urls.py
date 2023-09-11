from django.urls import path
from . import views

app_name='api'

urlpatterns = [
    path('todo/list/', views.ListTodoView.as_view(), name='todo_list'),
    path('todo/create/', views.CreateTodoView.as_view(), name='todo_create'),
]

