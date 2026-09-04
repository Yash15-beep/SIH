'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => Promise<void>;
  switchDemoUser: (role: 'farmer' | 'consumer' | 'bulk_buyer' | 'admin') => void;
  users: User[];
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  logout: async () => {},
  switchDemoUser: () => {},
  users: [],
  refreshUsers: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.warn('Could not fetch users, fallback initialized');
    }
  };

  useEffect(() => {
    // 1. Restore authenticated user from localStorage if present
    try {
      const storedUser = localStorage.getItem('kisansetu_current_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.id) {
          setCurrentUserState(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not parse stored user');
    }

    fetchUsers();
  }, []);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('kisansetu_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kisansetu_current_user');
      localStorage.removeItem('kisansetu_user_id');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setCurrentUser(null);
    }
  };

  const switchDemoUser = (role: 'farmer' | 'consumer' | 'bulk_buyer' | 'admin') => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, switchDemoUser, users, refreshUsers: fetchUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
