import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Top</Link>
        {' > '}
        <span>利用規約</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">利用規約</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">第1条（適用）</h2>
            <p className="mb-4">
              本規約は、ユーザーが本サービス「カチサーチ」を利用する際の一切の行為に適用されます。
              ユーザーは、本規約に同意することにより、本サービスを利用することができます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">第2条（禁止事項）</h2>
            <p className="mb-4">
              ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">法令または公序良俗に違反する行為</li>
              <li className="mb-2">犯罪行為に関連する行為</li>
              <li className="mb-2">本サービスの運営を妨害する行為</li>
              <li className="mb-2">他のユーザーに迷惑をかける行為</li>
              <li className="mb-2">他のユーザーに成りすます行為</li>
              <li className="mb-2">当社のサーバーまたはネットワークに過度の負担をかける行為</li>
              <li className="mb-2">当社のサービスの運営を妨害するおそれのある行為</li>
              <li className="mb-2">その他、当社が不適切と判断する行為</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">第3条（免責事項）</h2>
            <p className="mb-4">
              当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
              本サービスで提供される価格情報は参考情報であり、実際の取引価格を保証するものではありません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">第4条（サービス内容の変更・停止）</h2>
            <p className="mb-4">
              当社は、ユーザーに通知することなく、本サービスの内容を変更または本サービスの提供を停止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第5条（利用規約の変更）</h2>
            <p className="mb-4">
              当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。
              本規約の変更後、本サービスの利用を継続した場合、ユーザーは変更後の規約に同意したものとみなされます。
            </p>
          </section>
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
