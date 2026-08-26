import { NextRequest,NextResponse } from "next/server";
import ical from "ical-generator";
export async function POST(req:NextRequest){
 const {events=[]}=await req.json();
 const cal=ical({name:"MUNE LIFE RPG"});
 for(const e of events){cal.createEvent({id:e.id||crypto.randomUUID(),start:new Date(e.start),end:new Date(e.end),summary:e.title||"MUNE LIFE RPG",description:e.description||""})}
 return new NextResponse(cal.toString(),{headers:{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":"attachment; filename=mune-life-rpg.ics"}});
}