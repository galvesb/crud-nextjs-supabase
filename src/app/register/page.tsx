"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        console.error('Erro no registro:', error);
        setError(error.message);
      } else {
        // Faz login automático após o registro
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (loginError) {
          console.error('Erro no login após registro:', loginError);
          setError('Conta criada, mas houve um erro ao fazer login automático');
          router.push('/login');
        } else {
          router.push('/dashboard');
          router.refresh();
        }
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Ocorreu um erro ao tentar fazer o cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg w-[350px]">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-2xl h-12 flex items-center px-4">
          <span className="text-white font-semibold">Cadastro de Usuário</span>
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
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-black">Senha:</label>
            <input
              type="password"
              className="w-full p-2 rounded-md bg-gray-100 outline-none text-black placeholder-gray-500"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1 text-black">Confirme a senha:</label>
            <input
              type="password"
              className="w-full p-2 rounded-md bg-gray-100 outline-none text-black placeholder-gray-500"
              placeholder="Digite sua senha novamente"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-purple-500 hover:text-purple-600 font-medium">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
