 "use client";
export default function Install(){
 return <main style={{minHeight:"100vh",background:"#0b0d11",color:"#fff",padding:"24px",fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"}}>
 <div style={{maxWidth:680,margin:"0 auto"}}>
 <h1>🟨 MUNE LIFE RPG</h1>
 <p style={{color:"#aaa"}}>iPhoneのホーム画面に置くためのページ</p>
 <div style={{background:"#161a22",border:"1px solid #2b303b",borderRadius:18,padding:20}}>
 <h2>iPhone / Safari</h2>
 <ol style={{lineHeight:2}}>
  <li>このページをSafariで開く</li>
  <li>画面下部の<strong>共有ボタン（□↑）</strong>をタップ</li>
  <li><strong>「ホーム画面に追加」</strong>を選択</li>
  <li>右上の<strong>「追加」</strong>をタップ</li>
  <li>ホーム画面の「MUNE LIFE RPG」をタップ</li>
 </ol>
 <p style={{color:"#f0c75e"}}>以後はホーム画面からアプリのように起動できます。</p>
 </div>
 <div style={{marginTop:18,background:"#211e17",border:"1px solid #514a3a",borderRadius:14,padding:16}}>
 <b>重要</b>
 <p>AI・クラウド同期・通知・カレンダー連携を実際に有効化するには、公開環境側でOpenAI / Supabase / Google Calendar / Pushの接続設定が必要です。このPWA化では、iPhone側の難しい設定を不要にすることを優先しています。</p>
 </div>
 </div>
 </main>
}