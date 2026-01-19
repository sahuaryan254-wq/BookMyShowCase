from django.db import models
from theatres.models import Screen
from shows.models import Show

class Seat(models.Model):
    SEAT_TYPES = (
        ('SILVER', 'Silver'),
        ('GOLD', 'Gold'),
        ('PLATINUM', 'Platinum'),
    )
    screen = models.ForeignKey(Screen, on_delete=models.CASCADE, related_name='seats')
    row_number = models.CharField(max_length=5) # e.g., "A", "B", "11"
    seat_number = models.CharField(max_length=5) # e.g., "1", "2"
    seat_type = models.CharField(max_length=10, choices=SEAT_TYPES)

    def __str__(self):
        return f"{self.row_number}-{self.seat_number} ({self.screen.name})"

class ShowSeat(models.Model):
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('LOCKED', 'Locked'), # For temporary hold during checkout
        ('BOOKED', 'Booked'),
    )
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name='show_seats')
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='AVAILABLE')
    price = models.DecimalField(max_digits=6, decimal_places=2) # Could override base show price

    class Meta:
        unique_together = ('show', 'seat')

    def __str__(self):
        return f"{self.seat} for {self.show} - {self.status}"
