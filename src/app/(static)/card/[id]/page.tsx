import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

// サーバーサイドでデータを取得する関数
async function getCardData(id: string) {
  // 実際の実装ではデータベースやAPIからデータを取得
  // ここではモックデータを使用
  const mockCards = {
    'lizardon-chr': {
      id: 'lizardon-chr',
      name: 'リザードン [CHR]',
      cardNumber: '{187/184} [S8b]',
      imageUrl: '/card-images/lizardon.jpg',
      shops: [
        { id: 'kachaicha', name: 'カチャイチャ', rank: 'B-', price: 1200, updatedAt: '2024/01/01 18:00' },
        { id: 'torekaland', name: 'トレカランド', rank: 'B-', price: 1280, updatedAt: '2024/01/01 18:00' },
        { id: 'minny', name: 'minny', rank: 'B-', price: 1300, updatedAt: '2024/01/01 18:00' },
        { id: 'yugioh', name: '遊学会', rank: 'B+', price: 1400, updatedAt: '2024/01/01 18:00' },
        { id: 'hareru2', name: '晴れる屋2', rank: 'A', price: 1450, updatedAt: '2024/01/01 18:00' },
        { id: 'cardrush', name: 'カードラッシュ', rank: '-', price: 0, updatedAt: '-' },
      ]
    },
    'kiterugura-sr': {
      id: 'kiterugura-sr',
      name: 'キテルギュラ (SR)',
      cardNumber: '{XXX/XXX} [XXX]',
      imageUrl: '/card-images/placeholder.jpg',
      shops: [
        { id: 'kachaicha', name: 'カチャイチャ', rank: 'B', price: 380, updatedAt: '2024/01/01 18:00' },
        { id: 'torekaland', name: 'トレカランド', rank: 'B+', price: 400, updatedAt: '2024/01/01 18:00' },
      ]
    },
    // 他のカードデータ...
  };
  
  return mockCards[id as keyof typeof mockCards] || null;
}

// 静的エクスポートのために必要なgenerateStaticParams関数
export async function generateStaticParams() {
  // 静的に生成するカードIDのリスト
  return [
    { id: 'lizardon-chr' },
    { id: 'kiterugura-sr' },
    { id: 'lugia-sr' },
    { id: 'mew-star' },
    { id: 'blacky-ex-sar' }
  ];
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cardId = params.id;
  const card = await getCardData(cardId);
  
  if (!card) {
    return {
      title: 'カードが見つかりません - カチサーチ',
    };
  }
  
  return {
    title: `${card.name} ${card.cardNumber} - カチサーチ`,
    description: `${card.name}の最新価格情報。複数のショップの価格を比較できます。`,
  };
}

export default async function CardDetailPage({ params }: { params: { id: string } }) {
  const cardId = params.id;
  const card = await getCardData(cardId);

  if (!card) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-xl mb-4">カードが見つかりませんでした</div>
          <Link href="/" className="text-blue-500 hover:underline">
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  // 関連カードのモックデータ
  const relatedCards = [
    {
      id: 'kiterugura-sr',
      name: 'キテルギュラ (SR)',
      imageUrl: '/card-images/placeholder.jpg',
      price: 380
    },
    {
      id: 'lugia-sr',
      name: 'ルギア (SR)',
      imageUrl: '/card-images/placeholder.jpg',
      price: 288000
    },
    {
      id: 'mew-star',
      name: 'ミュウ (★)',
      imageUrl: '/card-images/placeholder.jpg',
      price: 24800
    },
    {
      id: 'blacky-ex-sar',
      name: 'ブラッキーex (SAR)',
      imageUrl: '/card-images/placeholder.jpg',
      price: 36800
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Top</Link>
        {' > '}
        <Link href="/" className="hover:underline">ポケモンカード</Link>
        {' > '}
        <span>{card.name}</span>
      </div>

      {/* カード名とカード番号 */}
      <h1 className="text-2xl font-bold mb-8">
        {card.name} {card.cardNumber}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* カード画像 */}
        <div className="flex justify-center">
          <div className="w-72 h-96 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
            {card.imageUrl !== '/card-images/placeholder.jpg' ? (
              <Image 
                src={card.imageUrl} 
                alt={card.name} 
                width={300} 
                height={400} 
                className="object-contain"
              />
            ) : (
              <div className="text-gray-400">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 価格情報 */}
        <div>
          <p className="text-sm text-gray-600 mb-4">
            ショップ名をクリックするとそのショップの商品ページに遷移できます。
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border text-left">ショップ名</th>
                  <th className="py-2 px-4 border text-left">ランク</th>
                  <th className="py-2 px-4 border text-right">金額</th>
                  <th className="py-2 px-4 border text-left">最終更新日時</th>
                </tr>
              </thead>
              <tbody>
                {card.shops.map((shop, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border">
                      <Link href={`/shop/${shop.id}`} className="text-blue-500 hover:underline">
                        {shop.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border">{shop.rank}</td>
                    <td className="py-2 px-4 border text-right">
                      {shop.price > 0 ? `${shop.price.toLocaleString()}円` : '???'}
                    </td>
                    <td className="py-2 px-4 border">{shop.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 関連カード */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">関連カード</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedCards.map(relatedCard => (
            <Link href={`/card/${relatedCard.id}`} key={relatedCard.id} className="block">
              <div className="border rounded overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate">{relatedCard.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {relatedCard.price.toLocaleString()}円〜
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
