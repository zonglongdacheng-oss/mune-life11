import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    const stats = context?.stats || {};
    const money = context?.money || {};

    const text = String(message || "").toLowerCase();

    let answer = "";

    if (
      text.includes("買") ||
      text.includes("購入") ||
      text.includes("お金") ||
      text.includes("高い")
    ) {
      const income = Number(money.income || 0);
      const expense = Number(money.expense || 0);
      const balance = income - expense;

      answer = `
購入判断をします。

まず見るべきなのは「欲しいか」ではなく、
その支出が未来の自由を増やすかどうかです。

現在の収支：
収入 ¥${income.toLocaleString()}
支出 ¥${expense.toLocaleString()}
収支 ¥${balance.toLocaleString()}

判断基準は、

① 自由が増えるか
② 将来の収入につながるか
③ コンテンツになるか
④ 人生経験が増えるか
⑤ 身体・外見・能力が成長するか
⑥ 継続的に使うか
⑦ 今買う必要があるか

この7項目です。

特に「買ったものそのもの」より、
それを使って何を生み出せるかを重視してください。

迷う場合は、
「今すぐ買う」
「30日待つ」
「安い代替案を使う」
の3択で比較するのがおすすめです。
`.trim();
    } else if (
      text.includes("何") ||
      text.includes("今日") ||
      text.includes("すべき") ||
      text.includes("やる")
    ) {
      const body = Number(stats.BODY || 0);
      const expression = Number(stats.EXPRESSION || 0);
      const freedom = Number(stats.FREEDOM || 0);
      const challenge = Number(stats.CHALLENGE || 0);

      if (body < 50) {
        answer =
          "今日はBODYを優先。トレーニング、食事、睡眠のどれか1つを確実に改善してください。";
      } else if (expression < 50) {
        answer =
          "今日はEXPRESSIONを優先。完成度を気にせず、投稿または作品を1つ作りましょう。";
      } else if (freedom < 50 || challenge < 50) {
        answer =
          "今日はFREEDOM / CHALLENGEを優先。新しい場所・体験・撮影など、未来のコンテンツになる行動を1つしてください。";
      } else {
        answer =
          "今日は「人生そのものをコンテンツにする行動」を1つしてください。旅、撮影、アクティビティ、人との出会いなどがおすすめです。";
      }
    } else {
      answer = `
MUNE LIFE RPGの判断基準では、

「自由」
「挑戦」
「成長」
「人生経験」
「つながり」
「発信」
「将来の収入」

のどれを増やせるかを考えます。

短期的に楽しいだけではなく、
その行動が未来の自分の選択肢を増やすかを見てください。

迷ったら、
「これを1年続けたら、自分の人生はどう変わるか？」
と考えるのがおすすめです。
`.trim();
    }

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "AIコーチに接続できませんでした。",
      },
      { status: 500 }
    );
  }
}
