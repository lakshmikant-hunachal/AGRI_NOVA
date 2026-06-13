import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Settings, Database } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, scans: 0 });
  const { t } = useTranslation();
  
  useEffect(() => {
    // Basic auth check
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.email !== 'admin@smartcrop.com') { // simple fake admin check
      // navigate('/login'); // Allow for now just to show the UI
    }
    
    // Fake stats load
    setStats({ users: 142, scans: 893 });
  }, [navigate]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>{t('admin.title')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('admin.subtitle')}</p>
      </div>

      <div className="grid">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <Users size={32} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('admin.cardUsers')}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.users}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <Activity size={32} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('admin.cardScans')}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.scans}</h3>
          </div>
        </div>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <Database size={32} style={{ color: 'var(--warning)' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('admin.cardStorage')}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>42%</h3>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }} className="glass-card">
        <h3 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={20} /> {t('admin.settingsTitle')}
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>{t('admin.settingsDesc')}</p>
      </div>
    </div>
  );
};

export default Admin;
