import React, { useState } from 'react';
import { supabase } from '../supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  React.useEffect(() => {
    const checkInitialCooldown = () => {
      const rateLimitStr = localStorage.getItem('login_rate_limit');
      if (rateLimitStr) {
        const { attempts, timestamp } = JSON.parse(rateLimitStr);
        const now = Date.now();
        if (attempts >= 5 && now - timestamp < 60000) {
          setCooldown(Math.ceil((60000 - (now - timestamp)) / 1000));
        }
      }
    };
    checkInitialCooldown();

    let interval: any;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const checkAndIncrementRateLimit = () => {
    const rateLimitStr = localStorage.getItem('login_rate_limit');
    let attempts = 1;
    let timestamp = Date.now();
    
    if (rateLimitStr) {
      const data = JSON.parse(rateLimitStr);
      if (Date.now() - data.timestamp < 60000) {
        attempts = data.attempts + 1;
        timestamp = data.timestamp;
      }
    }
    
    localStorage.setItem('login_rate_limit', JSON.stringify({ attempts, timestamp }));
    
    if (attempts >= 5) {
      setCooldown(Math.ceil((60000 - (Date.now() - timestamp)) / 1000));
      return false; // Bloqueado
    }
    return true; // Permitido
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    
    if (!checkAndIncrementRateLimit()) {
      setError('Muitas tentativas. Tente novamente em alguns segundos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta ou tente fazer login.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (cooldown > 0) return;
    
    if (!checkAndIncrementRateLimit()) {
      setError('Muitas tentativas. Tente novamente em alguns segundos.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação com Google');
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-color)' }}>Marvel United</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{isSignUp ? 'Criar uma nova conta' : 'Entrar na sua campanha'}</p>
        </div>
        
        {error && (
          <div style={{ padding: '12px', background: 'rgba(255, 60, 110, 0.2)', color: 'var(--danger-color)', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>E-mail</label>
            <input 
              type="email" 
              className="add-hero-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Senha</label>
            <input 
              type="password" 
              className="add-hero-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className={`tool-btn ${cooldown > 0 ? '' : 'active'}`} 
            style={{ 
              justifyContent: 'center', 
              marginTop: '8px', 
              fontSize: '1rem', 
              padding: '12px',
              opacity: (loading || cooldown > 0) ? 0.5 : 1,
              cursor: (loading || cooldown > 0) ? 'not-allowed' : 'pointer'
            }}
            disabled={loading || cooldown > 0}
          >
            {cooldown > 0 
              ? `Aguarde ${cooldown}s` 
              : loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar com E-mail')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ou</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        </div>

        <button 
          type="button" 
          className="tool-btn" 
          style={{ 
            justifyContent: 'center', 
            fontSize: '1rem', 
            padding: '12px', 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--glass-border)', 
            color: 'var(--text-primary)',
            opacity: (loading || cooldown > 0) ? 0.5 : 1,
            cursor: (loading || cooldown > 0) ? 'not-allowed' : 'pointer'
          }}
          onClick={handleGoogleLogin}
          disabled={loading || cooldown > 0}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (loading || cooldown > 0) ? 0.5 : 1 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {cooldown > 0 ? `Aguarde ${cooldown}s` : 'Continuar com Google'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
          </span>
          {' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {isSignUp ? 'Fazer login' : 'Criar uma'}
          </button>
        </div>
      </div>
    </div>
  );
};
