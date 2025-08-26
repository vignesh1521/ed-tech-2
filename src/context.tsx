'use client';
import { useEffect, useState, useContext, createContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  id: string;
  username: string;
  email:string;
  role: string;
  exp?: number;
};

type AuthContextType = {
  user: DecodedToken | null;
  setUser: (user: DecodedToken | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.log(error);
        setUser(null);
      }
    } else {
      setUser(null); 
    }

    setLoading(false); 
  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
