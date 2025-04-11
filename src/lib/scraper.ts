import * as cheerio from 'cheerio';
import { Shop, CardPrice, CardInfo } from './shops';

export async function scrapeShop(shop: Shop, query: string): Promise<CardPrice[]> {
  try {
    const searchUrl = shop.searchUrl.replace('{query}', encodeURIComponent(query));
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const prices: CardPrice[] = [];

    const getStockStatus = (quantity: number | undefined): CardPrice['stock'] => {
      if (quantity === undefined) {
        return { status: 'in_stock' };
      }
      if (quantity === 0) {
        return { status: 'out_of_stock' };
      }
      if (quantity <= 3) {
        return { status: 'low_stock', quantity };
      }
      return { status: 'in_stock', quantity };
    };

    switch (shop.id) {
      case 'cardrush':
        $('.product-list-item').each((_, el) => {
          const name = $(el).find('.product-name').text().trim();
          const priceText = $(el).find('.product-price').text().trim();
          const condition = $(el).find('.product-condition').text().trim();
          const url = $(el).find('a').attr('href');
          const stockText = $(el).find('.product-stock').text().trim();
          const quantity = stockText ? parseInt(stockText.replace(/[^0-9]/g, '')) : undefined;

          if (name && priceText && url) {
            prices.push({
              shopId: shop.id,
              shopName: shop.name,
              price: parseInt(priceText.replace(/[^0-9]/g, '')),
              condition,
              url: new URL(url, shop.url).toString(),
              lastUpdated: new Date(),
              timestamp: Date.now(),
              stock: getStockStatus(quantity)
            });
          }
        });
        break;

      case 'surugaya':
        $('.item_box').each((_, el) => {
          const name = $(el).find('.item_name').text().trim();
          const priceText = $(el).find('.price').text().trim();
          const condition = $(el).find('.condition').text().trim();
          const url = $(el).find('a').attr('href');
          const stockText = $(el).find('.stock').text().trim();
          const quantity = stockText ? parseInt(stockText.replace(/[^0-9]/g, '')) : undefined;

          if (name && priceText && url) {
            prices.push({
              shopId: shop.id,
              shopName: shop.name,
              price: parseInt(priceText.replace(/[^0-9]/g, '')),
              condition,
              url: new URL(url, shop.url).toString(),
              lastUpdated: new Date(),
              timestamp: Date.now(),
              stock: getStockStatus(quantity)
            });
          }
        });
        break;

      case 'hareruya':
        $('.item_list').each((_, el) => {
          const name = $(el).find('.item_name').text().trim();
          const priceText = $(el).find('.price').text().trim();
          const condition = $(el).find('.condition').text().trim();
          const url = $(el).find('a').attr('href');
          const stockText = $(el).find('.stock').text().trim();
          const quantity = stockText ? parseInt(stockText.replace(/[^0-9]/g, '')) : undefined;

          if (name && priceText && url) {
            prices.push({
              shopId: shop.id,
              shopName: shop.name,
              price: parseInt(priceText.replace(/[^0-9]/g, '')),
              condition,
              url: new URL(url, shop.url).toString(),
              lastUpdated: new Date(),
              timestamp: Date.now(),
              stock: getStockStatus(quantity)
            });
          }
        });
        break;

      case 'yuyutei':
        $('.card_list_box').each((_, el) => {
          const name = $(el).find('.card_name').text().trim();
          const priceText = $(el).find('.price').text().trim();
          const condition = $(el).find('.condition').text().trim();
          const url = $(el).find('a').attr('href');
          const stockText = $(el).find('.stock').text().trim();
          const quantity = stockText ? parseInt(stockText.replace(/[^0-9]/g, '')) : undefined;

          if (name && priceText && url) {
            prices.push({
              shopId: shop.id,
              shopName: shop.name,
              price: parseInt(priceText.replace(/[^0-9]/g, '')),
              condition,
              url: new URL(url, shop.url).toString(),
              lastUpdated: new Date(),
              timestamp: Date.now(),
              stock: getStockStatus(quantity)
            });
          }
        });
        break;

      // 他のショップも同様に実装
      // 各ショップのHTMLセレクタは実際のサイトを確認して調整が必要
    }

    return prices;
  } catch (error) {
    console.error(`${shop.name}のスクレイピングエラー:`, error);
    return [];
  }
}

export function parseCardInfo(name: string): Partial<CardInfo> {
  // カード名からレアリティや拡張セットを抽出
  const matches = name.match(/^(.+?)(?:\s*[\[（(]([^）)\]]+)[\]）)])?(?:\s*[（(]([^）)]+)[）)])?$/);
  
  if (!matches) {
    return { name };
  }

  const [, baseName, rarity, expansion] = matches;
  return {
    name: baseName.trim(),
    rarity: rarity?.trim(),
    expansion: expansion?.trim()
  };
} 