import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, Menu, Globe, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { lang, changeLanguage, t, languages } = useTranslation();
  
  // Basic check for logged in user (from localStorage for now)
  const user = JSON.parse(localStorage.getItem('user'));
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('.lang-selector-container')) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('click', closeDropdown);
    }
    return () => document.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link to="/" className="logo flex items-center" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf className="text-primary" style={{ color: 'var(--primary)' }} />
          <span className="heading-md" style={{ margin: 0, fontFamily: 'Outfit' }}>{t('common.title')}</span>
        </Link>
        
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>{t('common.home')}</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>{t('common.dashboard')}</Link>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>
                <LogOut size={16} /> {t('common.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">{t('common.login')}</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>{t('common.register')}</Link>
            </>
          )}

          {/* Language Switcher Dropdown */}
          <div className="lang-selector-container" style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="btn-outline"
              style={{ 
                padding: '0.5rem 1rem', 
                gap: '0.4rem', 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'var(--surface-border)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <Globe size={16} style={{ color: 'var(--primary)' }} />
              <span>{languages.find(l => l.code === lang)?.flag}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                {languages.find(l => l.code === lang)?.label.split(' ')[0]}
              </span>
              <ChevronDown size={14} style={{ opacity: 0.6, transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
            </button>
            
            {isDropdownOpen && (
              <div 
                className="glass"
                style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  marginTop: '0.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  overflow: 'hidden', 
                  zIndex: 100, 
                  minWidth: '160px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--surface-border)',
                  padding: '0.25rem'
                }}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7rem',
                      background: l.code === lang ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: l.code === lang ? 'var(--text-main)' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left',
                      fontWeight: l.code === lang ? '600' : '400',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => {
                      if (l.code !== lang) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseOut={(e) => {
                      if (l.code !== lang) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span>{l.flag}</span>
                    <span style={{ fontSize: '0.9rem' }}>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
