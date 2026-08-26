import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (
    req.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = supabaseAdmin();

  const { data: users } = await db
    .from("profiles")
    .select("id");

  for (const u of users || []) {
    const [stats, money, tasks, body, posts] = await Promise.all([
      db.from("stats").select("*").eq("user_id", u.id).single(),
      db
        .from("money")
        .select("*")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false })
        .limit(30),
      db
        .from("tasks")
        .select("*")
        .eq("user_id", u.id)
        .eq("done", false)
        .limit(10),
      db
        .from("body_logs")
        .select("*")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false })
        .limit(7),
      db
        .from("posts")
        .select("*")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const snapshot = {
      stats: stats.data,
      money: money.data,
      tasks: tasks.data,
      body: body.data,
      posts: posts.data,
    };

    const analysis =
      "今日のMUNE LIFE RPGデータを確認しました。まずは現在のタスクを1つ完了し、身体・お金・発信のバランスを意識して行動しましょう。";

    await db.from("ai_daily").insert({
      user_id: u.id,
      analysis,
    });
  }

  return NextResponse.json({ ok: true });
}
