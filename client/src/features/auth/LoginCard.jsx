import React, { useState } from 'react';

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page-container">
      <main className="auth-card-panel">
        {/* Left Side: Promotional Panel */}
        <section className="auth-promo-side">
        {/* <img alt="Cartigo Presentation" src="" /> */}
          <div className="auth-promo-overlay">
            <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', maxWidth: '380px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>The Future of Tech is Here.</h2>
              <p style={{ fontSize: '16px', color: 'var(--on-surface-variant)' }}>Join the Cartigo community and have experience like never before.</p>
            </div>
          </div>
        </section>

        {/* Right Side: Authentication Form */}
        <section className="auth-form-side">
          <div className="auth-form-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '36px' }}>ac_unit</span>
              <span className="nav-brand" style={{ fontSize: '32px' }}>Cartigo</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '600' }}>Welcome back</h1>
              <p style={{ fontSize: '16px', color: 'var(--on-surface-variant)' }}>Please enter your details to sign in.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-field-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined field-icon">mail</span>
                  <input type="email" id="email" placeholder="Enter your email" />
                </div>
              </div>

              <div className="input-field-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined field-icon">lock</span>
                  <input type={showPassword ? 'text' : 'password'} id="password" placeholder="••••••••" />
                  <button 
                    type="button" 
                    className="password-toggle-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="form-flex-row">
                <label className="checkbox-label">
                  <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</a>
              </div>

              <button type="submit" className="primary-action-btn btn-active-scale">Log In</button>

              <div className="divider-container">
                <div className="divider-line"></div>
                <span className="divider-text">Or sign in with</span>
                <div className="divider-line"></div>
              </div>

              <button type="button" className="social-login-btn btn-active-scale">
                <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Continue with Google
              </button>
            </form>

            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--on-surface-variant)' }}>
              Don't have an account? <a href="#signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Sign up</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}