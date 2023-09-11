from django.db import models


class Todo(models.Model):
    title = models.CharField(max_length=120)
    content = models.TextField()
    image = models.ImageField(upload_to='todo', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True,)

    class Meta:
        ordering = ('-id',)

    def __str__(self) -> str:
        return self.title
    