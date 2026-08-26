import {NextRequest,NextResponse} from "next/server";
export async function POST(req:NextRequest){
 if(req.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`)return NextResponse.json({error:"unauthorized"},{status:401});
 return NextResponse.json({ok:true,detail:"Connect this endpoint to your scheduler after deployment; per-user backup calls /api/backup."});
}