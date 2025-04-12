import Link from 'next/link';

export default function CompanyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Top</Link>
        {' > '}
        <span>会社概要</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">会社概要</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <table className="min-w-full">
            <tbody>
              <tr className="border-b">
                <th className="py-4 px-6 text-left bg-gray-50 w-1/4">会社名</th>
                <td className="py-4 px-6">テストA</td>
              </tr>
              <tr className="border-b">
                <th className="py-4 px-6 text-left bg-gray-50">事業内容</th>
                <td className="py-4 px-6">テストB</td>
              </tr>
              <tr>
                <th className="py-4 px-6 text-left bg-gray-50">連絡先情報</th>
                <td className="py-4 px-6">テストC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-500 hover:underline">
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
