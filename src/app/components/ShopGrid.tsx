'use client';

import Image from 'next/image';
import Link from 'next/link';

type Shop = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
};

// ダミーデータ（後で実際のデータに置き換え）
const recommendedShops: Shop[] = [
  {
    id: '1',
    name: 'カードショップA',
    imageUrl: '/images/shop-placeholder.jpg',
    description: '豊富な品揃えと丁寧な対応が自慢のショップです。',
  },
  {
    id: '2',
    name: 'トレカストアB',
    imageUrl: '/images/shop-placeholder.jpg',
    description: '24時間営業のオンラインショップ。',
  },
  // 他のショップ...
];

export default function ShopGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedShops.map((shop) => (
        <Link
          key={shop.id}
          href={`/shops/${shop.id}`}
          className="block group"
        >
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={shop.imageUrl}
                alt={shop.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-red-500">
                {shop.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {shop.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 