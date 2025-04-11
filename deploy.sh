#!/bin/bash

# 色の設定
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ログ関数
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] エラー: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] 警告: $1${NC}"
}

# デプロイ開始
log "デプロイを開始します..."

# 1. 依存関係のインストール
log "依存関係をインストールします..."
npm install
if [ $? -ne 0 ]; then
    error "依存関係のインストールに失敗しました"
    exit 1
fi

# 2. ビルド
log "Next.jsのビルドを開始します..."
npm run build
if [ $? -ne 0 ]; then
    error "ビルドに失敗しました"
    exit 1
fi

# 3. outディレクトリの内容を確認
if [ ! -d "out" ]; then
    error "outディレクトリが見つかりません"
    exit 1
fi

# 4. ファイルのコピー
log "ファイルをコピーします..."
cp -r out/* ../
if [ $? -ne 0 ]; then
    error "ファイルのコピーに失敗しました"
    exit 1
fi

# 5. パーミッションの設定
log "パーミッションを設定します..."
find .. -type d -exec chmod 705 {} \;
find .. -type f -exec chmod 604 {} \;

# 6. 特定のファイルのパーミッション設定
chmod 604 ../.htaccess
chmod 604 ../index.html

log "デプロイが完了しました" 