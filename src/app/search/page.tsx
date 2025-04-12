'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '../components/SearchResults';
import { CardPrice } from '../lib/shops';

export default function SearchPage() {
  const [results, setResults] = useState<CardPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('検索に失敗しました');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('検索エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `"${query}" の検索結果` : '商品検索'}
      </h1>
      <SearchResults results={results} isLoading={isLoading} />
    </div>
  );
} 