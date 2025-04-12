'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, BarChart2, Globe2, Megaphone, ArrowRightCircle, ShieldCheck } from 'lucide-react';

export default function SellerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* ヒーローセクション */}
      <div className="bg-red-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-6">
            トレカ販売者さまへ<br />
            今すぐ「カチサーチ」で販売してみませんか？
          </h1>
          <p className="text-xl mb-8">
            あなたのショップの商品、<br />
            もっと多くの人に見てもらいたいと思ったこと、ありませんか？
          </p>
          <div className="bg-white text-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg">
              「カチサーチ」は、トレーディングカードの相場を検索できる新しいプラットフォーム。<br />
              今、ここにあなたのお店の商品情報を無料で掲載するチャンスがあります！
            </p>
          </div>
        </div>
      </div>

      {/* メリットセクション */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          「カチサーチ」に掲載するメリット
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* メリット1 */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-red-500 mb-4">
              <BarChart2 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">自社の価格を無料でアピール</h3>
            <p className="text-gray-600">
              販売価格・買取価格、どちらも掲載無料。最新相場と並んで表示されるから、"選ばれる可能性"がグンとアップ！
            </p>
          </div>

          {/* メリット2 */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-red-500 mb-4">
              <Globe2 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">ライバルの価格も丸見え</h3>
            <p className="text-gray-600">
              複数サイトの価格情報を一覧表示。お客さんだけでなく、販売者にも便利な「市場モニター」として活用可能。
            </p>
          </div>

          {/* メリット3 */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-red-500 mb-4">
              <Megaphone size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">広告掲載も可能</h3>
            <p className="text-gray-600">
              「今すぐ売りたい」「この商品を目立たせたい」時に使える広告枠もあり！
            </p>
          </div>
        </div>
      </div>

      {/* 対象者セクション */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            こんな販売者さまにぴったり！
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              'トレカ専門ショップ',
              '個人経営の小さなカード屋さん',
              'フリマサイトから卒業したい方',
              '買取にも力を入れている店舗',
              'オンラインでの集客を強化したいショップ',
            ].map((text, index) => (
              <div key={index} className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="text-green-500 mr-4" />
                <span className="text-lg">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTAセクション */}
      <div className="bg-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">今なら掲載無料！</h2>
          <p className="text-xl mb-8">
            初期費用も、月額費用も一切不要！<br />
            「カチサーチ」でお店の価値をもっと広げてみませんか？
          </p>
          <Link
            href="/seller/register"
            className="inline-flex items-center bg-white text-red-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-colors"
          >
            販売者登録フォームへ
            <ArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
} 