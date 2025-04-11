
import React, { ReactNode } from 'react';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

type MobileLayoutProps = {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
  className?: string;
};

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  showBottomNav = true,
  showMenu = false,
  onMenuClick,
  className = '',
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppHeader 
        title={title} 
        showBackButton={showBackButton} 
        showMenu={showMenu} 
        onMenuClick={onMenuClick} 
      />
      
      <main className={`flex-1 w-full max-w-md mx-auto pb-20 px-4 ${className}`}>
        {children}
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
