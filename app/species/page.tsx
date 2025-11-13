'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface Species {
  id: number;
  name: string;
  scientific_name: string | null;
  active: boolean;
}

export default function SpeciesPage() {
  const router = useRouter();
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      const response = await fetch('/api/species');
      const data = await response.json();
      
      // Sprawdź czy data jest tablicą
      if (Array.isArray(data)) {
        setSpecies(data);
      } else {
        console.error('API returned non-array data:', data);
        setSpecies([]);
      }
    } catch (error) {
      console.error('Error fetching species:', error);
      setSpecies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć gatunek "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/species?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete species');
      }

      alert('Gatunek został usunięty');
      fetchSpecies();
    } catch (error) {
      console.error('Error deleting species:', error);
      alert('Wystąpił błąd podczas usuwania gatunku');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do strony głównej
        </Link>

        <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur rounded-3xl shadow-lg dark:shadow-[0_0_30px_rgba(34,197,94,0.3)] p-8 border-[3px] border-gray-200 dark:border-[#22c55e]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-600 dark:text-[#22c55e]" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-[#22c55e]">
                Gatunki Drzew
              </h1>
            </div>
            <Link
              href="/add-species"
              className="inline-flex items-center gap-2 bg-green-600 dark:bg-[#22c55e] text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-all"
            >
              <Plus className="w-5 h-5" />
              Dodaj Gatunek
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Ładowanie...</p>
            </div>
          ) : species.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Brak gatunków drzew
              </p>
              <Link
                href="/add-species"
                className="inline-flex items-center gap-2 text-green-600 dark:text-[#22c55e] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Dodaj pierwszy gatunek
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {species.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {item.name}
                    </h3>
                    {item.scientific_name && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        {item.scientific_name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Usuń gatunek"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Łącznie: <span className="font-semibold">{species.length}</span> gatunków
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
