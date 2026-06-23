import type { Metadata, Viewport } from "next";
import "./globals.css";

// ▼ 部署後請把這裡改成你的正式網址（綁定網域後更新）
const SITE_URL = "https://anyu-yukihouse.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "榆您棋心 找到理想的家｜不動產財務試算中心",
  description:
    "租・管・售一條龍服務。免費試算出租收益、出售實拿金額與買房成本，依 114 年社宅租金單價表計算，30 秒快速評估您的不動產財務數字。安心寄寓・資產有託。",
  keywords: [
    "房東收益試算", "租金行情", "社宅租金單價表", "出售實拿", "房地合一稅試算",
    "土地增值稅", "買房成本", "房貸試算", "包租代管", "新北市租金", "台北市租金", "桃園市租金",
  ],
  authors: [{ name: "榆您棋心找到理想的家" }],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: "榆您棋心 找到理想的家",
    title: "不動產財務試算中心｜出租・出售・買房一次算清楚",
    description:
      "免費試算出租收益、出售實拿與買房成本，依官方社宅租金單價表計算。租・管・售一條龍服務。",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "榆您棋心 不動產財務試算中心" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "不動產財務試算中心｜榆您棋心",
    description: "出租・出售・買房，30 秒算清楚您的不動產財務數字。",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
