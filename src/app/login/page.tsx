import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)',
        padding: '24px 16px'
      }}
    >
      <Suspense fallback={
        <div style={{ textAlign: 'center', color: '#475569' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #bfdbfe', borderTopColor: '#2563eb', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: 16 }}>Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
