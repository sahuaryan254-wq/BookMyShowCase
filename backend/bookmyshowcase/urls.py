from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from movies.views import MovieViewSet
from bookmyshowcase.views import TheatreViewSet, ShowViewSet, BookingViewSet, SeatViewSet

router = DefaultRouter()
router.register(r'movies', MovieViewSet)
router.register(r'theatres', TheatreViewSet)
router.register(r'shows', ShowViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'seats', SeatViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/', include(router.urls)),
]
