import React from 'react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
    id: number;
    title: string;
    genre: string;
    rating: number;
    image: string;
}

export default function MovieCard({ id, title, genre, rating, image }: MovieCardProps) {
    return (
        <Link to={`/movie/${id}`} className="movie-card">
            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img
                    src={image}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '350px',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--accent-yellow)', fontSize: '1.1rem' }}>★</span>
                        <span style={{ fontWeight: 'bold' }}>{rating}/10</span>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{genre}</p>
            </div>
        </Link>
    );
}
