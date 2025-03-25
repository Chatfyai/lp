'use client';

import { useStore } from '@/context/StoreContext';
import Logo from './Logo';
import Testimonials from './Testimonials';

export default function HomeContent() {
  const { settings, isLoading } = useStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <Logo />
        <h1 className="text-3xl font-bold text-center">Naturalys</h1>
        <p className="text-center mt-2 text-gray-600 max-w-lg mx-auto">
          {settings?.description || "Produtos naturais e suplementos para sua saúde e bem-estar."}
        </p>
      </div>
      
      <div className="mt-12 bg-green-50 rounded-lg shadow-md overflow-hidden border border-green-100">
        <Testimonials />
      </div>
    </div>
  );
} 