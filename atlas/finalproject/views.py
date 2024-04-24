from django.shortcuts import render, redirect
from django.conf import settings
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer
import requests
from .igdb_api import search_games, igdb_api_request

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
    sort_order = request.GET.get('sort', 'desc') 
    games = search_games(query, sort_order)
    return Response({'results': games})



def search_games(query, sort_order='desc'):
    endpoint = 'games'
    query_string = f'''
    fields id, name, cover.url, cover.image_id, genres.name, 
           involved_companies.company.name, involved_companies.developer, 
           involved_companies.publisher, platforms.name, rating; 
    where name ~ *"{query}"*; 
    sort rating {sort_order}; 
    limit 50;
    '''
    response = igdb_api_request(endpoint, query_string)

    games = []
    for game in response:
        if 'id' not in game:
            continue
        
        image_id = game.get('cover', {}).get('image_id', '')
        cover_url = f"https://images.igdb.com/igdb/image/upload/t_cover_big/{image_id}.jpg" if image_id else ''
        genres = [genre['name'] for genre in game.get('genres', []) if 'name' in genre]
        developers = [comp['company']['name'] for comp in game.get('involved_companies', []) if comp.get('developer', False)]
        publishers = [comp['company']['name'] for comp in game.get('involved_companies', []) if comp.get('publisher', False)]
        platforms = [platform['name'] for platform in game.get('platforms', []) if 'name' in platform]
        rating = float(game.get('rating', 0))  # Ensuring rating is a float

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