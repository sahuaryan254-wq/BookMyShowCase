import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/movies/${id}/`);
                if (response.ok) {
                    const data = await response.json();
                    setMovie(data);
                } else {
                    console.error("Failed to fetch movie details");
                }
            } catch (error) {
                console.error("Error fetching movie:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '2rem', color: 'white' }}>Loading...</div>;

    if (!movie) {
        return <div className="container" style={{ padding: '2rem', color: 'white' }}>Movie not found</div>;
    }

    // Handle different API structures (some might be flat, some nested)
    const bgImage = movie.poster_image || movie.image;

    return (
        <div>
            {/* Movie Banner */}
            <div style={{
                height: '400px',
                position: 'relative',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)',
                opacity: 0.5,
                zIndex: -1
            }} />

            <div className="container" style={{ marginTop: '-350px', position: 'relative', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {/* Poster */}
                <img
                    src={bgImage}
                    alt={movie.title}
                    style={{
                        width: '300px',
                        height: '450px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                />

                {/* Info */}
                <div style={{ paddingTop: '2rem' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{movie.title}</h1>

                    <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
                        <div className="flex items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                            <span style={{ color: 'var(--accent-yellow)', fontSize: '1.2rem' }}>★</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{movie.rating || '8.5'}/10</span>
                        </div>
                        <div style={{ backgroundColor: 'white', color: 'black', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
                            2D
                        </div>
                        <div>{movie.language}</div>
                    </div>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {movie.genre && movie.genre.split(',').map((g: string) => (
                            <span key={g} style={{ border: '1px solid var(--text-secondary)', padding: '0.2rem 0.8rem', borderRadius: 'var(--radius-lg)', fontSize: '0.9rem' }}>
                                {g.trim()}
                            </span>
                        ))}
                    </div>

                    <div style={{ marginBottom: '1.5rem', maxWidth: '600px', color: 'var(--text-secondary)' }}>
                        {movie.description}
                    </div>

                    <Link to={`/seats/${id}`} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', marginBottom: '1rem' }}>
                        Book Tickets
                    </Link>
                </div>
            </div>

            {/* About Section */}
            <div className="container" style={{ marginTop: '3rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                <h2 style={{ marginBottom: '1rem' }}>About the Movie</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    {movie.description || "No description available."}
                </p>
            </div>
        </div>
    );
}
