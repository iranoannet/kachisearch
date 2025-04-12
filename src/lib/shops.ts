import { scrapeShop } from './scraper';
import { CheerioAPI } from 'cheerio';

export interface Card {
  name: string;
  price: number;
  imageUrl: string;
  rarity: string;
  shop: string;
}

export interface Shop {
  id: string;
  name: string;
  url: string;
  searchUrl: string | ((query: string) => string);
  scrape?: ($: CheerioAPI) => Card[];
}

export const CARD_SHOPS: Shop[] = [
  {
    id: 'cardlabo',
    name: 'カードラボ',
    url: 'https://www.c-labo-online.jp',
    searchUrl: (query: string) => `https://www.c-labo-online.jp/product-list?keyword=${encodeURIComponent(query)}&Submit=`,
    scrape: ($: CheerioAPI) => {
      const cards: Card[] = [];
      $('.list_item').each((_, element) => {
        const $item = $(element);
        const name = $item.find('h2.item_name a').text().trim();
        const priceText = $item.find('.selling_price').text().trim();
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
        const imageUrl = $item.find('.global_photo img').attr('src') || '';
        const soldOut = $item.find('.soldout').length > 0;
        const stockText = $item.find('.stock_number').text().trim();
        const stockMatch = stockText.match(/在庫数\s*(\d+)枚/);
        const stockQuantity = stockMatch ? parseInt(stockMatch[1], 10) : 0;
        
        console.log('Found card:', {
          name,
          price,
          imageUrl,
          soldOut,
          stockQuantity,
          stockText
        });
        
        if (name && !isNaN(price)) {
          cards.push({
            name,
            price,
            imageUrl,
            rarity: '', // レアリティ情報は後で追加
            shop: 'カードラボ'
          });
        }
      });
      
      console.log(`Total cards found: ${cards.length}`);
      return cards;
    }
  }
];

export interface CardPrice {
  shopId: string;
  shopName: string;
  name: string;
  price: number;
  condition: string;
  url: string;
  lastUpdated: Date;
  timestamp: number;
  stock: {
    status: 'in_stock' | 'out_of_stock';
    quantity: number;
  };
  rarity?: string;
  imageUrl?: string;
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
    const results = await searchFromShops(query);
    return results;
  } catch (error) {
    console.error('検索エラー:', error);
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
  const results: CardInfo[] = [];
  const seenNames = new Set<string>();

  for (const shop of CARD_SHOPS) {
    try {
      const prices = await scrapeShop(shop, query);
      
      for (const price of prices) {
        if (!seenNames.has(price.name)) {
          seenNames.add(price.name);
          results.push({
            id: `${shop.id}-${price.name}`,
            name: price.name,
            rarity: price.rarity || '',
            expansion: price.expansion || '',
            cardNumber: price.cardNumber || '',
            imageUrl: '',
            prices: [price]
          });
        } else {
          const existingCard = results.find(card => card.name === price.name);
          if (existingCard) {
            existingCard.prices.push(price);
          }
        }
      }
    } catch (error) {
      console.error(`${shop.name}の検索エラー:`, error);
    }
  }

  // 価格でソート
  results.sort((a, b) => {
    const minPriceA = Math.min(...a.prices.map(p => p.price));
    const minPriceB = Math.min(...b.prices.map(p => p.price));
    return minPriceA - minPriceB;
  });

  return results;
} 