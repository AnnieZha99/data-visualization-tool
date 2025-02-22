import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
}

const BarChartComponent: React.FC<BarChartProps> = ({ data, xAxisKey, yAxisKey }) => {
  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xAxisKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={yAxisKey} fill="#8884d8" />
    </BarChart>
  );
};

export default BarChartComponent;
