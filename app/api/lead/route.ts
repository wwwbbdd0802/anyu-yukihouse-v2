import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// 名單收集：把表單資料轉送到 Google Apps Script（寫入 Google Sheet）
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = process.env.GOOGLE_SCRIPT_URL;

    // 未設定試算表時，至少記錄到伺服器 log，不讓使用者端報錯
    if (!url) {
      console.log("[LEAD]", JSON.stringify(body));
      return NextResponse.json({ ok: true, stored: false });
    }

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json({ ok: true, stored: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
