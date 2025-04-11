import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// Next.js 13+ App RouterではGETとPOSTを明示的にエクスポートする必要があります
export const GET = handler;
export const POST = handler; 