import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getPromos, getPromoById, createPromo, updatePromo, deletePromo } from '../../api/promosApi';
import axiosClient from '../../api/axiosClient';

const promoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  precio: z.string().min(1, 'El precio es requerido'),
  producto_id: z.string().optional(),
  categoria_id: z.string().optional(),
}).refine(data => data.producto_id || data.categoria_id, {
  message: "Debe seleccionar un producto o una categoría",
  path: ["producto_id"],
});

const PromosPage = () => {
  const [promos, setPromos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(promoSchema)
  });

  const loadData = async () => {
    try {
      const [promosRes, prodRes, catRes] = await Promise.all([
        getPromos(),
        axiosClient.get('/productos'),
        axiosClient.get('/categorias')
      ]);
      
      // SOLUCIÓN: Agregamos "|| []" para asegurar que siempre sea un array, 
      // incluso si el backend responde con undefined o vacío.
      setPromos(promosRes || []);
      setProductos(prodRes.data || []);
      setCategorias(catRes.data || []);
    } catch (error) {
      toast.error('Error al cargar la información');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        nombre: data.nombre,
        precio: data.precio,
        producto_id: data.producto_id || null,
        categoria_id: data.categoria_id || null
      };

      if (editingId) {
        await updatePromo(editingId, payload);
        toast.success('Promo actualizada exitosamente');
      } else {
        await createPromo(payload);
        toast.success('Promo creada exitosamente');
      }
      setIsModalOpen(false);
      setEditingId(null);
      reset();
      loadData();
    } catch (error) {
      toast.error('Error al crear la promo');
      console.error(error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const promo = await getPromoById(id);
      reset({
        nombre: promo.nombre,
        precio: String(promo.precio),
        producto_id: promo.producto_id ? String(promo.producto_id) : '',
        categoria_id: promo.categoria_id ? String(promo.categoria_id) : '',
      });
      setEditingId(id);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Error al cargar la promo');
      console.error(error);
    }
  };

  const handleCreate = () => {
    reset({ nombre: '', precio: '', producto_id: '', categoria_id: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar esta promo?')) return;
    try {
      await deletePromo(id);
      toast.success('Promo eliminada');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar la promo');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-wide">Promociones</h1>
        <button 
          onClick={handleCreate}
          className="bg-resto-red hover:bg-red-700 text-white px-5 py-2.5 rounded-md font-semibold transition-colors shadow-lg"
        >
          + Nueva Promo
        </button>
      </div>

      <div className="p-4 overflow-hidden border rounded-lg bg-resto-black border-resto-gray">
        {(!promos || promos.length === 0) ? (
          <p className="text-gray-400">No hay promociones cargadas.</p>
        ) : (
          promos.map(promo => (
            <div key={promo.id} className="flex items-center justify-between py-3 border-b border-resto-gray last:border-0">
              <div>
                <p className="text-lg font-bold">{promo.nombre}</p>
                <p className="text-sm text-gray-400">
                  Aplica a: <span className="text-resto-orange">{promo.producto_nombre || promo.categoria_nombre || 'General'}</span>
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <p className="text-xl font-bold">${promo.precio}</p>
                <button onClick={() => handleEdit(promo.id)} className="font-semibold text-resto-orange hover:text-white">Editar</button>
                <button 
                  onClick={() => handleDelete(promo.id)}
                  className="font-semibold transition-colors text-resto-red hover:text-resto-orange"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md p-8 border rounded-lg shadow-2xl bg-resto-black border-resto-gray">
            <h2 className="pb-2 mb-6 text-2xl font-bold text-white border-b border-resto-gray">{editingId ? 'Editar Promoción' : 'Crear Promoción'}</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Nombre de la Promo</label>
                <input {...register('nombre')} className="w-full px-3 py-2 text-white transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange" />
                {errors.nombre && <span className="mt-1 text-sm text-resto-red">{errors.nombre.message}</span>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Precio Promocional ($)</label>
                <input type="number" {...register('precio')} className="w-full px-3 py-2 text-white transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange" />
                {errors.precio && <span className="mt-1 text-sm text-resto-red">{errors.precio.message}</span>}
              </div>

              <div className="p-3 border rounded border-resto-gray bg-resto-dark">
                <p className="mb-2 text-sm text-gray-400">Aplica a (Elegir uno):</p>
                
                <div className="mb-3">
                  <label className="block mb-1 text-xs font-medium text-gray-300">Producto específico</label>
                  <select {...register('producto_id')} className="w-full px-3 py-2 text-sm text-white transition-colors border rounded bg-resto-black border-resto-gray focus:outline-none focus:border-resto-orange">
                    <option value="">Ninguno...</option>
                    {(productos || []).map((prod) => (
                      <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-300">Toda una categoría</label>
                  <select {...register('categoria_id')} className="w-full px-3 py-2 text-sm text-white transition-colors border rounded bg-resto-black border-resto-gray focus:outline-none focus:border-resto-orange">
                    <option value="">Ninguna...</option>
                    {(categorias || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                {errors.producto_id && <span className="mt-1 text-xs text-resto-red">{errors.producto_id.message}</span>}
              </div>

              <div className="flex justify-end pt-4 mt-6 space-x-3">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); reset(); }} className="px-4 py-2 text-gray-400 transition-colors hover:text-white">Cancelar</button>
                <button type="submit" className="px-6 py-2 font-semibold text-white transition-colors rounded shadow-lg bg-resto-red hover:bg-red-700">{editingId ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromosPage;
