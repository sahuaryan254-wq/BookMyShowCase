from rest_framework import serializers
from .models import Booking
from users.serializers import UserSerializer
from bookmyshowcase.serializers import ShowSerializer, ShowSeatSerializer


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    show = ShowSerializer(read_only=True)
    seats = ShowSeatSerializer(many=True, read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
