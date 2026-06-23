import { NextResponse } from "next/server";
import { getWorldCupViewModel } from "@/lib/view-model";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getWorldCupViewModel();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
