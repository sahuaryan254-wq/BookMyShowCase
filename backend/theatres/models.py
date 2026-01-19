from django.db import models
from users.models import CustomUser

class Theatre(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='theatres')

    def __str__(self):
        return f"{self.name} - {self.city}"

class Screen(models.Model):
    name = models.CharField(max_length=50) # e.g., "Screen 1"
    theatre = models.ForeignKey(Theatre, on_delete=models.CASCADE, related_name='screens')
    capacity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} at {self.theatre.name}"
