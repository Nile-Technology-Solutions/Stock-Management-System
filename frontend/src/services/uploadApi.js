import { api } from './api';

export const uploadApi = {
    uploadImages: async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        return api.postMultipart('/api/upload', formData);
    }
};
