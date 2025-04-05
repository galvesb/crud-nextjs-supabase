"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, UserPlus, List, Menu, ChevronLeft, LogOut } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  // Começa sempre fechado (true)
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);

  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 484 && window.innerHeight <= 1000;
      setIsMobile(isMobileView);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // No mobile, menu sempre fechado. Em desktop, pode alternar
  const handleMenuToggle = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const menuItems = [
    { href: '/dashboard', icon: Users, text: 'Dashboard' },
    { href: '/dashboard/create', icon: UserPlus, text: 'Cadastrar' },
    { href: '/dashboard/list', icon: List, text: 'Listar/Excluir' },
  ];

  // Força o menu a ficar fechado no mobile, permite toggle apenas em desktop
  const effectiveCollapsed = isMobile ? true : isCollapsed;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform bg-white shadow-lg transition-all duration-300 ease-in-out ${effectiveCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Toggle Button - Only show if not mobile */}
        <button
          onClick={handleMenuToggle}
          className={`absolute -right-3 top-4 bg-white rounded-full p-1 shadow-md transition-colors ${isMobile ? 'invisible' : 'hover:bg-gray-100'}`}
        >
          {effectiveCollapsed ? (
            <Menu size={20} className="text-gray-600" />
          ) : (
            <ChevronLeft size={20} className="text-gray-600" />
          )}
        </button>
        <div className="h-16 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center overflow-hidden">
          <h1 className={`text-white text-xl font-semibold transition-all duration-300 ${effectiveCollapsed ? 'scale-0' : 'scale-100'}`}>Sistema CRUD</h1>
        </div>
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center ${effectiveCollapsed ? 'justify-center' : 'space-x-2 px-4'} py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className={`${effectiveCollapsed ? 'hidden' : 'block'}`}>{item.text}</span>
                </Link>
              );
            })}

            {/* Botão de Logout */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className={`w-full flex items-center ${effectiveCollapsed ? 'justify-center' : 'space-x-2 px-4'} py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 mt-8`}
            >
              <LogOut className="w-5 h-5" />
              <span className={`${effectiveCollapsed ? 'hidden' : 'block'}`}>{loading ? 'Saindo...' : 'Sair'}</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${effectiveCollapsed ? 'pl-20' : 'pl-64'} transition-all duration-300`}>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
