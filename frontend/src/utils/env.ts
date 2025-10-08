/**
 * Environment configuration utilities
 */

// Get the API base URL from environment variables
export const getApiBaseUrl = (): string => {
  // In production, we expect the API to be on the same domain
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // In development, use the environment variable or default to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
};

// Get the base URL (without /api) for image URLs
export const getBaseUrl = (): string => {
  // In production, we expect the API to be on the same domain
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, use the environment variable or default to localhost
  const apiUrl = getApiBaseUrl();
  return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
};

// Get the image URL for a given path
export const getImageUrl = (path?: string): string => {
  if (!path) return '';
  
  // If the path already includes a full URL, return it as is
  if (path.startsWith('http')) return path;
  
  // Otherwise, prepend the base URL
  return `${getBaseUrl()}${path}`;
};

// Get the CORS configuration for API requests
export const getCorsConfig = () => {
  if (import.meta.env.PROD) {
    // In production, we expect the API to be on the same domain
    return {
      credentials: 'include' as const,
      mode: 'cors' as const,
    };
  }
  
  // In development, we might need to handle CORS differently
  return {
    credentials: 'include' as const,
    mode: 'cors' as const,
  };
};