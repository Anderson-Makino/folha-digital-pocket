
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 h-16 z-40">
      <div className="grid grid-cols-4 h-full max-w-md mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className={cn(
            "flex flex-col items-center justify-center",
            isActive('/dashboard') ? "text-brand-600" : "text-gray-500"
          )}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Início</span>
        </button>
        
        <button
          onClick={() => navigate('/payslips')}
          className={cn(
            "flex flex-col items-center justify-center",
            isActive('/payslips') ? "text-brand-600" : "text-gray-500"
          )}
        >
          <FileText className="h-6 w-6" />
          <span className="text-xs mt-1">Holerites</span>
        </button>
        
        <button
          onClick={() => navigate('/search')}
          className={cn(
            "flex flex-col items-center justify-center",
            isActive('/search') ? "text-brand-600" : "text-gray-500"
          )}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Buscar</span>
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={cn(
            "flex flex-col items-center justify-center",
            isActive('/profile') ? "text-brand-600" : "text-gray-500"
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
