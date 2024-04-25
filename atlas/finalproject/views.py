from django.shortcuts import render, redirect
from django.conf import settings
from django.http import JsonResponse
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, CollectionSerializer, CollectionGameSerializer
from .igdb_api import search_games, igdb_api_request
from .models import Favorite, Collection, CollectionGame
import requests

class CollectionListCreateView(generics.ListCreateAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Collection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CollectionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Collection.objects.filter(user=self.request.user)

class CollectionGameListCreateView(generics.ListCreateAPIView):
    serializer_class = CollectionGameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        collection_id = self.kwargs['collection_id']
        return CollectionGame.objects.filter(collection_id=collection_id)

    def perform_create(self, serializer):
        collection_id = self.kwargs['collection_id']
        serializer.save(collection_id=collection_id)

class CollectionGameRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CollectionGameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        collection_id = self.kwargs['collection_id']
        return CollectionGame.objects.filter(collection_id=collection_id)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_favorite(request):
    user = request.user
    game_id = request.GET.get('game_id')

    if not game_id:
        return Response({'error': 'Game ID is required.'}, status=400)

    is_favorite = Favorite.objects.filter(user=user, game_id=game_id).exists()

    return Response({'is_favorite': is_favorite})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request):
    user = request.user
    game_id = request.data.get('game_id')

    if not game_id:
        return Response({'error': 'Game ID is required.'}, status=400)

    favorite, created = Favorite.objects.get_or_create(user=user, game_id=game_id)

    if not created:
        favorite.delete()

    return Response({'is_favorite': created})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorites(request):
    user = request.user
    favorites = Favorite.objects.filter(user=user)

    game_ids = [favorite.game_id for favorite in favorites]

    if game_ids:
        endpoint = 'games'
        query = f'fields name, cover.url, rating; where id = ({",".join(str(game_id) for game_id in game_ids)}); limit 50;'
        games = igdb_api_request(endpoint, query)
        for game in games:
            cover_url = game.get('cover', {}).get('url', '')
            if cover_url:
                game['cover']['url'] = cover_url.replace('t_thumb', 't_cover_big')
    else:
        games = []

    return Response(games)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_password(request):
    user = request.user
    password = request.data.get('password')
    if user.check_password(password):
        return Response({'valid': True})
    else:
        return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def search_games_view(request):
    query = request.GET.get('query', '')
    search_type = request.GET.get('type', 'title')

    games = search_games(query, search_type) 
    return Response({'results': games})



def search_games(query, search_type='title'):
    endpoint = 'games'
    base_query = f'fields id, name, cover.url, cover.image_id, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, genres.name, platforms.name, rating; limit 50;'

    if search_type == 'title':
        query_string = f'{base_query} where name ~ *"{query}"*; sort rating desc;'
    elif search_type == 'developer':
        query_string = f'{base_query} where involved_companies.company.name ~ *"{query}"*; sort rating desc;'

    response = igdb_api_request(endpoint, query_string)
    print(f"API Response: {response}")

    games = []
    for game in response:
        if 'id' not in game:
            continue

        image_id = game.get('cover', {}).get('image_id', '')
        cover_url = f"https://images.igdb.com/igdb/image/upload/t_cover_big/{image_id}.jpg" if image_id else ''
        genres = [genre['name'] for genre in game.get('genres', []) if 'name' in genre]
        platforms = [platform['name'] for platform in game.get('platforms', []) if 'name' in platform]
        rating = float(game.get('rating', 0))

        developers = []
        publishers = []
        for company in game.get('involved_companies', []):
            if 'company' in company:
                if company.get('developer', False):
                    developers.append(company['company'].get('name', ''))
                if company.get('publisher', False):
                    publishers.append(company['company'].get('name', ''))

        games.append({
            'id': game['id'],
            'name': game['name'],
            'cover': cover_url,
            'genres': genres,
            'developers': developers,
            'publishers': publishers,
            'platforms': platforms,
            'rating': rating
        })

    return games

@api_view(['GET'])
def get_games_by_ids(request):
    game_ids = request.GET.get('ids', '').split(',')
    game_ids = [int(id) for id in game_ids if id.strip()]

    if not game_ids:
        return Response({'error': 'No game IDs provided.'}, status=400)

    endpoint = 'games'
    query = f'fields name, cover.url, rating, summary, genres.name, platforms.name; where id = ({",".join(str(game_id) for game_id in game_ids)}); limit 50;'
    games = igdb_api_request(endpoint, query)

    for game in games:
        cover_url = game.get('cover', {}).get('url', '')
        if cover_url:
            game['cover'] = cover_url.replace('t_thumb', 't_cover_big')
        genres = ', '.join(genre['name'] for genre in game.get('genres', []))
        game['genres'] = genres
        platforms = ', '.join(platform['name'] for platform in game.get('platforms', []))
        game['platforms'] = platforms

    return Response(games)

def game_details_view(request, game_id):
    endpoint = 'games'
    query = f'fields name, first_release_date, genres.name, platforms.name, summary, cover.url, rating, videos.video_id, websites.url; where id = {game_id};'
    response = igdb_api_request(endpoint, query)

    if response:
        game_data = response[0]  # Assuming the first item in the response is the game data
        
        # Use the cover_big size for the cover image URL
        cover_url = game_data.get('cover', {}).get('url', '')
        if cover_url:
            game_data['cover'] = cover_url.replace('t_thumb', 't_cover_big')

        return JsonResponse(game_data, safe=False)
    else:
        return JsonResponse({'error': 'Game not found'}, status=404)


def igdb_oauth_callback(request):
    # Extract the authorization code from the request parameters
    auth_code = request.GET.get('code')

    # Set up the request parameters for exchanging the authorization code for an access token
    token_url = 'https://id.twitch.tv/oauth2/token'
    params = {
        'client_id': settings.IGDB_CLIENT_ID,
        'client_secret': settings.IGDB_CLIENT_SECRET,
        'code': auth_code,
        'grant_type': 'authorization_code',
        'redirect_uri': settings.IGDB_REDIRECT_URI,
    }

    # Make a POST request to the IGDB API's token endpoint to exchange the authorization code for an access token
    response = requests.post(token_url, params=params)
    data = response.json()

    access_token = data.get('access_token')
    # Store the access token securely (e.g., in the user's session or database)
    request.session['igdb_access_token'] = access_token

    # Redirect the user to your frontend application
    return redirect(settings.FRONTEND_URL)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED
        )


class UserLoginView(generics.CreateAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'detail': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user