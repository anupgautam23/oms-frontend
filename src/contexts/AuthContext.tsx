
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('oms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: email === 'admin@oms.com' ? 'Admin User' : 'John Doe',
        email,
        role: email === 'admin@oms.com' ? 'admin' : 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('oms_user', JSON.stringify(mockUser));
      toast.success(`Welcome back, ${mockUser.name}!`);
      setIsLoading(false);
      return true;
    }
    
    toast.error('Invalid credentials');
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user'
      };
      
      setUser(newUser);
      localStorage.setItem('oms_user', JSON.stringify(newUser));
      toast.success(`Account created successfully! Welcome, ${name}!`);
      setIsLoading(false);
      return true;
    }
    
    toast.error('Registration failed');
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oms_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
