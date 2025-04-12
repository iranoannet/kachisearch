import Link from 'next/link';
import { Metadata } from 'next';

// サーバーサイドでデータを取得する関数
async function getShopData(id: string) {
  // 実際の実装ではデータベースやAPIからデータを取得
  // ここではモックデータを使用
  const mockShops = {
    'kachaicha': {
      id: 'kachaicha',
      name: 'カチャイチャ',
      description: 'トレーディングカード専門店。ポケモンカードを中心に幅広い商品を取り扱っています。',
      imageUrl: '/shop-images/placeholder.jpg',
      cards: [
        { id: 'lizardon-chr', name: 'リザードン [CHR]', rank: 'B-', price: 1200, updatedAt: '2024/01/01 18:00' },
        { id: 'kiterugura-sr', name: 'キテルギュラ (SR)', rank: 'B', price: 380, updatedAt: '2024/01/01 18:00' },
        { id: 'lugia-sr', name: 'ルギア (SR)', rank: 'A', price: 288000, updatedAt: '2024/01/01 18:00' },
        { id: 'mew-star', name: 'ミュウ (★)', rank: 'B+', price: 24800, updatedAt: '2024/01/01 18:00' },
        { id: 'blacky-ex-sar', name: 'ブラッキーex (SAR)', rank: 'A-', price: 36800, updatedAt: '2024/01/01 18:00' },
      ]
    },
    'torekaland': {
      id: 'torekaland',
      name: 'トレカランド',
      description: '全国展開のトレーディングカードショップ。豊富な在庫と安定した価格が特徴です。',
      imageUrl: '/shop-images/placeholder.jpg',
      cards: [
        { id: 'lizardon-chr', name: 'リザードン [CHR]', rank: 'B-', price: 1280, updatedAt: '2024/01/01 18:00' },
        { id: 'kiterugura-sr', name: 'キテルギュラ (SR)', rank: 'B+', price: 400, updatedAt: '2024/01/01 18:00' },
        { id: 'lugia-sr', name: 'ルギア (SR)', rank: 'A-', price: 290000, updatedAt: '2024/01/01 18:00' },
        { id: 'mew-star', name: 'ミュウ (★)', rank: 'A', price: 25500, updatedAt: '2024/01/01 18:00' },
        { id: 'blacky-ex-sar', name: 'ブラッキーex (SAR)', rank: 'A', price: 38000, updatedAt: '2024/01/01 18:00' },
      ]
    },
    'minny': {
      id: 'minny',
      name: 'minny',
      description: 'オンライン専門のトレカショップ。迅速な発送と丁寧な梱包が評判です。',
      imageUrl: '/shop-images/placeholder.jpg',
      cards: [
        { id: 'lizardon-chr', name: 'リザードン [CHR]', rank: 'B-', price: 1300, updatedAt: '2024/01/01 18:00' },
      ]
    },
    'yugioh': {
      id: 'yugioh',
      name: '遊学会',
      description: '老舗のトレーディングカードショップ。買取価格の高さで人気があります。',
      imageUrl: '/shop-images/placeholder.jpg',
      cards: [
        { id: 'lizardon-chr', name: 'リザードン [CHR]', rank: 'B+', price: 1400, updatedAt: '2024/01/01 18:00' },
      ]
    },
    'hareru2': {
      id: 'hareru2',
      name: '晴れる屋2',
      description: '大型トレカ専門店。品揃えの豊富さと高品質なカードが特徴です。',
      imageUrl: '/shop-images/placeholder.jpg',
      cards: [
        { id: 'lizardon-chr', name: 'リザードン [CHR]', rank: 'A', price: 1450, updatedAt: '2024/01/01 18:00' },
      ]
    },
    'cardrush': {
      id: 'cardrush',
      name: 'カードラッシュ',
      description: 'トレカ買取・販売の大手ショップ。幅広いカードを取り扱っています。',
      imageUrl: '/shop-images/placeholder.jpg',
      cards: [
        { id: 'lizardon-chr', name: 'リザードン [CHR]', rank: '-', price: 0, updatedAt: '-' },
      ]
    }
  };
  
  return mockShops[id as keyof typeof mockShops] || null;
}

// 静的エクスポートのために必要なgenerateStaticParams関数
export async function generateStaticParams() {
  // 静的に生成するショップIDのリスト
  return [
    { id: 'kachaicha' },
    { id: 'torekaland' },
    { id: 'minny' },
    { id: 'yugioh' },
    { id: 'hareru2' },
    { id: 'cardrush' }
  ];
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const shopId = params.id;
  const shop = await getShopData(shopId);
  
  if (!shop) {
    return {
      title: 'ショップが見つかりません - カチサーチ',
    };
  }
  
  return {
    title: `${shop.name} - カチサーチ`,
    description: `${shop.name}の取扱カード一覧。${shop.description}`,
  };
}

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
  const shopId = params.id;
  const shop = await getShopData(shopId);

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-xl mb-4">ショップが見つかりませんでした</div>
          <Link href="/" className="text-blue-500 hover:underline">
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  // おすすめショップのモックデータ
  const recommendedShops = [
    {
      id: 'torekaland',
      name: 'トレカランド',
      description: '全国展開のトレーディングカードショップ。豊富な在庫と安定した価格が特徴です。',
      imageUrl: '/shop-images/placeholder.jpg',
    },
    {
      id: 'minny',
      name: 'minny',
      description: 'オンライン専門のトレカショップ。迅速な発送と丁寧な梱包が評判です。',
      imageUrl: '/shop-images/placeholder.jpg',
    },
    {
      id: 'yugioh',
      name: '遊学会',
      description: '老舗のトレーディングカードショップ。買取価格の高さで人気があります。',
      imageUrl: '/shop-images/placeholder.jpg',
    },
  ].filter(s => s.id !== shopId);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Top</Link>
        {' > '}
        <Link href="/" className="hover:underline">ショップ一覧</Link>
        {' > '}
        <span>{shop.name}</span>
      </div>

      {/* ショップ情報 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0 flex items-center justify-center bg-gray-200 md:w-48 h-48">
            <div className="text-gray-400">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h1>
            <p className="text-gray-600 mb-4">{shop.description}</p>
            <div className="flex items-center">
              <a href="#" className="text-blue-500 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                公式サイトへ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 取扱カード一覧 */}
      <h2 className="text-xl font-semibold mb-4">取扱カード一覧</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カード名</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ランク</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終更新日時</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shop.cards.map((card, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap">
                  <Link href={`/card/${card.id}`} className="text-blue-500 hover:underline">
                    {card.name}
                  </Link>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">{card.rank}</td>
                <td className="py-4 px-4 whitespace-nowrap text-right">{card.price > 0 ? `${card.price.toLocaleString()}円` : '???'}</td>
                <td className="py-4 px-4 whitespace-nowrap">{card.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* おすすめショップ */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">その他のおすすめショップ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedShops.map(otherShop => (
            <Link href={`/shop/${otherShop.id}`} key={otherShop.id} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{otherShop.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{otherShop.description}</p>
                  <p className="text-blue-500 mt-2 text-sm">詳細を見る →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
