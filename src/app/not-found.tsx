'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-blue-500 text-center mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 text-center mb-6">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="text-center">
          <Link
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors inline-block"
          >
            トップページに戻る
          </Link>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p className="text-center">
            URLを確認して、もう一度お試しください。
          </p>
          <p className="text-center mt-2">
            問題が解決しない場合は、
            <Link href="/contact" className="text-blue-500 hover:underline">
              お問い合わせ
            </Link>
            ください。
          </p>
        </div>
      </div>
    </div>
  );
} 