import { APP_NAME, APP_VERSION } from '@/lib/constants'

export function Footer() {
  const neonGreen = "#00FF66";
  
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/roca';

  const menuItems = [
    { label: 'Lavoura', path: '/roca', icon: '🌱' },
    { label: 'Armazém', path: '/galpao', icon: '🏭' },
    { label: 'Financeiro', path: '/financas', icon: '💰' },
    { label: 'Dashboard', path: '/', icon: '📊' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#040C08] border-t border-white/10 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
    
      <div className="max-w-md mx-auto flex justify-around items-center pt-2 pb-1 px-4">
        {menuItems.map((item) => {
    
          const isActive = currentPath === item.path || (item.path === '/' && currentPath === '');

          return (
            <a
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 py-1 no-underline transition-transform active:scale-95"
            >
              <span 
                className="text-xl mb-0.5 transition-all"
                style={{ 
                  filter: isActive ? `drop-shadow(0 0 5px ${neonGreen})` : 'none',
                  opacity: isActive ? 1 : 0.6
                }}
              >
                {item.icon}
              </span>
              <span 
                className="text-[10px] font-medium tracking-wide transition-colors"
                style={{ color: isActive ? neonGreen : '#9CA3AF' }}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>

    
      <div className="text-[8px] text-gray-600 text-center pb-1 tracking-wider opacity-40">
        {APP_NAME} v{APP_VERSION}
      </div>
    </footer>
  )
}
