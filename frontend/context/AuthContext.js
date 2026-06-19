'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const syncUserProfileState = async () => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user); 
      } else {
        logout();
      }
    } catch (err) {
      console.error("Auth hydration loop fault:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncUserProfileState();
  }, []);

  const login = async (email, password) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);


    localStorage.setItem('token', data.token);
    setUser(data.user); 

    if (data.user && data.user.role === 'Administrator') {
      console.log("Admin security clearance detected. Routing to controller matrix...");
      router.push('/admin');
    } else {
      console.log("Standard subscriber authenticated. Routing to analytics layout...");
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, syncUserProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);