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
    user_email = serializers.EmailField(source='user.email', read_only=True)
    show_details = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'

    def get_show_details(self, obj):
        return {
            'movie_title': obj.show.movie.title,
            'theatre_name': obj.show.screen.theatre.name,
            'time': obj.show.time.strftime('%H:%M'),
            'date': obj.show.date.strftime('%Y-%m-%d')
        }
