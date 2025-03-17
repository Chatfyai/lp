import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import { useImage } from '@/contexts/ImageContext';

interface StoreSettings {
  id: string;
  store_name: string;
  description: string;
  whatsapp_number: string;
  instagram_handle: string;
  address: string;
  open_weekdays: boolean;
  open_saturday: boolean;
  open_sunday: boolean;
  weekday_open_time: string;
  weekday_close_time: string;
  saturday_open_time: string;
  saturday_close_time: string;
  sunday_open_time: string;
  sunday_close_time: string;
  store_image: string;
}

interface SettingsProps {
  onUpdate?: () => void;
}

const Settings = ({ onUpdate }: SettingsProps) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { refreshImage } = useImage();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      setSettings(data);
      setImagePreview(data.store_image);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações da loja. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof StoreSettings, value: string | boolean) => {
    if (settings) {
      setSettings({
        ...settings,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          store_name: settings.store_name,
          description: settings.description,
          whatsapp_number: settings.whatsapp_number,
          instagram_handle: settings.instagram_handle,
          address: settings.address,
          open_weekdays: settings.open_weekdays,
          open_saturday: settings.open_saturday,
          open_sunday: settings.open_sunday,
          weekday_open_time: settings.weekday_open_time,
          weekday_close_time: settings.weekday_close_time,
          saturday_open_time: settings.saturday_open_time,
          saturday_close_time: settings.saturday_close_time,
          sunday_open_time: settings.sunday_open_time,
          sunday_close_time: settings.sunday_close_time,
          store_image: settings.store_image
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As configurações da loja foram atualizadas com sucesso",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (imageUrl) => {
    if (!settings) return;
    
    // Exibir preview imediatamente
    setImagePreview(imageUrl);
    
    try {
      console.log("Salvando nova imagem:", imageUrl);
      
      // Remover parâmetros de URL se existirem
      let cleanImageUrl = imageUrl;
      if (imageUrl.includes('?')) {
        cleanImageUrl = imageUrl.split('?')[0];
      }
      
      // Atualizar o campo store_image com a URL da imagem
      const { error } = await supabase
        .from('store_settings')
        .update({
          store_image: cleanImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;
      
      toast({
        title: "Imagem salva",
        description: "A imagem da loja foi atualizada e salva com sucesso",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      toast({
        title: "Erro ao salvar imagem",
        description: "A imagem foi carregada, mas ocorreu um erro ao salvar no banco de dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-store-highlight" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar configurações. Tente novamente mais tarde.</p>
        <Button 
          onClick={fetchSettings} 
          className="mt-4"
          variant="outline"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Imagem da Loja</CardTitle>
          <CardDescription>
            Carregue uma imagem para sua loja. Recomendamos uma imagem quadrada de pelo menos 300x300 pixels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {imagePreview && (
              <div className="mb-4">
                <img 
                  src={imagePreview} 
                  alt="Preview da imagem da loja" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-store-highlight"
                />
              </div>
            )}
            
            <ImageUpload onUploadComplete={handleImageUpload} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
          <CardDescription>
            Configure as informações básicas da sua loja que aparecem no site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo da Loja</Label>
            <div className="flex flex-col items-center space-y-4">
              {imagePreview && (
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={imagePreview}
                    alt="Logo da Loja" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeName">Nome da Loja</Label>
            <Input 
              id="storeName" 
              value={settings.store_name}
              onChange={(e) => handleChange('store_name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={settings.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Contato e Redes Sociais</CardTitle>
          <CardDescription>
            Configure os links e informações de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">Número do WhatsApp (com código do país)</Label>
            <Input 
              id="whatsappNumber" 
              value={settings.whatsapp_number}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              placeholder="551199999999"
            />
            <p className="text-xs text-gray-500">Ex: 5511999999999 (sem espaços ou caracteres especiais)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagramHandle">Usuário do Instagram</Label>
            <div className="flex">
              <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 rounded-l-md text-gray-500">@</span>
              <Input 
                id="instagramHandle" 
                value={settings.instagram_handle}
                onChange={(e) => handleChange('instagram_handle', e.target.value)}
                className="rounded-l-none"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address" 
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Horário de Funcionamento</CardTitle>
          <CardDescription>
            Configure os dias e horários de funcionamento da loja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h4 className="font-medium">Segunda a Sexta</h4>
                <p className="text-sm text-gray-500">Horário de funcionamento em dias úteis</p>
              </div>
              <div className="flex items-center space-x-3">
                <Switch 
                  checked={settings.open_weekdays}
                  onCheckedChange={(checked) => handleChange('open_weekdays', checked)}
                  id="openWeekdays"
                />
                <Label htmlFor="openWeekdays" className="cursor-pointer">
                  {settings.open_weekdays ? 'Aberto' : 'Fechado'}
                </Label>
              </div>
            </div>
            
            {settings.open_weekdays && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-gray-100">
                <div className="space-y-2">
                  <Label htmlFor="weekdayOpenTime">Horário de Abertura</Label>
                  <Input 
                    id="weekdayOpenTime" 
                    type="time" 
                    value={settings.weekday_open_time}
                    onChange={(e) => handleChange('weekday_open_time', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekdayCloseTime">Horário de Fechamento</Label>
                  <Input 
                    id="weekdayCloseTime" 
                    type="time" 
                    value={settings.weekday_close_time}
                    onChange={(e) => handleChange('weekday_close_time', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h4 className="font-medium">Sábado</h4>
                <p className="text-sm text-gray-500">Horário de funcionamento aos sábados</p>
              </div>
              <div className="flex items-center space-x-3">
                <Switch 
                  checked={settings.open_saturday}
                  onCheckedChange={(checked) => handleChange('open_saturday', checked)}
                  id="openSaturday"
                />
                <Label htmlFor="openSaturday" className="cursor-pointer">
                  {settings.open_saturday ? 'Aberto' : 'Fechado'}
                </Label>
              </div>
            </div>
            
            {settings.open_saturday && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-gray-100">
                <div className="space-y-2">
                  <Label htmlFor="saturdayOpenTime">Horário de Abertura</Label>
                  <Input 
                    id="saturdayOpenTime" 
                    type="time" 
                    value={settings.saturday_open_time}
                    onChange={(e) => handleChange('saturday_open_time', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saturdayCloseTime">Horário de Fechamento</Label>
                  <Input 
                    id="saturdayCloseTime" 
                    type="time" 
                    value={settings.saturday_close_time}
                    onChange={(e) => handleChange('saturday_close_time', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h4 className="font-medium">Domingo</h4>
                <p className="text-sm text-gray-500">Horário de funcionamento aos domingos</p>
              </div>
              <div className="flex items-center space-x-3">
                <Switch 
                  checked={settings.open_sunday}
                  onCheckedChange={(checked) => handleChange('open_sunday', checked)}
                  id="openSunday"
                />
                <Label htmlFor="openSunday" className="cursor-pointer">
                  {settings.open_sunday ? 'Aberto' : 'Fechado'}
                </Label>
              </div>
            </div>
            
            {settings.open_sunday && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-gray-100">
                <div className="space-y-2">
                  <Label htmlFor="sundayOpenTime">Horário de Abertura</Label>
                  <Input 
                    id="sundayOpenTime" 
                    type="time" 
                    value={settings.sunday_open_time}
                    onChange={(e) => handleChange('sunday_open_time', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sundayCloseTime">Horário de Fechamento</Label>
                  <Input 
                    id="sundayCloseTime" 
                    type="time" 
                    value={settings.sunday_close_time}
                    onChange={(e) => handleChange('sunday_close_time', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Button onClick={handleSave} className="bg-store-highlight hover:bg-opacity-90">
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
