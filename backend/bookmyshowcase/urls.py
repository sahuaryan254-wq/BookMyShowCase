from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from movies.views import MovieViewSet
from bookmyshowcase.views import TheatreViewSet, ShowViewSet, BookingViewSet, SeatViewSet
from bookmyshowcase.management_views import DashboardStatsView, TheatreOwnerDashboardView, AdminDashboardView

router = DefaultRouter()
router.register(r'movies', MovieViewSet)
router.register(r'theatres', TheatreViewSet)
router.register(r'shows', ShowViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'seats', SeatViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('api/dashboard/theatre-owner/', TheatreOwnerDashboardView.as_view(), name='theatre_owner_dashboard'),
    path('api/dashboard/admin/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('api/', include(router.urls)),
    path('', RedirectView.as_view(url='/api/', permanent=False)),
]
