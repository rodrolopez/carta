import axiosClient from './axiosClient';

export const getCategorias = async () => (await axiosClient.get('/categorias')).data;
export const getCategoriaById = async (id) => (await axiosClient.get(`/categorias/${id}`)).data;
export const createCategoria = async (data) => (await axiosClient.post('/categorias', data)).data;
export const updateCategoria = async (id, data) => (await axiosClient.put(`/categorias/${id}`, data)).data;
export const deleteCategoria = async (id) => axiosClient.delete(`/categorias/${id}`);
