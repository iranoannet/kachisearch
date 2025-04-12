import * as cheerio from 'cheerio';
import { Shop, CardPrice, CardInfo } from './shops';
import { saveCard } from './db';
import puppeteer from 'puppeteer';

// AIによる商品情報の解析
async function analyzeProductInfo(name: string, html: string): Promise<Partial<CardInfo>> {
  try {
    // 商品名からカードの種類、レアリティ、拡張セットを解析
    const cardInfo: Partial<CardInfo> = {
      name,
      rarity: '',
      expansion: '',
      cardNumber: ''
    };

    // レアリティの判定
    if (name.includes('SAR')) {
      cardInfo.rarity = 'SAR';
    } else if (name.includes('SR')) {
      cardInfo.rarity = 'SR';
    } else if (name.includes('RR')) {
      cardInfo.rarity = 'RR';
    } else if (name.includes('R')) {
      cardInfo.rarity = 'R';
    } else if (name.includes('C')) {
      cardInfo.rarity = 'C';
    }

    // 拡張セットの判定
    if (name.includes('SV')) {
      cardInfo.expansion = 'スカーレット&バイオレット';
    } else if (name.includes('XY')) {
      cardInfo.expansion = 'XY';
    }

    // カード番号の抽出
    const numberMatch = name.match(/(\d+\/\d+)/);
    if (numberMatch) {
      cardInfo.cardNumber = numberMatch[1];
    }

    return cardInfo;
  } catch (error) {
    console.error('商品情報の解析エラー:', error);
    return { name };
  }
}

export async function scrapeShop(shop: Shop, query: string): Promise<CardPrice[]> {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const searchUrl = typeof shop.searchUrl === 'function' ? shop.searchUrl(query) : shop.searchUrl.replace('{query}', query);
    
    console.log(`[スクレイピング開始] ${shop.name} - URL: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle0' });
    
    // 商品一覧が表示されるまで待機
    await page.waitForSelector('.list_item');
    
    // ページ内の商品情報を取得
    const cards = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.list_item'));
      return items.map(item => {
        const nameElement = item.querySelector('h2.item_name a');
        const priceElement = item.querySelector('.selling_price');
        const imageElement = item.querySelector('.global_photo img');
        const stockElement = item.querySelector('.stock_number');
        
        return {
          name: nameElement?.textContent?.trim() || '',
          price: parseInt((priceElement?.textContent || '0').replace(/[^0-9]/g, '')) || 0,
          imageUrl: imageElement?.getAttribute('src') || '',
          url: nameElement?.getAttribute('href') || '',
          stockText: stockElement?.textContent?.trim() || ''
        };
      });
    });
    
    console.log(`[スクレイピング結果] ${shop.name}: ${cards.length}件の商品が見つかりました`);
    cards.forEach((card, index) => {
      console.log(`${index + 1}. ${card.name} - ${card.price}円`);
    });
    
    await browser.close();
    
    return cards.map(card => ({
      shopId: shop.id,
      shopName: shop.name,
      name: card.name,
      price: card.price,
      condition: '新品',
      url: new URL(card.url, shop.url).toString(),
      lastUpdated: new Date(),
      timestamp: Date.now(),
      stock: {
        status: card.stockText.includes('在庫なし') ? 'out_of_stock' : 'in_stock',
        quantity: parseInt(card.stockText.match(/(\d+)枚/)?.[1] || '0', 10)
      },
      imageUrl: card.imageUrl.startsWith('http') ? card.imageUrl : new URL(card.imageUrl, shop.url).toString()
    }));
    
  } catch (error) {
    console.error(`[エラー] ${shop.name}のスクレイピングエラー:`, error);
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