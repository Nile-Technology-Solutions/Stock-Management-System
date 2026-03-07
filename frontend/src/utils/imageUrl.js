import { API_BASE_URL } from '../config/env';

/**
 * Resolves an image URL to a full absolute URL.
 * - If the URL is already absolute (http/https/data:), returns it as-is.
 * - If the URL is relative (e.g. /uploads/production/...), prepends the API base URL.
 */
export const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    return `${API_BASE_URL}${url}`;
};
