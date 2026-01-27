import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Search, Plus, Edit2, Trash2, Eye,
    Filter, ChevronLeft, ChevronRight, Film, Star, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
    primary: '#F84464',
    bg: '#020617',
    card: '#1e293b',
    text: '#f1f5f9',
    muted: '#94a3b8'
};

export default function ManageMovies() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const res = await api.get('movies/');
            setMovies(res.data.results || res.data);
        } catch (err) {
            console.error('Failed to fetch movies', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteMovie = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            try {
                await api.delete(`movies/${id}/`);
                setMovies(movies.filter(m => m.id !== id));
            } catch (err) {
                alert('Failed to delete movie');
            }
        }
    };

    const filteredMovies = movies.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, color: COLORS.text, fontFamily: "'Outfit', sans-serif", padding: '40px' }}>
            <div style={{ flex: 1, maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header + Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '5px' }}>Movie Library</h1>
                            <p style={{ color: COLORS.muted }}>Manage your platform's cinematic inventory.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin')}
                            style={{ padding: '12px 25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}
                        >
                            <ChevronLeft size={18} /> Back
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
                            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px 10px 40px',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(148, 163, 184, 0.4)',
                                    background: 'rgba(15,23,42,0.9)',
                                    color: COLORS.text,
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Grid of Movies */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                    {/* Add New Card */}
                    <div style={{
                        background: 'rgba(248, 68, 100, 0.05)', borderRadius: '24px', border: '2px dashed rgba(248, 68, 100, 0.2)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '40px', cursor: 'pointer', transition: 'all 0.3s'
                    }} className="card-hover" onClick={() => alert('Add Movie coming soon')}>
                        <div style={{ width: '60px', height: '60px', background: COLORS.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${COLORS.primary}40` }}>
                            <Plus size={30} color="white" />
                        </div>
                        <div style={{ fontWeight: 800, color: COLORS.primary }}>Add New Movie</div>
                    </div>

                    {loading ? [1, 2, 3].map(i => <div key={i} style={{ height: '400px', background: COLORS.card, borderRadius: '24px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}></div>) :
                        filteredMovies.map(movie => (
                            <div key={movie.id} style={{ background: COLORS.card, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }} className="card-hover">
                                <div style={{ height: '220px', background: '#000', position: 'relative' }}>
                                    {movie.poster_url ? <img src={movie.poster_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} /> :
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}><Film size={60} /></div>}
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                                        <button style={btnActionStyle} onClick={() => deleteMovie(movie.id)}><Trash2 size={16} color="#ef4444" /></button>
                                        <button style={btnActionStyle}><Edit2 size={16} /></button>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: COLORS.primary, padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800 }}>{movie.genre}</div>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>{movie.title}</h3>
                                    <div style={{ display: 'flex', gap: '15px', color: COLORS.muted, fontSize: '0.8rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {movie.duration}m</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={14} color="#f59e0b" fill="#f59e0b" /> {movie.rating || '4.5'}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <style>{`.card-hover:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }`}</style>
        </div>
    );
}

const btnActionStyle = {
    width: '35px',
    height: '35px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white'
};
