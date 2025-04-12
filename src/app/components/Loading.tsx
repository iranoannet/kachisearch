'use client';

interface LoadingProps {
  error?: string;
  progress?: number;
}

export default function Loading({ error, progress }: LoadingProps = {}) {
  return (
    <div className="flex flex-col justify-center items-center h-32 p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      {progress !== undefined && (
        <div className="w-64 bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      <span className="text-center text-gray-700">
        {error || 'データを取得中です...'}
      </span>
    </div>
  );
} 