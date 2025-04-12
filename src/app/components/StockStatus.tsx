'use client';

import type { CardPrice } from '@/lib/shops';

interface StockStatusProps {
  price: CardPrice;
}

export default function StockStatus({ price }: StockStatusProps) {
  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return '在庫あり';
      case 'low_stock':
        return '残りわずか';
      case 'out_of_stock':
        return '在庫切れ';
      default:
        return '不明';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(price.stock.status)}`}>
        {getStockStatusText(price.stock.status)}
      </span>
      {price.stock.quantity !== undefined && price.stock.status !== 'out_of_stock' && (
        <span className="text-xs text-gray-600">
          {price.stock.quantity}個
        </span>
      )}
    </div>
  );
} 