'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-red-500">カチサーチ</span>
            <span className="ml-2 text-sm text-gray-500">トレカの相場が見えるサイト</span>
          </Link>
          <nav>
            <Link
              href="/seller"
              className="inline-flex items-center text-gray-600 hover:text-red-500"
            >
              <Store className="mr-2 h-5 w-5" />
              <span>販売者募集</span>
            </Link>
          </nav>
        </div>
        <div className="py-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
