import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

// 謄本辨識：接收 base64 影像/PDF，呼叫 Anthropic API 擷取欄位後回傳 JSON
export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "未設定 ANTHROPIC_API_KEY" }, { status: 500 });
  }

  try {
    const { data, mediaType } = await req.json();
    if (!data) return NextResponse.json({ error: "缺少檔案" }, { status: 400 });

    const isPdf = mediaType === "application/pdf";
    const source = isPdf
      ? { type: "base64", media_type: "application/pdf", data }
      : { type: "base64", media_type: mediaType || "image/jpeg", data };

    const content = [
      isPdf ? { type: "document", source } : { type: "image", source },
      {
        type: "text",
        text:
          '這是台灣不動產謄本（土地/建物登記第二類謄本）。請擷取欄位，只輸出 JSON，不要任何說明或 markdown：' +
          '{"city":"縣市如台北市","district":"行政區如大安區","ping":建物總面積換算坪數的數字,' +
          '"acqYear":取得或登記年份(西元)數字,"landCurrentValue":公告土地現值總額數字或null}。' +
          "找不到的欄位填 null。坪數 = 平方公尺 ÷ 3.30579。",
      },
    ];

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content }],
      }),
    });

    const json = await resp.json();
    const txt = (json.content || [])
      .map((i: any) => i.text || "")
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(txt);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: "辨識失敗" }, { status: 500 });
  }
}
