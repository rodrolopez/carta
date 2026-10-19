import { useCallback, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getCategorias } from '../../api/categoriasApi';
import { createProducto, deleteProducto, getProductoById, getProductos, updateProducto } from '../../api/productosApi';

const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  precio: z.string().min(1, 'El precio es requerido'),
  categoria_id: z.string().min(1, 'Seleccione una categoría'),
});

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(productoSchema),
    defaultValues: { nombre: '', descripcion: '', precio: '', categoria_id: '' },
  });

  const loadProductos = useCallback(async () => {
    try {
      const params = categoriaFilter ? { categoria_id: categoriaFilter } : {};
      setProductos((await getProductos(params)) || []);
    } catch (error) {
      toast.error('Error al cargar los productos');
      console.error(error);
    }
  }, [categoriaFilter]);

  const loadCategorias = useCallback(async () => {
    try {
      setCategorias((await getCategorias()) || []);
    } catch (error) {
      toast.error('Error al cargar las categorías');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, [loadCategorias, loadProductos]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setCurrentPhoto(null);
    reset({ nombre: '', descripcion: '', precio: '', categoria_id: '' });
  };

  const openCreateModal = () => {
    reset({ nombre: '', descripcion: '', precio: '', categoria_id: '' });
    setEditingId(null);
    setCurrentPhoto(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (id) => {
    try {
      const producto = await getProductoById(id);
      reset({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: String(producto.precio ?? ''),
        categoria_id: String(producto.categoria_id ?? ''),
      });
      setEditingId(id);
      setCurrentPhoto(producto.foto || null);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Error al cargar el producto');
      console.error(error);
    }
  };

  const onSubmit = async (data, event) => {
    try {
      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('descripcion', data.descripcion || '');
      formData.append('precio', data.precio);
      formData.append('categoria_id', data.categoria_id);
      const file = event?.target?.elements?.foto?.files?.[0];
      if (file) formData.append('foto', file);

      if (editingId) {
        await updateProducto(editingId, formData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await createProducto(formData);
        toast.success('Producto creado exitosamente');
      }
      closeModal();
      await loadProductos();
    } catch (error) {
      toast.error(editingId ? 'Error al actualizar el producto' : 'Error al crear el producto');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return;
    try {
      await deleteProducto(id);
      toast.success('Producto eliminado');
      await loadProductos();
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error(error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'foto', headerName: 'Foto', width: 80,
      renderCell: (params) => params.row.foto
        ? <img src={params.row.foto} alt={params.row.nombre} className="object-cover w-10 h-10 mt-1 rounded-md" />
        : <span className="mt-3 text-xs text-resto-orange">S/F</span>,
    },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'categoria_nombre', headerName: 'Categoría', width: 150 },
    {
      field: 'precio', headerName: 'Precio', width: 120,
      renderCell: (params) => `$ ${params.row.precio}`,
    },
    {
      field: 'acciones', headerName: 'Acciones', width: 180, sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-4">
        <button onClick={() => handleEdit(params.row.id)} className="font-semibold text-resto-orange hover:text-resto-red">Editar</button>
          <button onClick={() => handleDelete(params.row.id)} className="font-semibold text-resto-red hover:text-resto-orange">Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full text-resto-orange">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-wide text-resto-orange">Productos</h1>
        <div className="flex items-center gap-3">
          <select
            value={categoriaFilter}
            onChange={(event) => setCategoriaFilter(event.target.value)}
            aria-label="Filtrar por categoría"
            className="px-3 py-2.5 text-resto-orange border rounded-md bg-resto-black border-resto-gray focus:outline-none focus:border-resto-orange"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}
          </select>
          <button onClick={openCreateModal} className="px-5 py-2.5 font-semibold text-resto-dark transition-colors rounded-md shadow-lg bg-resto-red hover:bg-resto-orange">
          + Nuevo Producto
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden border rounded-lg bg-resto-black border-resto-gray">
        <DataGrid
          rows={productos}
          columns={columns}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            color: '#f97316',
            '& .MuiDataGrid-cell': { borderColor: '#2d2d2d' },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#000000', borderBottom: '1px solid #2d2d2d' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #2d2d2d' },
          }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-resto-dark/90 p-4">
          <div className="w-full max-w-md p-8 border rounded-lg shadow-2xl bg-resto-black border-resto-gray">
            <h2 className="pb-2 mb-6 text-2xl font-bold text-resto-orange border-b border-resto-gray">
              {editingId ? 'Editar Producto' : 'Crear Producto'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-resto-orange">Nombre</label>
                <input {...register('nombre')} className="w-full px-3 py-2 text-resto-orange transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange" />
                {errors.nombre && <span className="mt-1 text-sm text-resto-red">{errors.nombre.message}</span>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-resto-orange">Descripción</label>
                <textarea {...register('descripcion')} rows="3" className="w-full px-3 py-2 text-resto-orange transition-colors border rounded resize-y bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange" />
                {errors.descripcion && <span className="mt-1 text-sm text-resto-red">{errors.descripcion.message}</span>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-resto-orange">Precio ($)</label>
                <input type="number" min="0" step="0.01" {...register('precio')} className="w-full px-3 py-2 text-resto-orange transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange" />
                {errors.precio && <span className="mt-1 text-sm text-resto-red">{errors.precio.message}</span>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-resto-orange">Categoría</label>
                <select {...register('categoria_id')} className="w-full px-3 py-2 text-resto-orange transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange">
                  <option value="">Seleccione...</option>
                  {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}
                </select>
                {errors.categoria_id && <span className="mt-1 text-sm text-resto-red">{errors.categoria_id.message}</span>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-resto-orange">Foto del producto</label>
                {currentPhoto && <img src={currentPhoto} alt="Foto actual del producto" className="object-cover w-20 h-20 mb-2 rounded-md" />}
                <input type="file" name="foto" accept="image/*" className="w-full px-3 py-2 text-resto-orange border rounded bg-resto-dark border-resto-gray file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:font-semibold file:bg-resto-red file:text-resto-dark hover:file:bg-resto-orange" />
                {editingId && <p className="mt-1 text-sm text-resto-orange">Dejá el campo vacío para conservar la foto actual.</p>}
              </div>
              <div className="flex justify-end pt-4 mt-8 space-x-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 font-medium text-resto-orange transition-colors hover:text-resto-red">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 font-semibold text-resto-dark transition-colors rounded shadow-lg bg-resto-red hover:bg-resto-orange disabled:opacity-60">
                  {isSubmitting ? 'Guardando…' : editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosPage;
