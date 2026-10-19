import axiosClient from './axiosClient';

const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

export const getProductos = async (params = {}) => (await axiosClient.get('/productos', { params })).data;
export const getProductoById = async (id) => (await axiosClient.get(`/productos/${id}`)).data;
export const createProducto = async (data) => (await axiosClient.post('/productos', data, multipartConfig)).data;
export const updateProducto = async (id, data) => (await axiosClient.put(`/productos/${id}`, data, multipartConfig)).data;
export const deleteProducto = async (id) => axiosClient.delete(`/productos/${id}`);
