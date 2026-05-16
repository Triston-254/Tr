import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase';

export default function SetNewPassword({ onToast }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      onToast?.({ type: 'error', message: 'Invalid reset link' });
      navigate('/admin');
    }
  }, [oobCode, navigate, onToast]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) {
      onToast?.({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      onToast?.({ type: 'success', message: 'Password reset successful!' });
      navigate('/admin');
    } catch (err) {
      console.error(err);
      onToast?.({ type: 'error', message: 'Failed to reset password. Link may be expired.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="headerRow">
          <div>
            <h1 className="pageTitle">Set New Password</h1>
            <p className="pageSubtitle">Enter your new password below.</p>
          </div>
          <div className="badge badgeAdmin">Admin</div>
        </div>

        <form className="authCard" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">New Password</span>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                minLength={6}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          <div className="formActions">
            <button 
              className="btn btnPrimary" 
              type="submit" 
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                  <path 
                    d="M12 2C6.48 2 2 6.48 2 12" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}