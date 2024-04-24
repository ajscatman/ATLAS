from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

IGDB_API_KEY = 'jchii2xwro1730ovglxhrnq0m1njcz'
IGDB_CLIENT_ID = 'kigzb47i9x1pw53j474utzpiav1j71'
IGDB_API_URL = 'https://api.igdb.com/v4'

def igdb_api_request(endpoint, query):
    url = f'{IGDB_API_URL}/{endpoint}'
    headers = {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': f'Bearer {IGDB_API_KEY}',
    }
    data = query.encode('utf-8')
    response = requests.post(url, headers=headers, data=data)
    response_json = response.json()

    # Log the raw API response to help with debugging
    print(f"API Response for {query}: {response_json}")

    return response_json

def search_games(query, page=1, games_per_page=20):
    offset = (page - 1) * games_per_page
    limit = games_per_page

    endpoint = 'games'
    query = f'search "{query}"; fields name, cover.url, genres.name, involved_companies.company.name; limit {limit}; offset {offset};'
    response = igdb_api_request(endpoint, query)

    games = []
    for game in response:
        cover_url = game.get('cover', {}).get('url', '')
        genres = [genre['name'] for genre in game.get('genres', [])]
        companies = [company['company']['name'] for company in game.get('involved_companies', [])]

        games.append({
            'id': game['id'],
            'name': game['name'],
            'cover': cover_url,
            'genres': genres,
            'companies': companies,
        })

    return {
        'count': len(response),
        'results': games,
    }