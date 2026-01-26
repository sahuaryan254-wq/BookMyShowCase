import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import {
    LayoutDashboard, Box, Users, ShoppingCart,
    MessageSquare, Calendar, Monitor,
    ChevronDown, Search, Globe,
    Moon, Bell, User, Edit2, Trash2,
    DollarSign, TrendingUp, Download,
    Menu, X, Activity, Zap, Star
} from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const COLORS = {
    primary: '#F84464', // BMS Red
    secondary: '#1e293b',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    dark: '#0f172a',
    cardBg: '#1e293b',
    sidebar: '#0f172a',
    header: '#1e293b',
    bg: '#020617' // Deep slate black
};

const lineData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 6890 },
    { name: 'Sat', sales: 8390 },
    { name: 'Sun', sales: 9490 },
];

const trafficData = [
    { name: 'Direct', value: 80, color: '#F84464' },
    { name: 'Social', value: 50, color: '#3b82f6' },
    { name: 'Referral', value: 70, color: '#10b981' },
    { name: 'Search', value: 40, color: '#f59e0b' },
];

export default function Dashboard() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [extraData, setExtraData] = useState<any>(null);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');

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
            setStats({
                overview: { total_bookings: 1240, total_theatres: 25, total_shows: 156 },
                revenue: { this_month: 85400, last_month: 72000 },
                bookings: { this_month: 450 },
                charts: { sales_history: lineData, distribution: [{ name: 'Confirmed', value: 400, color: COLORS.primary }, { name: 'Pending', value: 100, color: '#3b82f6' }] },
                notifications: [
                    { id: 1, title: 'Revenue Spike', message: 'Sales are up by 25% today!', time: 'Just now', type: 'success' },
                    { id: 2, title: 'System Alert', message: 'New update available for movie engine.', time: '2 hours ago', type: 'info' }
                ],
                user_role: { is_admin: true }
            });
        } finally {
            setLoading(false);
        }
    };

    const sidebarItems = [
        { type: 'label', label: 'Main' },
        { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
        { name: 'Analytics', icon: Activity, path: '/analytics' },
        { type: 'label', label: 'Management' },
        { name: 'Movies', icon: Box, path: '/manage/movies' },
        { name: 'Theatres', icon: Monitor, path: '/manage/theatres' },
        { name: 'Shows', icon: Calendar, path: '/manage/shows' },
        { name: 'Bookings', icon: ShoppingCart, path: '/manage/bookings' },
        { type: 'label', label: 'People' },
        { name: 'Users', icon: Users, path: '/manage/users' },
        { name: 'Support', icon: MessageSquare, path: '/support' },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: COLORS.bg }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ width: '60px', height: '60px', border: '2px solid rgba(248, 68, 100, 0.1)', borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: COLORS.primary, fontWeight: 900 }}>BMS</div>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, color: '#f1f5f9', fontFamily: "'Outfit', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '280px' : '0px',
                background: COLORS.sidebar,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000,
                borderRight: '1px solid rgba(255,255,255,0.05)',
                overflowX: 'hidden'
            }}>
                <div style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', background: COLORS.primary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${COLORS.primary}40` }}>
                        <Zap size={20} fill="white" color="white" />
                    </div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Showcase<span style={{ color: COLORS.primary }}>Pro</span></span>
                </div>

                <div
                    className="custom-scrollbar"
                    style={{ flex: 1, overflowY: 'auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {sidebarItems.map((item, idx) => {
                        if (item.type === 'label') {
                            return (
                                <div key={idx} style={{ padding: '25px 15px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                    {item.label}
                                </div>
                            );
                        }
                        const Icon = item.icon as any;
                        const isActive = location.pathname === item.path || (item.name === 'Overview' && location.pathname === '/admin');
                        return (
                            <Link
                                key={idx}
                                to={item.path || '#'}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 15px',
                                    color: isActive ? 'white' : '#94a3b8',
                                    background: isActive ? 'linear-gradient(90deg, rgba(248, 68, 100, 0.15) 0%, rgba(248, 68, 100, 0) 100%)' : 'transparent',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: isActive ? 600 : 500,
                                    borderRadius: '10px',
                                    transition: 'all 0.2s',
                                    gap: '12px',
                                    borderLeft: isActive ? `3px solid ${COLORS.primary}` : '3px solid transparent'
                                }}
                            >
                                <Icon size={20} style={{ opacity: isActive ? 1 : 0.7 }} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div style={{ padding: '30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ background: 'rgba(248, 68, 100, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(248, 68, 100, 0.1)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '5px' }}>Upgrade to Enterprise</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '15px' }}>Get advanced analytics and multi-theatre support.</div>
                        <button style={{ width: '100%', padding: '10px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Learn More</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{
                flex: 1,
                marginLeft: sidebarOpen ? '280px' : '0',
                transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <header style={{
                    height: '80px',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900,
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '8px', marginRight: '25px' }}>
                        <Menu size={20} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Good Morning, {user?.username} 👋</h2>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Here's what's happening on your platform today.</span>
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '25px' }}>
                        <div style={{ position: 'relative', width: '250px', display: window.innerWidth > 1024 ? 'block' : 'none' }}>
                            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="text"
                                placeholder="Search data..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 15px 10px 45px', color: 'white', outline: 'none' }}
                            />
                        </div>

                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setNotificationsOpen(!notificationsOpen)}>
                            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Bell size={20} color="#94a3b8" />
                            </div>
                            <span style={{ position: 'absolute', top: '2px', right: '2px', background: COLORS.primary, width: '18px', height: '18px', borderRadius: '50%', border: '3px solid #0f172a', fontSize: '9px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {stats?.notifications?.length || 0}
                            </span>

                            {notificationsOpen && (
                                <div style={{ position: 'absolute', top: '60px', right: '0', width: '350px', background: '#1e293b', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 1001, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                    <div style={{ padding: '20px', fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Notifications
                                        <div style={{ fontSize: '0.7rem', color: COLORS.primary, cursor: 'pointer' }}>Mark all as read</div>
                                    </div>
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {stats?.notifications?.map((n: any) => (
                                            <div key={n.id} style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '15px' }}>
                                                <div style={{ width: '10px', height: '10px', background: n.type === 'success' ? '#10b981' : '#3b82f6', borderRadius: '50%', marginTop: '5px' }}></div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '3px' }}>{n.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{n.message}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '8px' }}>{n.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            onClick={logout}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '25px', cursor: 'pointer' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.username}</div>
                                <div style={{ fontSize: '0.75rem', color: COLORS.primary, fontWeight: 700 }}>{stats?.user_role?.is_admin ? 'Admin' : 'Owner'}</div>
                            </div>
                            <div style={{ width: '45px', height: '45px', background: `linear-gradient(135deg, ${COLORS.primary}, #D43552)`, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', boxShadow: `0 10px 20px ${COLORS.primary}40` }}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Body */}
                <main style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '35px' }}>

                    {/* Live Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(16, 185, 129, 0.05)', padding: '12px 25px', borderRadius: '100px', width: 'fit-content', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#10b981', borderRadius: '50%', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981' }}>Live: 128 Active Users</span>
                        <style>{`@keyframes ping { 75%, 100% { transform: scale(3); opacity: 0; } }`}</style>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                        <StatCard
                            title="Total Revenue"
                            value={`₹${stats?.revenue?.this_month?.toLocaleString('en-IN') || '0'}`}
                            change="+12.5%"
                            icon={<DollarSign />}
                            gradient="linear-gradient(135deg, #F84464 0%, #D43552 100%)"
                        />
                        <StatCard
                            title="Bookings"
                            value={stats?.overview?.total_bookings || '0'}
                            change="+8.2%"
                            icon={<ShoppingCart />}
                            gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                        />
                        <StatCard
                            title="Running Shows"
                            value={stats?.overview?.total_shows || '0'}
                            change="+4.1%"
                            icon={<Activity />}
                            gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                        />
                        <StatCard
                            title="Average Rating"
                            value="4.8"
                            change="+0.2"
                            icon={<Star />}
                            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        />
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1200 ? '2fr 1fr' : '1fr', gap: '30px' }}>
                        {/* Area Chart */}
                        <div style={{ background: COLORS.cardBg, padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Revenue Growth</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Weekly performance analysis</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button style={btnSmallStyle}>Week</button>
                                    <button style={{ ...btnSmallStyle, background: COLORS.primary, color: 'white' }}>Month</button>
                                </div>
                            </div>
                            <div style={{ height: '350px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.charts?.sales_history || lineData}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: COLORS.primary }}
                                        />
                                        <Area type="monotone" dataKey="sales" stroke={COLORS.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Traffic Sources */}
                        <div style={{ background: COLORS.cardBg, padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '30px' }}>Traffic Pulse</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                {trafficData.map((item, idx) => (
                                    <div key={idx} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</span>
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.value}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: '10px', boxShadow: `0 0 10px ${item.color}40` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '30px', padding: '20px', background: 'linear-gradient(135deg, rgba(248, 68, 100, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)', borderRadius: '20px', textAlign: 'center' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px' }}>Top Growing Source</div>
                                <div style={{ color: COLORS.primary, fontWeight: 900, fontSize: '1.2rem' }}>Direct Visit <TrendingUp size={16} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Table */}
                    <div style={{ background: COLORS.cardBg, padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Transactions</h3>
                            <button style={{ ...btnSmallStyle, color: COLORS.primary, background: 'rgba(248, 68, 100, 0.1)' }}>View Report</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={thStyle}>Customer</th>
                                        <th style={thStyle}>Movie / Item</th>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(extraData?.recent_bookings || demoBookings).map((b: any, idx: number) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={16} />
                                                    </div>
                                                    {b.user_email || b.customer}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>{b.show_details?.movie_title || b.product}</td>
                                            <td style={tdStyle}>{b.show_details?.date || b.date}</td>
                                            <td style={{ ...tdStyle, fontWeight: 800 }}>₹{b.total_amount || b.id * 10}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '5px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800,
                                                    background: b.status === 'CONFIRMED' || b.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: b.status === 'CONFIRMED' || b.status === 'Success' ? '#10b981' : '#f59e0b',
                                                    border: `1px solid ${b.status === 'CONFIRMED' || b.status === 'Success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                                }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon, gradient }: any) {
    return (
        <div style={{
            background: COLORS.cardBg,
            padding: '30px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: gradient, opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '45px', height: '45px', background: gradient, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                    {icon}
                </div>
                <div style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, borderRadius: '8px' }}>
                    {change}
                </div>
            </div>
            <div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600, marginBottom: '5px' }}>{title}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>{value}</div>
            </div>
        </div>
    );
}

const btnSmallStyle: React.CSSProperties = {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#94a3b8',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const thStyle: React.CSSProperties = {
    padding: '15px',
    color: '#64748b',
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1px'
};

const tdStyle: React.CSSProperties = {
    padding: '20px 15px',
    fontSize: '0.9rem',
    color: '#cbd5e1',
    fontWeight: 500
};

const demoBookings = [
    { customer: 'Alex Rivera', product: 'Oppenheimer - 2D', date: 'Oct 24, 2026', total_amount: 1200, status: 'CONFIRMED' },
    { customer: 'Sarah Jenkins', product: 'Pushpa 2 - IMAX', date: 'Oct 24, 2026', total_amount: 850, status: 'PENDING' },
    { customer: 'Mike Ross', product: 'Batman - 4DX', date: 'Oct 23, 2026', total_amount: 1500, status: 'CONFIRMED' },
];
