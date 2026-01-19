from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import CustomUser, OTP
from .serializers import UserSerializer, RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import random

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class RegisterView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # MOCK Google Login: Accepts any email and logs them in
        email = request.data.get('email')
        name = request.data.get('name', 'Google User')
        
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or Create User
        user, created = CustomUser.objects.get_or_create(username=email, defaults={
            'email': email,
            'first_name': name
        })
        
        if created:
            user.set_unusable_password()
            user.save()
            
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })

class ForgotPasswordView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
            otp_code = str(random.randint(100000, 999999))
            OTP.objects.create(user=user, otp_code=otp_code)
            # In real app: send_mail('Subject', f'OTP: {otp_code}', ...)
            print(f"OTP for {email}: {otp_code}") 
            return Response({'message': 'OTP sent to email (check console)'})
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class VerifyOTPView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp')
        try:
            user = CustomUser.objects.get(email=email)
            otp_record = OTP.objects.filter(user=user, otp_code=otp_code).last()
            if otp_record:
                # OTP Verified
                return Response({'message': 'OTP Verified', 'reset_token': 'allow_reset'})
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        # In real app: verify reset_token
        try:
            user = CustomUser.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'})
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
