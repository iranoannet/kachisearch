'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import ProductGrid from './components/ProductGrid';
import { useState } from 'react';

// 画像のサイズを定数として定義
const BANNER_SIZE = {
  width: 980,
  height: 120
} as const;

const SHOP_IMAGE_SIZE = {
  width: 600,
  height: 400
} as const;

// 画像のエラーハンドリング用のコンポーネント
const ImageWithError = ({ src, alt, className, ...props }: { src: string; alt: string; className?: string; [key: string]: any }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`画像の読み込みエラー: ${src}`, e);
    setError(true);
  };

  const handleLoad = () => {
    console.log(`画像の読み込み成功: ${src}`);
    setLoaded(true);
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <p className="text-sm text-gray-500">
          画像の読み込みに失敗しました
          <br />
          {src}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`${className} ${!loaded ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
      {!loaded && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}>
          <p className="text-sm text-gray-500">読み込み中...</p>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 広告バナー */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="relative mx-auto bg-black rounded-lg overflow-hidden" style={{ width: BANNER_SIZE.width, height: BANNER_SIZE.height }}>
          <Image
            src="/images/banners/gacha-banner.jpg"
            alt="World's first Web GACHA"
            width={980}
            height={120}
            className="w-full h-full object-contain"
            quality={100}
            priority
          />
        </div>
      </section>

      {/* 最近閲覧したカード */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">最近閲覧したカード</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductGrid />
        </Suspense>
      </section>

      {/* おすすめのトレカショップ */}
      <section className="max-w-6xl mx-auto px-4 py-8 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">おすすめのトレカショップ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* minny大阪店 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/images/shops/minny-osaka.jpg"
                alt="minny大阪店の外観"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">minny大阪店</h3>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                トレーディングカードの買取・販売を行う専門店です。豊富な品揃えと丁寧な接客で、お客様のニーズにお応えします。
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>大阪府大阪市中央区</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span>10:00-20:00（年中無休）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>06-XXXX-XXXX</span>
                </div>
              </div>
            </div>
          </div>

          {/* minny大宮店 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/images/shops/minny-omiya.jpg"
                alt="minny大宮店の店内"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">minny大宮店</h3>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                充実した店内スペースで、ゆっくりとカード選びをお楽しみいただけます。初心者の方から上級者の方まで、幅広いニーズにお応えします。
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>埼玉県さいたま市大宮区</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span>10:00-20:00（年中無休）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>048-XXX-XXXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* おすすめのオンラインガチャサイト */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">おすすめのオンラインガチャサイト</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* E-GET24 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="relative h-48">
              <Image
                src="/images/no-image.svg"
                alt="E-GET24"
                width={980}
                height={120}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">E-GET24</h3>
              <p className="text-gray-600 text-sm mb-3">
                世界初のWebガチャサービス。24時間いつでもトレーディングカードのガチャを楽しめます。
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>💎 1回 500円から</p>
                <p>🎯 レア度別の提供割合を公開</p>
                <p>✨ 毎日更新される限定カード</p>
              </div>
              <a 
                href="#" 
                className="mt-4 block w-full bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                サイトを見る
              </a>
            </div>
          </div>

          {/* 近日公開予定のサイト枠 */}
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center">
            <div className="text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-lg font-bold mb-2">近日公開予定</h3>
              <p className="text-sm">新しいガチャサイトが追加されます</p>
            </div>
          </div>

          {/* 近日公開予定のサイト枠 */}
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center">
            <div className="text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-lg font-bold mb-2">近日公開予定</h3>
              <p className="text-sm">新しいガチャサイトが追加されます</p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <a href="#" className="hover:underline">運営会社</a>
            <a href="#" className="hover:underline">利用規約</a>
            <a href="#" className="hover:underline">ポイントの利用規約</a>
            <a href="#" className="hover:underline">特定商取引法に基づく表示</a>
            <a href="#" className="hover:underline">プライバシーポリシー</a>
          </div>
          <p className="mt-4 text-sm text-gray-500">Copyright © 2024 Iranoan All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
