import { NextRequest, NextResponse } from "next/server";
import { openai, AI_MODEL } from "@/lib/openai";
export async function POST(req:NextRequest){
  try{
    const {message,context}=await req.json();
    const system=`あなたは「MUNE LIFE RPG」の人生戦略AIコーチ。ユーザーの目的はSランクになること自体ではなく、Sへ成長する過程を楽しみながら、自由・挑戦・楽しさ・つながり・成長を最大化すること。教える人になるより、自分自身の活動・旅・身体・発信・人との出会いをコンテンツ化し、最終的に活動そのものが収入/IPになる人生を目指す。判断は短期の快楽だけでなく、時間・お金・身体・自由・将来収入・人生経験を総合評価する。疲労時は回復を優先。現在の退職目標、バイク×旅×撮影×SNS、身体・外見の重要性も考慮する。断定しすぎず、具体的な次の一手を出す。`;
    const r=await openai.responses.create({model:AI_MODEL,instructions:system,input:`現在のデータ:\n${JSON.stringify(context)}\n\nユーザー:\n${message}`});
    return NextResponse.json({answer:r.output_text});
  }catch(e){return NextResponse.json({error:"AI接続に失敗しました。OPENAI_API_KEYを設定してください。"}, {status:500})}
}