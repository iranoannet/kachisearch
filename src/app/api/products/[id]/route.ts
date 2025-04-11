import { NextResponse } from 'next/server';
import { getSpreadsheetData } from '@/lib/sheets';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // スプレッドシートからデータを取得
    const data = await getSpreadsheetData();
    
    // IDに一致する商品を検索
    const product = data.find(item => item.id === params.id);
    
    if (!product) {
      return new NextResponse(JSON.stringify({ error: '商品が見つかりません' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600', // 1時間キャッシュ
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new NextResponse(JSON.stringify({ error: '商品の取得に失敗しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 