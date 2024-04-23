from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserProfileView, validate_password

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('validate-password/', validate_password, name='validate-password'),
]