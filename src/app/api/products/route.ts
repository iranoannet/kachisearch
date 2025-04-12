import { NextResponse } from 'next/server';
import { getSpreadsheetData } from '@/lib/sheets';

// 1時間のキャッシュを設定
export const revalidate = 3600;

export async function GET() {
  try {
    console.log('API route called: /api/products');
    
    const data = await getSpreadsheetData();
    
    // データを配列として返す
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600', // 1時間キャッシュ
      },
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: '商品データの取得に失敗しました' },
      { status: 500 }
    );
  }
} 