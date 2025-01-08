import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api'
});

// 基础接口
export const getCategories = () => api.get('/categories');

export const getResources = async () => {
  try {
    const response = await api.get('/resources');
    const resources = response.data.resources || response.data;
    return {
      data: Array.isArray(resources) ? resources : []
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getResourceById = (id) => api.get(`/resources/${id}`);

export const searchResources = async (keyword) => {
  try {
    const response = await api.get(`/resources/search?q=${encodeURIComponent(keyword)}`);
    const resources = response.data.resources || response.data;
    return {
      data: Array.isArray(resources) ? resources : []
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// 资源管理接口
export const createResource = (data) => api.post('/resources', data);

export const updateResource = async (id, data) => {
  try {
    const response = await api.put(`/resources/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw error;
  }
};

export const deleteResource = (id) => api.delete(`/resources/${id}`);

// 分类管理接口
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);