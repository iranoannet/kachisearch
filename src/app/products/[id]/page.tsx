'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type Shop = {
  name: string;
  url: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  condition: string;
  shop: Shop;
  category: string;
};

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('商品の取得に失敗しました');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '商品の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">商品が見つかりませんでした</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 商品画像 */}
            <div className="relative aspect-square">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain rounded-lg"
              />
              <span className="absolute top-2 right-2 px-3 py-1 text-sm font-bold text-white bg-blue-500 rounded">
                {product.condition}
              </span>
            </div>

            {/* 商品情報 */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">価格</h2>
                  <p className="text-2xl font-bold text-red-500">{product.price.toLocaleString()}円</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">カテゴリー</h2>
                  <p className="text-gray-600">{product.category}</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">販売ショップ</h2>
                  <a
                    href={product.shop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {product.shop.name}
                  </a>
                </div>
                <div>
                  <a
                    href={product.shop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    ショップで見る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 