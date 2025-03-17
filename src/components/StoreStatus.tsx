import { useEffect, useState } from 'react';

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
}

interface StoreStatusProps {
  settings: StoreSettings | null;
}

const StoreStatus = ({ settings }: StoreStatusProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (!settings) {
      setIsOpen(false);
      setMessage('🔴 Horário não disponível');
      return;
    }
    
    const checkStoreStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = domingo, 6 = sábado
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Define horário de funcionamento com base nas configurações
      if (day >= 1 && day <= 5 && settings.open_weekdays) {
        // Segunda a sexta
        if (currentTime >= settings.weekday_open_time && currentTime < settings.weekday_close_time) {
          setIsOpen(true);
          setMessage('🟢 Aberto agora!');
        } else {
          setIsOpen(false);
          if (currentTime < settings.weekday_open_time) {
            setMessage(`🔴 Fechado no momento (Abrimos às ${settings.weekday_open_time})`);
          } else {
            setMessage(`🔴 Fechado no momento (Abrimos amanhã às ${settings.weekday_open_time})`);
          }
        }
      } else if (day === 6 && settings.open_saturday) {
        // Sábado
        if (currentTime >= settings.saturday_open_time && currentTime < settings.saturday_close_time) {
          setIsOpen(true);
          setMessage('🟢 Aberto agora!');
        } else {
          setIsOpen(false);
          if (currentTime < settings.saturday_open_time) {
            setMessage(`🔴 Fechado no momento (Abrimos às ${settings.saturday_open_time})`);
          } else {
            if (settings.open_sunday) {
              setMessage(`🔴 Fechado no momento (Abrimos amanhã às ${settings.sunday_open_time})`);
            } else {
              setMessage(`🔴 Fechado no momento (Abrimos segunda às ${settings.weekday_open_time})`);
            }
          }
        }
      } else if (day === 0 && settings.open_sunday) {
        // Domingo
        if (currentTime >= settings.sunday_open_time && currentTime < settings.sunday_close_time) {
          setIsOpen(true);
          setMessage('🟢 Aberto agora!');
        } else {
          setIsOpen(false);
          if (currentTime < settings.sunday_open_time) {
            setMessage(`🔴 Fechado no momento (Abrimos às ${settings.sunday_open_time})`);
          } else {
            setMessage(`🔴 Fechado no momento (Abrimos amanhã às ${settings.weekday_open_time})`);
          }
        }
      } else {
        // Loja fechada nos dias não configurados
        setIsOpen(false);
        if (day === 0 && !settings.open_sunday) {
          setMessage(`🔴 Fechado aos domingos (Abrimos segunda às ${settings.weekday_open_time})`);
        } else if (day === 6 && !settings.open_saturday) {
          setMessage(`🔴 Fechado aos sábados (Abrimos segunda às ${settings.weekday_open_time})`);
        } else {
          setMessage('🔴 Fechado no momento');
        }
      }
    };
    
    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000); // Verifica a cada minuto
    
    return () => clearInterval(interval);
  }, [settings]);
  
  return (
    <div 
      className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm my-4 mx-auto flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-store-open animate-gentle-pulse' : 'bg-store-closed'}`}
    >
      {message}
    </div>
  );
};

export default StoreStatus;
