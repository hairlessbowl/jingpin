export const request = {
  get: async <T>(url: string, options?: { params?: Record<string, unknown> }): Promise<T> => {
    const searchParams = new URLSearchParams();
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    if (response.status === 204) return undefined as T;
    return response.json();
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    if (response.status === 204) return undefined as T;
    return response.json();
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    if (response.status === 204) return undefined as T;
    return response.json();
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    if (response.status === 204) return undefined as T;
    return response.json();
  },
};
