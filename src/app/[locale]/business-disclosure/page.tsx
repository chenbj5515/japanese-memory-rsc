export default function BusinessDisclosure() {
    return (
      <div className="min-h-screen bg-white text-[18px] leading-relaxed tracking-[0.4px]">
  
        {/* Main Content */}
        <div className="container mx-auto px-6 pt-8 pb-16 max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 text-left">特定商取引法に基づく表示</h1>
  
          <div className="space-y-8 text-gray-700 mt-16">
            <div>
              <h2 className="text-xl font-bold mb-4">■ 販売業者</h2>
              <p>陳百進</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 代表者</h2>
              <p>陳百進</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 住所</h2>
              <p>〒167-0051</p>
              <p>東京都杉並区荻窪5丁目22-8 藤和シティコープ荻窪401</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 電話番号</h2>
              <p>090-1176-6911</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ Eメールアドレス</h2>
              <p>
                <a href="mailto:chenbj55150220@gmail.com" className="text-blue-600 hover:underline">
                  chenbj55150220@gmail.com
                </a>
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ ホームページ</h2>
              <p>
                <a href="https://japanese-memory-rsc.vercel.app/home" className="text-blue-600 hover:underline">
                  https://japanese-memory-rsc.vercel.app/home
                </a>
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ サイト名</h2>
              <p>Bunn</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 商品の販売価格</h2>
              <p>月額5ドルのサブスクリプションサービス</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 商品代金以外の必要料金</h2>
              <p>特になし</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 支払方法</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>クレジットカード</li>
                <li>PayPay</li>
                <li>Alipay</li>
              </ul>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 支払い期限</h2>
              <p>お申し込み時に即時決済</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 商品のお届け期間</h2>
              <p>決済完了後、即時にサービスをご利用いただけます。</p>
            </div>
  
            <div>
              <h2 className="text-xl font-bold mb-4">■ 解約・返金について</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>サブスクリプションはいつでも解約可能です。</li>
                <li>解約後も当月内はサービスをご利用いただけます。</li>
                <li>既にお支払いいただいた料金の返金は対応いたしかねますので、ご了承ください。</li>
              </ul>
              <p>ご不明な点がございましたら、上記のEメールアドレスまでお気軽にお問い合わせください。</p>
            </div>
          </div>
        </div>
      </div>
    )
  }