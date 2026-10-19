import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import axiosClient from '../../api/axiosClient';

const flyerSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
});

const FlyersPage = () => {
  const [flyers, setFlyers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(flyerSchema)
  });

  const fetchFlyers = async () => {
    try {
      const response = await axiosClient.get('/flyers');
      setFlyers(response.data);
    } catch {
      toast.error('Error al cargar los flyers');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFlyers();
    };
    loadData();
  }, []);

  const onSubmit = async (data, e) => {
    try {
      const fileInput = e.target.foto.files[0];
      if (!fileInput) {
        toast.error('La foto del flyer es obligatoria');
        return;
      }

      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('foto', fileInput);

      await axiosClient.post('/flyers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Flyer subido exitosamente');
      setIsModalOpen(false);
      reset();
      fetchFlyers();
    } catch {
      toast.error('Error al subir el flyer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este flyer?')) return;
    try {
      await axiosClient.delete(`/flyers/${id}`);
      toast.success('Flyer eliminado');
      fetchFlyers();
    } catch {
      toast.error('Error al eliminar el flyer');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-wide">Flyers (Promos)</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-resto-red hover:bg-red-700 text-white px-5 py-2.5 rounded-md font-semibold transition-colors shadow-lg"
        >
          + Subir Flyer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {flyers.length === 0 ? (
          <p className="col-span-3 text-gray-400">No hay flyers subidos.</p>
        ) : (
          flyers.map((flyer) => (
            <div key={flyer.id} className="flex flex-col overflow-hidden border rounded-lg shadow-lg bg-resto-black border-resto-gray">
              <img src={flyer.foto} alt={flyer.nombre} className="object-cover w-full h-48" />
              <div className="flex items-center justify-between p-4 bg-resto-dark">
                <p className="text-lg font-bold">{flyer.nombre}</p>
                <button 
                  onClick={() => handleDelete(flyer.id)}
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
            <h2 className="pb-2 mb-6 text-2xl font-bold text-white border-b border-resto-gray">Subir Flyer</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Nombre de la Promo</label>
                <input {...register('nombre')} className="w-full px-3 py-2 text-white transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange" />
                {errors.nombre && <span className="mt-1 text-sm text-resto-red">{errors.nombre.message}</span>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Imagen del Flyer</label>
                <input type="file" name="foto" accept="image/*" className="w-full px-3 py-2 text-white transition-colors border rounded bg-resto-dark border-resto-gray focus:outline-none focus:border-resto-orange file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-resto-red file:text-white hover:file:bg-red-700" />
              </div>

              <div className="flex justify-end pt-4 mt-8 space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 transition-colors hover:text-white">Cancelar</button>
                <button type="submit" className="px-6 py-2 font-semibold text-white transition-colors rounded shadow-lg bg-resto-red hover:bg-red-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlyersPage;