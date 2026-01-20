export default function Footer() {
    return (
        <footer style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '3rem 0',
            marginTop: '4rem',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div className="container text-center">
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>BookMyShowcase</h2>
                    <p style={{ color: 'var(--text-muted)' }}>The best place to book your tickets.</p>
                </div>

                <div className="flex justify-center gap-4" style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    <a href="#">About Us</a>
                    <a href="#">Contact</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    © 2026 BookMyShowcase. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
