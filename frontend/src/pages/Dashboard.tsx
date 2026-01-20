import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { TrendingUp, Users, Film, Calendar, DollarSign, ShoppingCart, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchStats();
    }, [isAuthenticated, navigate]);

    const fetchStats = async () => {
        try {
            const response = await api.get('dashboard/stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading dashboard...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1>Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Failed to load dashboard data.</p>
            </div>
        );
    }

    const { overview, revenue, bookings: bookingStats, user_role } = stats;

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${revenue.this_month.toLocaleString('en-IN')}`,
            subtitle: `Last month: ₹${revenue.last_month.toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: '#10b981',
        },
        {
            title: 'Total Bookings',
            value: overview.total_bookings.toLocaleString(),
            subtitle: `${bookingStats.this_month} this month`,
            icon: ShoppingCart,
            color: '#3b82f6',
        },
        {
            title: 'Theatres',
            value: overview.total_theatres.toLocaleString(),
            subtitle: user_role.is_theatre_owner ? 'Your theatres' : 'Total theatres',
            icon: Film,
            color: '#8b5cf6',
        },
        {
            title: 'Active Shows',
            value: overview.total_shows.toLocaleString(),
            subtitle: 'Currently running',
            icon: Calendar,
            color: '#f59e0b',
        },
    ];

    if (user_role.is_admin) {
        statCards.push(
            {
                title: 'Total Users',
                value: overview.total_users.toLocaleString(),
                subtitle: 'Registered users',
                icon: Users,
                color: '#ef4444',
            },
            {
                title: 'Total Movies',
                value: overview.total_movies.toLocaleString(),
                subtitle: 'Available movies',
                icon: Film,
                color: '#06b6d4',
            }
        );
    }

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1400px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Welcome back, {user?.username || 'User'}! 
                    {user_role.is_admin && ' (Admin)'}
                    {user_role.is_theatre_owner && ' (Theatre Owner)'}
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-md)',
                                background: `${card.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Icon size={24} color={card.color} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    {card.title}
                                </div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                    {card.value}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {card.subtitle}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Booking Status */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <AlertCircle size={32} color="#f59e0b" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {bookingStats.pending}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pending Bookings</div>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {bookingStats.confirmed}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Confirmed Bookings</div>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <XCircle size={32} color="#ef4444" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {bookingStats.cancelled}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cancelled Bookings</div>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <TrendingUp size={32} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        ₹{revenue.today.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Revenue Today</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
            }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {(user_role.is_admin || user_role.is_theatre_owner) && (
                        <>
                            <button
                                onClick={() => navigate('/manage/theatres')}
                                className="btn btn-primary"
                            >
                                Manage Theatres
                            </button>
                            <button
                                onClick={() => navigate('/manage/shows')}
                                className="btn btn-primary"
                            >
                                Manage Shows
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="btn"
                        style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        View My Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}
