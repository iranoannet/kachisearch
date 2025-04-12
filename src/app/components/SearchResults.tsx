'use client';

import React from 'react';
import { CardPrice } from '../lib/shops';

interface SearchResultsProps {
  results: CardPrice[];
  isLoading: boolean;
}

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">商品が見つかりませんでした。</p>
      </div>
    );
  }

  // ショップごとに結果をグループ化
  const resultsByShop = results.reduce((acc, result) => {
    if (!acc[result.shopName]) {
      acc[result.shopName] = [];
    }
    acc[result.shopName].push(result);
    return acc;
  }, {} as Record<string, CardPrice[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 text-gray-600">
        {results.length}件
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {results.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative pb-[100%]">
              {card.stock.status === 'out_of_stock' ? (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <span className="text-white font-bold text-lg">SOLD OUT</span>
                </div>
              ) : null}
              <img
                src={card.imageUrl || '/images/no-image.png'}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/no-image.png';
                }}
              />
            </div>
            
            <div className="p-3">
              <h3 className="text-sm font-semibold mb-2 line-clamp-2">
                {card.name}
              </h3>
              <div className="text-sm text-gray-600 mb-1">
                {card.rarity && <span className="mr-2">{card.rarity}</span>}
                <span>{card.shopName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">
                  {card.price.toLocaleString()}円
                  <span className="text-xs text-gray-500 ml-1">(税込)</span>
                </span>
                {card.stock.status === 'in_stock' && card.stock.quantity > 0 && (
                  <button className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600 transition-colors">
                    カートに入れる
                  </button>
                )}
              </div>
              {card.stock.status === 'in_stock' && card.stock.quantity > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  在庫数 {card.stock.quantity}枚
                </div>
              )}
              {card.stock.status === 'out_of_stock' && (
                <div className="text-xs text-red-500 mt-1">
                  在庫なし
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">1</button>
        <button className="px-4 py-2 text-blue-500 hover:bg-gray-100 rounded-md">2</button>
        <button className="px-4 py-2 text-blue-500 hover:bg-gray-100 rounded-md">3</button>
        <span className="px-4 py-2">...</span>
        <button className="px-4 py-2 text-blue-500 hover:bg-gray-100 rounded-md">5</button>
        <button className="px-4 py-2 text-blue-500 hover:bg-gray-100 rounded-md flex items-center">
          次<span className="ml-1">»</span>
        </button>
      </div>
    </div>
  );
} 