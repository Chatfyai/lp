
import { Card } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/ui/chart';

const Statistics = () => {
  // Data for the charts
  const visitData = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Visitas',
        data: [150, 230, 180, 290, 320, 250, 180],
        backgroundColor: 'rgba(109, 182, 67, 0.5)',
        borderColor: 'rgba(109, 182, 67, 1)',
        borderWidth: 2,
      },
    ],
  };

  const salesData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas 2023',
        data: [2100, 1800, 2400, 2200, 2600, 3100],
        borderColor: 'rgba(109, 182, 67, 1)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        tension: 0.3,
      },
      {
        label: 'Vendas 2022',
        data: [1800, 1600, 2000, 1900, 2200, 2700],
        borderColor: 'rgba(200, 200, 200, 1)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-0 shadow-sm">
          <div className="text-sm text-gray-500">Total de Visitas</div>
          <div className="text-3xl font-bold mt-2">1,428</div>
          <div className="text-xs text-green-600 mt-1">+12% em relação ao mês anterior</div>
        </Card>
        
        <Card className="p-4 border-0 shadow-sm">
          <div className="text-sm text-gray-500">Vendas no Mês</div>
          <div className="text-3xl font-bold mt-2">R$ 3.492,00</div>
          <div className="text-xs text-green-600 mt-1">+8% em relação ao mês anterior</div>
        </Card>
        
        <Card className="p-4 border-0 shadow-sm">
          <div className="text-sm text-gray-500">Produtos Cadastrados</div>
          <div className="text-3xl font-bold mt-2">24</div>
          <div className="text-xs text-blue-600 mt-1">3 adicionados este mês</div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 border-0 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Visitas por Dia da Semana</h3>
          <div className="h-72">
            <BarChart 
              data={visitData as any} 
              dataKey="data"
              nameKey="labels"
            />
          </div>
        </Card>
        
        <Card className="p-4 border-0 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Vendas Mensais</h3>
          <div className="h-72">
            <LineChart 
              data={salesData as any} 
              dataKey="data"
              nameKey="labels"
            />
          </div>
        </Card>
      </div>
      
      <Card className="p-6 border-0 shadow-sm">
        <h3 className="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Produto</th>
                <th className="text-center py-3">Preço</th>
                <th className="text-center py-3">Vendas</th>
                <th className="text-right py-3">Faturamento</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 transition-all">
                <td className="py-3">Camiseta Premium</td>
                <td className="py-3 text-center">R$ 59,90</td>
                <td className="py-3 text-center">24</td>
                <td className="py-3 text-right">R$ 1.437,60</td>
              </tr>
              <tr className="border-b hover:bg-gray-50 transition-all">
                <td className="py-3">Mochila Urban</td>
                <td className="py-3 text-center">R$ 149,90</td>
                <td className="py-3 text-center">8</td>
                <td className="py-3 text-right">R$ 1.199,20</td>
              </tr>
              <tr className="border-b hover:bg-gray-50 transition-all">
                <td className="py-3">Tênis Confort</td>
                <td className="py-3 text-center">R$ 199,90</td>
                <td className="py-3 text-center">4</td>
                <td className="py-3 text-right">R$ 799,60</td>
              </tr>
              <tr className="border-b hover:bg-gray-50 transition-all">
                <td className="py-3">Boné Estilizado</td>
                <td className="py-3 text-center">R$ 49,90</td>
                <td className="py-3 text-center">11</td>
                <td className="py-3 text-right">R$ 548,90</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Statistics;
