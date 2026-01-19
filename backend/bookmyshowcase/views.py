from rest_framework import viewsets
from theatres.models import Theatre, Screen
from shows.models import Show
from bookings.models import Booking
from seats.models import Seat, ShowSeat
from .serializers import TheatreSerializer, ShowSerializer, BookingSerializer, SeatSerializer, ShowSeatSerializer

class TheatreViewSet(viewsets.ModelViewSet):
    queryset = Theatre.objects.all()
    serializer_class = TheatreSerializer

class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
