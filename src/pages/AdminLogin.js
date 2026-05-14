import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function AdminLogin({ onLogin, onToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ username: false, password: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const usernameError = username.trim().length === 0;
  const passwordError = password.trim().length === 0;

  async function submit(e) {
    e.preventDefault();
    setTouched({ username: true, password: true });

    if (usernameError || passwordError) return;

    setLoading(true);

    try {
      // Admin uses Firebase Auth; username input is treated as email.
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const token = await userCredential.user.getIdToken();

      onLogin?.({ token, username });
      onToast?.({ type: 'success', message: 'Logged in successfully' });
    } catch (err) {
      console.error(err);
      onToast?.({ type: 'error', message: 'Admin login failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="headerRow">
          <div>
            <h1 className="pageTitle">Admin Panel</h1>
            <p className="pageSubtitle">Login to manage submissions.</p>
          </div>
          <div className="badge badgeAdmin">Admin</div>
        </div>

        <form className="formCard" onSubmit={submit}>
          <div className="grid2">
            <label className="field">
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                placeholder="admin@example.com"
              />
              {touched.username && usernameError ? (
                <div className="errorText">Username is required.</div>
              ) : null}
            </label>

            <label className="field">
              <span className="label">Password</span>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="input password"
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
              {touched.password && passwordError ? (
                <div className="errorText">Password is required.</div>
              ) : null}
            </label>
          </div>

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
                'Log in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


