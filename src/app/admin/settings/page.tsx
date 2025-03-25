import LogoUpload from "@/components/admin/LogoUpload";
import StoreImageUpload from "@/components/admin/StoreImageUpload";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Configurações da Loja</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LogoUpload />
        <StoreImageUpload />
        {/* Outros componentes de configuração */}
      </div>
    </div>
  );
} 