const API = '/api';
const getCustomerToken = () => localStorage.getItem('canberry_customer_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getCustomerToken()}` });

export const registerCustomer = async (data) => {
  const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Registration failed');
  return json;
};
export const loginCustomer = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email, password}) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Login failed');
  return json;
};
export const getMyProfile = async () => {
  const res = await fetch(`${API}/auth/profile`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
};
export const updateMyProfile = async (data) => {
  const res = await fetch(`${API}/auth/profile`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
};
export const updateMyPassword = async (currentPassword, newPassword) => {
  const res = await fetch(`${API}/auth/password`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({currentPassword, newPassword}) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
};
export const getMyOrders = async () => {
  const res = await fetch(`${API}/orders/my`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data || [];
};
export const getOrderById = async (id) => {
  const res = await fetch(`${API}/orders/${id}`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
};
export const createOrder = async (orderData) => {
  const res = await fetch(`${API}/orders`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(orderData) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
};
