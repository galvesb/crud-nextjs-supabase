"use client";

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Person } from '@/types/person';
import { cacheService } from '@/services/cacheService';

export default function ListPage() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadPeople();
  }, []);

  async function loadPeople() {
    const cachedPeople = await cacheService.getPeople();
    if (cachedPeople.length > 0) {
      setPeople(cachedPeople);
    } else {
      const freshPeople = await cacheService.fetchAndUpdateCache();
      setPeople(freshPeople);
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
      setShowSuccess(true);
      await cacheService.fetchAndUpdateCache();
      const updatedPeople = await cacheService.getPeople();
      setPeople(updatedPeople);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-2xl h-12 flex items-center px-4">
          <span className="text-white font-semibold">Pessoas Cadastradas</span>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {people.map((person) => (
              <div 
                key={person.id} 
                className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-black">{person.name}</p>
                  <p className="text-sm text-gray-600">{person.cpf}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/dashboard/edit/${person.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(person.id)}
                    className="bg-red-500 hover:bg-red-600 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
