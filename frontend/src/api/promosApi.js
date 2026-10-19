import axiosClient from './axiosClient';

export const getPromos = async () => (await axiosClient.get('/promos')).data;
export const getPromoById = async (id) => (await axiosClient.get(`/promos/${id}`)).data;
export const createPromo = async (data) => (await axiosClient.post('/promos', data)).data;
export const updatePromo = async (id, data) => (await axiosClient.put(`/promos/${id}`, data)).data;
export const deletePromo = async (id) => axiosClient.delete(`/promos/${id}`);
