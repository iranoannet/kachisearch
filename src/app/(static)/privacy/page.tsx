'use client';

import React from 'react';
import Header from '../components/Header';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">プライバシーポリシー</h1>
          
          <div className="prose max-w-none">
            <p>カチサーチ（以下、「当サイト」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">第1条（個人情報）</h2>
            <p>「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">第2条（個人情報の収集方法）</h2>
            <p>当サイトは、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当サイトの提携先（情報提供元、広告主、広告配信先などを含みます。以下、｢提携先｣といいます。）などから収集することがあります。</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">第3条（個人情報を収集・利用する目的）</h2>
            <p>当サイトが個人情報を収集・利用する目的は、以下のとおりです。</p>
            <ol className="list-decimal pl-6 mt-2 mb-4">
              <li>当サイトサービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
              <li>ユーザーに対して、メールマガジン等の広告宣伝を行うため</li>
              <li>ユーザーに対して、当サイトの利用に関する連絡をするため</li>
              <li>当サイトサービスの改善、新サービス開発等の参考とするため</li>
              <li>上記の利用目的に付随する目的</li>
            </ol>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">第4条（個人情報の第三者提供）</h2>
            <p>当サイトは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。</p>
            <ol className="list-decimal pl-6 mt-2 mb-4">
              <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
              <li>予め次の事項を告知あるいは公表し、かつ当サイトが個人情報保護委員会に届出をしたとき</li>
            </ol>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">第5条（個人情報の開示）</h2>
            <p>当サイトは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">第6条（プライバシーポリシーの変更）</h2>
            <p>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。当サイトが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。</p>
            
            <p className="mt-8 text-right">以上</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            トップページに戻る
          </Link>
        </div>
      </main>
      
      <footer className="bg-white shadow-inner py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">© 2025 カチサーチ - トレカの相場が見えるサイト</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
                利用規約
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
                プライバシーポリシー
              </Link>
              <Link href="/login" className="text-gray-500 hover:text-gray-700 text-sm">
                管理者ログイン
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
