# 🚗 北海道自駕旅程規劃（Hokkaido Trip Planner）

2027/6/30 – 7/7，8 天 7 夜北海道自駕行程規劃 Web App。純靜態網站，無需建置、無外部依賴。

## 功能
- 開源地圖（Leaflet + OpenStreetMap／Esri 衛星）：可縮放、拖曳、切換底圖；路線與每段里程／車程由 OSRM 實際道路計算（首次載入後快取）
- 無法連線時自動改用可縮放、可拖曳的示意 SVG 地圖與估算值
- 景點詳情頁：圖示橫幅、介紹、貼士、建議停留時間
- Google Maps 連結：景點位置、上一站導航、當日完整路線
- 收據影像辨識：附件圖片可按「🔍 辨識金額」，以 Tesseract.js（日文＋繁中＋英文，瀏覽器本機運算）讀取金額與幣別，填入表單後由你確認。
- 花費 PDF：「⬇️ 全部明細轉 PDF」直接下載 A4 PDF，包含分類、完整明細、平分與收據縮圖（使用 html2pdf.js 0.10.2，由 cdnjs 載入）。
- 費用總表：天 × 分類的矩陣，格子可直接修改金額（台幣），並有每日小計與分類合計；PDF 報表亦包含。
- 備份：花費管理頁可「匯出備份」成 JSON 檔（含附件），並可「匯入備份」還原；換裝置或清除瀏覽器資料前請先匯出。
- 載入順序：開啟時先讀根目錄 expenses.json（有 token 走 GitHub API，否則讀網站同層檔案），讀不到才用 localStorage；若本機有尚未同步的變更則沿用本機。存檔時同時寫入 localStorage 與根目錄 expenses.json（需 token）。
- GitHub 同步：以 Fine-grained token 將花費存成 repository 根目錄的 expenses.json（附件另存 expenses-attachments.json），可手動或修改後自動儲存，並可從 GitHub 載入。注意：公開 repository 的檔案任何人都看得到。
- 花費管理：摘要與清單同頁，清單為表格（頂部可直接新增，每列可編輯或刪除）。
- 花費管理：台幣計價總額（日幣項目依匯率換算）、輸入時可選日幣或台幣、預算與匯率、分類占比、明細可編輯/刪除、附件（收據圖片或小型 PDF）、平分標記與每人金額、列印/存成 PDF
- 手機優先、支援深色模式；花費資料存於瀏覽器 localStorage

## 專案結構
```
hokkaido-trip-planner/
├── index.html        # 頁面骨架
(所有檔案都在根目錄，便於手機上傳)
├── js/data.js        # 行程、景點、住宿資料
├── js/app.js         # 地圖繪製、互動與花費邏輯
├── public/favicon.svg
├── vercel.json       # Vercel 設定
├── package.json      # 本機預覽指令
├── .gitignore
├── LICENSE
└── README.md
```

## 本機執行
直接用瀏覽器開啟 `index.html`，或：
```bash
npm run dev      # 需要 Node.js，會啟動 npx serve
```

## 修改行程
行程資料已依「北海道.xlsx」匯入，共 8 天（6/30–7/7）。
編輯 `js/data.js`：`H` 為住宿、`D` 為每日行程（`pts` 景點、`legs` 為各段 `[公里, 分鐘]`）。里程與車程為概略估算，請以 Google Maps 確認。

## 部署（Vercel）
1. 將專案推到 GitHub。
2. 在 Vercel 選 **Add New → Project** 匯入該 repo。
3. Framework Preset 選 **Other**，Build Command 與 Output Directory 留空，按 Deploy。

## 已知限制
- 辨識在瀏覽器本機進行，首次使用會下載約數 MB 的語言資料；辨識準確度依收據清晰度而定，金額務必人工確認。辨識僅支援圖片，不支援 PDF。
- 附件以 base64 存在 localStorage（瀏覽器約 5MB 上限）；圖片會自動壓縮，PDF 限 600KB 內。
- 地圖為示意圖，並非真實地圖圖磚；真實路線請點「Google Maps 導航」。
- 花費資料僅存在使用者自己的瀏覽器，不跨裝置同步。
