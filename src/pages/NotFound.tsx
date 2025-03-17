
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f5f5f5] to-[#e8f4e5]">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center animate-scale-in">
        <div className="text-9xl font-bold text-store-highlight opacity-20 mb-2">404</div>
        <h1 className="text-3xl font-bold text-store-primary mb-4">Página não encontrada</h1>
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-store-highlight hover:bg-opacity-90 inline-flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar para a loja
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
