import { Link } from 'react-router-dom';
import { Search, ChevronDown, Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header>
            {/* Top Navbar */}
            <nav style={{
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-light)',
                padding: '0 1rem',
                height: 'var(--navbar-height)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container flex items-center justify-between" style={{ width: '100%' }}>

                    {/* Left: Logo & Search */}
                    <div className="flex items-center gap-4" style={{ flex: 1 }}>
                        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--text-light)' }}>book</span>
                            <span style={{ background: 'var(--brand-primary)', padding: '0 4px', borderRadius: '4px' }}>my</span>
                            <span style={{ color: 'var(--text-light)' }}>showcase</span>
                        </Link>

                        <div style={{
                            flex: 1,
                            maxWidth: '500px',
                            marginLeft: '2rem',
                            position: 'relative',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.4rem 0.8rem'
                        }}>
                            <Search size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    marginLeft: '0.8rem',
                                    flex: 1,
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right: Location & Auth */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                            <span style={{ fontSize: '0.9rem' }}>Mumbai</span>
                            <ChevronDown size={14} />
                        </div>

                        {isAuthenticated && user ? (
                            <>
                                {(user.is_staff || user.is_theatre_owner) && (
                                    <Link to="/dashboard" className="hover:text-white" style={{ padding: '0.2rem 0.8rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                                        Dashboard
                                    </Link>
                                )}
                                <Link to="/profile" className="flex items-center gap-2 hover:text-white" style={{ padding: '0.2rem 0.8rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                                    <User size={18} />
                                    <span>ID: {user.id}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="btn"
                                    style={{ padding: '0.2rem 1rem', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.3)' }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ padding: '0.2rem 1.2rem', fontSize: '0.8rem' }}>
                                Sign In
                            </Link>
                        )}

                        <div className="flex items-center gap-2 cursor-pointer">
                            <Menu size={24} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Bottom Navbar (Categories) */}
            <div style={{
                backgroundColor: '#222539', // Slightly lighter dark
                color: '#ddd',
                padding: '0.6rem 0',
                fontSize: '0.9rem'
            }}>
                <div className="container flex justify-between">
                    <div className="flex gap-4">
                        <Link to="/movies" className="hover:text-white">Movies</Link>
                        <Link to="/events" className="hover:text-white">Stream</Link>
                        <Link to="/events" className="hover:text-white">Events</Link>
                        <Link to="/events" className="hover:text-white">Plays</Link>
                        <Link to="/events" className="hover:text-white">Sports</Link>
                        <Link to="/events" className="hover:text-white">Activities</Link>
                    </div>
                    <div className="flex gap-4" style={{ fontSize: '0.8rem' }}>
                        <Link to="/offers" className="hover:text-white">ListYourShow</Link>
                        <Link to="/offers" className="hover:text-white">Corporates</Link>
                        <Link to="/offers" className="hover:text-white">Offers</Link>
                        <Link to="/offers" className="hover:text-white">Gift Cards</Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
