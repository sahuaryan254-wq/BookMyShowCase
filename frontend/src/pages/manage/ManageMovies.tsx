import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Search, Plus, Edit2, Trash2, Eye,
    Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f7fb', padding: '25px' }}>
            <div style={{ flex: 1, maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Manage Movies</h1>
                        <p style={{ fontSize: '0.85rem', color: '#adb5bd' }}>Add, edit or remove movies from the platform.</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        style={{ padding: '10px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ChevronLeft size={16} /> Back to Dashboard
                    </button>
                </div>

                {/* Table Container */}
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ padding: '20px', borderBottom: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #eef0f2', outline: 'none', fontSize: '0.9rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ padding: '10px 15px', background: '#f8f9fa', border: '1px solid #eef0f2', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <Filter size={16} /> Filter
                            </button>
                            <button
                                onClick={() => alert('Add Movie Modal Coming Soon')}
                                style={{ padding: '10px 20px', background: '#4680ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                <Plus size={18} /> Add New Movie
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8f9fa' }}>
                                <tr>
                                    <th style={thStyle}>Movie</th>
                                    <th style={thStyle}>Genre</th>
                                    <th style={thStyle}>Duration</th>
                                    <th style={thStyle}>Release Date</th>
                                    <th style={thStyle}>Rating</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#adb5bd' }}>Loading movies...</td></tr>
                                ) : filteredMovies.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#adb5bd' }}>No movies found.</td></tr>
                                ) : (
                                    filteredMovies.map((movie) => (
                                        <tr key={movie.id} style={{ borderBottom: '1px solid #f8f9fa', transition: 'background 0.2s' }}>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '55px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                                        {movie.poster_url && <img src={movie.poster_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{movie.title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#adb5bd' }}>ID: #{movie.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>{movie.genre}</td>
                                            <td style={tdStyle}>{movie.duration} min</td>
                                            <td style={tdStyle}>{movie.release_date}</td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <span style={{ fontWeight: 700, color: '#ffb64d' }}>★</span>
                                                    {movie.rating || 'N/A'}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button style={actionBtnStyle} title="View"><Eye size={16} /></button>
                                                    <button style={actionBtnStyle} title="Edit"><Edit2 size={16} /></button>
                                                    <button
                                                        onClick={() => deleteMovie(movie.id)}
                                                        style={{ ...actionBtnStyle, color: '#ff5370' }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f1f1' }}>
                        <div style={{ fontSize: '0.85rem', color: '#adb5bd' }}>
                            Showing <b>{filteredMovies.length}</b> movies
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button style={pageBtnStyle} disabled><ChevronLeft size={16} /></button>
                            <button style={{ ...pageBtnStyle, background: '#4680ff', color: 'white', border: 'none' }}>1</button>
                            <button style={pageBtnStyle} disabled><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: '15px 20px',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const tdStyle: React.CSSProperties = {
    padding: '12px 20px',
    fontSize: '0.85rem',
    color: '#555'
};

const actionBtnStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid #f1f1f1',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#adb5bd',
    transition: 'all 0.2s'
};

const pageBtnStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid #f1f1f1',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#555'
};
