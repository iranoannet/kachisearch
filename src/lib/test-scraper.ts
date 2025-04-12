import { CARD_SHOPS } from './shops';
import { scrapeShop } from './scraper';

async function testCardLaboScraping() {
  const cardLabo = CARD_SHOPS.find(shop => shop.id === 'cardlabo');
  if (!cardLabo) {
    console.error('カードラボの設定が見つかりません');
    return;
  }

  try {
    console.log('カードラボのスクレイピングを開始します...');
    const results = await scrapeShop(cardLabo, 'ピカチュウ');
    console.log('スクレイピング結果:', results);
  } catch (error) {
    console.error('スクレイピングエラー:', error);
  }
}

testCardLaboScraping(); 