/* 應用邏輯：地圖繪製、景點詳情、花費管理（資料存於 localStorage） */
let S={exp:[{id:1,day:1,cat:'住宿',name:'Nexus Hotel Hakodate',amt:88760},{id:2,day:2,cat:'住宿',name:'HOTEL COCOA RESORT',amt:32400}],budget:0,rate:0.21,nid:10};
try{const r=localStorage.getItem('hk27');if(r)S=JSON.parse(r)}catch(e){}
const save=()=>{try{localStorage.setItem('hk27',JSON.stringify(S))}catch(e){}};
const pr=(la,lo)=>[(lo-139.6)*73,(46-la)*100],fmt=m=>(m>=60?Math.floor(m/60)+'小時':'')+(m%60?Math.round(m%60)+'分':''),Y=n=>'¥'+Math.round(n).toLocaleString();
const gm=p=>`https://www.google.com/maps/search/?api=1&query=${p.la},${p.lo}`;
const dir=(a,b)=>`https://www.google.com/maps/dir/?api=1&origin=${a.la},${a.lo}&destination=${b.la},${b.lo}&travelmode=driving`;
const dayDir=pts=>`https://www.google.com/maps/dir/?api=1&origin=${pts[0].la},${pts[0].lo}&destination=${pts.at(-1).la},${pts.at(-1).lo}&travelmode=driving`+(pts.length>2?`&waypoints=${pts.slice(1,-1).map(p=>p.la+','+p.lo).join('%7C')}`:'');
let view=0,cur=1,hi=-1;
const tabs=document.getElementById('tabs'),main=document.getElementById('main');
D.forEach((x,i)=>{const b=document.createElement('button');b.textContent=x.d;b.onclick=()=>{cur=i;hi=-1;view=0;draw()};tabs.appendChild(b)});
const tw=e=>e.cur=='TWD'?e.orig:Math.round(e.amt*S.rate),W=n=>'NT$ '+Math.round(n).toLocaleString(),tot=()=>S.exp.reduce((a,e)=>a+tw(e),0),dsum=i=>S.exp.filter(e=>e.day==i).reduce((a,e)=>a+tw(e),0);
const sum=d=>[d.legs.reduce((a,l)=>a+l[0],0),d.legs.reduce((a,l)=>a+l[1],0)];
function kpi(){const K=D.slice(1).reduce((a,d)=>a+sum(d)[0],0),M=D.slice(1).reduce((a,d)=>a+sum(d)[1],0),n=D.slice(1).reduce((a,d)=>a+d.pts.filter(p=>p.t=='p').length,0);
 document.getElementById('kpi').innerHTML=`<div><b>${K} km</b>全程開車</div><div><b>${fmt(M)}</b>總車程</div><div><b>${n}</b>景點</div><div><b>${W(tot())}</b>已記花費</div>`}
function banner(p){const c=p.t=='s'?['#c92a2a','#ff8787']:p.t=='a'?['#2b8a3e','#8ce99a']:['#0b6bcb','#74c0fc'];
 return `<svg viewBox="0 0 560 200" style="height:190px"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="560" height="200" fill="url(#g)"/><circle cx="470" cy="40" r="60" fill="#fff" opacity=".15"/><path d="M0 150 Q140 100 280 150 T560 140 V200 H0Z" fill="#fff" opacity=".2"/><path d="M0 175 Q160 130 300 175 T560 165 V200 H0Z" fill="#fff" opacity=".25"/><text x="50" y="125" font-size="84">${p.ic}</text><text x="160" y="105" font-size="26" fill="#fff" font-weight="700">${p.n}</text><text x="160" y="135" font-size="14" fill="#fff" opacity=".9">${p.stay}</text></svg>`}
function openS(di,i){const d=D[di],p=d.pts[i],prev=d.pts[i-1],eg=S.exp.filter(e=>e.name==p.n);
 const dc=p.t=='s'?'住宿':'門票';
 document.getElementById('sheet').innerHTML=`<button class="close" onclick="closeS()">✕</button>${banner(p)}<div class="bd"><h3>${p.ic} ${p.n}</h3><div>${p.stay?`<span class="tag">⏱ ${p.stay}</span>`:''}<span class="tag">${d.d}</span><span class="tag">${p.la.toFixed(3)}, ${p.lo.toFixed(3)}</span></div><p>${p.desc}</p>${p.tip?`<p class="mu">💡 ${p.tip}</p>`:''}<div class="f"><a class="btn" target="_blank" rel="noopener" href="${gm(p)}">📍 在 Google Maps 開啟</a>${prev?`<a class="btn o" target="_blank" rel="noopener" href="${dir(prev,p)}">🚗 從上一站導航</a>`:''}</div><div class="mu" style="margin-top:10px">記一筆花費（${dc}）</div><div class="f"><input id="qa" type="number" inputmode="numeric" placeholder="金額">${curSel('qa')}<button class="btn" onclick="addE(${di},'${dc}',${JSON.stringify(p.n).replace(/"/g,'&quot;')},'qa')">＋ 新增</button></div>${eg.length?`<div class="mu">此處已記：${eg.map(e=>W(tw(e))).join('、')}</div>`:''}</div>`;
 document.getElementById('shade').classList.add('on')}
let A={};try{A=JSON.parse(localStorage.getItem('hk27a')||'{}')}catch(e){}
const saveA=()=>{try{localStorage.setItem('hk27a',JSON.stringify(A));return true}catch(e){alert('瀏覽器儲存空間不足，附件未能儲存。請刪除部分附件或改用較小的檔案。');return false}};
const rd=f=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.onerror=()=>r(null);x.readAsDataURL(f)});
async function pack(f){const u=await rd(f);if(!u)return null;
 if(f.type.startsWith('image/'))return new Promise(r=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1000/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);r({n:f.name,t:'image/jpeg',d:c.toDataURL('image/jpeg',.7)})};im.onerror=()=>r(null);im.src=u});
 if(f.type=='application/pdf'&&f.size<600000)return{n:f.name,t:f.type,d:u};alert('「'+f.name+'」未加入：僅支援圖片，或 600KB 以內的 PDF。');return null}
async function attach(id,files){const add=[];for(const f of files){const p=await pack(f);if(p)add.push(p)}if(!add.length)return;const old=A[id];A[id]=(old||[]).concat(add);if(!saveA())A[id]=old}
function rmA(id,i){A[id].splice(i,1);if(!A[id].length)delete A[id];saveA();draw()}
function viewA(id,i){const a=A[id][i];if(a.t=='application/pdf'){const b=atob(a.d.split(',')[1]),u=new Uint8Array(b.length);for(let k=0;k<b.length;k++)u[k]=b.charCodeAt(k);window.open(URL.createObjectURL(new Blob([u],{type:a.t})));return}
 document.getElementById('sheet').innerHTML=`<button class="close" onclick="closeS()">✕</button><img src="${a.d}" alt="" style="width:100%;display:block;border-radius:22px 22px 0 0"><div class="bd mu">${a.n}</div>`;document.getElementById('shade').classList.add('on')}
const attHtml=e=>{const L=(A[e.id]||[]).map((a,i)=>a.t=='application/pdf'?`<span class="tag" style="cursor:pointer" onclick="viewA(${e.id},${i})">📄 ${a.n}</span>`:`<img src="${a.d}" alt="" onclick="viewA(${e.id},${i})" style="width:44px;height:44px;object-fit:cover;border-radius:8px;cursor:pointer">`).join('');
 const s=e.split?`<span class="tag">👥 ÷${e.n} → ${W(tw(e)/e.n)}/人</span>`:'';return L||s?`<div class="att">${s}${L}</div>`:''};
const editExtra=e=>`<div class="f" style="width:100%;align-items:center"><label class="mu" style="flex:none"><input type="checkbox" id="xs"${e.split?' checked':''} style="flex:none"> 平分</label><input id="xp" type="number" min="2" value="${e.n||2}" placeholder="人數"><input id="xf" type="file" accept="image/*,application/pdf" multiple><button class="btn o" onclick="recog('xf','xa','xk','xn')">🔍 辨識金額</button></div><div class="f" style="width:100%">${(A[e.id]||[]).map((a,i)=>`<span class="tag">${a.n} <button class="x" onclick="rmA(${e.id},${i})">✕</button></span>`).join('')}</div>`;
const splitCard=()=>{const L=S.exp.filter(e=>e.split);if(!L.length)return '';const sh=L.reduce((a,e)=>a+tw(e)/e.n,0);return `<div class="card"><h2>👥 平分明細</h2>${L.map(e=>`<div class="row"><span>${e.name} <span class="mu">÷${e.n}</span></span><span>${W(tw(e))} → <b>${W(tw(e)/e.n)}</b>/人</span></div>`).join('')}<div class="row"><b>每人分攤合計</b><b>${W(sh)}</b></div><div class="mu">若各筆平分人數不同，合計為逐筆每人金額的加總。</div></div>`};
let editId=-1;
const editRow=e=>{const c=e.cur||'JPY',v=c=='TWD'?e.orig:e.amt;return `<div class="row" style="flex-wrap:wrap"><div class="f" style="width:100%"><input id="xn" value="${e.name.replace(/"/g,'&quot;')}"><select id="xd">${D.slice(1).map((d,i)=>`<option value="${i+1}"${i+1==e.day?' selected':''}>${d.d}</option>`).join('')}</select><select id="xc">${CATS.map(k=>`<option${k==e.cat?' selected':''}>${k}</option>`).join('')}</select></div>${editExtra(e)}<div class="f" style="width:100%"><input id="xa" type="number" inputmode="numeric" value="${v}"><select id="xk"><option value="JPY"${c=='JPY'?' selected':''}>¥ 日幣</option><option value="TWD"${c=='TWD'?' selected':''}>NT$ 台幣</option></select><button class="btn" onclick="saveE(${e.id})">儲存</button><button class="btn o" onclick="editId=-1;draw()">取消</button></div></div>`};
async function saveE(id){const e=S.exp.find(x=>x.id==id),v=+document.getElementById('xa').value;if(!e||!v)return;const g=k=>document.getElementById(k),c=g('xk').value;Object.assign(e,{name:g('xn').value||e.name,day:+g('xd').value,cat:g('xc').value,cur:c,orig:v,amt:c=='TWD'?Math.round(v/S.rate):v});if(g('xs').checked){e.split=1;e.n=Math.max(2,+g('xp').value||2)}else{delete e.split;delete e.n}if(g('xf').files.length)await attach(id,g('xf').files);save();editId=-1;draw()}
const curSel=id=>`<select id="${id}c" onchange="S.cur=this.value;save()"><option value="JPY"${S.cur!='TWD'?' selected':''}>¥ 日幣</option><option value="TWD"${S.cur=='TWD'?' selected':''}>NT$ 台幣</option></select>`;
const closeS=()=>document.getElementById('shade').classList.remove('on');
async function addE(day,cat,name,id){const v=+document.getElementById(id).value;if(!v)return;const g=k=>document.getElementById(id+k),c=(g('c')||{}).value||'JPY',e={id:S.nid++,day,cat,name,amt:c=='TWD'?Math.round(v/S.rate):v,cur:c,orig:v};if(g('s')&&g('s').checked){e.split=1;e.n=Math.max(2,+(g('n')||{}).value||2)}S.exp.push(e);if(g('f')&&g('f').files.length)await attach(e.id,g('f').files);save();closeS();draw()}
function delE(id){delete A[id];saveA();S.exp=S.exp.filter(e=>e.id!=id);save();draw()}
function mapSvg(x){const pts=x.pts.map(p=>pr(p.la,p.lo)),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
 const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),span=Math.max(x1-x0,y1-y0,30),s=span/45,cx=(x0+x1)/2,cy=(y0+y1)/2,w=Math.max(x1-x0,y1-y0,30)*1.7+span*.3,h=w/1.1;
 let g=`<polygon points="${OUT.map(p=>pr(...p).join(',')).join(' ')}" fill="var(--land)" stroke="var(--ln)" stroke-width="${s*.3}"/><polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="var(--rt)" stroke-width="${s*.5}" stroke-dasharray="${s*1.4} ${s*.8}" stroke-linejoin="round"/>`;
 x.legs.forEach((l,i)=>{const a=pts[i],b=pts[i+1],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;g+=`<rect x="${mx-s*5.2}" y="${my-s*1.5}" width="${s*10.4}" height="${s*2.2}" rx="${s*.6}" fill="var(--card)" stroke="var(--rt)" stroke-width="${s*.15}"/><text x="${mx}" y="${my+s*.1}" font-size="${s*1.3}" text-anchor="middle" fill="var(--tx)">${l[0]}km · ${fmt(l[1])}</text>`});
 x.pts.forEach((p,i)=>{const [px,py]=pts[i],r=s*(i==hi?2.2:1.7),c=p.t=='s'?'#c92a2a':p.t=='a'?'#2b8a3e':'var(--ac)';
  g+=`<g style="cursor:pointer" onclick="if(!window.DR){hi=${i};openS(cur,${i});draw()}"><circle cx="${px}" cy="${py}" r="${r}" fill="${c}" stroke="#fff" stroke-width="${s*.25}"/><text x="${px}" y="${py+r*.35}" font-size="${r*1.1}" text-anchor="middle">${p.ic}</text><text x="${px+r*1.3}" y="${py-r*.5}" font-size="${s*1.5}" fill="var(--tx)" stroke="var(--card)" stroke-width="${s*.35}" paint-order="stroke">${p.n}</text></g>`});
 const b0=[cx-w/2,cy-h/2,w,h];if(!(VB&&VBd==cur)){VB=b0;VBd=cur}VB0=b0;return `<svg id="msvg" viewBox="${VB.join(' ')}">${g}</svg>`}
const OCRLIB={url:'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js',p:null};
function loadOCR(){if(window.Tesseract)return Promise.resolve();if(OCRLIB.p)return OCRLIB.p;OCRLIB.p=new Promise((res,rej)=>{const s=document.createElement('script');s.src=OCRLIB.url;s.onload=res;s.onerror=()=>{OCRLIB.p=null;rej(new Error('無法載入辨識引擎，請確認網路連線'))};document.head.appendChild(s)});return OCRLIB.p}
async function ocrText(src){await loadOCR();const w=await Tesseract.createWorker(['jpn','chi_tra','eng']);try{const r=await w.recognize(src);return r.data.text}finally{await w.terminate()}}
function parseReceipt(t){const lines=t.split(/\n/).map(s=>s.trim()).filter(Boolean);
 const cur=/NT\$|TWD|台幣|元/.test(t)&&!/¥|円|JPY/.test(t)?'TWD':'JPY';
 const nums=s=>[...s.matchAll(/\d{1,3}(?:[,，.]\d{3})+|\d{2,8}/g)].map(m=>+m[0].replace(/[,，.]/g,'')).filter(n=>n>0&&n<1e7);
 const K=/合計|合计|総計|総額|お会計|税込|小計|total|amount|金額|應付|實付|應收|¥|円|NT\$|元/i,TOP=/合計|合计|総計|総額|お会計|total|應付|實付|應收/i;
 const cand=[];lines.forEach(l=>{if(K.test(l))nums(l).forEach(n=>cand.push({n,p:TOP.test(l)?2:1}))});
 if(!cand.length)lines.forEach(l=>nums(l).forEach(n=>cand.push({n,p:0})));
 if(!cand.length)return null;cand.sort((a,b)=>b.p-a.p||b.n-a.n);
 const name=lines.find(l=>l.length>1&&l.length<30&&!/\d{3,}|合計|total|receipt|領收|收據/i.test(l))||'';
 return{amount:cand[0].n,cur,name}}
async function recog(fid,aid,cid,nid){const f=document.getElementById(fid).files[0];
 if(!f||!f.type.startsWith('image/')){alert('請先選擇收據圖片（PDF 無法辨識）。');return}
 const r0=await new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
 try{const r=parseReceipt(await ocrText(r0));if(!r){alert('未辨識到金額，請手動輸入。');return}
  document.getElementById(aid).value=r.amount;const c=document.getElementById(cid);if(c)c.value=r.cur;
  const nm=document.getElementById(nid);if(nm&&!nm.value&&r.name)nm.value=r.name;
  alert('辨識結果：'+(r.cur=='TWD'?'NT$ ':'¥')+r.amount.toLocaleString()+'\n請確認金額與幣別後再儲存。')}
 catch(e){alert('辨識失敗：'+(e.message||e)+'\n（預覽環境可能不支援，請使用 GitHub／Vercel 版本。）')}}
const RCSS='body,.rp{font:13px/1.5 "Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;color:#111}.rp{padding:4px}h1{font-size:20px;margin:0 0 4px}.s{color:#555;margin-bottom:14px}table{width:100%;border-collapse:collapse;margin-bottom:16px}th,td{border-bottom:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top}th{background:#f3f5f8}.r{text-align:right;white-space:nowrap}.t{font-size:15px;font-weight:700}.mu{color:#666;font-size:12px}.ap{break-inside:avoid;margin-bottom:12px}.ap img{width:46%;margin:4px 2%;border:1px solid #ddd;border-radius:6px;vertical-align:top}.btn{padding:8px 14px;background:#0b6bcb;color:#fff;border:0;border-radius:8px;cursor:pointer}@media print{.btn{display:none}}';
const PDFLIB={url:'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js',p:null};
function loadPDF(){if(window.html2pdf)return Promise.resolve();if(PDFLIB.p)return PDFLIB.p;PDFLIB.p=new Promise((res,rej)=>{const s=document.createElement('script');s.src=PDFLIB.url;s.onload=res;s.onerror=()=>{PDFLIB.p=null;rej(new Error('無法載入 PDF 產生器，請確認網路連線'))};document.head.appendChild(s)});return PDFLIB.p}
function reportBody(){
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const T=tot(),bud=+S.budget||0;
 const rows=S.exp.map(e=>`<tr><td>${esc(D[e.day]?D[e.day].d:'')}</td><td>${esc(e.name)}</td><td>${esc(e.cat)}</td><td class="r">${W(tw(e))}</td><td class="r">${e.cur!='TWD'?Y(e.amt):'—'}</td><td>${e.split?`÷${e.n} → ${W(tw(e)/e.n)}/人`:''}</td><td>${(A[e.id]||[]).length?(A[e.id].length+' 件附件'):''}</td></tr>`).join('');
 const cats=CATS.map(c=>{const v=S.exp.filter(e=>e.cat==c).reduce((a,e)=>a+tw(e),0);return v?`<tr><td>${c}</td><td class="r">${W(v)}</td></tr>`:''}).join('');
 const split=S.exp.filter(e=>e.split);
 const sp=split.length?`<h3>平分明細</h3><table><tr><th>項目</th><th class="r">總額</th><th>人數</th><th class="r">每人</th></tr>${split.map(e=>`<tr><td>${esc(e.name)}</td><td class="r">${W(tw(e))}</td><td>${e.n}</td><td class="r">${W(tw(e)/e.n)}</td></tr>`).join('')}<tr><td colspan="3"><b>每人分攤合計</b></td><td class="r"><b>${W(split.reduce((a,e)=>a+tw(e)/e.n,0))}</b></td></tr></table>`:'';
 const pics=S.exp.filter(e=>(A[e.id]||[]).some(a=>a.t!='application/pdf')).map(e=>`<div class="ap"><div class="mu">${esc(D[e.day]?D[e.day].d:'')} · ${esc(e.name)} · ${W(tw(e))}</div>${A[e.id].filter(a=>a.t!='application/pdf').map(a=>`<img src="${a.d}" alt="">`).join('')}</div>`).join('');
 return `<h1>🚗 北海道 8天7夜自駕花費明細</h1><div class="s">2027/6/30 – 7/7 ・ 以台幣計價（日幣依匯率 ${S.rate} 換算）</div><p class="t">總計：${W(T)}（約 ${Y(T/S.rate)}）${bud?` ・ 預算 ${W(bud)}，剩餘 ${W(bud-T)}`:''}</p><h3>分類</h3><table><tr><th>分類</th><th class="r">金額（NT$）</th></tr>${cats}</table><h3>明細</h3><table><tr><th>日期</th><th>項目</th><th>分類</th><th class="r">台幣</th><th class="r">原始日幣</th><th>平分</th><th>附件</th></tr>${rows||'<tr><td colspan="7">尚無紀錄</td></tr>'}</table>${sp}${pics?'<h3>收據附件</h3>'+pics:''}`}
function exportRep(){
 const html=`<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="utf-8"><title>北海道自駕花費明細</title><style>${RCSS}body{margin:24px}</style></head><body>${reportBody()}<button class="btn" onclick="print()">列印／存成 PDF</button><script>addEventListener('load',()=>setTimeout(()=>{try{print()}catch(e){}},400))<\/script></body></html>`;
 const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
 const w=window.open(url,'_blank');
 if(!w){const a=document.createElement('a');a.href=url;a.download='hokkaido-expenses.html';document.body.appendChild(a);a.click();a.remove();alert('瀏覽器阻擋了新分頁，已改為下載報表檔。請用瀏覽器開啟後按「列印／存成 PDF」。')}
}
async function exportPDF(){
 try{await loadPDF()}catch(e){alert(e.message);return}
 const wrap=document.createElement('div');wrap.className='rp';wrap.style.cssText='position:absolute;left:0;top:0;width:794px;background:#fff;color:#111;padding:28px;z-index:-1';
 wrap.innerHTML=`<style>${RCSS}</style>`+reportBody();document.body.appendChild(wrap);
 try{await html2pdf().set({margin:10,filename:'hokkaido-expenses.pdf',image:{type:'jpeg',quality:.95},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy']}}).from(wrap).save()}
 catch(e){alert('PDF 產生失敗：'+(e.message||e))}
 finally{wrap.remove()}
}
function decPoly(t){let i=0,la=0,lo=0,o=[];while(i<t.length){let b,sh=0,r=0;do{b=t.charCodeAt(i++)-63;r|=(b&31)<<sh;sh+=5}while(b>=32);la+=(r&1)?~(r>>1):r>>1;sh=0;r=0;do{b=t.charCodeAt(i++)-63;r|=(b&31)<<sh;sh+=5}while(b>=32);lo+=(r&1)?~(r>>1):r>>1;o.push([la/1e5,lo/1e5])}return o}
let VB=null,VBd=-1,VB0=null,LM=null,LD=-1,RT={},RTc={};window.DR=false;
try{RTc=JSON.parse(localStorage.getItem('hk29r')||'{}')}catch(e){}
Object.keys(RTc).forEach(i=>{if(D[i]&&RTc[i].p){RT[i]={p:RTc[i].p,g:decPoly(RTc[i].p),legs:RTc[i].legs};D[i].legs=RTc[i].legs}});
const zoomCtl=()=>`<div class="zc"><button onclick="zoomBy(1.4)" aria-label="放大">＋</button><button onclick="zoomBy(1/1.4)" aria-label="縮小">－</button><button onclick="zoomReset()" aria-label="重設">⟲</button></div>`;
function zoomBy(k,fx,fy){const s=document.getElementById('msvg');if(!s||!VB)return;const [x,y,w,h]=VB,ax=fx==null?.5:fx,ay=fy==null?.5:fy,nw=Math.min(Math.max(w/k,VB0[2]/14),VB0[2]*1.8),nh=nw*h/w;VB=[x+(w-nw)*ax,y+(h-nh)*ay,nw,nh];s.setAttribute('viewBox',VB.join(' '))}
function zoomReset(){const s=document.getElementById('msvg');if(!s)return;VB=VB0;s.setAttribute('viewBox',VB.join(' '))}
function svgInit(){const s=document.getElementById('msvg');if(!s)return;
 s.addEventListener('wheel',e=>{e.preventDefault();const r=s.getBoundingClientRect();zoomBy(e.deltaY<0?1.2:1/1.2,(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height)},{passive:false});
 let d=null;s.addEventListener('pointerdown',e=>{d={x:e.clientX,y:e.clientY,m:false}});
 s.addEventListener('pointermove',e=>{if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.m&&Math.hypot(dx,dy)<5)return;d.m=true;window.DR=true;const r=s.getBoundingClientRect(),k=Math.min(r.width/VB[2],r.height/VB[3]);VB=[VB[0]-dx/k,VB[1]-dy/k,VB[2],VB[3]];d.x=e.clientX;d.y=e.clientY;s.setAttribute('viewBox',VB.join(' '))});
 addEventListener('pointerup',()=>{d=null;setTimeout(()=>{window.DR=false},0)})}
function lmap(){const x=D[cur],el=document.getElementById('mapbox');if(!el)return;let keep=null;
 if(LM){if(LD==cur)keep={c:LM.getCenter(),z:LM.getZoom()};try{LM.remove()}catch(e){}LM=null}
 LM=L.map(el);LD=cur;
 const osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}),sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,attribution:'Tiles © Esri'});
 osm.addTo(LM);L.control.layers({'OpenStreetMap':osm,'衛星':sat},null,{position:'topleft'}).addTo(LM);
 const ll=x.pts.map(p=>[p.la,p.lo]),r=RT[cur];
 L.polyline(r?r.g:ll,{color:'#e8590c',weight:4,opacity:.85,dashArray:r?null:'8 8'}).addTo(LM);
 x.legs.forEach((l,i)=>{const a=ll[i],b=ll[i+1];L.marker([(a[0]+b[0])/2,(a[1]+b[1])/2],{interactive:false,icon:L.divIcon({className:'',html:`<div class="lg">${l[0]}km · ${fmt(l[1])}</div>`,iconSize:[0,0]})}).addTo(LM)});
 x.pts.forEach((p,i)=>{const c=p.t=='s'?'#c92a2a':p.t=='a'?'#2b8a3e':'#0b6bcb',z=i==hi?42:34;
  L.marker(ll[i],{icon:L.divIcon({className:'',html:`<div class="pin" style="background:${c};width:${z}px;height:${z}px;font-size:${Math.round(z*.55)}px">${p.ic}</div>`,iconSize:[z,z],iconAnchor:[z/2,z/2]})}).addTo(LM).bindTooltip(p.n,{permanent:true,direction:'right',offset:[z/2,0],className:'lbl'}).on('click',()=>{hi=i;openS(cur,i);draw()})});
 if(keep)LM.setView(keep.c,keep.z);else LM.fitBounds(L.latLngBounds(r?r.g:ll),{padding:[40,40]})}
function afterDraw(){if(view!=0){if(LM){try{LM.remove()}catch(e){}LM=null}return}window.L?lmap():svgInit()}
async function loadRoutes(){for(let i=1;i<D.length;i++){if(RT[i])continue;const c=D[i].pts.map(p=>p.lo+','+p.la).join(';');
 try{const j=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${c}?overview=full&geometries=polyline`)).json();if(j.code!='Ok')continue;const r=j.routes[0];
  RT[i]={p:r.geometry,g:decPoly(r.geometry),legs:r.legs.map(l=>[Math.round(l.distance/100)/10,Math.round(l.duration/60)])};D[i].legs=RT[i].legs;
  try{localStorage.setItem('hk29r',JSON.stringify(Object.fromEntries(Object.entries(RT).map(([k,v])=>[k,{p:v.p,legs:v.legs}]))))}catch(e){}view==0?draw():kpi()}catch(e){}
 await new Promise(r=>setTimeout(r,1100))}}
function draw(){
 document.getElementById('n0').classList.toggle('on',view==0);document.getElementById('n1').classList.toggle('on',view==1);
 tabs.style.display=view==0?'flex':'none';[...tabs.children].forEach((b,i)=>b.classList.toggle('on',i==cur));kpi();
 main.innerHTML=view==0?trip():cost();afterDraw()}
function trip(){const x=D[cur],[tk,tm]=sum(x);
 let h=`<div class="map" id="mapbox">${window.L?'':mapSvg(x)+zoomCtl()}</div><div><div class="card"><h2>${x.d} ${x.t}</h2>${x.note?`<div class="mu">${x.note}</div>`:''}${RT[cur]?'<div class="mu">✓ 里程與時間依 OSRM 實際道路路線計算</div>':''}<div class="stat"><div><b>${tk} km</b>開車距離</div><div><b>${fmt(tm)}</b>開車時間</div><div><b>${W(dsum(cur))}</b>當日花費</div></div><a class="btn" target="_blank" rel="noopener" href="${dayDir(x.pts)}">🧭 在 Google Maps 開啟當日完整路線</a></div><div class="card">`;
 x.pts.forEach((p,i)=>{h+=`<div class="step${i==hi?' hi':''}" onclick="hi=${i};openS(${cur},${i});draw()"><span class="ic ${p.t}">${p.ic}</span><div style="flex:1"><b>${p.n}</b><div class="mu">${p.stay||p.tip||''}</div></div><span class="mu">›</span></div>`;
  if(x.legs[i])h+=`<div class="leg">🚗 ${x.legs[i][0]} km · 約 ${fmt(x.legs[i][1])} <a target="_blank" rel="noopener" href="${dir(p,x.pts[i+1])}">Google Maps 導航 ↗</a></div>`});
 h+='</div>';
 if(cur==0){h+=`<div class="card"><h2>每日開車總覽</h2>`;D.slice(1).forEach((d,i)=>{const [k,m]=sum(d);h+=`<div class="row" style="cursor:pointer" onclick="cur=${i+1};draw()"><span>${d.d} ${d.t}</span><span class="mu">${k}km · ${fmt(m)}</span></div>`});h+='</div>'}
 return h+'</div>'}
function rowHtml(e){const d=D[e.day]?D[e.day].d.split(' ')[0]:'';
 return `<tr><td>${d}</td><td><b>${e.name}</b>${attHtml(e)}</td><td><span class="tag">${e.cat}</span></td><td class="rr"><b>${W(tw(e))}</b></td><td class="rr mu">${e.cur!='TWD'?Y(e.amt):'—'}</td><td>${e.split?`÷${e.n}<br><b>${W(tw(e)/e.n)}</b> /人`:''}</td><td class="rr"><button class="x" onclick="editId=${e.id};draw()">✏️</button><button class="x" onclick="delE(${e.id})">🗑</button></td></tr>`}
function addRow(){const n=document.getElementById('en').value||document.getElementById('ec').value;addE(+document.getElementById('ed').value,document.getElementById('ec').value,n,'ea')}
function cost(){const T=tot(),bud=+S.budget||0,sh=S.exp.filter(e=>e.split).reduce((a,e)=>a+tw(e)/e.n,0);
 const by=CATS.map(c=>S.exp.filter(e=>e.cat==c).reduce((a,e)=>a+tw(e),0));
 const days=D.slice(1).map((d,i)=>{const L=S.exp.filter(e=>e.day==i+1);return `<tr><td>${d.d}</td><td class="rr">${L.length} 筆</td><td class="rr"><b>${W(dsum(i+1))}</b></td></tr>`}).join('');
 const cats=CATS.map((c,i)=>by[i]?`<div style="margin-top:6px"><div class="row" style="border:0;padding:0"><span>${c}</span><span>${W(by[i])}</span></div><div class="bar"><i style="width:${T?by[i]/T*100:0}%;background:${CC[i]}"></i></div></div>`:'').join('')||'<div class="mu">尚無紀錄</div>';
 const rows=S.exp.slice().sort((a,b)=>a.day-b.day||a.id-b.id).map(e=>editId==e.id?`<tr><td colspan="7">${editRow(e)}</td></tr>`:rowHtml(e)).join('');
 const add=`<tr class="addrow"><td><select id="ed">${D.slice(1).map((d,i)=>`<option value="${i+1}">${d.d.split(' ')[0]}</option>`).join('')}</select></td><td><input id="en" placeholder="項目"></td><td><select id="ec">${CATS.map(c=>`<option>${c}</option>`).join('')}</select></td><td colspan="2"><div class="f" style="flex-wrap:nowrap"><input id="ea" type="number" inputmode="numeric" placeholder="金額">${curSel('ea')}</div></td><td><label class="mu"><input type="checkbox" id="eas"> 平分</label> <input id="ean" type="number" min="2" value="2" style="width:56px"></td><td class="rr"><input id="eaf" type="file" accept="image/*,application/pdf" multiple style="max-width:120px"><div class="f" style="flex-wrap:nowrap;justify-content:flex-end"><button class="btn o" onclick="recog('eaf','ea','eac','en')">🔍</button><button class="btn" onclick="addRow()">＋ 新增</button></div></td></tr>`;
 return `<div class="cw" style="grid-column:1/-1">
 <div class="card"><h2>💴 花費摘要</h2>
  <div class="stat"><div><b>${W(T)}</b>台幣合計</div><div><b>${Y(T/S.rate)}</b>約合日幣</div><div><b>${bud?W(bud-T):'—'}</b>預算剩餘</div><div><b>${S.exp.length}</b>筆數</div><div><b>${W(sh)}</b>平分每人合計</div></div>
  <div class="f"><label class="mu">預算（NT$）<input type="number" inputmode="numeric" value="${bud||''}" onchange="S.budget=+this.value;save();draw()"></label><label class="mu">匯率（JPY→TWD）<input type="number" step="0.001" value="${S.rate}" onchange="S.rate=+this.value||0.21;save();draw()"></label></div>${bud?hint(T,bud):''}
  <div class="two"><div><h3 class="sh">分類占比</h3>${cats}</div><div><h3 class="sh">每日小計</h3><table class="tb"><tbody>${days}</tbody></table></div></div>
 </div>
 <div class="card"><h2>🧾 花費清單</h2><div class="wrap"><table class="tb"><thead><tr><th>日期</th><th>項目</th><th>分類</th><th class="rr">台幣</th><th class="rr">原始</th><th>平分</th><th class="rr">操作</th></tr></thead><tbody>${add}${rows||'<tr><td colspan="7" class="mu">尚無紀錄，請於上方新增</td></tr>'}</tbody></table></div></div>
 </div>`}
function hint(T,bud){return `<div class="bar"><i style="width:${Math.min(100,T/bud*100)}%;background:${T>bud?'#e03131':'var(--ac)'}"></i></div>`}

draw();
if(window.L)loadRoutes();
