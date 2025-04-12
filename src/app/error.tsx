'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに出力
    console.error('エラーが発生しました:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-red-500 text-center mb-4">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          エラーが発生しました
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {error.message || 'ページの読み込み中にエラーが発生しました。'}
        </p>
        <div className="text-center">
          <button
            onClick={reset}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            もう一度試す
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p className="text-center">エラー詳細:</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
            {error.stack || error.toString()}
          </pre>
        </div>
      </div>
    </div>
  );
} 