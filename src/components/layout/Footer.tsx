import { APP_NAME, APP_VERSION } from '@/lib/constants'

export function Footer() {
  const neonGreen = "#00FF66";
  
  // Identifica a página atual
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/roca';

  const menuItems = [
    { label: 'Lavoura', path: '/roca', icon: '🌱' },
    { label: 'Armazém', path: '/galpao', icon: '🏭' },
    { label: 'Financeiro', path: '/financas', icon: '💰' },
    { label: 'Dashboard', path: '/', icon: '📊' },
  ];

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#040C08',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 9999,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.6)',
      fontFamily: 'sans-serif'
    }}>
      {/* Container dos Botões */}
      <div style={{
        maxWidth: '440px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 16px 4px 16px'
      }}>
        {menuItems.map((item) => {
          const isActive = currentPath === item.path || (item.path === '/' && currentPath === '');

          return (
            <a
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '4px 0',
                textDecoration: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span style={{ 
                fontSize: '20px', 
                marginBottom: '2px',
                filter: isActive ? `drop-shadow(0 0 5px ${neonGreen})` : 'none',
                opacity: isActive ? 1 : 0.5
              }}>
                {item.icon}
              </span>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: isActive ? neonGreen : '#9CA3AF'
              }}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>

      {/* Versão do App */}
      <div style={{
        fontSize: '8px',
        color: '#4B5563',
        textAlign: 'center',
        paddingBottom: '4px',
        letterSpacing: '0.1em',
        opacity: 0.5
      }}>
        {APP_NAME} v{APP_VERSION}
      </div>
    </footer>
  )
}
