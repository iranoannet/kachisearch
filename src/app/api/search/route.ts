import { NextResponse } from 'next/server';
import { searchCards } from '@/lib/shops';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: '検索キーワードを入力してください' },
        { status: 400 }
      );
    }

    const results = await searchCards(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('検索エラー:', error);
    return NextResponse.json(
      { error: '検索中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 