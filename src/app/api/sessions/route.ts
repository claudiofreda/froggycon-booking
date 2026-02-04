import { NextResponse } from "next/server";
import { getSessions } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessions = await getSessions();
    return NextResponse.json(sessions, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
