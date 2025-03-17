
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  barColor?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
}

export const BarChart = ({
  data,
  dataKey,
  nameKey = "name",
  barColor = "#6DB643",
  xAxisLabel,
  yAxisLabel,
  height = 300
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={nameKey} label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }} />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={barColor} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

interface LineChartProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  lineColor?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
}

export const LineChart = ({
  data,
  dataKey,
  nameKey = "name",
  lineColor = "#6DB643",
  xAxisLabel,
  yAxisLabel,
  height = 300
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={nameKey} label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }} />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={lineColor} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
