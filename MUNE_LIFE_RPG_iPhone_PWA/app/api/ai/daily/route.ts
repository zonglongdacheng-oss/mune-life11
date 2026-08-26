import { NextRequest,NextResponse } from "next/server";
import { openai,AI_MODEL } from "@/lib/openai";
export async function POST(req:NextRequest){
 try{
  const {snapshot}=await req.json();
  const prompt=`以下はMUNE LIFE RPGの直近データです。毎朝の戦略を作ってください。\n${JSON.stringify(snapshot)}\n\n出力形式:\n1. 今日の総合状態\n2. 今日の最重要3クエスト（各XP付き）\n3. やらないこと2つ\n4. お金の注意点\n5. 身体/回復の注意点\n6. 退職・自由・IP形成に向けた一手\n7. 今日の一言\n「人生を犠牲にしてSを目指さない」を守る。`;
  const r=await openai.responses.create({model:AI_MODEL,instructions:"あなたはユーザーの人生OSを運用する戦略AI。短く、具体的、合理的に。",input:prompt});
  return NextResponse.json({analysis:r.output_text});
 }catch(e){return NextResponse.json({error:"Daily AI failed"},{status:500})}
}