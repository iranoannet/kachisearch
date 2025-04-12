'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { CardPrice } from '@/lib/shops';

interface PriceChartProps {
  prices: CardPrice[];
}

export default function PriceChart({ prices }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // 価格データの整形
  const chartData = prices.map(price => ({
    name: price.shopName,
    price: price.price,
    condition: price.condition,
    date: new Date(price.timestamp).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">価格推移</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded ${
              timeRange === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            1日
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded ${
              timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            1週間
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded ${
              timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            1ヶ月
          </button>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`¥${value.toLocaleString()}`, '価格']}
              labelFormatter={(label) => `日時: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 