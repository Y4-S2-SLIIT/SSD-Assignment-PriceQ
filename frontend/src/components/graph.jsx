import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const Graph = (props) => {
  const data = [
    {
      Marked_Price: props.cost,
      Profit_Percentage: 0,
    },
    {
      Marked_Price: props.msrp,
      Profit_Percentage: 100,
    },
    {
      Marked_Price: props.level3,
      Profit_Percentage: 5,
    },
    {
      Marked_Price: props.level4,
      Profit_Percentage: 0,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="9 9" />
        <XAxis dataKey="Marked_Price" />
        <YAxis hide={true} />
        <Legend name='Max Profit Percentage' />
        <Tooltip
          formatter={(value, name) => {
            return name === 'Marked_Price' ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`;
          }}
        />
        <Line type="monotone" dataKey="Profit_Percentage" name='Max Profit - Percentage' stroke="#55ff55" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Graph;
