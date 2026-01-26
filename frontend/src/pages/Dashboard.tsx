import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import {
    LayoutDashboard, Box, Users, ShoppingCart,
    Mail, MessageSquare, Calendar, Monitor,
    ChevronRight, ChevronDown, Search, Globe,
    Moon, Bell, User, Edit2, Trash2, Eye,
    DollarSign, ClipboardList, TrendingUp, Download,
    Menu, X
} from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = {
    primary: '#4680ff',
    secondary: '#adb5bd',
    success: '#2ed8b6',
    danger: '#ff5370',
    warning: '#ffb64d',
    info: '#00bcd4',
    dark: '#2c3e50',
    sidebar: '#ffffff',
    header: '#4680ff',
    bg: '#f6f7fb'
};

const lineData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

const pieData = [
    { name: 'Youtube', value: 400, color: '#ff5370' },
    { name: 'Facebook', value: 300, color: '#4680ff' },
    { name: 'Twitter', value: 300, color: '#00bcd4' },
];

const trafficData = [
    { name: 'Direct', value: 80, color: '#4680ff' },
    { name: 'Social', value: 50, color: '#2c3e50' },
    { name: 'Referral', value: 70, color: '#4680ff' },
    { name: 'Bounce', value: 40, color: '#2c3e50' },
    { name: 'Internet', value: 40, color: '#4680ff' },
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
    const [dateFilter, setDateFilter] = useState('This Month');

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
            // Fallback for demo if API fails
            setStats({
                overview: { total_bookings: 540, total_theatres: 12, total_shows: 48 },
                revenue: { this_month: 30200, last_month: 28000 },
                bookings: { this_month: 145 },
                user_role: { is_admin: true }
            });
        } finally {
            setLoading(false);
        }
    };

    const sidebarItems = [
        { type: 'label', label: 'MATERIALLY', subLabel: 'Dashboard & Widget' },
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', active: location.pathname === '/admin' },
        { name: 'Widget', icon: Box, path: '/widgets' },
        { type: 'label', label: 'APPLICATION', subLabel: 'Prebuild Application' },
        { name: 'User', icon: Users, path: '/manage/users', hasSub: true },
        { name: 'Movies', icon: Box, path: '/manage/movies', hasSub: true },
        { name: 'Theatres', icon: Monitor, path: '/manage/theatres', hasSub: true },
        { name: 'Shows', icon: Calendar, path: '/manage/shows', hasSub: true },
        { name: 'Bookings', icon: ShoppingCart, path: '/manage/bookings', hasSub: true },
        { name: 'Mail', icon: Mail, path: '/mail' },
        { name: 'Chat', icon: MessageSquare, path: '/chat' },
        { type: 'label', label: 'SYSTEM', subLabel: 'Settings & Security' },
        { name: 'Settings', icon: Edit2, path: '/settings' },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '260px' : '0px',
                background: COLORS.sidebar,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000,
                boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
                overflowX: 'hidden'
            }}>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f1f1f1' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(45deg, #4680ff, #00bcd4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>Materially</span>
                    <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', display: window.innerWidth < 1024 ? 'block' : 'none' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                    {sidebarItems.map((item, idx) => {
                        if (item.type === 'label') {
                            return (
                                <div key={idx} style={{ padding: '20px 25px 5px', fontSize: '0.65rem', fontWeight: 700, color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {item.label}
                                    {item.subLabel && <div style={{ fontSize: '0.6rem', fontWeight: 400, textTransform: 'none', color: '#ced4da' }}>{item.subLabel}</div>}
                                </div>
                            );
                        }
                        const Icon = item.icon as any;
                        const isActive = location.pathname === item.path || item.active;
                        return (
                            <Link
                                key={idx}
                                to={item.path || '#'}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 25px',
                                    color: isActive ? COLORS.primary : '#555',
                                    background: isActive ? '#eef3ff' : 'transparent',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 600 : 400,
                                    borderLeft: isActive ? `3px solid ${COLORS.primary}` : '3px solid transparent',
                                    transition: 'all 0.2s',
                                    gap: '12px'
                                }}
                            >
                                <Icon size={18} style={{ opacity: isActive ? 1 : 0.7 }} />
                                <span style={{ flex: 1 }}>{item.name}</span>
                                {item.hasSub && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
                            </Link>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content */}
            <div style={{
                flex: 1,
                marginLeft: sidebarOpen ? '260px' : '0',
                transition: 'margin-left 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Topbar */}
                <header style={{
                    height: '60px',
                    background: COLORS.header,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 25px',
                    color: 'white',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '20px' }}>
                        <Menu size={24} />
                    </button>

                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', color: 'rgba(255,255,255,0.7)' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.15)',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 15px 8px 40px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <Globe size={18} />
                            <span>English</span>
                            <ChevronDown size={14} />
                        </div>
                        <Moon size={18} style={{ cursor: 'pointer' }} />
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setNotificationsOpen(!notificationsOpen)}>
                            <Bell size={20} />
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: COLORS.danger, width: '15px', height: '15px', borderRadius: '50%', border: '2px solid #4680ff', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {stats?.notifications?.length || 0}
                            </span>

                            {notificationsOpen && (
                                <div style={{
                                    position: 'absolute', top: '40px', right: '0', width: '300px', background: 'white', borderRadius: '8px', boxShadow: '0 5px 25px rgba(0,0,0,0.1)', color: '#333', zIndex: 1001, overflow: 'hidden'
                                }}>
                                    <div style={{ padding: '15px', fontWeight: 700, borderBottom: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between' }}>
                                        Notifications
                                        <X size={16} onClick={(e) => { e.stopPropagation(); setNotificationsOpen(false); }} />
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {stats?.notifications?.map((n: any) => (
                                            <div key={n.id} style={{ padding: '12px 15px', borderBottom: '1px solid #f8f9fa', cursor: 'pointer', transition: 'background 0.2s' }} className="notif-item">
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{n.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{n.message}</div>
                                                <div style={{ fontSize: '0.65rem', color: '#adb5bd', marginTop: '4px' }}>{n.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ padding: '10px', textAlign: 'center', fontSize: '0.8rem', color: COLORS.primary, fontWeight: 600, background: '#f8f9fa' }}>
                                        View All
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <div style={{ textAlign: 'right', display: window.innerWidth > 768 ? 'block' : 'none' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.username}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Admin</div>
                            </div>
                            <div
                                onClick={logout}
                                style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Click to Logout"
                            >
                                <User size={18} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Body */}
                <main style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* Toolbar / Filters */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>Filter by:</span>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    style={{ padding: '6px 30px 6px 15px', borderRadius: '4px', border: '1px solid #e1e1e1', appearance: 'none', fontSize: '0.85rem', outline: 'none', background: 'white', cursor: 'pointer' }}
                                >
                                    <option>Today</option>
                                    <option>This Week</option>
                                    <option>This Month</option>
                                    <option>This Year</option>
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', background: '#f8f9fa', border: '1px solid #e1e1e1', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                <Download size={16} /> Export CSV
                            </button>
                            {stats?.user_role?.is_admin && (
                                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                    <Box size={16} /> Add New Theatre
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        <StatCard
                            title="All Earnings"
                            value={`$${stats?.revenue?.this_month || '30200'}`}
                            subText="10% changes on profit"
                            icon={<DollarSign />}
                            color="#ffb64d"
                            subColor="#ffb64d"
                        />
                        <StatCard
                            title="Task"
                            value={stats?.bookings?.this_month || '145'}
                            subText="28% task performance"
                            icon={<ClipboardList />}
                            color="#ff5370"
                            subColor="#ff5370"
                        />
                        <StatCard
                            title="Page Views"
                            value="290+"
                            subText="10k daily views"
                            icon={<Eye />}
                            color="#2ed8b6"
                            subColor="#2ed8b6"
                        />
                        <StatCard
                            title="Downloads"
                            value="500"
                            subText="1k download in App store"
                            icon={<Download />}
                            color="#4680ff"
                            subColor="#4680ff"
                        />
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '25px' }}>
                        {/* Sales Per Day Chart */}
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Sales History (Last 7 Days)</h3>
                                <div style={{ color: '#4680ff', fontSize: '0.8rem', fontWeight: 700 }}>+12% <TrendingUp size={12} style={{ verticalAlign: 'middle' }} /></div>
                            </div>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.charts?.sales_history || lineData}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4680ff" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#4680ff" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#adb5bd' }} />
                                        <YAxis hide />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="sales" stroke="#4680ff" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', borderTop: '1px solid #f1f1f1', marginTop: '20px', paddingTop: '20px' }}>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>$4230</div>
                                    <div style={{ fontSize: '0.75rem', color: '#adb5bd' }}>Total Revenue</div>
                                </div>
                                <div style={{ width: '1px', background: '#f1f1f1' }}></div>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>321</div>
                                    <div style={{ fontSize: '0.75rem', color: '#adb5bd' }}>Today Sales</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '20px', fontSize: '0.8rem', color: '#ff5370', fontWeight: 500 }}>
                                <span>REALTY <span style={{ marginLeft: '10px' }}>-0.99</span></span>
                                <span style={{ color: '#2ed8b6' }}>INFRA <span style={{ marginLeft: '10px' }}>-7.66</span></span>
                            </div>
                        </div>

                        {/* Revenue Pie Chart */}
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>Booking Distribution</h3>
                            <div style={{ height: '300px', position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats?.charts?.distribution || pieData}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {(stats?.charts?.distribution || pieData).map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#adb5bd' }}>Total</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats?.overview?.total_bookings || 0}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
                                {(stats?.charts?.distribution || pieData).map((item: any, idx: number) => (
                                    <div key={idx} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                                            {item.name}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#adb5bd' }}>{item.value} bookings</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
                        {/* Traffic Sources */}
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '25px' }}>Traffic Sources</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {trafficData.map((item, idx) => (
                                    <div key={idx}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#555' }}>
                                            <span>{item.name}</span>
                                            <span style={{ fontWeight: 600 }}>{item.value}%</span>
                                        </div>
                                        <div style={{ height: '4px', background: '#f1f1f1', borderRadius: '2px' }}>
                                            <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: '2px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Latest Order</h3>
                                <Link to="/manage/bookings" style={{ color: COLORS.primary, fontSize: '0.8rem', fontWeight: 600 }}>View All</Link>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                    <thead style={{ background: '#f8f9fa' }}>
                                        <tr>
                                            <th style={tableHeaderStyle}>Customer</th>
                                            <th style={tableHeaderStyle}>Order Id</th>
                                            <th style={tableHeaderStyle}>Photo</th>
                                            <th style={tableHeaderStyle}>Product</th>
                                            <th style={tableHeaderStyle}>Quantity</th>
                                            <th style={tableHeaderStyle}>Date</th>
                                            <th style={tableHeaderStyle}>Status</th>
                                            <th style={tableHeaderStyle}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(extraData?.recent_bookings || demoBookings).map((b: any, idx: number) => (
                                            <tr key={b.id || idx} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                                <td style={tableCellStyle}>{b.user_email || b.customer}</td>
                                                <td style={tableCellStyle}>#{b.id || b.orderId}</td>
                                                <td style={tableCellStyle}>
                                                    <div style={{ width: '32px', height: '32px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Box size={16} color="#adb5bd" />
                                                    </div>
                                                </td>
                                                <td style={tableCellStyle}>{b.show_details?.movie_title || b.product}</td>
                                                <td style={tableCellStyle}>{b.seats?.length || b.quantity || 1}</td>
                                                <td style={tableCellStyle}>{b.show_details?.date || (b.booking_date ? new Date(b.booking_date).toLocaleDateString() : b.date)}</td>
                                                <td style={tableCellStyle}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: b.status === 'CONFIRMED' || b.status === 'Paid' || b.status === 'Success' ? '#e6fffb' : '#fff7e6',
                                                        color: b.status === 'CONFIRMED' || b.status === 'Paid' || b.status === 'Success' ? '#2ed8b6' : '#ffb64d',
                                                        border: `1px solid ${b.status === 'CONFIRMED' || b.status === 'Paid' || b.status === 'Success' ? '#b5f5ec' : '#ffe7ba'}`
                                                    }}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td style={tableCellStyle}>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <Edit2 size={16} color={COLORS.primary} style={{ cursor: 'pointer' }} />
                                                        <Trash2 size={16} color={COLORS.danger} style={{ cursor: 'pointer' }} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

const tableHeaderStyle: React.CSSProperties = {
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#1e293b',
    borderBottom: '1px solid #f1f1f1'
};

const tableCellStyle: React.CSSProperties = {
    padding: '15px',
    fontSize: '0.85rem',
    color: '#555'
};

function StatCard({ title, value, subText, icon, color, subColor }: any) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>{value}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#adb5bd', marginTop: '5px' }}>{title}</p>
                </div>
                <div style={{ color: color }}>
                    {icon}
                </div>
            </div>
            <div style={{
                padding: '8px 20px',
                background: subColor,
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {subText}
                <TrendingUp size={14} />
            </div>
        </div>
    );
}

const demoBookings = [
    { customer: 'John Doe', orderId: '89432341', product: 'Moto G5', quantity: 12, date: '17-2-2017', status: 'Pending' },
    { customer: 'Jenny Wilson', orderId: '56457898', product: 'iPhone X', quantity: 15, date: '20-2-2017', status: 'Paid' },
    { customer: 'Lori Moore', orderId: '24545898', product: 'Redmi 4', quantity: 20, date: '17-2-2017', status: 'Success' },
];
