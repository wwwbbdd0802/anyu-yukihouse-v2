# 榆您棋心 找到理想的家｜不動產財務試算中心

租・管・售一條龍服務。包含三大工具：**出租收益評估、出售收益評估、買房成本評估**，並支援上傳謄本自動帶入與名單收集。

---

## 這個專案有什麼

- **首頁**：三大工具選擇入口
- **出租收益評估**：依「114 年社宅租金單價表」計算，含區位／裝修／設備調整，同時顯示社宅評定價與市場行情區間
- **出售收益評估**：實拿金額、土地增值稅、房地合一稅／財產交易所得稅、年度持有成本；可上傳謄本自動帶入
- **買房成本評估**：每月房貸、一次性購置費用、年度持有成本
- **名單收集**：客戶填寫的資料自動寫入你的 Google Sheet
- **SEO 與分享**：Google 搜尋最佳化、LINE／Facebook 分享預覽

---

## 部署到 Vercel（不用寫程式，約 15 分鐘）

### 步驟 1️⃣：放到 GitHub

1. 申請一個 [GitHub](https://github.com) 帳號（免費）。
2. 點右上角「+」→「New repository」，取名例如 `anyu-yukihouse`，建立。
3. 把這整個 `anyu-yukihouse` 資料夾的檔案上傳上去
   （可用網頁的「uploading an existing file」直接拖拉，或用 GitHub Desktop）。

### 步驟 2️⃣：部署到 Vercel

1. 申請 [Vercel](https://vercel.com) 帳號，用 GitHub 登入。
2. 點「Add New…」→「Project」→ 選剛剛的 `anyu-yukihouse`。
3. 直接按「Deploy」。約 1 分鐘後就會有一個網址，例如
   `https://anyu-yukihouse.vercel.app` — 這時網站就能用了！

> 此時「出租／出售／買房」三大試算、名單表單都能正常運作。
> 「上傳謄本」與「名單寫入 Google Sheet」需要再做下面的步驟 3、4 才會生效。

### 步驟 3️⃣（選用）：開啟「上傳謄本自動辨識」

1. 到 [console.anthropic.com](https://console.anthropic.com) 申請一組 API 金鑰（`sk-ant-...`）。
2. Vercel 專案 →「Settings」→「Environment Variables」新增：
   - Name：`ANTHROPIC_API_KEY`
   - Value：你的金鑰
3. 回到「Deployments」→ 最新一筆 →「Redeploy」重新部署即可。

> ⚠️ 使用 API 會依用量計費（謄本辨識每次成本極低，約幾分錢台幣），請留意帳單。

### 步驟 4️⃣（選用）：開啟「名單自動寫入 Google Sheet」

1. 開一個 Google 試算表。
2. 擴充功能 → Apps Script，貼上本專案 `google-apps-script.js` 的內容，存檔。
3. 部署為「網頁應用程式」（執行身分：我；存取權：任何人），取得網址。
4. Vercel → Settings → Environment Variables 新增：
   - Name：`GOOGLE_SCRIPT_URL`
   - Value：剛剛的 Apps Script 網址
5. Redeploy。之後客戶填的名單就會自動進到你的試算表。

---

## 之後想改內容怎麼辦

| 想改的東西 | 改哪裡 |
|------------|--------|
| 電話、LINE、FB 連結 | `app/page.tsx` 最上方的 `PHONE` / `LINE` / `FB` |
| 仲介費率（賣方 4%、買方 2%） | `app/page.tsx` 內 `calcSale` / `calcPurchase` |
| 租金單價表 | `app/page.tsx` 內的 `RENT` 物件 |
| 市場行情倍率（評定價 ×1.08~1.28） | `calcRental` 內的 `mktLow` / `mktHigh` |
| 網站標題、SEO、分享文字 | `app/layout.tsx` |
| 正式網址 | `app/layout.tsx` 的 `SITE_URL` |

改完存檔、推回 GitHub，Vercel 會自動重新部署。

---

## 本機開發（進階，選用）

```bash
npm install
cp .env.local.example .env.local   # 填入金鑰
npm run dev                         # 開 http://localhost:3000
```

---

## 重要提醒

本網站所有試算結果**僅供初步參考**。土地增值稅、房地合一稅、財產交易所得稅的實際金額，會因公告土地現值、持有年限、所得級距、土地漲價總數額等因素而異，**請以代書、地政事務所或會計師精算為準**。
