from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserProfileView, validate_password, igdb_oauth_callback, \
    search_games_view, game_details_view, toggle_favorite, check_favorite, get_favorites, CollectionGameListCreateView, \
    CollectionGameRetrieveUpdateDestroyView, CollectionListCreateView, CollectionRetrieveUpdateDestroyView, get_games_by_ids, UserSearchView, \
    UserCollectionsView, CollectionOwnershipCheck, CollectionUpvoteView

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
    path('collections/', CollectionListCreateView.as_view(), name='collection-list-create'),
    path('collections/<int:pk>/', CollectionRetrieveUpdateDestroyView.as_view(), name='collection-retrieve-update-destroy'),
    path('collections/<int:collection_id>/games/', CollectionGameListCreateView.as_view(), name='collection-game-list-create'),
    path('collections/<int:collection_id>/games/<int:pk>/', CollectionGameRetrieveUpdateDestroyView.as_view(), name='collection-game-retrieve-update-destroy'),
    path('games/', get_games_by_ids, name='get-games-by-ids'),
    path('search-users/', UserSearchView.as_view(), name='search-users'),
    path('users/<int:user_id>/collections/', UserCollectionsView.as_view(), name='user-collections'),
    path('collections/<int:pk>/check-ownership/', CollectionOwnershipCheck.as_view(), name='collection-ownership-check'),
    path('collections/<int:collection_id>/upvote/', CollectionUpvoteView.as_view(), name='collection-upvote'),
]