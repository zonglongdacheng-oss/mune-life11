import { NextRequest,NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export async function POST(req:NextRequest){
 const {userId}=await req.json();
 if(!userId)return NextResponse.json({error:"userId required"},{status:400});
 const db=supabaseAdmin();
 const tables=["profiles","stats","events","tasks","money","time_logs","body_logs","experiences","connections","posts","journals","achievements","ai_daily"];
 const backup:any={created_at:new Date().toISOString()};
 for(const t of tables){const {data}=await db.from(t).select("*").eq("user_id",userId);backup[t]=data||[]}
 const path=`${userId}/${new Date().toISOString().slice(0,10)}.json`;
 const blob=new Blob([JSON.stringify(backup)],{type:"application/json"});
 const {error}=await db.storage.from("backups").upload(path,blob,{upsert:true,contentType:"application/json"});
 if(error)return NextResponse.json({error:error.message},{status:500});
 return NextResponse.json({ok:true,path});
}