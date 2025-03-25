import { StoreProvider } from '@/context/StoreContext';
import Logo from '@/components/Logo';
import Debug from '@/components/Debug';

export default function HomePage() {
  return (
    <StoreProvider>
      <main className="p-8">
        <div className="flex flex-col items-center">
          <Logo />
          <h1 className="text-3xl font-bold text-center">Naturalys</h1>
          <p className="text-center mt-2">Bem-vindo à nossa loja!</p>
        </div>
        
        <Debug />
      </main>
    </StoreProvider>
  );
} 