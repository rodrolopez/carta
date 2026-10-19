import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import MenuLayout from './pages/client/MenuLayout';
import HomeCarta from './pages/client/HomeCarta';

import DashboardLayout from './pages/admin/DashboardLayout';
import ProductosPage from './pages/admin/ProductosPage';
import CategoriasPage from './pages/admin/CategoriasPage';
import FlyersPage from './pages/admin/FlyersPage';
import PromosPage from './pages/admin/PromosPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<MenuLayout />}>
          <Route index element={<HomeCarta mode="delivery" />} />
          <Route path="qr" element={<HomeCarta mode="qr" />} />
        </Route>

        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="productos" replace />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="flyers" element={<FlyersPage />} />
          <Route path="promos" element={<PromosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
