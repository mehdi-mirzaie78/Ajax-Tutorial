from django.shortcuts import get_object_or_404
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


class TodoDetailView(APIView):
    def get(self, request, pk):
        todo = Todo.objects.filter(pk=pk)
        if todo.exists():
            todo = todo.get()
            serializer_data = TodoSerializer(todo)
            return Response(serializer_data.data, status=status.HTTP_200_OK)
        return Response({"msg": f"There is no todo with ID: {pk}"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        todo = Todo.objects.filter(pk=pk)
        if todo.exists():
            todo = todo.get()
            serializer_data = TodoSerializer(instance=todo, data=request.data)
            serializer_data.is_valid(raise_exception=True)
            serializer_data.save()
            return Response(serializer_data.data, status=status.HTTP_200_OK)
        return Response({"msg": f"There is no todo with ID: {pk}"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        todo = Todo.objects.filter(pk=pk)
        if todo.exists():
            todo.delete()
            return Response({"msg": f"Todo with ID: {pk} deleted Sucessfully"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"msg": f"There is no todo with ID: {pk}"}, status=status.HTTP_404_NOT_FOUND)
