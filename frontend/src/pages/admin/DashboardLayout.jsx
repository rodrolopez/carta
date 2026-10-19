import { Outlet, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Centralizamos el tema oscuro para todas las tablas del dashboard
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0d0d0d', paper: '#000000' },
    primary: { main: '#db2721' },
    divider: '#2d2d2d',
  },
});

const DashboardLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Productos', path: '/admin/productos' },
    { name: 'Categorías', path: '/admin/categorias' },
    { name: 'Flyers', path: '/admin/flyers' },
    { name: 'Promos', path: '/admin/promos' },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="flex h-screen font-sans text-white bg-resto-dark">
        {/* Sidebar Fijo */}
        <aside className="flex flex-col w-64 border-r bg-resto-black border-resto-gray">
          <div className="flex justify-center p-6 border-b border-resto-gray">
            <img src="/logo.png" alt="AQUI Lomos & Pizzas" className="object-contain h-16" />
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 rounded-md transition-colors font-medium tracking-wide ${
                    isActive 
                      ? 'bg-resto-red text-white shadow-md' 
                      : 'text-gray-400 hover:bg-resto-gray hover:text-resto-orange'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-resto-gray">
            <button className="w-full px-4 py-2 text-left text-gray-400 transition-colors hover:text-white">
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content (Aquí se inyectan dinámicamente las Páginas) */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default DashboardLayout;