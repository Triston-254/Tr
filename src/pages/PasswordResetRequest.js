import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function PasswordResetRequest({ onToast }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      onToast?.({ type: 'success', message: 'Password reset email sent!' });
    } catch (err) {
      console.error(err);
      onToast?.({ type: 'error', message: 'Failed to send reset email' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="headerRow">
          <div>
            <h1 className="pageTitle">Reset Password</h1>
            <p className="pageSubtitle">Enter your email and send to receive a reset link.</p>
          </div>
          <div className="badge badgeAdmin">Admin</div>
        </div>

        {sent ? (
          <div className="successCard" role="status">
            <div className="successTitle">Email Sent!</div>
            <div className="successText">
              Check your email for the password reset link.
            </div>
          </div>
        ) : (
          <form className="authCard" onSubmit={handleSubmit}>
            <label className="field">
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
              />
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
                  'Send'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}