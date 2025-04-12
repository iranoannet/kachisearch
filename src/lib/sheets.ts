import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// 環境変数から認証情報を取得
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// 認証クライアントを取得
async function getAuthClient() {
  try {
    return new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  } catch (error) {
    console.error('Error creating auth client:', error);
    throw error;
  }
}

// スプレッドシートからデータを取得
export async function getSpreadsheetData() {
  try {
    // 環境変数のチェック
    if (!SPREADSHEET_ID) {
      throw new Error('スプレッドシートIDが設定されていません');
    }
    if (!CLIENT_EMAIL) {
      throw new Error('クライアントメールアドレスが設定されていません');
    }
    if (!PRIVATE_KEY) {
      throw new Error('秘密鍵が設定されていません');
    }

    console.log('環境変数:', {
      SPREADSHEET_ID,
      CLIENT_EMAIL,
      HAS_PRIVATE_KEY: !!PRIVATE_KEY,
    });

    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    const range = 'sale!A1:G'; // A列からG列まで

    console.log('スプレッドシートからデータを取得中:', SPREADSHEET_ID);
    console.log('対象範囲:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    if (!response.data) {
      throw new Error('スプレッドシートからのレスポンスが空です');
    }

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('スプレッドシートにデータが見つかりません');
    }

    if (rows.length === 1) {
      throw new Error('スプレッドシートにヘッダー行しかありません');
    }

    // ヘッダー行を取得
    const headers = rows[0];
    console.log('取得したヘッダー:', headers);

    // データ行を処理
    const data = rows.slice(1).map((row, index) => {
      console.log(`行${index + 1}のデータ:`, row);
      const item: any = {
        id: (index + 1).toString(),
      };

      headers.forEach((header: string, i: number) => {
        if (!row[i]) {
          console.warn(`警告: 行${index + 1}の${header}が空です`);
        }

        switch (header) {
          case '商品名':
            item.name = row[i] || '';
            break;
          case '価格':
            const price = parseInt(row[i], 10);
            if (isNaN(price)) {
              console.warn(`警告: 行${index + 1}の価格が数値ではありません: ${row[i]}`);
            }
            item.price = price || 0;
            break;
          case 'コンディション':
            item.condition = row[i] || 'A';
            item.points = parseInt(row[i], 10) || 0;  // 還元ポイントを取得
            break;
          case 'ショップ名':
            item.shopName = row[i] || '';
            break;
          case 'カテゴリ':
            item.category = row[i].replace('シャドウバース', 'シャドバ') || '';  // カテゴリ名の置換
            break;
          case '商品URL':
            item.url = row[i] || '';
            break;
        }
      });

      return item;
    });

    console.log('処理完了。取得したデータ数:', data.length);
    return data;
  } catch (error) {
    console.error('スプレッドシートデータ取得エラー:', error);
    throw new Error(`スプレッドシートデータ取得エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

// データの型定義
export interface ProductData {
  productId: string;      // 商品ID（A列）
  name: string;          // 商品名（B列）
  condition: string;     // コンディション（C列）
  points: number;        // 還元ポイント（C列）
  price: number;         // 価格（D列）
  shopName: string;      // ショップ名（E列）
  category: string;      // カテゴリ（F列）
  url: string;          // 商品ページのURL（G列）
}

// スプレッドシートのデータを整形する関数
export function formatSpreadsheetData(rawData: any[][]) {
  // ヘッダー行を除外してデータを処理
  const [headers, ...rows] = rawData;

  return rows.map((row) => {
    const product: ProductData = {
      productId: row[0]?.toString() || '',
      name: row[1]?.toString() || '',
      condition: row[2]?.toString() || '',
      points: parseInt(row[2] || '0', 10),  // C列から還元ポイントを取得
      price: parseInt(row[3] || '0', 10),
      shopName: row[4]?.toString() || '',
      category: row[5]?.toString() || '',
      url: row[6]?.toString() || ''
    };
    return product;
  });
} 