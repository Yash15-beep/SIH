'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  switchDemoUser: (role: 'farmer' | 'consumer' | 'bulk_buyer' | 'admin') => void;
  users: User[];
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
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
        if (!currentUser && data.length > 0) {
          // Default to Ramesh (Farmer) or stored user
          const savedId = localStorage.getItem('kisansetu_user_id');
          const found = data.find((u: User) => u.id === savedId) || data[0];
          setCurrentUserState(found);
        }
      }
    } catch (e) {
      console.warn('Could not fetch users, fallback initialized');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    localStorage.setItem('kisansetu_user_id', user.id);
  };

  const switchDemoUser = (role: 'farmer' | 'consumer' | 'bulk_buyer' | 'admin') => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, switchDemoUser, users, refreshUsers: fetchUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
