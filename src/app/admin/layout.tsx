"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showFullLayout, setShowFullLayout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoggingOut) {
      router.push('/admin/login');
    } else if (isAuthenticated) {
      setCheckingAuth(false);
      setTimeout(() => {
        setShowFullLayout(true);
      }, 500);
      
    }
  }, [isAuthenticated, router, isLoggingOut]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
  };

  if (!showFullLayout || isLoggingOut) {
    return <main className="flex-1 p-6">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">
          
          {children}</main>
      </div>
    </div>
  );
}
