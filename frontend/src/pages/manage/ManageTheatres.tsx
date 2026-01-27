import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Search, Plus, Edit2, Trash2, Eye,
    Filter, ChevronLeft, Monitor, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
    primary: '#F84464',
    bg: '#020617',
    card: '#1e293b',
    text: '#f1f5f9',
    muted: '#94a3b8',
    border: 'rgba(148,163,184,0.25)'
};

export default function ManageTheatres() {
    const [theatres, setTheatres] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTheatres();
    }, []);

    const fetchTheatres = async () => {
        try {
            setLoading(true);
            const res = await api.get('theatres/');
            setTheatres(res.data.results || res.data);
        } catch (err) {
            console.error('Failed to fetch theatres', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteTheatre = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this theatre?')) {
            try {
                await api.delete(`theatres/${id}/`);
                setTheatres(theatres.filter(t => t.id !== id));
            } catch (err) {
                alert('Failed to delete theatre');
            }
        }
    };

    const filteredTheatres = theatres.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, padding: '40px', color: COLORS.text, fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ flex: 1, maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>Manage Theatres</h1>
                        <p style={{ fontSize: '0.9rem', color: COLORS.muted }}>Control cinema locations and their screens.</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        style={{
                            padding: '10px 22px',
                            background: 'rgba(15,23,42,0.9)',
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: '999px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: COLORS.text
                        }}
                    >
                        <ChevronLeft size={16} /> Back to Dashboard
                    </button>
                </div>

                {/* Controls */}
                <div style={{
                    background: COLORS.card,
                    borderRadius: '20px',
                    border: `1px solid ${COLORS.border}`,
                    marginBottom: '25px',
                    padding: '18px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
                        <input
                            type="text"
                            placeholder="Search theatres..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px 10px 40px',
                                borderRadius: '999px',
                                border: `1px solid ${COLORS.border}`,
                                background: 'rgba(15,23,42,0.9)',
                                color: COLORS.text,
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button style={{
                            padding: '9px 16px',
                            background: 'rgba(15,23,42,0.9)',
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: '999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: COLORS.muted
                        }}>
                            <Filter size={16} /> Filter
                        </button>
                        <button
                            onClick={() => alert('Add Theatre Modal Incoming')}
                            style={{
                                padding: '9px 18px',
                                background: COLORS.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                boxShadow: `0 10px 25px ${COLORS.primary}40`
                            }}
                        >
                            <Plus size={18} /> Add New Theatre
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div style={{
                    background: COLORS.card,
                    borderRadius: '20px',
                    border: `1px solid ${COLORS.border}`,
                    overflow: 'hidden',
                    boxShadow: '0 20px 45px rgba(15,23,42,0.8)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Theatre</th>
                                    <th style={thStyle}>Location</th>
                                    <th style={thStyle}>Screens</th>
                                    <th style={thStyle}>Contact</th>
                                    <th style={thStyle}>Owner</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: COLORS.muted }}>Loading theatres...</td></tr>
                                ) : filteredTheatres.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: COLORS.muted }}>No theatres found.</td></tr>
                                ) : (
                                    filteredTheatres.map((theatre) => (
                                        <tr key={theatre.id} style={{ borderBottom: `1px solid rgba(15,23,42,0.9)` }}>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        background: 'rgba(248, 68, 100, 0.08)',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: COLORS.primary
                                                    }}>
                                                        <Monitor size={18} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{theatre.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: COLORS.muted }}>{theatre.theatre_type || 'Multiplex'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: COLORS.muted }}>
                                                    <MapPin size={14} />
                                                    {theatre.city}, {theatre.state}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>{theatre.screens?.length || 0} Screens</td>
                                            <td style={tdStyle}>{theatre.contact_number || 'N/A'}</td>
                                            <td style={tdStyle}>{theatre.owner_name || 'Owner'}</td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button style={actionBtnStyle} title="View"><Eye size={16} /></button>
                                                    <button style={actionBtnStyle} title="Edit"><Edit2 size={16} /></button>
                                                    <button
                                                        onClick={() => deleteTheatre(theatre.id)}
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
                </div>
            </div>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    borderBottom: `1px solid ${COLORS.border}`,
    background: 'rgba(15,23,42,0.9)'
};

const tdStyle: React.CSSProperties = {
    padding: '14px 20px',
    fontSize: '0.85rem',
    color: COLORS.text
};

const actionBtnStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '999px',
    border: `1px solid ${COLORS.border}`,
    background: 'rgba(15,23,42,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: COLORS.muted
};
