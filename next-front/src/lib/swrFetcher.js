import api from './axios';

export const swrFetcher = (url) => api.get(url).then(res => res.data);