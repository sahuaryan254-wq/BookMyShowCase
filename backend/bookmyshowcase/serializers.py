from rest_framework import serializers
from theatres.models import Theatre, Screen
from shows.models import Show
from bookings.models import Booking
from seats.models import Seat, ShowSeat
from movies.serializers import MovieSerializer

class ScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screen
        fields = '__all__'

class TheatreSerializer(serializers.ModelSerializer):
    screens = ScreenSerializer(many=True, read_only=True)
    class Meta:
        model = Theatre
        fields = '__all__'

class ShowSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    screen = ScreenSerializer(read_only=True)
    class Meta:
        model = Show
        fields = '__all__'

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'

class ShowSeatSerializer(serializers.ModelSerializer):
    seat = SeatSerializer(read_only=True)
    class Meta:
        model = ShowSeat
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
