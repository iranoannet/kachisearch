/**
 * 静的サイト生成のためのビルドスクリプト
 * スプレッドシートから取得したデータを使用して静的ページを生成します
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定
const DATA_DIR = path.join(__dirname, '../public/data');
const CARDS_FILE = path.join(DATA_DIR, 'cards.json');
const SHOPS_FILE = path.join(DATA_DIR, 'shops.json');
const CARD_IMAGES_DIR = path.join(__dirname, '../public/card-images');
const SHOP_IMAGES_DIR = path.join(__dirname, '../public/shop-images');

/**
 * JSONファイルからデータを読み込む
 */
function loadJson(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`JSONファイル読み込みエラー: ${error.message}`);
    return [];
  }
}

/**
 * Next.jsの静的サイトをビルドする
 */
function buildStaticSite() {
  try {
    console.log("Next.jsの静的サイトをビルドしています...");
    
    // プロジェクトルートディレクトリに移動してビルドコマンドを実行
    const projectRoot = path.resolve(__dirname, '..');
    execSync('npm run build', { 
      cwd: projectRoot,
      stdio: 'inherit' // コンソール出力を表示
    });
    
    console.log("ビルド成功");
    return true;
  } catch (error) {
    console.error(`ビルドエラー: ${error.message}`);
    return false;
  }
}

/**
 * 画像ディレクトリを準備する
 */
function prepareImageDirectories() {
  // カード画像ディレクトリの作成
  if (!fs.existsSync(CARD_IMAGES_DIR)) {
    fs.mkdirSync(CARD_IMAGES_DIR, { recursive: true });
  }
  
  // ショップ画像ディレクトリの作成
  if (!fs.existsSync(SHOP_IMAGES_DIR)) {
    fs.mkdirSync(SHOP_IMAGES_DIR, { recursive: true });
  }
  
  // プレースホルダー画像の作成
  const placeholderPath = path.join(CARD_IMAGES_DIR, 'placeholder.jpg');
  if (!fs.existsSync(placeholderPath)) {
    // 簡易的なプレースホルダー画像を作成（実際のプロジェクトでは適切な画像を用意）
    fs.writeFileSync(placeholderPath, 'placeholder');
  }
  
  const shopPlaceholderPath = path.join(SHOP_IMAGES_DIR, 'placeholder.jpg');
  if (!fs.existsSync(shopPlaceholderPath)) {
    // 簡易的なプレースホルダー画像を作成
    fs.writeFileSync(shopPlaceholderPath, 'placeholder');
  }
}

/**
 * データファイルを確認する
 */
function checkDataFiles() {
  // カードデータの読み込み
  const cards = loadJson(CARDS_FILE);
  const shops = loadJson(SHOPS_FILE);
  
  if (!cards.length || !shops.length) {
    console.log("データファイルが見つからないか空です");
    return false;
  }
  
  console.log(`データファイルを確認しました: カード数=${cards.length}, ショップ数=${shops.length}`);
  return true;
}

/**
 * メイン処理
 */
function main() {
  console.log("静的サイト生成処理を開始します");
  
  // 画像ディレクトリの準備
  prepareImageDirectories();
  
  // データファイルの確認
  if (!checkDataFiles()) {
    console.log("データファイルの確認に失敗しました");
    return;
  }
  
  // 静的サイトのビルド
  if (buildStaticSite()) {
    console.log("静的サイトの生成が完了しました");
    console.log(`出力ディレクトリ: ${path.resolve(__dirname, '../out')}`);
  } else {
    console.log("静的サイトの生成に失敗しました");
  }
}

// スクリプト実行
main();
