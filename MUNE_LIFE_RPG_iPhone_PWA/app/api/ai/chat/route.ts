import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    const stats = context?.stats || {};
    const money = context?.money || {};
    const postCount = context?.postCount || 0;

    const avg = Math.round(
      Object.values(stats).reduce(
        (a: number, b: unknown) => a + Number(b || 0),
        0
      ) / Math.max(Object.keys(stats).length, 1)
    );

    let answer = "";

    if (
      message.includes("買") ||
      message.includes("購入") ||
      message.includes("バイク") ||
      message.includes("お金")
    ) {
      answer =
        `【MUNE AI COACH｜購入判断】\n\n` +
        `今の総合ステータスは平均${avg}ptです。\n\n` +
        `購入前に「自由・挑戦・成長・経験・収入・楽しさ」の6項目で考えてください。\n\n` +
        `特に大きな買い物は、欲しいかどうかだけではなく、` +
        `その購入によって「人生経験」「発信」「将来の収入」が増えるかを確認するのがおすすめです。\n\n` +
        `今のあなたにとって重要なのは、買うこと自体ではなく、` +
        `買ったものを使って何を生み出すかです。\n\n` +
        `次の一手：\n` +
        `① 金額を確認\n` +
        `② 生活防衛資金を確認\n` +
        `③ その購入で増える経験・発信・収入を3つ書く\n` +
        `④ それでも価値があるなら購入候補にする`;
    } else if (
      message.includes("何") ||
      message.includes("すべき") ||
      message.includes("今日") ||
      message.includes("今")
    ) {
      answer =
        `【MUNE AI COACH｜今日の戦略】\n\n` +
        `現在の総合平均は${avg}ptです。\n\n` +
        `今日やることは、全部を頑張ることではありません。\n\n` +
        `優先順位は\n` +
        `1. BODY：身体を作る\n` +
        `2. EXPRESSION：1つ作品を作る\n` +
        `3. SELF RELIANCE：未来の収入につながる行動\n` +
        `4. LIFE EXPERIENCE：新しい経験\n` +
        `です。\n\n` +
        `疲れている場合は、まず回復を優先してください。\n\n` +
        `Sランクを目指すことより、「今日の自分が昨日より少し前進したか」を基準にしてください。`;
    } else if (
      message.includes("疲") ||
      message.includes("休") ||
      message.includes("しんど")
    ) {
      answer =
        `【MUNE AI COACH｜回復モード】\n\n` +
        `今日は無理に経験値を稼ぐ必要はありません。\n\n` +
        `疲労が強い状態でトレーニング・仕事・発信を無理に積み上げると、` +
        `長期的な成長効率が落ちます。\n\n` +
        `今日は「休むことも人生への投資」と考えてください。\n\n` +
        `最低限やるなら、睡眠・食事・水分・軽いストレッチを優先。\n\n` +
        `明日の自分が動きやすくなる選択をしてください。`;
    } else {
      answer =
        `【MUNE AI COACH】\n\n` +
        `現在の総合平均は${avg}ptです。\n` +
        `作品制作数は${postCount}件です。\n\n` +
        `MUNE LIFE RPGの判断基準は、` +
        `「自由・挑戦・楽しさ・つながり・成長」です。\n\n` +
        `短期的に得かどうかだけではなく、` +
        `その行動が将来の身体・経験・発信・人脈・収入につながるかを考えてください。\n\n` +
        `迷ったときは、` +
        `「これは未来の自分の選択肢を増やすか？」` +
        `を基準にすると判断しやすくなります。`;
    }

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      { error: "AI COACHの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
