const API = '/api';
const getAdminToken = () => localStorage.getItem('canberry_admin_token');
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAdminToken()}`,
});

export const adminLogin = async (identifier, password) => {
  const res = await fetch(`${API}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: identifier, email: identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const fetchDashboardStats = async () => {
  const res = await fetch(`${API}/admin/dashboard`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchCategories = async () => {
  const res = await fetch(`${API}/categories`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data || [];
};

export const createCategory = async (categoryData) => {
  const res = await fetch(`${API}/categories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const res = await fetch(`${API}/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${API}/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchAdminProducts = async () => {
  const res = await fetch(`${API}/products`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data || [];
};

export const createAdminProduct = async (productData) => {
  const res = await fetch(`${API}/admin/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const updateAdminProduct = async (id, productData) => {
  const res = await fetch(`${API}/admin/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const deleteAdminProduct = async (id) => {
  const res = await fetch(`${API}/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchAdminOrders = async () => {
  const res = await fetch(`${API}/admin/orders`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data || [];
};

export const updateOrderStatus = async (id, orderStatus) => {
  const res = await fetch(`${API}/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ orderStatus }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const updatePaymentStatus = async (id, paymentStatus) => {
  const res = await fetch(`${API}/admin/orders/${id}/payment`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ paymentStatus }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchAdminEnquiries = async () => {
  const res = await fetch(`${API}/enquiries`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data || [];
};

export const updateEnquiryStatus = async (id, status) => {
  const res = await fetch(`${API}/admin/enquiries/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchAdminCustomers = async () => {
  const res = await fetch(`${API}/admin/customers`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data || [];
};

export const deleteAdminCustomer = async (id) => {
  const res = await fetch(`${API}/admin/customers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
