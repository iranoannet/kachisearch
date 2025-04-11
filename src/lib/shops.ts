export interface Shop {
  id: string;
  name: string;
  url: string;
  searchUrl: string;
}

export const CARD_SHOPS: Shop[] = [
  {
    id: 'cardrush',
    name: 'カードラッシュ',
    url: 'https://www.cardrush-pokemon.jp',
    searchUrl: 'https://www.cardrush-pokemon.jp/product-list?keyword={query}'
  },
  {
    id: 'surugaya',
    name: '駿河屋',
    url: 'https://www.suruga-ya.jp',
    searchUrl: 'https://www.suruga-ya.jp/search?category=1&search_word={query}'
  },
  {
    id: 'hareruya',
    name: '晴れる屋',
    url: 'https://www.hareruya2.com',
    searchUrl: 'https://www.hareruya2.com/search/q={query}'
  },
  {
    id: 'toretoku',
    name: 'トレトク',
    url: 'https://www.toretoku.jp',
    searchUrl: 'https://www.toretoku.jp/items/search?q={query}'
  },
  {
    id: 'yuyutei',
    name: '遊々亭',
    url: 'https://yuyu-tei.jp',
    searchUrl: 'https://yuyu-tei.jp/game_poc/sell/sell_price.php?name={query}'
  },
  {
    id: 'kanabell',
    name: 'カーナベル',
    url: 'https://www.ka-nabell.com',
    searchUrl: 'https://www.ka-nabell.com/search?q={query}'
  },
  {
    id: 'tcgshop193',
    name: 'TCGshop193',
    url: 'https://tcgshop193.com',
    searchUrl: 'https://tcgshop193.com/index.php?main_page=advanced_search_result&keyword={query}'
  },
  {
    id: 'bigweb',
    name: 'Bigweb',
    url: 'https://www.bigweb.co.jp',
    searchUrl: 'https://www.bigweb.co.jp/ver2/pokemon_list.php?search={query}'
  },
  {
    id: 'fullahead',
    name: 'フルアヘッド',
    url: 'https://www.fullahead.jp',
    searchUrl: 'https://www.fullahead.jp/search/index?keyword={query}'
  },
  {
    id: 'mercard',
    name: 'メルカード',
    url: 'https://www.mercard.jp',
    searchUrl: 'https://www.mercard.jp/search?q={query}'
  },
  {
    id: 'fukufuku',
    name: 'ふくふくトレカ',
    url: 'https://fukufuku-trading.com',
    searchUrl: 'https://fukufuku-trading.com/products/search?q={query}'
  },
  {
    id: 'torecajapan',
    name: 'トレカジパング',
    url: 'https://www.torecajapan.com',
    searchUrl: 'https://www.torecajapan.com/products/search?q={query}'
  },
  {
    id: 'cardlabo',
    name: 'カードラボ',
    url: 'https://www.c-labo-online.jp',
    searchUrl: 'https://www.c-labo-online.jp/product-list?keyword={query}'
  },
  {
    id: 'torecolo',
    name: 'トレコロ',
    url: 'https://www.torecolo.jp',
    searchUrl: 'https://www.torecolo.jp/shop/goods/search.aspx?keyword={query}'
  },
  {
    id: 'hanjou',
    name: 'はんじょう',
    url: 'https://www.cardshop-hanjou.jp',
    searchUrl: 'https://www.cardshop-hanjou.jp/products/search?q={query}'
  },
  {
    id: 'minny',
    name: 'minny',
    url: 'https://www.minny.jp',
    searchUrl: 'https://www.minny.jp/products/search?q={query}'
  },
  {
    id: 'serra',
    name: 'セラ',
    url: 'https://www.serra.jp',
    searchUrl: 'https://www.serra.jp/product-list?keyword={query}'
  },
  {
    id: 'cardmax',
    name: 'カードマックス',
    url: 'https://www.cardmax.jp',
    searchUrl: 'https://www.cardmax.jp/shop/goods/search.aspx?keyword={query}'
  }
];

export interface CardPrice {
  shopId: string;
  shopName: string;
  price: number;
  condition: string;
  url: string;
  lastUpdated: Date;
  timestamp: number;
  stock: {
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    quantity?: number;
  };
}

export interface CardInfo {
  id: string;
  name: string;
  rarity: string;
  expansion: string;
  cardNumber: string;
  imageUrl: string;
  prices: CardPrice[];
}

// キャッシュの有効期限（1時間）
const CACHE_EXPIRY = 60 * 60 * 1000;

export async function searchCards(query: string): Promise<CardInfo[]> {
  try {
    // 1. まずキャッシュから高速に結果を返す
    const cachedResults = await searchFromCache(query);
    if (cachedResults.length > 0) {
      // 2. バックグラウンドで最新データを取得
      updatePricesInBackground(query, cachedResults);
      return cachedResults;
    }

    // 3. キャッシュにない場合は実際に検索
    return await searchFromShops(query);
  } catch (error) {
    console.error('カード検索エラー:', error);
    throw error;
  }
}

// キャッシュのインターフェース
interface CacheEntry {
  data: CardInfo[];
  timestamp: number;
}

// メモリ内キャッシュ（本番環境ではRedisなどを使用）
const cache = new Map<string, CacheEntry>();

async function searchFromCache(query: string): Promise<CardInfo[]> {
  const cacheEntry = cache.get(query);
  if (!cacheEntry) return [];

  // キャッシュの有効期限をチェック
  if (Date.now() - cacheEntry.timestamp > CACHE_EXPIRY) {
    cache.delete(query);
    return [];
  }

  return cacheEntry.data;
}

async function updatePricesInBackground(query: string, cards: CardInfo[]) {
  // Web Workerを使用してバックグラウンドで処理
  if (typeof Worker !== 'undefined') {
    const worker = new Worker(new URL('../workers/priceUpdater.ts', import.meta.url));
    worker.postMessage({ query, shops: CARD_SHOPS });
    
    worker.onmessage = (event) => {
      const { prices } = event.data;
      // キャッシュを更新
      updateCache(query, cards, prices);
    };
  }
}

function updateCache(query: string, cards: CardInfo[], newPrices: CardPrice[]) {
  const updatedCards = cards.map(card => ({
    ...card,
    prices: [
      ...card.prices,
      ...newPrices
        .filter(p => p.shopId !== card.prices[0]?.shopId)
        .map(p => ({
          ...p,
          timestamp: Date.now()
        }))
    ]
  }));

  cache.set(query, {
    data: updatedCards,
    timestamp: Date.now()
  });
}

async function searchFromShops(query: string): Promise<CardInfo[]> {
  const allPrices: CardPrice[] = [];
  
  // 並列でスクレイピングを実行
  const promises = CARD_SHOPS.map(shop => scrapeShop(shop, query));
  const results = await Promise.allSettled(promises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allPrices.push(...result.value);
    } else {
      console.error(`${CARD_SHOPS[index].name}のスクレイピングに失敗:`, result.reason);
    }
  });

  // 商品ごとにグループ化
  const cardGroups = new Map<string, CardInfo>();
  
  allPrices.forEach(price => {
    const cardInfo = parseCardInfo(price.url);
    const key = `${cardInfo.name}-${cardInfo.rarity}-${cardInfo.expansion}`;
    
    if (!cardGroups.has(key)) {
      cardGroups.set(key, {
        id: key,
        ...cardInfo,
        cardNumber: '',  // スクレイピングから取得
        imageUrl: '',    // スクレイピングから取得
        prices: []
      });
    }
    
    cardGroups.get(key)?.prices.push(price);
  });

  // キャッシュに保存
  const cards = Array.from(cardGroups.values());
  cache.set(query, {
    data: cards,
    timestamp: Date.now()
  });

  return cards;
} 