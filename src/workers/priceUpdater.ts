import { scrapeShop } from '../lib/scraper';
import type { Shop, CardPrice } from '../lib/shops';

// 並列処理の設定
const MAX_CONCURRENT_REQUESTS = 3;
const REQUEST_DELAY = 1000;

// チャンク分割関数
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// ショップの処理を実行する関数
const processShop = async (shop: Shop, query: string): Promise<CardPrice[]> => {
  try {
    const prices = await scrapeShop(shop, query);
    return prices;
  } catch (error) {
    console.error(`${shop.name}のスクレイピングエラー:`, error);
    return [];
  }
};

// Web Worker内のメインスレッド
self.onmessage = async (event) => {
  const { query, shops } = event.data as { query: string; shops: Shop[] };
  
  try {
    const allPrices: CardPrice[] = [];
    const shopChunks = chunkArray(shops, MAX_CONCURRENT_REQUESTS);
    
    for (const chunk of shopChunks) {
      // 並列処理の実行
      const results = await Promise.all(
        chunk.map(shop => processShop(shop, query))
      );
      
      // 結果の集計と進捗報告
      results.forEach((prices, index) => {
        allPrices.push(...prices);
        self.postMessage({
          type: 'progress',
          shopId: chunk[index].id,
          prices,
          progress: Math.round((allPrices.length / shops.length) * 100)
        });
      });
      
      // チャンク間の待機
      if (shopChunks.indexOf(chunk) < shopChunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
      }
    }
    
    // 最終結果を送信
    self.postMessage({
      type: 'complete',
      prices: allPrices,
      totalShops: shops.length,
      successCount: allPrices.length
    });
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}; 