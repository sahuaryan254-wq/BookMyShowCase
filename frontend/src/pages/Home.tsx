import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import HeroCarousel from '../components/HeroCarousel';
import { MOCK_MOVIES, MOCK_EVENTS } from '../services/mockData';

export default function Home() {
    const [movies, setMovies] = useState<any[]>([]);

    useEffect(() => {
        // Fetch from Backend API
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/movies/');
                const data = await response.json();
                // If data is array
                if (Array.isArray(data)) {
                    setMovies(data);
                } else if (data.results) { // In case of pagination
                    setMovies(data.results);
                }
            } catch (error) {
                console.error("Failed to fetch movies:", error);
                setMovies(MOCK_MOVIES); // Fallback to mock
            }
        };
        fetchMovies();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <HeroCarousel />

            <div className="container" style={{ marginTop: '2rem' }}>
                <img src="https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-1440,h-120/lead-in-v3-collection-202102040828.png" alt="Ad" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>

            {/* Recommended Movies */}
            <section className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem' }}>Recommended Movies</h2>
                    <span style={{ color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 500 }}>See All ›</span>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '2rem'
                }}>
                    {movies.map(movie => (
                        <MovieCard key={movie.id} {...movie} />
                    ))}
                </div>
            </section>

            {/* Events Stream */}
            <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '4rem 0', marginTop: '4rem' }}>
                <div className="container">
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem' }}>The Best of Live Events</h2>
                        <span style={{ color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 500 }}>See All ›</span>
                    </div>

                    <div className="flex gap-4" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                        {/* Using generic cards for events for now */}
                        {MOCK_EVENTS.map(event => (
                            <div key={event.id} style={{ minWidth: '250px', cursor: 'pointer' }}>
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                />
                                <h3 style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>{event.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{event.category}</p>
                            </div>
                        ))}
                        {/* Placeholder for 'See More' */}
                        <div style={{
                            minWidth: '250px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-secondary)'
                        }}>
                            View All Events
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
