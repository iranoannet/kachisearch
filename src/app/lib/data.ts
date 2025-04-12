// データ型の定義
export interface Card {
  id: string;
  name: string;
  cardNumber: string;
  imageUrl: string;
  status: string;
  price: number;
  shopName: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// モックデータ
const mockCards: Card[] = [
  {
    id: 'lizardon-chr',
    name: 'リザードン [CHR]',
    cardNumber: '{187/184} [S8b]',
    imageUrl: '/card-images/lizardon.jpg',
    status: 'B-',
    price: 1200,
    shopName: 'カチャイチャ',
    updatedAt: '2024/01/01 18:00'
  },
  {
    id: 'kiterugura-sr',
    name: 'キテルギュラ (SR)',
    cardNumber: '{XXX/XXX} [XXX]',
    imageUrl: '/card-images/placeholder.jpg',
    status: 'B',
    price: 380,
    shopName: 'カチャイチャ',
    updatedAt: '2024/01/01 18:00'
  },
  {
    id: 'lugia-sr',
    name: 'ルギア (SR)',
    cardNumber: '{XXX/XXX} [XXX]',
    imageUrl: '/card-images/placeholder.jpg',
    status: 'A',
    price: 288000,
    shopName: 'カチャイチャ',
    updatedAt: '2024/01/01 18:00'
  },
  {
    id: 'mew-star',
    name: 'ミュウ (★)',
    cardNumber: '{XXX/XXX} [XXX]',
    imageUrl: '/card-images/placeholder.jpg',
    status: 'B+',
    price: 24800,
    shopName: 'カチャイチャ',
    updatedAt: '2024/01/01 18:00'
  },
  {
    id: 'blacky-ex-sar',
    name: 'ブラッキーex (SAR)',
    cardNumber: '{XXX/XXX} [XXX]',
    imageUrl: '/card-images/placeholder.jpg',
    status: 'A-',
    price: 36800,
    shopName: 'カチャイチャ',
    updatedAt: '2024/01/01 18:00'
  },
];

const mockShops: Shop[] = [
  {
    id: 'kachaicha',
    name: 'カチャイチャ',
    description: 'トレーディングカード専門店。ポケモンカードを中心に幅広い商品を取り扱っています。',
    imageUrl: '/shop-images/placeholder.jpg'
  },
  {
    id: 'torekaland',
    name: 'トレカランド',
    description: '全国展開のトレーディングカードショップ。豊富な在庫と安定した価格が特徴です。',
    imageUrl: '/shop-images/placeholder.jpg'
  },
  {
    id: 'minny',
    name: 'minny',
    description: 'オンライン専門のトレカショップ。迅速な発送と丁寧な梱包が評判です。',
    imageUrl: '/shop-images/placeholder.jpg'
  },
  {
    id: 'yugioh',
    name: '遊学会',
    description: '老舗のトレーディングカードショップ。買取価格の高さで人気があります。',
    imageUrl: '/shop-images/placeholder.jpg'
  },
  {
    id: 'hareru2',
    name: '晴れる屋2',
    description: '大型のトレーディングカードショップ。品揃えの豊富さが特徴です。',
    imageUrl: '/shop-images/placeholder.jpg'
  },
];

// データ取得関数
export async function getCardData(id: string) {
  // 実際の実装ではデータベースやAPIからデータを取得
  const cardData = mockCards.find(card => card.id === id);
  
  if (!cardData) {
    return null;
  }
  
  // 同じカードの他店舗での価格情報も取得
  const shopPrices = mockCards
    .filter(card => card.id === id)
    .map(card => ({
      shopId: mockShops.find(shop => shop.name === card.shopName)?.id || '',
      shopName: card.shopName,
      status: card.status,
      price: card.price,
      updatedAt: card.updatedAt
    }));
  
  return {
    id: cardData.id,
    name: cardData.name,
    cardNumber: cardData.cardNumber,
    imageUrl: cardData.imageUrl,
    shops: shopPrices
  };
}

export async function getShopData(id: string) {
  // 実際の実装ではデータベースやAPIからデータを取得
  const shopData = mockShops.find(shop => shop.id === id);
  
  if (!shopData) {
    return null;
  }
  
  // このショップで取り扱っているカード情報も取得
  const shopCards = mockCards
    .filter(card => card.shopName === shopData.name)
    .map(card => ({
      id: card.id,
      name: card.name,
      rank: card.status,
      price: card.price,
      updatedAt: card.updatedAt
    }));
  
  return {
    id: shopData.id,
    name: shopData.name,
    description: shopData.description,
    imageUrl: shopData.imageUrl,
    cards: shopCards
  };
}

export async function getRecentCards() {
  // 実際の実装ではユーザーの閲覧履歴などからデータを取得
  // ここではモックデータの最初の5件を返す
  return mockCards.slice(0, 5).map(card => ({
    id: card.id,
    name: card.name,
    imageUrl: card.imageUrl,
    price: card.price
  }));
}

export async function getRecommendedShops() {
  // 実際の実装では人気のショップなどからデータを取得
  // ここではモックデータの最初の3件を返す
  return mockShops.slice(0, 3).map(shop => ({
    id: shop.id,
    name: shop.name,
    imageUrl: shop.imageUrl,
    description: shop.description
  }));
}

export async function searchCards(query: string) {
  // 実際の実装ではデータベースやAPIからデータを検索
  // ここではモックデータから名前に検索クエリが含まれるカードを返す
  return mockCards
    .filter(card => card.name.toLowerCase().includes(query.toLowerCase()))
    .map(card => ({
      id: card.id,
      name: card.name,
      imageUrl: card.imageUrl,
      price: card.price
    }));
}
