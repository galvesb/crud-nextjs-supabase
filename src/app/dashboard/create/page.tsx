"use client";

import { useState } from 'react';
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { cacheService } from '@/services/cacheService';

export default function CreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    cpf: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('people')
        .insert([formData]);

      if (error) {
        console.error('Error creating person:', error);
        return;
      }
      
      setShowSuccess(true);
      await cacheService.fetchAndUpdateCache();
      setTimeout(() => {
        router.push('/dashboard/list');
      }, 1000);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg w-full">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-2xl h-12 flex items-center justify-between px-4">
          <span className="text-white font-semibold">Cadastrar Pessoa</span>
          <X 
            className="text-white cursor-pointer" 
            onClick={() => setFormData({ name: '', cpf: '' })} 
          />
        </div>
        <div className="px-6 py-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-black">Nome:</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-gray-100 outline-none text-black placeholder-gray-500"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-black">CPF:</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-gray-100 outline-none text-black placeholder-gray-500"
              placeholder="Digite seu CPF"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              required
            />
          </div>
          <Button 
            onClick={handleSubmit}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md"
          >
            Cadastrar
          </Button>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed bottom-8 right-8 animate-fade-in">
          <div className="bg-green-500 p-4 rounded-full shadow-lg flex items-center justify-center w-12 h-12">
            <Check className="text-white w-6 h-6" />
          </div>
        </div>
      )}
    </div>
  );
}
