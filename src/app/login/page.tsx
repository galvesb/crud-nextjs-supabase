"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Primeiro, verifica se o usuário confirmou o email
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Tenta fazer login
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        console.error('Erro de login:', error);
        if (error.message === 'Invalid login credentials') {
          setError('Email ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu email antes de fazer login');
        } else {
          setError(`Erro ao fazer login: ${error.message}`);
        }
      } else {
        // Login bem sucedido
        console.log('Login bem sucedido');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Ocorreu um erro inesperado ao tentar fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[350px]">
        <div className="h-16 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
          <span className="text-white font-semibold">Login</span>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-black">Email:</label>
            <input
              type="email"
              className="w-full p-2 rounded-md bg-gray-100 outline-none text-black placeholder-gray-500"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1 text-black">Senha:</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-2 pr-10 rounded-md bg-gray-100 outline-none text-black placeholder-gray-500"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-purple-500 hover:text-purple-600 font-medium">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
