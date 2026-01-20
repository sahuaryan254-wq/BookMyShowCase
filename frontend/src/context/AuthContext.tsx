import { createContext, useContext, useMemo, useState } from 'react';

type AuthUser = {
    id?: number;
    username?: string;
    email?: string;
    phone_number?: string | null;
    is_customer?: boolean;
    is_theatre_owner?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
};

type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    setUser: (u: AuthUser | null) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem('user');
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
        return null;
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = useMemo<AuthContextValue>(() => {
        return {
            user,
            isAuthenticated: !!localStorage.getItem('access'),
            setUser,
            logout,
        };
    }, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};
