import { API_BASE_URL } from '../config/env';

/**
 * Ensures an image URL is absolute by prepending the API base URL if it's a relative path.
 * This is crucial for environments like Vercel where the frontend and backend are hosted separately.
 * 
 * @param {string} url - The original image URL (e.g. '/uploads/news/img.jpg')
 * @returns {string} The absolute image URL
 */
export const getImageUrl = (url) => {
    if (!url) return '';

    // If it's already an absolute URL (http://, https://, data:, blob:), return as is
    if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    // Ensure the relative URL starts with a slash
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;

    // Remove trailing slash from base URL if present
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

    return `${baseUrl}${cleanUrl}`;
};
