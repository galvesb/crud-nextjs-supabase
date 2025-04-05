"use client";

import { useState, useEffect } from 'react';
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '../lib/supabase';
import { Person, PersonInput } from '../types/person';

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [formData, setFormData] = useState<PersonInput>({
    name: '',
    cpf: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

  async function fetchPeople() {
    const { data: people, error } = await supabase
      .from('people')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching people:', error);
    } else {
      setPeople(people || []);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('people')
          .update(formData)
          .eq('id', editingId);

        if (error) {
          console.error('Error updating person:', error);
          return;
        }
        
        setEditingId(null);
      } else {
        console.log('Attempting to insert:', formData);
        const { error } = await supabase
          .from('people')
          .insert([formData])
          .select();

        if (error) {
          console.error('Error creating person:', error);
          return;
        }
        
        console.log('Insert successful');
      }

      setFormData({ name: '', cpf: '' });
      fetchPeople();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  async function handleDelete(id: number) {
    const { error } = await supabase
      .from('people')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting person:', error);
    } else {
      fetchPeople();
    }
  }

  function handleEdit(person: Person) {
    setFormData({ name: person.name, cpf: person.cpf });
    setEditingId(person.id);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg w-[350px]">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-2xl h-12 flex items-center justify-between px-4">
          <span className="text-white font-semibold">
            {editingId ? 'Editar Pessoa' : 'Cadastrar Pessoa'}
          </span>
          <X className="text-white cursor-pointer" onClick={() => setFormData({ name: '', cpf: '' })} />
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
            {editingId ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </div>

      {showSuccess && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-purple-500 p-4 rounded-full shadow-lg">
            <Check className="text-white w-6 h-6" />
          </div>
        </div>
      )}

      {people.length > 0 && (
        <div className="mt-8 w-[350px]">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Pessoas Cadastradas</h2>
            <div className="space-y-3">
              {people.map((person) => (
                <div key={person.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-gray-600">{person.cpf}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(person)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
