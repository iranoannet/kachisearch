/**
 * スプレッドシートからデータを取得し、JSONファイルに保存するスクリプト
 * 1日3回実行することを想定しています
 */

const fs = require('fs');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// 認証情報の設定
const CREDENTIALS_FILE = path.join(__dirname, 'credentials.json'); // Google APIのサービスアカウント認証情報ファイル

// 出力先の設定
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const CARDS_FILE = path.join(OUTPUT_DIR, 'cards.json');
const SHOPS_FILE = path.join(OUTPUT_DIR, 'shops.json');

// スプレッドシートのID（複数のスプレッドシートを処理）
const SPREADSHEET_IDS = [
  'spreadsheet_id_1', // 実際のスプレッドシートIDに置き換えてください
  'spreadsheet_id_2', // 実際のスプレッドシートIDに置き換えてください
  // 必要に応じて追加
];

/**
 * Google Spreadsheet APIの認証を行う
 */
async function authenticateGoogleSheets() {
  try {
    const credentials = require(CREDENTIALS_FILE);
    const jwt = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return jwt;
  } catch (error) {
    console.error(`認証エラー: ${error.message}`);
    return null;
  }
}

/**
 * スプレッドシートからデータを取得する
 */
async function getSpreadsheetData(auth, spreadsheetId) {
  try {
    const doc = new GoogleSpreadsheet(spreadsheetId);
    await doc.useServiceAccountAuth(auth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0]; // 最初のシートを使用
    const rows = await sheet.getRows();
    
    return rows.map(row => {
      return {
        'A列': row['A列'] || '', // 商品ID
        'B列': row['B列'] || '', // 商品名
        'C列': row['C列'] || '', // コンディションランク
        'D列': row['D列'] || 0,  // 価格
        'E列': row['E列'] || '', // ショップ名
        'F列': row['F列'] || '', // カテゴリ
      };
    });
  } catch (error) {
    console.error(`スプレッドシート取得エラー: ${error.message}`);
    return [];
  }
}

/**
 * 取得したデータを処理してカードとショップの情報に変換する
 */
function processData(allData) {
  const cards = [];
  const shops = {};
  
  for (const item of allData) {
    // スプレッドシートの列に対応するデータを取得
    const cardId = String(item['A列'] || ''); // 商品ID
    const cardName = item['B列'] || '';       // 商品名
    const condition = item['C列'] || '';      // コンディションランク
    const price = parseInt(item['D列'] || 0); // 価格
    const shopName = item['E列'] || '';       // ショップ名
    const category = item['F列'] || '';       // カテゴリ
    
    // 画像パスの設定（商品IDと一致するファイル名）
    const imagePath = `/card-images/${cardId}.jpg`;
    
    // カード情報の作成
    const card = {
      id: cardId,
      name: cardName,
      condition: condition,
      price: price,
      shopName: shopName,
      category: category,
      imageUrl: imagePath,
      updatedAt: new Date().toLocaleString('ja-JP', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    cards.push(card);
    
    // ショップ情報の作成（ユニークなショップのみ）
    if (!shops[shopName]) {
      const shopId = shopName.toLowerCase().replace(/\s+/g, '-');
      shops[shopName] = {
        id: shopId,
        name: shopName,
        description: `${shopName}のトレーディングカードショップです。`,
        imageUrl: '/shop-images/placeholder.jpg'
      };
    }
  }
  
  return { cards, shops: Object.values(shops) };
}

/**
 * データをJSONファイルとして保存する
 */
function saveJson(data, filePath) {
  // ディレクトリが存在しない場合は作成
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
  fs.writeFileSync(
    filePath, 
    JSON.stringify(data, null, 2), 
    { encoding: 'utf8' }
  );
  console.log(`${filePath}にデータを保存しました`);
}

/**
 * メイン処理
 */
async function main() {
  console.log(`スプレッドシート同期処理を開始: ${new Date().toLocaleString()}`);
  
  // 認証
  const auth = await authenticateGoogleSheets();
  if (!auth) {
    return;
  }
  
  // 全スプレッドシートからデータを取得
  let allData = [];
  for (const spreadsheetId of SPREADSHEET_IDS) {
    const data = await getSpreadsheetData(auth, spreadsheetId);
    allData = allData.concat(data);
  }
  
  // データの処理
  const { cards, shops } = processData(allData);
  
  // JSONファイルとして保存
  saveJson(cards, CARDS_FILE);
  saveJson(shops, SHOPS_FILE);
  
  console.log(`スプレッドシート同期処理を完了: ${new Date().toLocaleString()}`);
  console.log(`カード数: ${cards.length}, ショップ数: ${shops.length}`);
}

// スクリプト実行
main().catch(error => {
  console.error(`エラーが発生しました: ${error.message}`);
  process.exit(1);
});
