#!/usr/bin/env node

/**
 * Xserverでの定期実行用スクリプト
 * crontabに登録して1日3回実行することを想定しています
 */

const { execSync } = require('child_process');
const path = require('path');

// スクリプトのディレクトリパス
const SCRIPTS_DIR = __dirname;

// 実行時間をログに記録
console.log(`===== ${new Date().toLocaleString()} スプレッドシート同期処理開始 =====`);

try {
  // スプレッドシートからデータを取得
  console.log('スプレッドシートからデータを取得中...');
  execSync(`node ${path.join(SCRIPTS_DIR, 'sync-spreadsheet.js')}`, { stdio: 'inherit' });
  
  // 静的サイトを生成
  console.log('静的サイトを生成中...');
  execSync(`node ${path.join(SCRIPTS_DIR, 'build-static-site.js')}`, { stdio: 'inherit' });
  
  // 実行完了をログに記録
  console.log(`===== ${new Date().toLocaleString()} スプレッドシート同期処理完了 =====`);
} catch (error) {
  console.error(`エラーが発生しました: ${error.message}`);
  process.exit(1);
}
