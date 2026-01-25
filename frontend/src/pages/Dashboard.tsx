import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import {
    TrendingUp, Film, Calendar, DollarSign,
    ShoppingCart, AlertCircle,
    LayoutDashboard, Monitor, Ticket, Users as UsersIcon,
    Tag, Search, Bell, LogOut, ChevronLeft, Menu
} from 'lucide-react';

export default function Dashboard() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState<any>(null);
    const [extraData, setExtraData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

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

    const sidebarItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Movies', icon: Film, path: '/manage/movies' },
        { name: 'Theatres', icon: Monitor, path: '/manage/theatres' },
        { name: 'Shows', icon: Calendar, path: '/manage/shows' },
        { name: 'Bookings', icon: Ticket, path: '/manage/bookings' },
        { name: 'Users', icon: UsersIcon, path: '/manage/users' },
        { name: 'Coupons', icon: Tag, path: '/manage/coupons' },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!stats) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <AlertCircle size={48} color="#ef4444" />
                <h2>Error loading stats</h2>
                <button onClick={fetchDashboardData}>Retry</button>
            </div>
        );
    }

    const { overview, revenue, bookings: bookingStats, user_role } = stats;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '260px' : '80px',
                background: '#1e293b',
                color: '#f8fafc',
                transition: 'width 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {sidebarOpen && <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '1px' }}>ADMIN<span style={{ color: 'var(--brand-primary)' }}>PANEL</span></span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
                        {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0' }}>
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.85rem 1.5rem',
                                color: location.pathname === item.path ? 'white' : '#94a3b8',
                                background: location.pathname === item.path ? 'rgba(248, 68, 100, 0.1)' : 'transparent',
                                borderLeft: location.pathname === item.path ? '4px solid var(--brand-primary)' : '4px solid transparent',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            color: '#ef4444',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            padding: 0
                        }}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: sidebarOpen ? '260px' : '80px',
                transition: 'margin-left 0.3s ease',
                padding: '1.5rem'
            }}>
                {/* Header */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    background: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 1rem 0.6rem 2.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button style={{ position: 'relative', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <Bell size={20} />
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--brand-primary)', borderRadius: '50%', border: '2px solid white' }}></span>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1 }}>{user?.username}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                                    {user_role.is_admin ? 'Super Admin' : 'Theatre Owner'}
                                </div>
                            </div>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'var(--brand-primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1.1rem'
                            }}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Overview</h1>
                        <p style={{ color: '#64748b' }}>Quick summary of your platform pulse.</p>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {[
                            { label: 'Monthly Revenue', value: `₹${revenue.this_month.toLocaleString('en-IN')}`, icon: DollarSign, color: '#10b981', sub: `Last month ₹${revenue.last_month.toLocaleString('en-IN')}` },
                            { label: 'Total Bookings', value: overview.total_bookings.toLocaleString(), icon: ShoppingCart, color: '#3b82f6', sub: `${bookingStats.this_month} new this month` },
                            { label: 'Active Theatres', value: overview.total_theatres.toLocaleString(), icon: Film, color: '#8b5cf6', sub: 'Verified locations' },
                            { label: 'Running Shows', value: overview.total_shows.toLocaleString(), icon: Calendar, color: '#f59e0b', sub: 'Live screenings' },
                        ].map((s, i) => (
                            <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: `${s.color}10`, color: s.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <s.icon size={20} />
                                    </div>
                                    <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, background: '#10b98110', padding: '4px 8px', borderRadius: '12px', height: 'fit-content' }}>+12%</div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{s.label}</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>{s.value}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        {/* Table */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontWeight: 800 }}>Recent Activity</h3>
                                <button style={{ color: 'var(--brand-primary)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>View Report</button>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                            <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>User</th>
                                            <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Movie</th>
                                            <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                            <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {extraData?.recent_bookings?.map((b: any) => (
                                            <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{ padding: '1rem 0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{b.user_email}</td>
                                                <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem' }}>{b.show_details?.movie_title}</td>
                                                <td style={{ padding: '1rem 0.5rem' }}>
                                                    <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, background: b.status === 'CONFIRMED' ? '#ecfdf5' : '#fff7ed', color: b.status === 'CONFIRMED' ? '#10b981' : '#f59e0b' }}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>₹{b.total_amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <h3 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Top Movies</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {extraData?.top_movies?.map((m: any, i: number) => (
                                        <div key={m.movie.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#cbd5e1', fontSize: '0.9rem' }}>{i + 1}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.movie.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.booking_count} bookings</div>
                                            </div>
                                            <TrendingUp size={16} color="#10b981" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '1.5rem', borderRadius: '16px', color: 'white' }}>
                                <div style={{ marginBottom: '1rem', fontWeight: 800, fontSize: '1.1rem' }}>Need Help?</div>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>Check our documentation for advanced theatre management.</p>
                                <button style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'var(--brand-primary)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Documentation</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
