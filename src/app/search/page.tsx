'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import PriceChart from '../components/PriceChart';
import PriceAlert from '../components/PriceAlert';
import StockStatus from '../components/StockStatus';
import type { CardInfo, CardPrice } from '@/lib/shops';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [progress, setProgress] = useState(0);
  const [sortBy, setSortBy] = useState<'price' | 'shop'>('price');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);
        setProgress(0);
        
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('検索中にエラーが発生しました');
        }
        
        const data = await response.json();
        setCards(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [query]);

  // フィルタリングとソート
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (minPrice !== null && card.prices[0]?.price < minPrice) return false;
      if (maxPrice !== null && card.prices[0]?.price > maxPrice) return false;
      return true;
    }).map(card => ({
      ...card,
      prices: card.prices.sort((a, b) => 
        sortBy === 'price' ? a.price - b.price : a.shopName.localeCompare(b.shopName)
      )
    }));
  }, [cards, minPrice, maxPrice, sortBy]);

  // レアリティでグループ化
  const cardsByRarity = useMemo(() => {
    return filteredCards.reduce((groups, card) => {
      const rarity = card.rarity || '不明';
      if (!groups[rarity]) {
        groups[rarity] = [];
      }
      groups[rarity].push(card);
      return groups;
    }, {} as Record<string, CardInfo[]>);
  }, [filteredCards]);

  if (loading) return <Loading progress={progress} />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!cards.length) return <div className="text-center py-8">商品が見つかりませんでした</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* フィルターとソート */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">並び替え:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'shop')}
              className="border rounded px-2 py-1"
            >
              <option value="price">価格順</option>
              <option value="shop">ショップ順</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">価格範囲:</label>
            <input
              type="number"
              placeholder="最小"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
              className="border rounded px-2 py-1 w-24"
            />
            <span>〜</span>
            <input
              type="number"
              placeholder="最大"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
              className="border rounded px-2 py-1 w-24"
            />
          </div>
        </div>
      </div>

      {Object.entries(cardsByRarity).map(([rarity, cards]) => (
        <div key={rarity} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">
              {rarity}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={card.imageUrl}
                      alt={card.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain"
                      loading="lazy"
                      quality={100}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLzYvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLz/2wBDAR0dHh4eHRoaHSQtJCEkLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{card.name}</h3>
                  {card.expansion && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">拡張セット:</span> {card.expansion}
                    </p>
                  )}
                  <div className="space-y-2">
                    {card.prices.map((price) => (
                      <a
                        key={`${price.shopId}-${price.condition}`}
                        href={price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 hover:bg-gray-50 rounded transition-colors border border-gray-100"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="font-medium">{price.shopName}</span>
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {price.condition}
                            </span>
                            <div className="ml-2">
                              <StockStatus price={price} />
                            </div>
                          </div>
                          <span className="text-lg font-bold text-red-500">
                            ¥{price.price.toLocaleString()}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  {card.prices.length > 0 && (
                    <div className="mt-4">
                      <PriceChart prices={card.prices} />
                      <PriceAlert card={card} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 