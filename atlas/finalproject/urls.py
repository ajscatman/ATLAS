from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserProfileView, validate_password, igdb_oauth_callback, \
    search_games_view, game_details_view, toggle_favourite, check_favourite, get_favourite, CollectionGameListCreateView, \
    CollectionGameRetrieveUpdateDestroyView, CollectionListCreateView, CollectionRetrieveUpdateDestroyView, get_games_by_ids, UserSearchView, \
    UserCollectionsView, CollectionOwnershipCheck, CollectionUpvoteView, TopCollectionsView, delete_collection_game, UserDetailsView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('validate-password/', validate_password, name='validate-password'),
    path('igdb-oauth-callback/', igdb_oauth_callback, name='igdb-oauth-callback'),
    path('search/', search_games_view, name='search-games'),
    path('games/<int:game_id>/', game_details_view, name='game-details'),
    path('toggle-favourite/', toggle_favourite, name='toggle-favourite'),
    path('check-favourite/', check_favourite, name='check-favourite'),
    path('favourites/', get_favourite, name='get-favourites'),
    path('collections/', CollectionListCreateView.as_view(), name='collection-list-create'),
    path('collections/<int:pk>/', CollectionRetrieveUpdateDestroyView.as_view(), name='collection-retrieve-update-destroy'),
    path('collections/<int:collection_id>/games/', CollectionGameListCreateView.as_view(), name='collection-game-list-create'),
    path('collections/<int:collection_id>/games/<int:pk>/', CollectionGameRetrieveUpdateDestroyView.as_view(), name='collection-game-retrieve-update-destroy'),
    path('games/', get_games_by_ids, name='get-games-by-ids'),
    path('search-users/', UserSearchView.as_view(), name='search-users'),
    path('users/<int:user_id>/collections/', UserCollectionsView.as_view(), name='user-collections'),
    path('collections/<int:pk>/check-ownership/', CollectionOwnershipCheck.as_view(), name='collection-ownership-check'),
    path('collections/<int:collection_id>/upvote/', CollectionUpvoteView.as_view(), name='collection-upvote'),
    path('top-collections/', TopCollectionsView.as_view(), name='top-collections'),
    path('collections/<int:collection_id>/games/<int:game_id>/delete/', delete_collection_game, name='collection-game-delete'),
    path('users/<int:pk>/', UserDetailsView.as_view(), name='user-details'),
]