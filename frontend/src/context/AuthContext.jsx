import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const s = localStorage.getItem('canberry_admin');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [customer, setCustomer] = useState(() => {
    try {
      const s = localStorage.getItem('canberry_customer');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('canberry_admin_token') || null);
  const [customerToken, setCustomerToken] = useState(() => localStorage.getItem('canberry_customer_token') || null);

  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    setAdminToken(token);
    localStorage.setItem('canberry_admin', JSON.stringify(adminData));
    localStorage.setItem('canberry_admin_token', token);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem('canberry_admin');
    localStorage.removeItem('canberry_admin_token');
  };

  const loginCustomer = (customerData, token) => {
    setCustomer(customerData);
    setCustomerToken(token);
    localStorage.setItem('canberry_customer', JSON.stringify(customerData));
    localStorage.setItem('canberry_customer_token', token);
  };

  const logoutCustomer = () => {
    setCustomer(null);
    setCustomerToken(null);
    localStorage.removeItem('canberry_customer');
    localStorage.removeItem('canberry_customer_token');
  };

  return (
    <AuthContext.Provider value={{
      admin, adminToken, loginAdmin, logoutAdmin,
      customer, customerToken, loginCustomer, logoutCustomer,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
