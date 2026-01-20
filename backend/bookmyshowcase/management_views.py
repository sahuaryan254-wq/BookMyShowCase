from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from theatres.models import Theatre, Screen
from shows.models import Show
from bookings.models import Booking
from movies.models import Movie
from users.models import CustomUser
from .serializers import TheatreSerializer, ShowSerializer, BookingSerializer


class DashboardStatsView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        is_admin = user.is_staff or user.is_superuser
        is_theatre_owner = user.is_theatre_owner
        
        # Base queries
        if is_admin:
            # Admin sees everything
            theatres = Theatre.objects.all()
            shows = Show.objects.all()
            bookings = Booking.objects.all()
            users = CustomUser.objects.all()
            movies = Movie.objects.all()
        elif is_theatre_owner:
            # Theatre owner sees only their data
            theatres = Theatre.objects.filter(owner=user)
            shows = Show.objects.filter(screen__theatre__owner=user)
            bookings = Booking.objects.filter(show__screen__theatre__owner=user)
            users = None
            movies = Movie.objects.all()
        else:
            # Customer sees their own bookings
            theatres = Theatre.objects.none()
            shows = Show.objects.none()
            bookings = Booking.objects.filter(user=user)
            users = None
            movies = Movie.objects.all()
        
        # Stats calculation
        today = timezone.now().date()
        this_month_start = today.replace(day=1)
        last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
        last_month_end = this_month_start - timedelta(days=1)
        
        stats = {
            'overview': {
                'total_theatres': theatres.count() if theatres else 0,
                'total_shows': shows.count() if shows else 0,
                'total_bookings': bookings.count() if bookings else 0,
                'total_revenue': float(bookings.filter(status='CONFIRMED').aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
                'total_users': users.count() if users else 0,
                'total_movies': movies.count() if movies else 0,
            },
            'revenue': {
                'today': float(bookings.filter(
                    status='CONFIRMED',
                    booking_date__date=today
                ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
                'this_month': float(bookings.filter(
                    status='CONFIRMED',
                    booking_date__date__gte=this_month_start
                ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
                'last_month': float(bookings.filter(
                    status='CONFIRMED',
                    booking_date__date__gte=last_month_start,
                    booking_date__date__lte=last_month_end
                ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
            },
            'bookings': {
                'today': bookings.filter(booking_date__date=today).count(),
                'this_month': bookings.filter(booking_date__date__gte=this_month_start).count(),
                'pending': bookings.filter(status='PENDING').count(),
                'confirmed': bookings.filter(status='CONFIRMED').count(),
                'cancelled': bookings.filter(status='CANCELLED').count(),
            },
            'user_role': {
                'is_admin': is_admin,
                'is_theatre_owner': is_theatre_owner,
                'is_customer': user.is_customer,
            }
        }
        
        return Response(stats)


class TheatreOwnerDashboardView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not request.user.is_theatre_owner:
            return Response({'error': 'Only theatre owners can access this'}, status=status.HTTP_403_FORBIDDEN)
        
        user = request.user
        theatres = Theatre.objects.filter(owner=user)
        shows = Show.objects.filter(screen__theatre__owner=user)
        bookings = Booking.objects.filter(show__screen__theatre__owner=user)
        
        # Recent bookings
        recent_bookings = bookings.order_by('-booking_date')[:10]
        
        # Top performing theatres
        theatre_stats = []
        for theatre in theatres:
            theatre_bookings = bookings.filter(show__screen__theatre=theatre)
            theatre_stats.append({
                'theatre': TheatreSerializer(theatre).data,
                'total_bookings': theatre_bookings.count(),
                'total_revenue': float(theatre_bookings.filter(status='CONFIRMED').aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
            })
        theatre_stats.sort(key=lambda x: x['total_revenue'], reverse=True)
        
        return Response({
            'theatres': TheatreSerializer(theatres, many=True).data,
            'theatre_stats': theatre_stats,
            'recent_bookings': BookingSerializer(recent_bookings, many=True).data,
        })


class AdminDashboardView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Only admins can access this'}, status=status.HTTP_403_FORBIDDEN)
        
        # Recent bookings
        recent_bookings = Booking.objects.order_by('-booking_date')[:10]
        
        # Top theatres by revenue
        theatres = Theatre.objects.annotate(
            revenue=Sum('screens__shows__booking__total_amount', filter=Q(screens__shows__booking__status='CONFIRMED'))
        ).order_by('-revenue')[:10]
        
        # Top movies by bookings
        movies = Movie.objects.annotate(
            booking_count=Count('shows__booking')
        ).order_by('-booking_count')[:10]
        
        return Response({
            'recent_bookings': BookingSerializer(recent_bookings, many=True).data,
            'top_theatres': [{
                'theatre': TheatreSerializer(t).data,
                'revenue': float(t.revenue or 0),
            } for t in theatres],
            'top_movies': [{
                'movie': {'id': m.id, 'title': m.title},
                'booking_count': m.booking_count,
            } for m in movies],
        })
