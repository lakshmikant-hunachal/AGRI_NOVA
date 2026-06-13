import { Link } from 'react-router-dom';
import { Camera, CloudRain, TrendingUp, Droplets, ArrowRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="section" style={{ 
        position: 'relative', 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center',
        paddingTop: '8rem'
      }}>
        {/* Background elements for modern look */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%', zIndex: -1 }}></div>
        
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 className="heading-xl animate-fade-in">
              {t('home.hero.title')}<span className="text-gradient">{t('home.hero.titleHighlight')}</span>
            </h1>
            <p className="animate-fade-in delay-1" style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              {t('home.hero.subtitle')}
            </p>
            <div className="animate-fade-in delay-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/dashboard" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                <Camera size={20} />
                {t('home.hero.btnTry')}
              </Link>
              <Link to="/register" className="btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                {t('home.hero.btnCreate')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="heading-lg">{t('home.features.title')}</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
                <Camera size={32} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="heading-md">{t('home.features.detectionTitle')}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t('home.features.detectionDesc')}</p>
              <Link to="/dashboard" style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                {t('home.features.learnMore')} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
                <CloudRain size={32} style={{ color: 'var(--secondary)' }} />
              </div>
              <h3 className="heading-md">{t('home.features.weatherTitle')}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t('home.features.weatherDesc')}</p>
              <Link to="/dashboard" style={{ color: 'var(--secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                {t('home.features.learnMore')} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.features.yieldNew')}</div>
              <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
                <TrendingUp size={32} style={{ color: 'var(--warning)' }} />
              </div>
              <h3 className="heading-md">{t('home.features.yieldTitle')}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t('home.features.yieldDesc')}</p>
              <Link to="/dashboard" style={{ color: 'var(--warning)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                {t('home.features.learnMore')} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
                <Droplets size={32} style={{ color: 'var(--danger)' }} />
              </div>
              <h3 className="heading-md">{t('home.features.treatmentTitle')}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t('home.features.treatmentDesc')}</p>
              <Link to="/dashboard" style={{ color: 'var(--danger)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                {t('home.features.learnMore')} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Banner */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', opacity: 0.1, zIndex: -1 }}></div>
        <div className="container">
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(59,130,246,0.2) 100%)', border: '1px solid rgba(255,255,255,0.2)', padding: '4rem 2rem', textAlign: 'center' }}>
            <h2 className="heading-lg">{t('home.ready.title')}</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '2rem', opacity: 0.9 }}>{t('home.ready.subtitle')}</p>
            <Link to="/register" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              {t('home.ready.btn')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
