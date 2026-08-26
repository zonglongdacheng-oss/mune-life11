import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "MUNE LIFE RPG daily system is ready.",
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "MUNE LIFE RPG daily system is ready.",
  });
}
