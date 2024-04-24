from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserProfileView, validate_password, igdb_oauth_callback, search_games_view, game_details_view, toggle_favorite, check_favorite, get_favorites

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('validate-password/', validate_password, name='validate-password'),
    path('igdb-oauth-callback/', igdb_oauth_callback, name='igdb-oauth-callback'),
    path('search/', search_games_view, name='search-games'),
    path('games/<int:game_id>/', game_details_view, name='game-details'),
    path('toggle-favorite/', toggle_favorite, name='toggle-favorite'),
    path('check-favorite/', check_favorite, name='check-favorite'),
    path('favorites/', get_favorites, name='get-favorites'),
]