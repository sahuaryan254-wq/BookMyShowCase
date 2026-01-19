import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resetPassword } from '../services/api';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Verify OTP, 2: Reset Password
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await verifyOtp({ email, otp });
            setStep(2);
        } catch (error) {
            alert('Invalid OTP');
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await resetPassword({ email, new_password: newPassword });
            alert('Password reset successful. Please login.');
            navigate('/login');
        } catch (error) {
            alert('Failed to reset password');
        }
    };

    if (!email) {
        return <div className="text-white text-center mt-10">Invalid access. Go back to login.</div>;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', backgroundColor: 'var(--bg-primary)' }}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>
                    {step === 1 ? 'Verify OTP' : 'Reset Password'}
                </h1>

                {step === 1 ? (
                    <form onSubmit={handleVerify}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Enter 6-Digit OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--bg-tertiary)',
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    textAlign: 'center',
                                    letterSpacing: '0.5rem',
                                    fontSize: '1.2rem'
                                }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Verify</button>
                    </form>
                ) : (
                    <form onSubmit={handleReset}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--bg-tertiary)',
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Reset Password</button>
                    </form>
                )}
            </div>
        </div>
    );
}
