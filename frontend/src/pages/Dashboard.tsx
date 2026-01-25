import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    TrendingUp, Users, Film, Calendar, DollarSign,
    ShoppingCart, AlertCircle, CheckCircle, XCircle,
    ArrowRight, MapPin, Clock, Star, Activity
} from 'lucide-react';

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [extraData, setExtraData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchDashboardData();
    }, [isAuthenticated, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const statsRes = await api.get('dashboard/stats/');
            setStats(statsRes.data);

            // Fetch extra data based on role
            if (statsRes.data.user_role.is_admin) {
                const adminRes = await api.get('dashboard/admin/');
                setExtraData(adminRes.data);
            } else if (statsRes.data.user_role.is_theatre_owner) {
                const ownerRes = await api.get('dashboard/theatre-owner/');
                setExtraData(ownerRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div className="spinner" style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid rgba(248, 68, 100, 0.1)',
                    borderTopColor: 'var(--brand-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '1rem'
                }}></div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Preparing your workspace...
                </div>
                <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                <h1 style={{ marginBottom: '1rem' }}>Access Denied</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    We couldn't retrieve your dashboard data. Please try logging in again.
                </p>
                <button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button>
            </div>
        );
    }

    const { overview, revenue, bookings: bookingStats, user_role } = stats;

    const statCards = [
        {
            title: 'Monthly Revenue',
            value: `₹${revenue.this_month.toLocaleString('en-IN')}`,
            subtitle: `Last month: ₹${revenue.last_month.toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: '#10b981',
            trend: revenue.this_month >= revenue.last_month ? 'up' : 'down'
        },
        {
            title: 'Total Bookings',
            value: overview.total_bookings.toLocaleString(),
            subtitle: `${bookingStats.this_month} new this month`,
            icon: ShoppingCart,
            color: '#3b82f6',
        },
        {
            title: 'Active Theatres',
            value: overview.total_theatres.toLocaleString(),
            subtitle: user_role.is_theatre_owner ? 'Managing now' : 'Platform total',
            icon: Film,
            color: '#8b5cf6',
        },
        {
            title: 'Live Shows',
            value: overview.total_shows.toLocaleString(),
            subtitle: 'Across all screens',
            icon: Calendar,
            color: '#f59e0b',
        },
    ];

    if (user_role.is_admin) {
        statCards.push(
            {
                title: 'Platform Users',
                value: overview.total_users.toLocaleString(),
                subtitle: 'Active community',
                icon: Users,
                color: '#ec4899',
            },
            {
                title: 'Movie Library',
                value: overview.total_movies.toLocaleString(),
                subtitle: 'Listed titles',
                icon: Film,
                color: '#06b6d4',
            }
        );
    }

    const GlassCard = ({ children, style = {} }: any) => (
        <div style={{
            background: 'var(--bg-primary)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            ...style
        }}>
            {children}
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1400px' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: 'var(--brand-primary)',
                        marginBottom: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        <Activity size={18} />
                        Live Dashboard
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        Welcome back, <span style={{ color: 'var(--brand-primary)' }}>{user?.username}</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.25rem' }}>
                        Here's what's happening with BookMyShowCase today.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {(user_role.is_admin || user_role.is_theatre_owner) && (
                        <>
                            <button onClick={() => navigate('/manage/shows')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={18} /> Add Show
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="stat-card" style={{
                            background: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.75rem',
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: `${card.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Icon size={20} color={card.color} />
                                </div>
                                {card.trend && (
                                    <div style={{
                                        color: card.trend === 'up' ? '#10b981' : '#ef4444',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2px',
                                        background: card.trend === 'up' ? '#10b98110' : '#ef444410',
                                        padding: '4px 8px',
                                        borderRadius: '20px',
                                        height: 'fit-content'
                                    }}>
                                        {card.trend === 'up' ? '↑' : '↓'} Performance
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>
                                {card.title}
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {card.subtitle}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Recent Bookings Table */}
                    {extraData?.recent_bookings && (
                        <GlassCard>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Bookings</h3>
                                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>View All</button>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>USER</th>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>MOVIE</th>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>DATE</th>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>AMOUNT</th>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {extraData.recent_bookings.map((booking: any) => (
                                            <tr key={booking.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                                <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{booking.user_email || 'Guest'}</td>
                                                <td style={{ padding: '1rem 0.5rem' }}>{booking.show_details?.movie_title}</td>
                                                <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    {new Date(booking.booking_date).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>₹{booking.total_amount}</td>
                                                <td style={{ padding: '1rem 0.5rem' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: booking.status === 'CONFIRMED' ? '#10b98115' : '#f59e0b15',
                                                        color: booking.status === 'CONFIRMED' ? '#10b981' : '#f59e0b',
                                                    }}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>
                    )}

                    {/* Theatre Stats for Owner */}
                    {extraData?.theatre_stats && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {extraData.theatre_stats.map((item: any) => (
                                <GlassCard key={item.theatre.id}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'var(--brand-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <Film size={24} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.theatre.name}</h4>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={12} /> {item.theatre.city}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TOTAL REVENUE</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{item.total_revenue.toLocaleString('en-IN')}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>BOOKINGS</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.total_bookings}</div>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Status Highlights */}
                    <GlassCard>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Service Health</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={18} color="#10b981" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Confirmed</span>
                                </div>
                                <span style={{ fontWeight: 700 }}>{bookingStats.confirmed}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <AlertCircle size={18} color="#f59e0b" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Pending</span>
                                </div>
                                <span style={{ fontWeight: 700 }}>{bookingStats.pending}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <XCircle size={18} color="#ef4444" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Cancelled</span>
                                </div>
                                <span style={{ fontWeight: 700 }}>{bookingStats.cancelled}</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily Target</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>75%</span>
                            </div>
                            <div style={{ height: '8px', background: '#f1f1f1', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '75%', height: '100%', background: 'var(--brand-primary)' }}></div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Top Performing Movies (Admin) */}
                    {extraData?.top_movies && (
                        <GlassCard>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Top Movies</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {extraData.top_movies.map((item: any, idx: number) => (
                                    <div key={item.movie.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'rgba(0,0,0,0.1)', width: '24px' }}>{idx + 1}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.movie.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.booking_count} bookings</div>
                                        </div>
                                        <div style={{ color: 'var(--brand-primary)' }}><TrendingUp size={16} /></div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* Quick Link Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--brand-primary) 0%, #ff6b81 100%)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Star size={80} style={{ position: 'absolute', right: '-20px', top: '-10px', opacity: 0.2, transform: 'rotate(15deg)' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>Expand Your Business</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem' }}>Add new theatres or shows to increase your revenue potential.</p>
                        <button
                            onClick={() => navigate('/manage/theatres')}
                            style={{
                                background: 'white',
                                color: 'var(--brand-primary)',
                                border: 'none',
                                padding: '0.6rem 1.2rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Get Started <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </div>
    );
}
