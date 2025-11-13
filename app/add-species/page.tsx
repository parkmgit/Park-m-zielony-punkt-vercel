'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddSpeciesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scientific_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/species', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Błąd podczas dodawania gatunku');
        return;
      }

      alert('Gatunek został dodany pomyślnie!');
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Wystąpił błąd podczas dodawania gatunku');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do strony głównej
        </Link>

        <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur rounded-3xl shadow-lg dark:shadow-[0_0_30px_rgba(34,197,94,0.3)] p-8 border-[3px] border-gray-200 dark:border-[#22c55e]">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-8 h-8 text-green-600 dark:text-[#22c55e]" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-[#22c55e]">
              Dodaj Nowy Gatunek Drzewa
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nazwa polska */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">
                Nazwa polska <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="np. Dąb szypułkowy"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Nazwa łacińska */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">
                Nazwa łacińska (naukowa)
              </label>
              <input
                type="text"
                value={formData.scientific_name}
                onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
                placeholder="np. Quercus robur"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent italic"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Opcjonalne - nazwa naukowa gatunku
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 dark:bg-[#22c55e] text-white py-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Dodawanie...' : '✓ Dodaj Gatunek'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
