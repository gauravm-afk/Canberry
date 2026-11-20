const API_BASE = '/api';

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn('[API] Could not fetch categories from backend:', error.message);
    return [];
  }
};

export const fetchProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn('[API] Could not fetch from backend, using local fallback:', error.message);
    // Return empty array to trigger local fallback in components if needed
    return null;
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.warn('[API] Could not fetch single product from backend:', error.message);
    return null;
  }
};

export const submitEnquiry = async (enquiryData) => {
  try {
    const token = localStorage.getItem('canberry_customer_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers,
      body: JSON.stringify(enquiryData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit enquiry');
    }
    return data;
  } catch (error) {
    console.warn('[API] Backend enquiry submission error:', error.message);
    throw error;
  }
};
