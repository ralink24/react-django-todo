from django.db import models

# Create your models here.

class Todo(models.Model):
    title = models.CharField(max_length=256)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)
    position = models.IntegerField(default=0)

    def __str__(self):
        return self.title
