import {NextRequest,NextResponse} from "next/server";
import webpush from "web-push";
import {supabaseAdmin} from "@/lib/supabase";
export async function POST(req:NextRequest){
 const {userId,title,body}=await req.json();
 webpush.setVapidDetails(process.env.VAPID_SUBJECT!,process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,process.env.VAPID_PRIVATE_KEY!);
 const {data}=await supabaseAdmin().from("push_subscriptions").select("*").eq("user_id",userId);
 for(const s of data||[]){try{await webpush.sendNotification(s.subscription,JSON.stringify({title,body}))}catch{}}
 return NextResponse.json({ok:true});
}