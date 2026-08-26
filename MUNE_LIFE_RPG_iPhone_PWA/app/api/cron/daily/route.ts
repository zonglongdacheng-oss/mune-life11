import {NextRequest,NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabase";
import {openai,AI_MODEL} from "@/lib/openai";
export async function POST(req:NextRequest){
 if(req.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`)return NextResponse.json({error:"unauthorized"},{status:401});
 const db=supabaseAdmin(); const {data:users}=await db.from("profiles").select("id");
 for(const u of users||[]){
   const [stats,money,tasks,body,posts]=await Promise.all([
    db.from("stats").select("*").eq("user_id",u.id).single(),
    db.from("money").select("*").eq("user_id",u.id).order("created_at",{ascending:false}).limit(30),
    db.from("tasks").select("*").eq("user_id",u.id).eq("done",false).limit(10),
    db.from("body_logs").select("*").eq("user_id",u.id).order("created_at",{ascending:false}).limit(7),
    db.from("posts").select("*").eq("user_id",u.id).order("created_at",{ascending:false}).limit(10)
   ]);
   const snapshot={stats:stats.data,money:money.data,tasks:tasks.data,body:body.data,posts:posts.data};
   const r=await openai.responses.create({model:AI_MODEL,instructions:"MUNE LIFE RPGの毎朝戦略を日本語で作る。短く具体的に。",input:JSON.stringify(snapshot)});
   await db.from("ai_daily").insert({user_id:u.id,analysis:r.output_text});
 }
 return NextResponse.json({ok:true});
}