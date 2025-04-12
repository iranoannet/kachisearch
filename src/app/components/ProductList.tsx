'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from './Loading';
import Error from './Error';
import ImageWithError from './ImageWithError';

interface Product {
  productId: string;
  productName: string;
  condition: string;
  price: string;
  shopName: string;
  category: string;
  url: string;
}

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorProps | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('商品データの取得に失敗しました');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : '商品データの取得に失敗しました',
        onRetry: fetchProducts
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getShopImage = (shopName: string) => {
    const shopImages: { [key: string]: string } = {
      'ミンティ大宮店': '/images/shops/minny-omiya.jpg',
      'ミンティ大阪日本橋店': '/images/shops/minny-osaka.jpg'
    };
    return shopImages[shopName] || '/images/shop-placeholder.jpg';
  };

  const getBannerImage = (bannerType: string) => {
    const bannerImages: { [key: string]: string } = {
      'gacha': '/images/banners/gacha-banner.jpg',
      'ad': '/images/banners/ad-banner.svg'
    };
    return bannerImages[bannerType] || '/images/placeholder.jpg';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} onRetry={error.onRetry} />;
  if (!products.length) return <Error message="商品が見つかりませんでした" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.productId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={product.url} target="_blank" rel="noopener noreferrer">
              <div className="p-4">
                <div className="mb-4 relative aspect-video">
                  <ImageWithError
                    src={getShopImage(product.shopName)}
                    alt={`${product.shopName}の店舗画像`}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.productName}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    product.condition === 'A' ? 'bg-green-100 text-green-800' :
                    product.condition === 'B' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    コンディション: {product.condition}
                  </span>
                  <span className="text-lg font-bold text-gray-900">¥{product.price}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{product.shopName}</p>
                  <p>{product.category}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 