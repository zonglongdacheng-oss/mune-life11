import {NextRequest,NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabase";
export async function POST(req:NextRequest){
 const {userId,subscription}=await req.json(); if(!userId||!subscription)return NextResponse.json({error:"missing"},{status:400});
 const {error}=await supabaseAdmin().from("push_subscriptions").upsert({user_id:userId,subscription},{onConflict:"user_id,endpoint"});
 if(error)return NextResponse.json({error:error.message},{status:500}); return NextResponse.json({ok:true});
}