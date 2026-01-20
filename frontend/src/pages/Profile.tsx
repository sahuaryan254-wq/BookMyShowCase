import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Profile</h1>
                <p style={{ color: 'var(--text-muted)' }}>Please sign in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '900px' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>My Profile</h1>

            <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>User ID</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.id ?? '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button className="btn" onClick={logout} style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                            Logout
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Username</div>
                        <div style={{ fontWeight: 600 }}>{user?.username ?? '—'}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email</div>
                        <div style={{ fontWeight: 600 }}>{user?.email ?? '—'}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Phone</div>
                        <div style={{ fontWeight: 600 }}>{user?.phone_number ?? '—'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

