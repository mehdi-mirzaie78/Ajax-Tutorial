from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from todo.models import Todo
from .serializers import TodoSerializer


class ListTodoView(APIView):
    def get(self, request):
        queryset = Todo.objects.all()
        serializer_data = TodoSerializer(queryset, many=True)
        return Response(serializer_data.data, status=status.HTTP_200_OK)

class CreateTodoView(APIView):
    def post(self, request):
        serializer_data = TodoSerializer(data=request.data)
        if serializer_data.is_valid():
            serializer_data.save()
            return Response(serializer_data.data, status=status.HTTP_201_CREATED)
        return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)


