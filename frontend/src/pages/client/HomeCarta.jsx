import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const HomeCarta = ({ mode }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarta = async () => {
      try {
        const response = await axiosClient.get('/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar la carta:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarta();
  }, []);

  // Agrupar los productos por nombre de categoría para mostrarlos ordenados
  const productosPorCategoria = productos.reduce((acc, prod) => {
    // Si un producto no tiene categoría, lo mandamos a "Otros"
    const cat = prod.categoria_nombre || 'Otros';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(prod);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 rounded-full border-resto-red border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {mode === 'delivery' && (
        <div className="p-3 text-sm font-bold text-center rounded-md shadow-md bg-resto-orange text-resto-black">
          Modo Delivery: Pedí por WhatsApp
        </div>
      )}

      {productos.length === 0 ? (
        <p className="py-10 text-center text-gray-400">La carta se está actualizando. Volvé pronto.</p>
      ) : (
        Object.entries(productosPorCategoria).map(([categoria, items]) => (
          <div key={categoria} className="space-y-4">
            <h2 className="pb-2 text-2xl font-bold tracking-wide uppercase border-b border-resto-gray text-resto-red">
              {categoria}
            </h2>
            
            <div className="grid gap-4">
              {items.map((prod) => (
                <div key={prod.id} className="flex overflow-hidden border rounded-lg shadow-lg bg-resto-black border-resto-gray">
                  <div className="flex items-center justify-center w-1/3 bg-resto-dark">
                    {prod.foto ? (
                      <img 
                        src={prod.foto} 
                        alt={prod.nombre} 
                        className="w-full h-full object-cover min-h-[110px]" 
                      />
                    ) : (
                      <span className="text-xs text-gray-600">Sin foto</span>
                    )}
                  </div>
                  <div className="flex flex-col justify-between w-2/3 p-3">
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{prod.nombre}</h3>
                      {prod.descripcion && (
                        <p className="mt-1 text-xs text-gray-400 line-clamp-2">{prod.descripcion}</p>
                      )}
                    </div>
                    <p className="mt-2 text-lg font-black text-resto-orange">
                      ${Number(prod.precio).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HomeCarta;