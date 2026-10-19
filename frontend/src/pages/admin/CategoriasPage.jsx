import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria } from '../../api/categoriasApi';

// Esquema de validación para categorías
const categoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  tipo: z.string().min(1, 'Seleccione un tipo'),
});

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(categoriaSchema)
  });

  // Obtener categorías del backend
  const fetchCategorias = async () => {
    try {
      setCategorias(await getCategorias());
    } catch (error) {
      toast.error('Error al cargar las categorías');
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCategorias();
    };
    loadData();
  }, []);

  // Crear nueva categoría
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateCategoria(editingId, data);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await createCategoria(data);
        toast.success('Categoría creada exitosamente');
      }
      setIsModalOpen(false);
      setEditingId(null);
      reset();
      fetchCategorias(); // Recargar la lista
    } catch (error) {
      toast.error('Error al crear la categoría');
      console.error(error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const categoria = await getCategoriaById(id);
      reset({ nombre: categoria.nombre, tipo: categoria.tipo });
      setEditingId(id);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Error al cargar la categoría');
      console.error(error);
    }
  };

  const handleCreate = () => {
    reset({ nombre: '', tipo: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar esta categoría?')) return;
    
    try {
      await deleteCategoria(id);
      toast.success('Categoría eliminada');
      fetchCategorias();
    } catch (error) {
      toast.error('Error al eliminar la categoría');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-wide">Categorías</h1>
        <button 
          onClick={handleCreate}
          className="px-5 py-2.5 font-semibold text-white transition-colors rounded-md shadow-lg bg-resto-red hover:bg-red-700"
        >
          + Nueva Categoría
        </button>
      </div>

      <div className="p-4 overflow-hidden border rounded-lg bg-resto-black border-resto-gray">
        {categorias.length === 0 ? (
          <p className="text-gray-400">No hay categorías cargadas.</p>
        ) : (
          categorias.map(cat => (
            <div key={cat.id} className="flex items-center justify-between py-3 border-b border-resto-gray last:border-0">
              <div>
                <p className="text-lg font-bold">{cat.nombre}</p>
                <p className="text-sm text-gray-400 capitalize">Tipo: {cat.tipo}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(cat.id)} className="font-semibold text-resto-orange hover:text-white">Editar</button>
                <button onClick={() => handleDelete(cat.id)} className="font-semibold transition-colors text-resto-red hover:text-resto-orange">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear Categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md p-8 border rounded-lg shadow-2xl bg-resto-black border-resto-gray">
            <h2 className="pb-2 mb-6 text-2xl font-bold text-white border-b border-resto-gray">{editingId ? 'Editar Categoría' : 'Crear Categoría'}</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Nombre (Ej: Pizzas, Lomos)</label>
                <input 
                  {...register('nombre')}
                  className="w-full px-3 py-2 text-white transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange"
                />
                {errors.nombre && <span className="mt-1 text-sm text-resto-red">{errors.nombre.message}</span>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Tipo</label>
                <select 
                  {...register('tipo')}
                  className="w-full px-3 py-2 text-white transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange"
                >
                  <option value="">Seleccione...</option>
                  <option value="comida">Comida</option>
                  <option value="bebida">Bebida</option>
                  <option value="promo">Promo</option>
                </select>
                {errors.tipo && <span className="mt-1 text-sm text-resto-red">{errors.tipo.message}</span>}
              </div>

              <div className="flex justify-end pt-4 mt-8 space-x-3">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); setEditingId(null); reset(); }}
                  className="px-4 py-2 text-gray-400 transition-colors hover:text-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 font-semibold text-white transition-colors rounded shadow-lg bg-resto-red hover:bg-red-700"
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriasPage;
