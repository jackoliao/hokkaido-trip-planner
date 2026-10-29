# 北海道自駕旅程規劃

## 更新內容
- Apple-inspired visual refinement: cleaner typography, calmer surfaces, refined spacing, responsive cards and controls.
- 花費總覽、分類與每日花費分析、平分項目總覽。
- 花費明細可新增、修改、刪除，並可逐筆設定是否平分及平分人數。
- 搜尋與篩選花費項目。

## 部署
將本專案中的 `index.html`、`style.css`、`app.js`、`data.js`、`favicon.svg` 部署到同一個網站目錄。

## 花費資料注意事項
花費資料由瀏覽器 localStorage 保存。更新時不要清除瀏覽器網站資料，且應在同一個網域/來源開啟網站。不同網域、不同瀏覽器或由 `file://` 改為網站部署時，localStorage 不會自動同步。建議先保留舊網站並備份資料。
