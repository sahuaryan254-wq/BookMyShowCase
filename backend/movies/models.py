from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    duration_minutes = models.IntegerField()
    language = models.CharField(max_length=50)
    release_date = models.DateField()
    genre = models.CharField(max_length=100)  # Simple comma-separated string for now or change to ManyToMany
    poster_image = models.URLField(max_length=500, null=True, blank=True)
    trailer_url = models.URLField(max_length=500, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)

    def __str__(self):
        return self.title
