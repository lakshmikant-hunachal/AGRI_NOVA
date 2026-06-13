import { useTranslation } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={{ 
      borderTop: '1px solid var(--surface-border)', 
      padding: '2rem 0',
      textAlign: 'center',
      marginTop: 'auto',
      background: 'rgba(15, 23, 42, 0.8)'
    }}>
      <div className="container">
        <p style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Smart Crop Doctor | {t('common.developed')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
