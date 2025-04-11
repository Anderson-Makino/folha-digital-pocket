
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { companies, employees, currentUser } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  name: string;
  role: 'admin' | 'employee';
  companyIds?: string[];
  companyId?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we're using simple logic here
      // In a real application, this would be a proper API call
      if (username === 'admin' && password === 'admin123') {
        setUser(currentUser);
        navigate('/dashboard');
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta, Admin!",
        });
      } else if (username === 'joao' && password === 'joao123') {
        const employee = employees.find(emp => emp.name.toLowerCase().includes('joão'));
        if (employee) {
          setUser({
            id: employee.id,
            name: employee.name,
            role: 'employee',
            companyId: employee.companyId,
          });
          navigate('/dashboard');
          toast({
            title: "Login bem-sucedido",
            description: `Bem-vindo de volta, ${employee.name}!`,
          });
        }
      } else {
        toast({
          title: "Erro de login",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro de login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin }}>
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
