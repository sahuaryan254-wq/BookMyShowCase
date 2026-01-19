import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookmyshowcase.settings')

import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb
MySQLdb.version_info = (2, 2, 2, 'final', 0)
MySQLdb.version = '2.2.2'

django.setup()

from movies.models import Movie
from theatres.models import Theatre, Screen
from shows.models import Show
from users.models import CustomUser

def seed():
    print("Seeding Data...")
    
    # 0. Create Theatre Owner
    owner, _ = CustomUser.objects.get_or_create(username='theatre_owner', defaults={
        'email': 'owner@bookmyshowcase.com',
        'is_theatre_owner': True
    })
    owner.set_password('password')
    owner.save()
    print(f"Theatre Owner: {owner.username}")
    
    # 1. Create Movies
    movies_data = [
        {
            "title": "Jawan",
            "description": "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
            "duration_minutes": 169,
            "language": "Hindi",
            "genre": "Action, Thriller",
            "poster_image": "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/jawan-et00330424-1693892482.jpg",
            "release_date": "2023-09-07"
        },
        {
            "title": "Gadar 2",
            "description": "Tara Singh returns to Pakistan to rescue his son Charanjeet Singh.",
            "duration_minutes": 170,
            "language": "Hindi",
            "genre": "Action, Drama",
            "poster_image": "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/gadar-2-et00338629-1688724591.jpg",
            "release_date": "2023-08-11"
        },
        {
            "title": "Oppenheimer",
            "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
            "duration_minutes": 180,
            "language": "English",
            "genre": "Biography, Drama",
            "poster_image": "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/oppenheimer-et00347867-1673330199.jpg",
            "release_date": "2023-07-21"
        },
        {
            "title": "Dream Girl 2",
            "description": "Karam, a small-town boy from Mathura, starts cross-dressing as Pooja to make ends meet.",
            "duration_minutes": 133,
            "language": "Hindi",
            "genre": "Comedy, Drama",
            "poster_image": "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/dream-girl-2-et00340111-1692169546.jpg",
            "release_date": "2023-08-25"
        },
        {
            "title": "Jailer",
            "description": "A retired jailer goes on a manhunt to find his son's killers.",
            "duration_minutes": 168,
            "language": "Tamil",
            "genre": "Action, Crime",
            "poster_image": "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/jailer-et00331686-1661162152.jpg",
            "release_date": "2023-08-10"
        }
    ]

    created_movies = []
    for m in movies_data:
        movie, created = Movie.objects.get_or_create(title=m['title'], defaults=m)
        if created:
            print(f"Created Movie: {movie.title}")
        else:
            print(f"Movie exists: {movie.title}")
        created_movies.append(movie)

    # 2. Create Theatres
    theatres_data = [
        {"name": "PVR Icon: Oberoi Mall", "address": "Goregaon East, Mumbai", "city": "Mumbai"},
        {"name": "INOX: Megaplex", "address": "Malad West, Mumbai", "city": "Mumbai"},
        {"name": "Cinepolis: Fun Republic", "address": "Andheri West, Mumbai", "city": "Mumbai"}
    ]

    created_theatres = []
    for t in theatres_data:
        t_defaults = t.copy()
        t_defaults['owner'] = owner
        theatre, created = Theatre.objects.get_or_create(name=t['name'], defaults=t_defaults)
        if created:
            print(f"Created Theatre: {theatre.name}")
        created_theatres.append(theatre)

    # 3. Create Shows (Randomly)
    today = datetime.now().date()
    for theatre in created_theatres:
        # Create a screen if none
        screen, _ = Screen.objects.get_or_create(theatre=theatre, name="Screen 1", defaults={"capacity": 100})
        
        for movie in created_movies:
            # Create 2 shows per movie per theatre
            for i in range(2):
                hour = 10 + (i * 4) + random.randint(0, 2)
                show_time = datetime.combine(today, datetime.min.time()) + timedelta(hours=hour)
                
                show, created = Show.objects.get_or_create(
                    movie=movie,
                    screen=screen,
                    date=today,
                    time=show_time.time(),
                    defaults={"price": 250.00}
                )
                if created:
                    print(f"Created Show: {movie.title} at {theatre.name} ({show_time.time()})")

    print("Seeding Complete!")

if __name__ == '__main__':
    seed()
