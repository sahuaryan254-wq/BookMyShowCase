import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Search, Plus, Edit2, Trash2, Eye,
    Filter, ChevronLeft, Monitor, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f7fb', padding: '25px' }}>
            <div style={{ flex: 1, maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Manage Theatres</h1>
                        <p style={{ fontSize: '0.85rem', color: '#adb5bd' }}>Control cinema locations and their screens.</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        style={{ padding: '10px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ChevronLeft size={16} /> Back to Dashboard
                    </button>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                            <input
                                type="text"
                                placeholder="Search theatres..."
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
                                onClick={() => alert('Add Theatre Modal Incoming')}
                                style={{ padding: '10px 20px', background: '#4680ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                <Plus size={18} /> Add New Theatre
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8f9fa' }}>
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
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#adb5bd' }}>Loading theatres...</td></tr>
                                ) : filteredTheatres.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#adb5bd' }}>No theatres found.</td></tr>
                                ) : (
                                    filteredTheatres.map((theatre) => (
                                        <tr key={theatre.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '36px', height: '36px', background: '#eef3ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4680ff' }}>
                                                        <Monitor size={18} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{theatre.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#adb5bd' }}>{theatre.theatre_type || 'Multiplex'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <MapPin size={14} color="#adb5bd" />
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
    color: '#adb5bd'
};
