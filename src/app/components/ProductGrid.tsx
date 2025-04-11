'use client';

import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  condition?: string;
};

// ダミーデータ（後で実際のデータに置き換え）
const recentProducts: Product[] = [
  {
    id: '1',
    name: 'リザードン【CHR】(187/172)',
    price: 1200,
    imageUrl: '/images/placeholder.jpg',
    condition: 'A',
  },
  {
    id: '2',
    name: 'キチキギス(RR)',
    price: 380,
    imageUrl: '/images/placeholder.jpg',
    condition: 'B',
  },
  // 他の商品...
];

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {recentProducts.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group"
        >
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="relative aspect-square">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain rounded-t-lg"
              />
              {product.condition && (
                <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded">
                  {product.condition}
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-500">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {product.price.toLocaleString()}円～
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 