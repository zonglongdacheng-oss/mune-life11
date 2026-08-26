"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_STATS,
  STAT_KEYS,
  STAT_LABEL,
  rank,
  level,
  levelTitle,
} from "@/lib/rpg";

type Stats = Record<string, number>;

type Task = {
  text: string;
  changes: Stats;
  xpText: string;
  done: boolean;
};

type ChatMessage = {
  role: string;
  text: string;
};

type EventRecord = {
  reason: string;
  date: string;
};

const initialTasks: [string, Stats, string][] = [
  ["トレーニング40〜60分", { BODY: 3 }, "BODY +3"],
  ["SNS/作品を1つ作る", { EXPRESSION: 3 }, "EXPRESSION +3"],
  ["家計を5分確認", { SELF_RELIANCE: 1 }, "SELF RELIANCE +1"],
  ["大切な人と連絡する", { CONNECTION: 2 }, "CONNECTION +2"],
  [
    "30分、未来の収入につながる行動",
    { SELF_RELIANCE: 2, FREEDOM: 1 },
    "SELF RELIANCE +2 / FREEDOM +1",
  ],
  [
    "新しい場所・体験へ行く",
    { CHALLENGE: 2, LIFE_EXPERIENCE: 3 },
    "CHALLENGE +2 / EXPERIENCE +3",
  ],
];

export default function Home() {
  const [stats, setStats] = useState<Stats>({ ...DEFAULT_STATS });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tab, setTab] = useState("HOME");

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [q, setQ] = useState("");
  const [analysis, setAnalysis] = useState("");

  const [money, setMoney] = useState({
    income: 0,
    expense: 0,
    today: 0,
  });

  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [bodyFat, setBodyFat] = useState("");

  const [postCount, setPostCount] = useState(0);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [syncStatus] = useState("LOCAL");

  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const lv = level(stats);
  const avg = Math.round(total / 8);

  const days = Math.max(
    0,
    Math.ceil(
      (new Date("2027-02-01").getTime() - Date.now()) / 86400000
    )
  );

  useEffect(() => {
    const raw = localStorage.getItem("mune-rpg-v2");

    if (raw) {
      try {
        const x = JSON.parse(raw);

        setStats(x.stats || DEFAULT_STATS);
        setTasks(x.tasks || []);
        setEvents(x.events || []);
        setMoney(
          x.money || {
            income: 0,
            expense: 0,
            today: 0,
          }
        );
        setPostCount(x.postCount || 0);
        setAnalysis(x.analysis || "");
      } catch {
        setTasks(
          initialTasks.map(([text, changes, xpText]) => ({
            text,
            changes,
            xpText,
            done: false,
          }))
        );
      }
    } else {
      setTasks(
        initialTasks.map(([text, changes, xpText]) => ({
          text,
          changes,
          xpText,
          done: false,
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "mune-rpg-v2",
      JSON.stringify({
        stats,
        tasks,
        events,
        money,
        postCount,
        analysis,
      })
    );
  }, [stats, tasks, events, money, postCount, analysis]);

  const addXP = (changes: Stats, reason: string) => {
    setStats((s) => {
      const n = { ...s };

      for (const [k, v] of Object.entries(changes)) {
        n[k] = Math.min(100, (n[k] || 0) + v);
      }

      return n;
    });

    setEvents((e) => [
      {
        reason,
        date: new Date().toISOString(),
      },
      ...e,
    ]);
  };

  const complete = (i: number) => {
    if (!tasks[i] || tasks[i].done) return;

    const t = tasks[i];

    const n = [...tasks];
    n[i] = {
      ...n[i],
      done: true,
    };

    setTasks(n);
    addXP(t.changes, t.text);
  };

  const ask = async () => {
    if (!q.trim()) return;

    const message = q;

    setQ("");

    setChat((c) => [
      ...c,
      {
        role: "user",
        text: message,
      },
    ]);

    try {
      const r = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          context: {
            stats,
            tasks,
            money,
            postCount,
            days,
          },
        }),
      });

      const j = await r.json();

      setChat((c) => [
        ...c,
        {
          role: "ai",
          text: j.answer || j.error || "AIから回答を取得できませんでした。",
        },
      ]);
    } catch {
      setChat((c) => [
        ...c,
        {
          role: "ai",
          text: "AIに接続できません。OPENAI_API_KEYを設定してください。",
        },
      ]);
    }
  };

  const daily = async () => {
    try {
      const r = await fetch("/api/ai/daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snapshot: {
            stats,
            tasks,
            money,
            postCount,
            days,
          },
        }),
      });

      const j = await r.json();

      setAnalysis(
        j.analysis ||
          j.error ||
          "AI分析を取得できませんでした。"
      );
    } catch {
      setAnalysis("AI分析に接続できませんでした。");
    }
  };

  const addTask = (t: [string, Stats, string]) => {
    setTasks((x) => [
      {
        text: t[0],
        changes: t[1],
        xpText: t[2],
        done: false,
      },
      ...x,
    ]);
  };

  const nav = [
    "HOME",
    "CHARACTER",
    "QUEST",
    "TIME",
    "MONEY",
    "BODY",
    "EXPRESSION",
    "EXPERIENCE",
    "CONNECTION",
    "ACHIEVEMENT",
    "AI",
  ];

  return (
    <>
      <div className="top">
        <div className="wrap">
          <div className="brand">
            <div>
              <h1>MUNE LIFE RPG</h1>
              <div className="muted">
                人生の経営管理OS / AI COACH
              </div>
            </div>

            <div className="tag">{syncStatus}</div>
          </div>

          <div className="nav">
            {nav.map((n) => (
              <button
                className={"btn " + (tab === n ? "active" : "")}
                onClick={() => setTab(n)}
                key={n}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="wrap">
        {tab === "HOME" && (
          <>
            <div className="card hero">
              <div className="muted">TODAY'S CHARACTER</div>

              <div className="big">
                {rank(avg)}ランクの旅人
              </div>

              <p>
                Lv.{lv} / {levelTitle(lv)}
              </p>

              <div className="bar">
                <i
                  style={{
                    width: `${((total % 7) / 7) * 100}%`,
                  }}
                />
              </div>

              <p className="muted">
                Sまであと {Math.max(0, 80 - avg)}pt / 2027年2月まであと{" "}
                {days}日
              </p>

              <button
                className="btn gold"
                onClick={daily}
              >
                ☀️ 今日のAI分析を生成
              </button>
            </div>

            <div className="grid">
              {STAT_KEYS.map((k) => (
                <div className="card" key={k}>
                  <div className="row">
                    <b>{STAT_LABEL[k]}</b>

                    <b className="gold">
                      {rank(stats[k])}
                    </b>
                  </div>

                  <div className="big">
                    {stats[k]}
                  </div>

                  <div className="bar">
                    <i
                      style={{
                        width: `${stats[k]}%`,
                      }}
                    />
                  </div>

                  <div className="muted">
                    Sまであと {Math.max(0, 80 - stats[k])}pt
                  </div>
                </div>
              ))}
            </div>

            <div className="grid">
              <div className="card">
                <div className="muted">
                  今日の最重要クエスト
                </div>

                {tasks
                  .filter((x) => !x.done)
                  .slice(0, 3)
                  .map((t) => (
                    <div
                      className="quest"
                      key={t.text}
                    >
                      <input
                        type="checkbox"
                        onChange={() =>
                          complete(tasks.indexOf(t))
                        }
                      />

                      <div>
                        <b>{t.text}</b>

                        <div className="tag">
                          {t.xpText}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="card">
                <div className="muted">
                  TODAY'S AI STRATEGY
                </div>

                <p>
                  {analysis ||
                    "まだ今日のAI分析がありません。上のボタンから生成できます。"}
                </p>
              </div>
            </div>
          </>
        )}

        {tab === "CHARACTER" && (
          <>
            <div className="card">
              <h2>CHARACTER</h2>

              <p>
                総合Lv.{lv} / {rank(avg)} /{" "}
                {levelTitle(lv)}
              </p>
            </div>

            <div className="grid">
              {STAT_KEYS.map((k) => (
                <div className="card" key={k}>
                  <h3>{STAT_LABEL[k]}</h3>

                  <div className="big">
                    {stats[k]}{" "}
                    <span className="gold">
                      {rank(stats[k])}
                    </span>
                  </div>

                  <div className="bar">
                    <i
                      style={{
                        width: `${stats[k]}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h2>SKILL TREE</h2>

              {[
                [
                  "旅人",
                  stats.FREEDOM >= 50 &&
                    stats.CHALLENGE >= 45,
                ],
                [
                  "表現者",
                  stats.EXPRESSION >= 50,
                ],
                [
                  "人を惹きつける人",
                  stats.CONNECTION >= 50 &&
                    stats.EXPRESSION >= 50 &&
                    stats.CHARACTER >= 60,
                ],
                [
                  "自由人",
                  stats.FREEDOM >= 70 &&
                    stats.SELF_RELIANCE >= 70,
                ],
                [
                  "冒険者",
                  stats.CHALLENGE >= 70 &&
                    stats.LIFE_EXPERIENCE >= 70,
                ],
                [
                  "自分自身がコンテンツ",
                  stats.EXPRESSION >= 80 &&
                    stats.CHARACTER >= 75 &&
                    stats.LIFE_EXPERIENCE >= 70,
                ],
              ].map(([name, unlocked]) => {
                const skillName = String(name);
                const isUnlocked = Boolean(unlocked);

                return (
                  <div
                    className={
                      "row " +
                      (isUnlocked ? "" : "locked")
                    }
                    key={skillName}
                  >
                    <b>
                      {isUnlocked ? "🔓" : "🔒"}{" "}
                      {skillName}
                    </b>

                    <span>
                      {isUnlocked
                        ? "UNLOCKED"
                        : "LOCKED"}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "QUEST" && (
          <>
            <div className="card">
              <h2>DAILY QUEST</h2>

              {tasks.map((t, i) => (
                <div
                  className="quest"
                  key={`${t.text}-${i}`}
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => complete(i)}
                  />

                  <div>
                    <b>{t.text}</b>

                    <div className="tag">
                      {t.xpText}
                    </div>
                  </div>
                </div>
              ))}

              <div className="nav">
                {initialTasks.map((t, i) => (
                  <button
                    className="btn"
                    key={i}
                    onClick={() => addTask(t)}
                  >
                    + {t[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>MONTHLY QUEST</h2>

              <p>🏍️ バイク・発信基盤を前進させる</p>
              <p>🎥 コンテンツ10本</p>
              <p>💰 貯蓄・退職資金を守る</p>
            </div>
          </>
        )}

        {tab === "TIME" && (
          <div className="card">
            <h2>TIME = LIFE CURRENCY</h2>

            <p>
              今日24時間のうち、何に人生を使ったかを記録する画面です。
            </p>

            <div className="alert">
              WORK / BODY / CREATION / CONNECTION /
              LIFE EXPERIENCE / REST / PERSONAL
            </div>

            <p className="muted">
              本番版ではカレンダーから自動取り込みし、
              AIが「理想人生への投資時間」を毎朝分析します。
            </p>
          </div>
        )}

        {tab === "MONEY" && (
          <>
            <div className="grid">
              <div className="card">
                <div className="muted">
                  今月収入
                </div>

                <div className="big green">
                  ¥{money.income.toLocaleString()}
                </div>
              </div>

              <div className="card">
                <div className="muted">
                  今月支出
                </div>

                <div className="big red">
                  ¥{money.expense.toLocaleString()}
                </div>
              </div>

              <div className="card">
                <div className="muted">
                  収支
                </div>

                <div className="big">
                  ¥
                  {(
                    money.income -
                    money.expense
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="card">
              <h2>お金の意思決定</h2>

              <p>
                自由 / 挑戦 / 成長 / 経験 /
                CONNECTION / EXPRESSION /
                経済合理性 / 楽しさを各0〜5点で採点し、
                30点以上を強い候補とします。
              </p>

              <button
                className="btn gold"
                onClick={() => setTab("AI")}
              >
                AIに購入判断を相談
              </button>
            </div>
          </>
        )}

        {tab === "BODY" && (
          <div className="card">
            <h2>BODY</h2>

            <div className="form">
              <label>
                体重
                <input
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
                  placeholder="62"
                />
              </label>

              <label>
                腹囲
                <input
                  value={waist}
                  onChange={(e) =>
                    setWaist(e.target.value)
                  }
                  placeholder="77"
                />
              </label>

              <label>
                体脂肪率
                <input
                  value={bodyFat}
                  onChange={(e) =>
                    setBodyFat(e.target.value)
                  }
                  placeholder="8〜9"
                />
              </label>

              <button
                className="btn primary"
                onClick={() =>
                  addXP(
                    { BODY: 1 },
                    "身体記録"
                  )
                }
              >
                身体を記録 +1 XP
              </button>
            </div>

            <div className="card">
              <h3>2027/2 TARGET</h3>

              <p>
                60〜63kg / 6〜9% /
                腹囲70〜73cm /
                肩・背中・上胸・腕を優先
              </p>
            </div>
          </div>
        )}

        {tab === "EXPRESSION" && (
          <div className="card">
            <h2>EXPRESSION</h2>

            <div className="big">
              {postCount}
            </div>

            <p>制作数</p>

            <button
              className="btn gold"
              onClick={() => {
                setPostCount((x) => x + 1);
                addXP(
                  { EXPRESSION: 3 },
                  "作品制作"
                );
              }}
            >
              作品を1つ記録 +3 XP
            </button>

            <p className="muted">
              将来の「自分自身がコンテンツ」スキルを育てる。
            </p>
          </div>
        )}

        {tab === "EXPERIENCE" && (
          <div className="card">
            <h2>LIFE EXPERIENCE</h2>

            <button
              className="btn gold"
              onClick={() =>
                addXP(
                  {
                    CHALLENGE: 2,
                    LIFE_EXPERIENCE: 3,
                    FREEDOM: 1,
                  },
                  "新しい体験"
                )
              }
            >
              新しい体験 +5 XP
            </button>

            <p className="muted">
              旅・バイク・アクティビティ・歌・撮影・新しい場所など、
              人生そのものを経験値にする。
            </p>
          </div>
        )}

        {tab === "CONNECTION" && (
          <div className="card">
            <h2>CONNECTION</h2>

            <button
              className="btn gold"
              onClick={() =>
                addXP(
                  {
                    CONNECTION: 3,
                    CHALLENGE: 1,
                    CHARACTER: 1,
                  },
                  "新しい出会い"
                )
              }
            >
              新しい人と出会った +5 XP
            </button>

            <p className="muted">
              全国に「会いたい人」が増えるほど
              CONNECTIONが育つ。
            </p>
          </div>
        )}

        {tab === "ACHIEVEMENT" && (
          <div className="card">
            <h2>ACHIEVEMENT</h2>

            {[
              ["初投稿", postCount >= 1],
              ["SランクBODY", stats.BODY >= 80],
              [
                "Sランク表現者",
                stats.EXPRESSION >= 80,
              ],
              ["旅人", events.length >= 10],
              ["自由人", stats.FREEDOM >= 80],
              [
                "人生を仕事にした人",
                money.income > 0,
              ],
            ].map(([name, unlocked]) => {
              const achievementName =
                String(name);
              const isUnlocked =
                Boolean(unlocked);

              return (
                <div
                  className="row"
                  key={achievementName}
                >
                  <b>
                    {isUnlocked
                      ? "🏆"
                      : "🔒"}{" "}
                    {achievementName}
                  </b>

                  <span>
                    {isUnlocked
                      ? "UNLOCKED"
                      : "LOCKED"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {tab === "AI" && (
          <>
            <div className="card hero">
              <h2>MUNE AI COACH</h2>

              <p>
                あなたの人生設計・現在地・時間・お金・身体・発信を前提に会話するAI。
              </p>

              <div className="chat">
                {chat.map((m, i) => (
                  <div
                    className={
                      "bubble " + m.role
                    }
                    key={i}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="chatbar">
                <input
                  value={q}
                  onChange={(e) =>
                    setQ(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      ask();
                    }
                  }}
                  placeholder="今何をすべき？ / これ買うべき？"
                />

                <button
                  className="btn gold"
                  onClick={ask}
                >
                  送信
                </button>
              </div>
            </div>

            <div className="card">
              <h2>毎朝AI分析</h2>

              <p>
                {analysis || "未生成"}
              </p>

              <button
                className="btn gold"
                onClick={daily}
              >
                最新分析を生成
              </button>
            </div>
          </>
        )}

        <div className="footer">
          MUNE LIFE RPG v2 / Cloud + AI architecture ready.
          本番運用にはSupabase・OpenAI・Google Calendar・Web Pushの環境変数設定が必要です。
        </div>
      </main>
    </>
  );
}
