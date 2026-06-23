"use client";
import { useState, useEffect, useRef } from "react";

// ─── TOKENS ──────────────────────────────────────────────────
const G  = "#C9A84C";
const GL = "#E8D5A3";
const BG = "#0A0A0A";
const S1 = "#111111";
const BD = "#252525";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  select option{background:#111;color:#fff}
  input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
  input:focus,select:focus,textarea:focus{border-color:${G}!important;box-shadow:0 0 0 3px rgba(201,168,76,.15)!important;outline:none!important}
  .bg{background-color:${G}!important}
  .btn-g:hover{background-color:${GL}!important;transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.38)!important}
  .btn-o:hover{background-color:rgba(201,168,76,.1)!important;transform:translateY(-1px)}
  .card-h:hover{border-color:${G}!important;transform:translateY(-6px);box-shadow:0 20px 48px rgba(0,0,0,.6)}
  .card-h,.svc-c{transition:all .3s ease}
  .svc-c:hover{border-color:${G}!important;transform:translateY(-5px)}
  .tog{transition:all .18s ease}
  @keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  .fu{animation:fu .5s ease both}
  .divider{height:1px;background:linear-gradient(90deg,transparent,${G}33,transparent);max-width:680px;margin:0 auto}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#8A6E24;border-radius:2px}
`;

const iS = {
  width:"100%",backgroundColor:"#0D0D0D",color:"#fff",
  border:`1px solid ${BD}`,borderRadius:7,padding:"11px 14px",
  fontSize:15,outline:"none",WebkitAppearance:"none",appearance:"none",
  transition:"border-color .2s,box-shadow .2s",
};
const lS = {
  display:"block",color:GL,fontSize:11,marginBottom:7,
  fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",
};
const fS  = { marginBottom:18 };
const bG  = {
  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
  padding:"14px 28px",backgroundColor:G,color:"#000",
  fontWeight:900,fontSize:15.5,borderRadius:7,border:"none",
  cursor:"pointer",letterSpacing:"0.05em",transition:"all .22s",width:"100%",
};

const CITIES  = ["台北市","新北市","桃園市","其他"];
const LAYOUTS = ["套房","1房1廳","2房1廳","2房2廳","3房2廳","4房以上"];

// ─── CONTACT ─────────────────────────────────────────────────
const PHONE = "0939150692";
const LINE  = "https://line.me/ti/p/ucFzbt9tdX";
const FB    = "https://www.facebook.com/share/193ncyJBgf/?mibextid=wwXIfr";

// ─── 114年社宅租金單價表（元/坪/月）──────────────────────────
// 台北/新北欄位：[<5,<10,<15,<20,<25,<30,<40,40+]（8欄，30-40合併）
// 桃園欄位：[<5,<10,<15,<20,<25,<30,<35,<40,40+]（9欄）
const RENT = {
  台北市:{ nine:false,
    整層:{大安區:[1725,1715,1695,1670,1640,1605,1575,1500],中山區:[1725,1715,1695,1670,1640,1605,1575,1500],中正區:[1705,1690,1675,1645,1615,1585,1555,1480],信義區:[1705,1690,1675,1645,1615,1585,1555,1480],大同區:[1680,1665,1650,1625,1595,1565,1535,1460],松山區:[1680,1665,1650,1625,1595,1565,1535,1460],南港區:[1545,1530,1515,1490,1465,1435,1410,1340],萬華區:[1545,1530,1515,1490,1465,1435,1410,1340],士林區:[1495,1485,1470,1445,1420,1395,1365,1300],內湖區:[1495,1485,1470,1445,1420,1395,1365,1300],文山區:[1415,1405,1390,1370,1345,1320,1295,1230],北投區:[1415,1405,1390,1370,1345,1320,1295,1230]},
    套房:{大安區:[2475,2435,2390,2350,2290,2225,2165,2060],中山區:[2365,2325,2290,2250,2190,2130,2070,1970],松山區:[2305,2270,2230,2190,2135,2075,2020,1920],信義區:[2220,2185,2150,2110,2055,2000,1945,1850],中正區:[2175,2140,2100,2065,2010,1955,1905,1810],大同區:[2160,2125,2090,2055,2000,1945,1890,1800],南港區:[2160,2125,2090,2055,2000,1945,1890,1800],萬華區:[2160,2125,2090,2055,2000,1945,1890,1800],士林區:[2040,2010,1975,1940,1890,1840,1785,1700],內湖區:[2040,2010,1975,1940,1890,1840,1785,1700],文山區:[1920,1890,1860,1825,1780,1730,1680,1600],北投區:[1920,1890,1860,1825,1780,1730,1680,1600]} },
  新北市:{ nine:false,
    整層:{三重區:[1380,1370,1360,1335,1310,1285,1260,1200],永和區:[1210,1200,1190,1170,1145,1125,1105,1050],板橋區:[1185,1175,1165,1145,1125,1105,1085,1030],中和區:[1165,1155,1145,1125,1105,1085,1065,1010],新店區:[1060,1050,1040,1025,1005,985,970,920],新莊區:[1050,1040,1030,1015,995,975,960,910],蘆洲區:[1050,1040,1030,1015,995,975,960,910],土城區:[1015,1005,995,980,960,945,925,880],汐止區:[980,970,965,945,930,910,895,850],林口區:[920,915,905,890,875,860,840,800],泰山區:[920,915,905,890,875,860,840,800],五股區:[890,880,875,855,840,825,810,770],樹林區:[890,880,875,855,840,825,810,770],三峽區:[795,790,780,770,755,740,725,690],鶯歌區:[750,745,735,725,710,700,685,650],淡水區:[715,710,705,690,680,665,655,620],八里區:[645,640,635,625,615,600,590,560],深坑區:[635,630,625,615,600,590,580,550],金山區:[460,460,455,445,440,430,420,400],三芝區:[440,435,430,425,415,410,400,380],石門區:[430,425,420,415,405,400,390,370],石碇區:[430,425,420,415,405,400,390,370],貢寮區:[430,425,420,415,405,400,390,370],瑞芳區:[430,425,420,415,405,400,390,370],萬里區:[430,425,420,415,405,400,390,370],其他:[360,355,355,345,340,335,330,310]},
    套房:{三重區:[1815,1785,1755,1725,1680,1635,1590,1510],永和區:[1790,1760,1730,1700,1655,1610,1565,1490],板橋區:[1780,1750,1720,1690,1645,1600,1555,1480],中和區:[1670,1645,1615,1585,1545,1505,1460,1390],新店區:[1670,1645,1615,1585,1545,1505,1460,1390],土城區:[1600,1570,1545,1520,1480,1440,1400,1330],新莊區:[1600,1570,1545,1520,1480,1440,1400,1330],汐止區:[1405,1385,1360,1335,1300,1265,1230,1170],蘆洲區:[1405,1385,1360,1335,1300,1265,1230,1170],林口區:[1320,1300,1280,1255,1225,1190,1155,1100],泰山區:[1320,1300,1280,1255,1225,1190,1155,1100],樹林區:[1225,1205,1185,1165,1135,1105,1075,1020],深坑區:[1200,1180,1160,1145,1110,1080,1050,1000],三峽區:[1155,1135,1115,1095,1070,1040,1010,960],五股區:[1105,1090,1070,1050,1025,995,970,920],淡水區:[1105,1090,1070,1050,1025,995,970,920],八里區:[1010,995,975,960,935,910,885,840],鶯歌區:[900,885,870,860,835,810,790,750],金山區:[660,650,640,630,615,595,580,550],萬里區:[660,650,640,630,615,595,580,550],三芝區:[640,630,615,605,590,575,560,530],石門區:[640,630,615,605,590,575,560,530],石碇區:[640,630,615,605,590,575,560,530],貢寮區:[640,630,615,605,590,575,560,530],瑞芳區:[640,630,615,605,590,575,560,530],其他:[385,380,375,365,360,350,340,320]} },
  桃園市:{ nine:true,
    整層:{龜山區:[855,840,825,805,785,760,740,710,675],桃園區:[780,770,755,735,720,700,680,650,620],中壢區:[770,760,745,725,705,685,670,640,610],蘆竹區:[745,735,720,705,685,665,645,620,590],八德區:[735,720,710,690,675,655,635,610,580],大園區:[735,720,710,690,675,655,635,610,580],平鎮區:[720,710,700,680,660,645,625,600,570],觀音區:[700,685,675,660,640,625,605,580,555],楊梅區:[615,605,595,580,565,550,535,510,485],新屋區:[580,570,560,545,530,515,500,480,460],龍潭區:[580,570,560,545,530,515,500,480,460],大溪區:[565,555,550,535,520,505,490,470,450],復興區:[375,370,360,355,345,335,325,310,295]},
    套房:{龜山區:[1225,1205,1185,1155,1125,1095,1065,1020,970],蘆竹區:[1180,1160,1140,1110,1080,1050,1020,980,935],桃園區:[1120,1100,1080,1055,1025,1000,970,930,885],中壢區:[1080,1065,1045,1020,995,965,940,900,855],八德區:[1045,1030,1010,985,960,935,905,870,830],大園區:[1045,1030,1010,985,960,935,905,870,830],平鎮區:[900,885,870,850,830,805,780,750,715],觀音區:[900,885,870,850,830,805,780,750,715],楊梅區:[830,815,805,780,760,740,720,690,660],龍潭區:[830,815,805,780,760,740,720,690,660],大溪區:[710,700,685,670,650,635,615,590,565],新屋區:[625,615,605,590,575,560,545,520,495],復興區:[385,380,375,365,355,345,335,320,305]} },
  其他:{ nine:false,
    整層:{"（其他縣市）":[700,690,680,665,650,635,615,580]},
    套房:{"（其他縣市）":[1000,985,965,945,920,895,865,820]} },
};

const DISTRICTS = {
  台北市:Object.keys(RENT.台北市.整層),
  新北市:Object.keys(RENT.新北市.整層),
  桃園市:Object.keys(RENT.桃園市.整層),
  其他:["（其他縣市）"],
};

// 屋齡 → 級距索引
function brIdx(age,nine){
  const a=parseInt(age)||10;
  if(nine){ return a<5?0:a<10?1:a<15?2:a<20?3:a<25?4:a<30?5:a<35?6:a<40?7:8; }
  return a<5?0:a<10?1:a<15?2:a<20?3:a<25?4:a<30?5:a<40?6:7;
}
// 查單價（元/坪/月）
function rentRate(city,district,layout,age){
  const c=RENT[city]||RENT.其他;
  const type=layout==="套房"?"套房":"整層";
  const table=c[type];
  const row=table[district]||Object.values(table)[0];
  return row[brIdx(age,c.nine)];
}
const LOC_OPTS  = ["優質","中上","中下"];        // 區位調整率 +5/+3/0
const RENO_OPTS = ["中等","簡易","無"];          // 裝修調整率 +5/+3/0
const round100=n=>Math.round(n/100)*100;
const round500=n=>Math.round(n/500)*500;
const fmt = n => n > 0 ? `NT$ ${Math.round(n).toLocaleString()}` : "—";
const wan = n => n > 0 ? `${(n/10000).toFixed(0)} 萬` : "—";

// ─── HOOKS / ATOMS ────────────────────────────────────────────
function useCounter(target, dur=1200) {
  const [v,setV] = useState(0);
  useEffect(()=>{
    if(!target){setV(0);return;}
    let c=0; const step=Math.max(1,target/(dur/16));
    const t=setInterval(()=>{c+=step;if(c>=target){setV(target);clearInterval(t);}else setV(Math.floor(c));},16);
    return()=>clearInterval(t);
  },[target,dur]);
  return v;
}

function Field({label,children}){
  return <div style={fS}><label style={lS}>{label}</label>{children}</div>;
}

function Tog({opts,val,onChange}){
  return(
    <div style={{display:"flex",gap:8}}>
      {opts.map(o=>(
        <button key={o} className="tog" style={{
          flex:1,padding:"10px 0",borderRadius:7,
          border:`1px solid ${val===o?G:"#2a2a2a"}`,
          backgroundColor:val===o?"rgba(201,168,76,.14)":"transparent",
          color:val===o?G:"#777",fontWeight:val===o?800:400,
          cursor:"pointer",fontSize:14,
        }} onClick={()=>onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

function Row({label,value,hi,lg,sub}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${BD}`}}>
      <span style={{color:sub?"#555":"#888",fontSize:sub?12:13}}>{label}</span>
      <span style={{color:hi?G:lg?GL:"#ddd",fontSize:lg?20:14,fontWeight:lg?900:hi?700:500}}>{value}</span>
    </div>
  );
}

function Stars({n}){
  return(
    <div style={{display:"flex",gap:3}}>
      {[1,2,3,4,5].map(i=><span key={i} style={{fontSize:20,color:i<=n?G:"#2a2a2a"}}>★</span>)}
    </div>
  );
}

function Hdr({tag,title,desc}){
  return(
    <div style={{textAlign:"center",marginBottom:26}}>
      {tag&&<p style={{color:G,fontSize:10.5,letterSpacing:"0.24em",fontWeight:700,textTransform:"uppercase",marginBottom:7}}>{tag}</p>}
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:8}}>{title}</h2>
      {desc&&<p style={{color:"#666",fontSize:13.5,lineHeight:1.6}}>{desc}</p>}
    </div>
  );
}

function BottomNav({setPage,active}){
  const items=[
    {id:"home",ic:"⌂",lb:"首頁"},
    {id:"rental",ic:"▦",lb:"試算"},
    {id:"line",ic:"◯",lb:"LINE",href:LINE},
    {id:"lead",ic:"?",lb:"諮詢"},
  ];
  return(
    <nav style={{position:"sticky",bottom:0,zIndex:100,backgroundColor:"rgba(10,10,10,.96)",backdropFilter:"blur(12px)",borderTop:`1px solid ${BD}`,display:"flex",padding:"8px 0 calc(8px + env(safe-area-inset-bottom))"}}>
      {items.map(it=>{
        const on=active===it.id;
        const inner=(
          <>
            <span style={{fontSize:18,lineHeight:1}}>{it.ic}</span>
            <span style={{fontSize:11,fontWeight:on?700:400}}>{it.lb}</span>
          </>
        );
        const st={flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,}as const;background:"none",border:"none",cursor:"pointer",color:on?G:"#666",textDecoration:"none",padding:"4px 0"};
        return it.href
          ? <a key={it.id} href={it.href} style={st}>{inner}</a>
          : <button key={it.id} style={st} onClick={()=>setPage(it.id)}>{inner}</button>;
      })}
    </nav>
  );
}

function TopBar({setPage,title,sub}){
  useEffect(()=>{window.scrollTo(0,0);},[]);
  return(
    <header style={{position:"sticky",top:0,zIndex:100,backgroundColor:"rgba(10,10,10,.95)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${BD}`,padding:"13px 20px",display:"flex",alignItems:"center",gap:14}}>
      <button onClick={()=>setPage("home")} style={{background:"none",border:`1px solid ${BD}`,borderRadius:6,color:"#888",fontSize:13,padding:"6px 12px",cursor:"pointer",flexShrink:0}}>← 返回</button>
      <div style={{flex:1,minWidth:0}}>
        <p style={{color:G,fontSize:13,fontWeight:800,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{title}</p>
        {sub&&<p style={{color:"#555",fontSize:11}}>{sub}</p>}
      </div>
      <a href={`tel:${PHONE}`} style={{textDecoration:"none",flexShrink:0}}>
        <button style={{padding:"6px 14px",borderRadius:18,border:`1px solid ${G}44`,backgroundColor:"transparent",color:G,fontSize:11.5,fontWeight:700,cursor:"pointer"}}>
          📞 諮詢
        </button>
      </a>
    </header>
  );
}

function Shell({children,setPage,title,sub,active}){
  return(
    <div style={{backgroundColor:BG,color:"#fff",minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:"'Noto Sans TC','PingFang TC',sans-serif"}}>
      <style>{CSS}</style>
      <TopBar setPage={setPage} title={title} sub={sub}/>
      <div style={{flex:1}}>{children}</div>
      <footer style={{borderTop:`1px solid #181818`,padding:"20px",textAlign:"center"}}>
        <p style={{color:"#2a2a2a",fontSize:11}}>© 2025 榆您棋心找到理想的家｜安心寄寓・資產有託｜試算結果僅供參考，請洽專業人員確認</p>
      </footer>
      <BottomNav setPage={setPage} active={active}/>
    </div>
  );
}

// ─── CALC ENGINES ─────────────────────────────────────────────
function calcRental(d){
  const ping=Math.max(3,parseFloat(d.ping)||20);
  const age=parseInt(d.age)||10;
  const isSuite=d.layout==="套房";
  const rate=rentRate(d.city,d.district,d.layout,age);   // 元/坪/月（官方社宅單價）

  // 官方調整：區位 δL（+5/+3/0）、裝修 δD（+5/+3/0）、設備 ΔE（整層+2000／套房+1000）
  const dL={優質:0.05,中上:0.03,中下:0}[d.loc]??0;
  const dD={中等:0.05,簡易:0.03,無:0}[d.reno]??0;
  const dE=d.appliance==="有"?(isSuite?1000:2000):0;

  const evalRent=round100(rate*ping*(1+dL+dD)+dE);       // 社宅評定月租
  // 市場行情通常高於社宅評定（約 1.08~1.28 倍）
  const mktLow=round500(evalRent*1.08);
  const mktHigh=round500(evalRent*1.28);
  const mktMid=Math.round((mktLow+mktHigh)/2);

  let vac="低";
  if(d.city==="其他")vac="中";
  if(d.layout==="4房以上")vac="中";
  if(d.city==="其他"&&d.layout==="4房以上")vac="高";
  if(age>40&&d.elevator==="無")vac="中";

  const curr=parseFloat(d.currentRent)||0;
  let rat=d.city==="台北市"?5:d.city==="新北市"?4:3;
  if(curr>0){const r=curr/mktMid;rat=r>=.95?5:r>=.85?4:r>=.72?3:r>=.55?2:1;}

  const gPkg=(d.city==="台北市"||d.city==="新北市")&&ping>=20&&age<=20&&d.elevator==="有";
  const sOk=d.city!=="台北市"&&ping>=12&&ping<=35;
  let rec,note;
  if(gPkg){rec="包租代管";note="物件條件優良，符合包租代管標準。由我全程管理，保障穩定收益，消除空租困擾。";}
  else if(sOk){rec="社會住宅";note="物件適合加入民間社宅／包租代管，享穩定租金與稅賦優惠，降低空租風險。";}
  else{rec="一般出租";note="建議採一般市場出租，我可協助招租、帶看、簽約全流程。";}

  return{rate,evalRent,mktLow,mktHigh,mktMid,yearly:evalRent*12,vac,rat,rec,note,isSuite,dL,dD,dE,age};
}

function calcSale(d){
  const cp={台北市:90000,新北市:48000,桃園市:30000,其他:22000};
  const lm={套房:1.18,"1房1廳":1.08,"2房1廳":1.0,"2房2廳":1.04,"3房2廳":0.93,"4房以上":0.85};
  const ping=Math.max(5,parseFloat(d.ping)||25); const age=parseInt(d.age)||10;
  const aF=age>40?.72:age>30?.82:age>20?.90:age>10?.96:1;
  const eF=d.elevator==="有"?1.04:1; const pF=d.parking==="有"?1.06:1;
  const mid=Math.round((cp[d.city]||28000)*ping*(lm[d.layout]||1)*aF*eF*pF/10000)*10000;
  const low=Math.round(mid*.90/10000)*10000;
  const high=Math.round(mid*1.10/10000)*10000;
  const sp=parseFloat(d.salePrice)||0;
  const ac=parseFloat(d.acqCost)||0;
  const ay=parseInt(d.acqYear)||2015;
  const isNew=ay>=2016;
  const hold=Math.max(0,2025-ay);
  const self=d.selfUse==="是";
  const agentFee=Math.round(sp*.04);          // 賣方仲介費 4%
  const notary=12000;
  const gain=Math.max(0,sp-ac-agentFee-notary);

  // ── 土地增值稅（兩種制度都要繳）──
  // 有填實際金額用實際；否則以土地持分概估
  const landRatio=0.55;
  const manualLVT=parseFloat(d.landTax)||0;
  const lvtRate=self?0.10:0.30;               // 自用 10%、一般取中估 30%
  const landTax = sp>0 ? (manualLVT>0?manualLVT:Math.round(Math.max(0,sp-ac)*landRatio*lvtRate)) : 0;

  // ── 所得面：房地合一(新制) 或 財產交易所得稅(舊制)，二擇一 ──
  let incomeTax=0,txRate=0,incomeTaxName="",txNote="";
  if(isNew){
    incomeTaxName="房地合一稅";
    // 新制稅基可再減除土地漲價總數額（此處未扣，結果偏保守）
    const exempt=self&&hold>=6?4000000:0;
    const base=Math.max(0,gain-exempt);
    if(self&&hold>=6){txRate=10;txNote="自住設籍滿 6 年，10% 優惠稅率、免稅額 400 萬";}
    else if(hold<2){txRate=45;txNote="持有未滿 2 年，45%";}
    else if(hold<5){txRate=35;txNote="持有 2–5 年，35%";}
    else if(hold<10){txRate=20;txNote="持有 5–10 年，20%";}
    else{txRate=15;txNote="持有 10 年以上，15%";}
    incomeTax = sp>0&&ac>0 ? Math.round(base*txRate/100) : 0;
  } else {
    incomeTaxName="財產交易所得稅";
    // 舊制：房屋部分併入綜所稅（土地部分已課土增稅，不再課所得）
    incomeTax = sp>0&&ac>0 ? Math.round(Math.max(0,sp-ac)*(1-landRatio)*0.12) : 0;
    txNote="房屋部分併入綜所稅（概估 12%）；土地部分已課土地增值稅";
  }

  const tax = landTax + incomeTax;             // 總稅負 = 土增稅 + 所得面稅
  const net = sp>0 ? Math.max(0, sp - agentFee - notary - tax) : 0;  // 賣方實拿

  const hTax=Math.round((sp||mid)*.001);
  const lTax=Math.round((sp||mid)*.0008);
  const mgmt=24000;
  return{low,mid,high,agentFee,notary,landTax,incomeTax,incomeTaxName,txRate,txNote,tax,isNew,net,hold,hTax,lTax,mgmt,manualLVT};
}

function calcPurchase(d){
  const price=parseFloat(d.price)||0;
  const down=parseFloat(d.down)||30;
  const rate=parseFloat(d.rate)||2.0;
  const years=parseInt(d.years)||20;
  const loan=Math.round(price*(1-down/100));
  const r=rate/100/12; const n=years*12;
  const pmt=r===0?loan/n:loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  const total=Math.round(pmt*n);
  const ctTax=Math.round(price*.012);
  const stTax=Math.round(price*.0001);
  const reg=Math.round(price*.001);
  const agentFee=Math.round(price*.02);
  const notary=12000;
  const move=30000;
  const once=ctTax+stTax+reg+agentFee+notary+move;
  const totalNeeded=Math.round(price*down/100)+once;
  const hTax=Math.round(price*.001);
  const lTax=Math.round(price*.0008);
  const mgmt=24000;
  const annual=hTax+lTax+mgmt;
  return{loan,monthly:Math.round(pmt),total,interest:total-loan,ctTax,stTax,reg,agentFee,notary,move,once,totalNeeded,hTax,lTax,mgmt,annual};
}

// ─── HOME PAGE ────────────────────────────────────────────────
function Home({setPage}){
  const [shareUrl,setShareUrl]=useState("");
  useEffect(()=>{setShareUrl(window.location.href);},[]);
  const tools=[
    {id:"rental",icon:"🏠",tag:"房東工具",title:"出租收益評估",
     desc:"評估租金行情、建議出租方案，快速了解出租潛力",
     chips:["預估月租金", "空租風險評估", "最佳方案建議", "租金行情快查"],cta:"開始出租試算"},
    {id:"sale",icon:"💰",tag:"屋主工具",title:"出售收益評估",
     desc:"試算售後淨收入、房地合一稅與各項費用，清楚掌握實際入帳",
     chips:["預估市場售價", "房地合一稅（新舊制）", "仲介費 / 代書費", "賣方淨收入"],cta:"開始出售試算"},
    {id:"purchase",icon:"🔑",tag:"買方工具",title:"買房成本評估",
     desc:"計算每月房貸、購置費用與年度稅費，買房前心中有數",
     chips:["每月房貸試算", "契稅 / 規費明細", "總購置成本", "年度持有成本"],cta:"開始買房試算"},
  ];
  return(
    <div style={{backgroundColor:BG,color:"#fff",minHeight:"100vh",fontFamily:"'Noto Sans TC','PingFang TC',sans-serif"}}>
      <style>{CSS}</style>
      <header style={{position:"sticky",top:0,zIndex:100,backgroundColor:"rgba(10,10,10,.95)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${BD}`,padding:"13px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:3,height:20,backgroundColor:G,borderRadius:2}}/>
          <span style={{color:G,fontFamily:"'Noto Serif TC',serif",fontWeight:700,fontSize:16}}>榆您棋心</span>
          <span style={{color:"#555",fontSize:13}}>找到理想的家</span>
        </div>
        <a href={`tel:${PHONE}`} style={{textDecoration:"none"}}>
          <button style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${G}44`,backgroundColor:"transparent",color:G,fontSize:12,fontWeight:700,cursor:"pointer"}}>📞 免費諮詢</button>
        </a>
      </header>

      {/* Hero */}
      <section style={{padding:"60px 20px 44px",textAlign:"center",background:`linear-gradient(175deg,#0E0E00 0%,${BG} 100%)`,position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:48,height:3,backgroundColor:G,borderRadius:"0 0 3px 3px"}}/>
        <p style={{color:G,fontSize:10.5,letterSpacing:"0.28em",fontWeight:700,textTransform:"uppercase",marginBottom:16}}>安心寄寓 · 資產有託</p>
        <h1 style={{fontFamily:"'Noto Serif TC',serif",fontSize:"clamp(27px,6.6vw,44px)",fontWeight:700,lineHeight:1.3,marginBottom:14}}>
          <span style={{color:G}}>榆</span>您<span style={{color:G}}>棋</span>心<br/>找到理想的家
        </h1>
        <p style={{color:"#888",fontSize:16,lineHeight:1.75,maxWidth:440,margin:"0 auto 28px"}}>
          <span style={{color:GL,fontWeight:700}}>租 · 管 · 售</span> 一條龍服務<br/>陪您算清楚每一筆不動產數字
        </p>

        {/* Disclaimer */}
        <div style={{maxWidth:440,margin:"0 auto",backgroundColor:"rgba(201,168,76,.06)",border:`1px solid ${G}22`,borderRadius:9,padding:"11px 14px",display:"flex",gap:9,alignItems:"flex-start",textAlign:"left"}}>
          <span style={{color:G,fontSize:14,flexShrink:0}}>ⓘ</span>
          <p style={{color:"#999",fontSize:12,lineHeight:1.6}}>所有試算結果僅供初步參考，實際金額依物件條件、市場狀況與最新法規而定，請以實際評估為準。</p>
        </div>

        <p style={{color:"#3a3a3a",fontSize:12.5,marginTop:28}}>▼ 選擇您需要的試算工具</p>
      </section>

      {/* Tool cards */}
      <section style={{padding:"4px 20px 60px",maxWidth:760,margin:"0 auto"}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {tools.map((t,i)=>(
            <div key={t.id} className="card-h fu" style={{backgroundColor:S1,border:`1px solid ${BD}`,borderRadius:14,padding:"24px 20px",animationDelay:`${i*.1}s`,cursor:"pointer"}} onClick={()=>setPage(t.id)}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
                <div style={{fontSize:34,lineHeight:1}}>{t.icon}</div>
                <div style={{flex:1}}>
                  <p style={{color:G,fontSize:10,letterSpacing:"0.22em",fontWeight:700,textTransform:"uppercase",marginBottom:5}}>{t.tag}</p>
                  <h3 style={{fontSize:18,fontWeight:900,marginBottom:6}}>{t.title}</h3>
                  <p style={{color:"#888",fontSize:13,lineHeight:1.6}}>{t.desc}</p>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:18}}>
                {t.chips.map(c=>(
                  <span key={c} style={{fontSize:11.5,color:"#bbb",padding:"4px 10px",border:`1px solid ${BD}`,borderRadius:16,backgroundColor:"rgba(255,255,255,.03)"}}>◆ {c}</span>
                ))}
              </div>
              <button className="btn-g" style={{...bG,maxWidth:240,height:42,fontSize:14}} onClick={e=>{e.stopPropagation();setPage(t.id);}}>
                {t.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={{borderTop:`1px solid ${BD}`,padding:"32px 20px 20px",textAlign:"center"}}>
        <p style={{color:"#555",fontSize:13,marginBottom:8}}>需要專人協助？立即與我聯繫</p>
        <a href={`tel:${PHONE}`} style={{textDecoration:"none"}}>
          <p style={{color:G,fontSize:22,fontWeight:900,letterSpacing:"0.04em",marginBottom:18}}>📞 0939-150-692</p>
        </a>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
          {[{lb:"💬 LINE",url:LINE,bg:"#06C755",c:"#fff"},{lb:"📘 Facebook",url:FB,bg:"#1877F2",c:"#fff"},{lb:"📞 電話洽詢",url:`tel:${PHONE}`,bg:"transparent",c:G,bd:`1px solid ${G}`}].map(({lb,url,bg,c,bd})=>(
            <a key={lb} href={url} style={{textDecoration:"none"}}>
              <button className="btn-o" style={{padding:"10px 22px",borderRadius:24,border:bd||"none",backgroundColor:bg,color:c,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>{lb}</button>
            </a>
          ))}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          {[{lb:"LINE 分享",url:`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`},{lb:"FB 分享",url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}].map(({lb,url})=>(
            <a key={lb} href={url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
              <button style={{padding:"7px 18px",borderRadius:18,border:`1px solid ${BD}`,backgroundColor:"transparent",color:"#555",fontSize:12,cursor:"pointer"}}>{lb}</button>
            </a>
          ))}
        </div>
      </section>
      <footer style={{borderTop:"1px solid #181818",padding:"16px",textAlign:"center"}}>
        <p style={{color:"#2a2a2a",fontSize:11}}>© 2025 榆您棋心找到理想的家｜安心寄寓・資產有託｜試算結果僅供參考，請洽專業人員確認</p>
      </footer>
      <BottomNav setPage={setPage} active="home"/>
    </div>
  );
}

// ─── RENTAL PAGE ──────────────────────────────────────────────
function Rental({setPage,prop,setProp}){
  const [f,setF]=useState({city:prop?.city||"台北市",district:prop?.district||"大安區",ping:prop?.ping||"",layout:"2房1廳",age:prop?.age||"",floor:"",elevator:"有",parking:"無",loc:"中下",reno:"無",appliance:"無",occupied:"空屋",currentRent:""});
  const [r,setR]=useState(null);
  const [mkt,setMkt]=useState(null);
  const [mf,setMf]=useState({city:"台北市",district:"大安區",ping:"",layout:"2房1廳"});
  const ref=useRef(null);
  const ec=useCounter(r?.evalRent||0);
  const mhi=useCounter(r?.mktHigh||0,1400);
  // 切換縣市時，行政區自動跳到該市第一個
  const setCity=v=>setF(p=>({...p,city:v,district:DISTRICTS[v][0]}));
  const setMCity=v=>setMf(p=>({...p,city:v,district:DISTRICTS[v][0]}));
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  function calc(){const res=calcRental(f);setR(res);setProp&&setProp({city:f.city,district:f.district,ping:f.ping,age:f.age});setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth",block:"start"}),80);}
  function mktCalc(){
    if(!mf.ping)return;
    const rate=rentRate(mf.city,mf.district,mf.layout,15); // 預設屋齡 15 年級距
    const evalR=round100(rate*(parseFloat(mf.ping)||20));
    setMkt({low:round500(evalR*1.08),mid:round500(evalR*1.18),high:round500(evalR*1.28),evalR});
  }
  const vc={"低":"#22c55e","中":"#f59e0b","高":"#ef4444"};
  const ri={"包租代管":"🏆","社會住宅":"🏛️","一般出租":"🏠"};

  return(
    <Shell setPage={setPage} title="出租收益評估" sub="租金行情・空租風險・方案建議" active="rental">

      {/* Market */}
      <section style={{padding:"36px 20px",maxWidth:640,margin:"0 auto"}}>
        <Hdr tag="免費工具" title="租金行情快查" desc="依 114 年社宅租金單價表，快速估算市場行情區間"/>
        <div style={{backgroundColor:S1,border:`1px solid ${BD}`,borderRadius:12,padding:"20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="縣市"><select style={iS} value={mf.city} onChange={e=>setMCity(e.target.value)}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="行政區"><select style={iS} value={mf.district} onChange={e=>setMf(p=>({...p,district:e.target.value}))}>{DISTRICTS[mf.city].map(x=><option key={x}>{x}</option>)}</select></Field>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <Field label="坪數"><input style={iS} type="number" placeholder="20" value={mf.ping} onChange={e=>setMf(p=>({...p,ping:e.target.value}))}/></Field>
            <Field label="格局"><select style={iS} value={mf.layout} onChange={e=>setMf(p=>({...p,layout:e.target.value}))}>{LAYOUTS.map(l=><option key={l}>{l}</option>)}</select></Field>
          </div>
          <button className="btn-g" style={{...bG,fontSize:13.5,padding:"11px 20px",height:42}} onClick={mktCalc}>查詢行情</button>
          {mkt&&(
            <div className="fu" style={{marginTop:16,padding:"16px",backgroundColor:BG,borderRadius:10,border:`1px solid ${G}28`,textAlign:"center"}}>
              <p style={{color:"#666",fontSize:12,marginBottom:7}}>{mf.district}・{mf.layout}　市場月租金區間</p>
              <p style={{color:G,fontSize:25,fontWeight:900}}>{mkt.low.toLocaleString()} ～ {mkt.high.toLocaleString()} <span style={{color:"#777",fontSize:13,fontWeight:400}}>元/月</span></p>
              <p style={{color:"#555",fontSize:11.5,marginTop:5}}>社宅評定參考：約 {mkt.evalR.toLocaleString()} 元/月（屋齡 15 年估）</p>
            </div>
          )}
        </div>
      </section>

      <div className="divider"/>

      {/* Form */}
      <section style={{padding:"36px 20px",maxWidth:640,margin:"0 auto"}}>
        <Hdr tag="第一步" title="填寫房屋資料" desc="依官方社宅單價表計算，填寫越完整越準確"/>
        <div style={{backgroundColor:S1,border:`1px solid ${BD}`,borderRadius:12,padding:"22px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="所在縣市"><select style={iS} value={f.city} onChange={e=>setCity(e.target.value)}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="行政區"><select style={iS} value={f.district} onChange={e=>s("district",e.target.value)}>{DISTRICTS[f.city].map(x=><option key={x}>{x}</option>)}</select></Field>
            <Field label="坪數（坪）"><input style={iS} type="number" placeholder="25" value={f.ping} onChange={e=>s("ping",e.target.value)}/></Field>
            <Field label="格局"><select style={iS} value={f.layout} onChange={e=>s("layout",e.target.value)}>{LAYOUTS.map(l=><option key={l}>{l}</option>)}</select></Field>
            <Field label="屋齡（年）"><input style={iS} type="number" placeholder="15" value={f.age} onChange={e=>s("age",e.target.value)}/></Field>
            <Field label="樓層"><input style={iS} type="number" placeholder="5" value={f.floor} onChange={e=>s("floor",e.target.value)}/></Field>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="電梯"><Tog opts={["有","無"]} val={f.elevator} onChange={v=>s("elevator",v)}/></Field>
            <Field label="車位"><Tog opts={["有","無"]} val={f.parking}  onChange={v=>s("parking",v)}/></Field>
          </div>

          {/* 官方調整項 */}
          <div style={{height:1,backgroundColor:BD,margin:"4px 0 18px"}}/>
          <p style={{color:G,fontSize:10.5,letterSpacing:"0.16em",fontWeight:700,textTransform:"uppercase",marginBottom:14}}>▸ 租金調整項（依官方標準）</p>
          <Field label="區位（交通/生活機能）">
            <Tog opts={LOC_OPTS} val={f.loc} onChange={v=>s("loc",v)}/>
            <p style={{color:"#444",fontSize:10.5,marginTop:5}}>優質 +5%（核心生活圈、交通便捷）｜中上 +3%｜中下 +0%</p>
          </Field>
          <Field label="室內裝修">
            <Tog opts={RENO_OPTS} val={f.reno} onChange={v=>s("reno",v)}/>
            <p style={{color:"#444",fontSize:10.5,marginTop:5}}>中等 +5%（系統櫃、設計）｜簡易 +3%（基本油漆收納）｜無 +0%</p>
          </Field>
          <Field label="家電設備（冷氣/冰箱/洗衣機等）">
            <Tog opts={["有","無"]} val={f.appliance} onChange={v=>s("appliance",v)}/>
            <p style={{color:"#444",fontSize:10.5,marginTop:5}}>提供完整家電：整層 +2,000、套房 +1,000 元/月</p>
          </Field>

          <div style={{height:1,backgroundColor:BD,margin:"4px 0 18px"}}/>
          <Field label="目前狀況"><Tog opts={["已出租","空屋"]} val={f.occupied} onChange={v=>s("occupied",v)}/></Field>
          {f.occupied==="已出租"&&<Field label="目前租金（元）"><input style={iS} type="number" placeholder="22000" value={f.currentRent} onChange={e=>s("currentRent",e.target.value)}/></Field>}
          <button className="btn-g" style={{...bG,marginTop:6,fontSize:16}} onClick={calc}>開始試算</button>
        </div>
      </section>

      {/* Result */}
      {r&&(
        <section ref={ref} style={{padding:"0 20px 36px",maxWidth:640,margin:"0 auto"}}>
          <div className="fu" style={{backgroundColor:"#0C0C0C",border:`1px solid ${G}40`,borderRadius:14,overflow:"hidden"}}>
            <div style={{padding:"15px 20px 13px",borderBottom:`1px solid ${G}1A`,background:"linear-gradient(135deg,#111 0%,#0F0B00 100%)"}}>
              <p style={{color:G,fontSize:10,letterSpacing:"0.22em",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>分析結果</p>
              <h3 style={{fontSize:16,fontWeight:800}}>出租收益試算報告</h3>
            </div>
            <div style={{padding:"20px"}}>
              {/* Eval rent + market range */}
              <div style={{backgroundColor:S1,borderRadius:9,padding:"16px",border:`1px solid ${BD}`,marginBottom:14}}>
                <p style={{color:"#666",fontSize:11,marginBottom:6}}>社宅評定月租（依 114 年單價表）</p>
                <p style={{color:G,fontSize:"clamp(24px,6vw,34px)",fontWeight:900,marginBottom:4}}>NT$ {ec.toLocaleString()}</p>
                <p style={{color:"#555",fontSize:11}}>單價 {r.rate.toLocaleString()} 元/坪 · 年租約 {r.yearly.toLocaleString()} 元</p>
              </div>
              <div style={{backgroundColor:"rgba(201,168,76,.06)",borderRadius:9,padding:"16px",border:`1px solid ${G}33`,marginBottom:16,textAlign:"center"}}>
                <p style={{color:"#888",fontSize:11.5,marginBottom:6}}>📈 一般市場行情區間（通常高於社宅評定）</p>
                <p style={{color:GL,fontSize:"clamp(18px,5vw,24px)",fontWeight:900}}>{r.mktLow.toLocaleString()} ～ {mhi.toLocaleString()} <span style={{color:"#777",fontSize:13,fontWeight:400}}>元/月</span></p>
              </div>

              {/* 調整明細 */}
              <div style={{backgroundColor:S1,borderRadius:9,padding:"14px 16px",border:`1px solid ${BD}`,marginBottom:16}}>
                <p style={{color:"#666",fontSize:11,marginBottom:9}}>計算明細</p>
                <Row label={`基準單價（${r.isSuite?"獨立套房":"整層"}·屋齡${r.age}年）`} value={`${r.rate.toLocaleString()} 元/坪`} sub/>
                <Row label="區位調整" value={r.dL?`+${r.dL*100}%`:"—"} sub/>
                <Row label="裝修調整" value={r.dD?`+${r.dD*100}%`:"—"} sub/>
                <Row label="家電設備加成" value={r.dE?`+${r.dE.toLocaleString()} 元`:"—"} sub/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <div>
                  <p style={{color:"#666",fontSize:11,marginBottom:7}}>空租風險</p>
                  <span style={{display:"inline-block",padding:"3px 14px",borderRadius:20,fontSize:13,fontWeight:800,color:"#000",backgroundColor:vc[r.vac]}}>{r.vac}</span>
                </div>
                <div>
                  <p style={{color:"#666",fontSize:11,marginBottom:7}}>收益評級</p>
                  <Stars n={r.rat}/>
                </div>
              </div>
              <div style={{backgroundColor:S1,borderRadius:9,padding:"14px 16px",border:`1px solid ${BD}`}}>
                <p style={{color:"#666",fontSize:11,marginBottom:9}}>建議出租方案</p>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
                  <span style={{fontSize:18}}>{ri[r.rec]}</span>
                  <span style={{color:G,fontWeight:800,fontSize:16}}>{r.rec}</span>
                </div>
                <p style={{color:"#888",fontSize:12.5,lineHeight:1.7}}>{r.note}</p>
              </div>
              <p style={{color:"#444",fontSize:10.5,marginTop:12,lineHeight:1.6}}>＊ 基準單價引用「114 年社會住宅租金單價表」，調整項依官方區位／裝修／設備標準。社宅評定價通常低於開放市場行情，實際租金仍受屋況、樓層、車位與當下供需影響，僅供參考。</p>
              <div style={{marginTop:16,padding:"14px 16px",backgroundColor:"rgba(201,168,76,.05)",borderRadius:9,border:`1px solid ${G}22`}}>
                <p style={{color:"#666",fontSize:11.5,marginBottom:10,textAlign:"center"}}>想獲得完整分析報告？由我免費為您評估</p>
                <button className="btn-g" style={{...bG,fontSize:14,height:42}} onClick={()=>setPage("lead")}>免費取得完整報告 →</button>
              </div>
            </div>
          </div>
        </section>
      )}
    </Shell>
  );
}

// ─── SALE PAGE ────────────────────────────────────────────────
function Sale({setPage,prop,setProp}){
  const [f,setF]=useState({city:prop?.city||"台北市",district:prop?.district||"大安區",ping:prop?.ping||"",layout:"2房1廳",age:prop?.age||"",floor:"",elevator:"有",parking:"無",acqYear:"",acqCost:"",salePrice:"",selfUse:"否",landTax:""});
  const [r,setR]=useState(null);
  const [up,setUp]=useState({loading:false,msg:""});
  const ref=useRef(null);
  const nc=useCounter(r?.net||0);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const setCity=v=>setF(p=>({...p,city:v,district:DISTRICTS[v][0]}));
  function calc(){
    if(!f.salePrice){alert("請填寫預期售價");return;}
    const res=calcSale(f);setR(res);
    setProp&&setProp({city:f.city,district:f.district,ping:f.ping,age:f.age});
    setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth",block:"start"}),80);
  }

  // 上傳謄本 → 後端 /api/parse-deed 由 AI 辨識並自動帶入欄位
  async function onUpload(e){
    const file=e.target.files?.[0]; if(!file) return;
    setUp({loading:true,msg:"辨識謄本中…"});
    try{
      const b64=await new Promise<string>((res,rej)=>{const rd=new FileReader();rd.onload=()=>res(String(rd.result).split(",")[1]);rd.onerror=rej;rd.readAsDataURL(file);});
      const resp=await fetch("/api/parse-deed",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({data:b64,mediaType:file.type||"image/jpeg"})
      });
      if(!resp.ok) throw new Error("server");
      const o=await resp.json();
      setF(p=>({...p,
        city:RENT[o.city]?o.city:p.city,
        district:(o.district&&DISTRICTS[RENT[o.city]?o.city:p.city]?.includes(o.district))?o.district:p.district,
        ping:o.ping?String(o.ping):p.ping,
        acqYear:o.acqYear?String(o.acqYear):p.acqYear,
      }));
      setUp({loading:false,msg:"✓ 已自動帶入謄本資料，請確認後試算"});
    }catch(err){
      setUp({loading:false,msg:"⚠ 自動辨識失敗，請手動填寫（請確認已設定 ANTHROPIC_API_KEY）"});
    }
  }

  return(
    <Shell setPage={setPage} title="出售收益評估" sub="實拿金額・土增稅・房地合一/財交稅" active="rental">
      <section style={{padding:"36px 20px",maxWidth:640,margin:"0 auto"}}>
        <Hdr tag="出售試算" title="填寫物件與交易資料" desc="試算售後實拿金額與各項稅費，可上傳謄本自動帶入"/>
        <div style={{backgroundColor:S1,border:`1px solid ${BD}`,borderRadius:12,padding:"22px 20px"}}>

          {/* 謄本上傳 */}
          <div style={{backgroundColor:"rgba(201,168,76,.06)",border:`1px dashed ${G}55`,borderRadius:9,padding:"14px",marginBottom:18,textAlign:"center"}}>
            <label style={{cursor:"pointer",display:"block"}}>
              <input type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={onUpload}/>
              <span style={{color:G,fontSize:14,fontWeight:700}}>📄 上傳謄本自動帶入</span>
              <p style={{color:"#666",fontSize:11,marginTop:5}}>拍照或上傳土地/建物謄本，自動辨識行政區、面積、取得年份</p>
            </label>
            {up.msg&&<p style={{color:up.loading?GL:(up.msg[0]==="✓"?"#22c55e":"#f59e0b"),fontSize:11.5,marginTop:9}}>{up.loading?"⏳ ":""}{up.msg}</p>}
          </div>

          <p style={{color:G,fontSize:10.5,letterSpacing:"0.18em",fontWeight:700,textTransform:"uppercase",marginBottom:14}}>▸ 物件基本資料</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="所在縣市"><select style={iS} value={f.city} onChange={e=>setCity(e.target.value)}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="行政區"><select style={iS} value={f.district} onChange={e=>s("district",e.target.value)}>{DISTRICTS[f.city].map(x=><option key={x}>{x}</option>)}</select></Field>
            <Field label="坪數（坪）"><input style={iS} type="number" placeholder="30" value={f.ping} onChange={e=>s("ping",e.target.value)}/></Field>
            <Field label="格局"><select style={iS} value={f.layout} onChange={e=>s("layout",e.target.value)}>{LAYOUTS.map(l=><option key={l}>{l}</option>)}</select></Field>
            <Field label="屋齡（年）"><input style={iS} type="number" placeholder="10" value={f.age} onChange={e=>s("age",e.target.value)}/></Field>
            <Field label="樓層"><input style={iS} type="number" placeholder="5" value={f.floor} onChange={e=>s("floor",e.target.value)}/></Field>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="電梯"><Tog opts={["有","無"]} val={f.elevator} onChange={v=>s("elevator",v)}/></Field>
            <Field label="車位"><Tog opts={["有","無"]} val={f.parking}  onChange={v=>s("parking",v)}/></Field>
          </div>
          <div style={{height:1,backgroundColor:BD,margin:"4px 0 20px"}}/>
          <p style={{color:G,fontSize:10.5,letterSpacing:"0.18em",fontWeight:700,textTransform:"uppercase",marginBottom:14}}>▸ 交易與持有資料</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="取得年份（西元）"><input style={iS} type="number" placeholder="例：2018" value={f.acqYear} onChange={e=>s("acqYear",e.target.value)}/></Field>
            <Field label="取得成本（元）"><input style={iS} type="number" placeholder="例：12000000" value={f.acqCost} onChange={e=>s("acqCost",e.target.value)}/></Field>
            <Field label="預期售價（元）"><input style={iS} type="number" placeholder="例：18000000" value={f.salePrice} onChange={e=>s("salePrice",e.target.value)}/></Field>
            <Field label="自住設籍">
              <Tog opts={["是","否"]} val={f.selfUse} onChange={v=>s("selfUse",v)}/>
              <p style={{color:"#444",fontSize:10.5,marginTop:5}}>設籍滿 6 年可享優惠稅率</p>
            </Field>
          </div>
          {/* 土地增值稅：兩制都會用到，可填實際金額（謄本公告現值可推算） */}
          <Field label="土地增值稅（元，如已知可填）">
            <input style={iS} type="number" placeholder="向地政事務所/代書查詢，留空則自動概估" value={f.landTax} onChange={e=>s("landTax",e.target.value)}/>
            <p style={{color:"#666",fontSize:10.5,marginTop:5,lineHeight:1.5}}>土地增值稅依公告土地現值漲幅計算，兩種制度都需繳納，建議洽代書精算後填入</p>
          </Field>
          {f.acqYear&&(
            <div style={{backgroundColor:parseInt(f.acqYear)>=2016?"rgba(201,168,76,.06)":"rgba(245,158,11,.06)",border:`1px solid ${parseInt(f.acqYear)>=2016?G+"33":"rgba(245,158,11,.25)"}`,borderRadius:9,padding:"11px 14px",marginBottom:4}}>
              <p style={{color:parseInt(f.acqYear)>=2016?G:"#f59e0b",fontSize:11.5,fontWeight:700}}>
                {parseInt(f.acqYear)>=2016?"適用新制：土地增值稅 ＋ 房地合一稅":"⚠ 適用舊制（105前）：土地增值稅 ＋ 財產交易所得稅"}
              </p>
            </div>
          )}
          <button className="btn-g" style={{...bG,marginTop:6,fontSize:16}} onClick={calc}>計算出售試算</button>
        </div>
      </section>

      {r&&(
        <section ref={ref} style={{padding:"0 20px 36px",maxWidth:640,margin:"0 auto"}}>
          <div className="fu" style={{backgroundColor:"#0C0C0C",border:`1px solid ${G}40`,borderRadius:14,overflow:"hidden"}}>
            <div style={{padding:"15px 20px 13px",borderBottom:`1px solid ${G}1A`,background:"linear-gradient(135deg,#111 0%,#0F0B00 100%)"}}>
              <p style={{color:G,fontSize:10,letterSpacing:"0.22em",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>試算結果</p>
              <h3 style={{fontSize:16,fontWeight:800}}>出售收益分析報告</h3>
            </div>
            <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>

              {/* 實拿 headline */}
              <div style={{backgroundColor:"rgba(201,168,76,.08)",borderRadius:11,padding:"20px 16px",border:`1px solid ${G}45`,textAlign:"center"}}>
                <p style={{color:"#aaa",fontSize:12,marginBottom:8}}>💰 扣除稅費後，賣方實拿約</p>
                <p style={{color:G,fontSize:"clamp(26px,6.5vw,38px)",fontWeight:900,letterSpacing:"0.01em"}}>NT$ {nc.toLocaleString()}</p>
                <p style={{color:"#777",fontSize:12,marginTop:8}}>售價 {wan(parseFloat(f.salePrice))} − 仲介費 − 代書費 − 稅負</p>
              </div>

              {/* Market price */}
              {f.ping&&(
                <div style={{backgroundColor:S1,borderRadius:9,padding:"16px",border:`1px solid ${BD}`}}>
                  <p style={{color:"#666",fontSize:11,marginBottom:11}}>📊 預估市場售價區間（{f.district}）</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center",marginBottom:8}}>
                    {[{lb:"保守",v:r.low,c:"#aaa"},{lb:"中間",v:r.mid,c:G},{lb:"樂觀",v:r.high,c:GL}].map(({lb,v,c})=>(
                      <div key={lb} style={{backgroundColor:BG,padding:"10px 6px",borderRadius:7}}>
                        <p style={{color:"#555",fontSize:10.5,marginBottom:4}}>{lb}</p>
                        <p style={{color:c,fontSize:"clamp(13px,3.5vw,17px)",fontWeight:800}}>{wan(v)}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{color:"#444",fontSize:10.5}}>＊ 依同區實價登錄概估，請以委託評估為準</p>
                </div>
              )}

              {/* Costs */}
              <div style={{backgroundColor:S1,borderRadius:9,padding:"16px",border:`1px solid ${BD}`}}>
                <p style={{color:"#666",fontSize:11,marginBottom:11}}>💸 交易費用</p>
                <Row label="仲介費（賣方 4%）" value={fmt(r.agentFee)} sub/>
                <Row label="代書費（估算）"     value={fmt(r.notary)}  sub/>
                <Row label="費用合計" value={fmt(r.agentFee+r.notary)} hi/>
              </div>

              {/* Tax — 土增稅(兩制都有) + 房地合一/財交(二擇一) */}
              <div style={{backgroundColor:S1,borderRadius:9,padding:"16px",border:`1px solid ${BD}`}}>
                <p style={{color:"#666",fontSize:11,marginBottom:11}}>🧾 出售稅負試算</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${BD}`}}>
                  <span style={{color:"#888",fontSize:12.5}}>適用制度</span>
                  <span style={{color:r.isNew?G:"#f59e0b",fontWeight:700,fontSize:13}}>{r.isNew?"新制（105後）":"舊制（105前）"}</span>
                </div>
                <Row label={`土地增值稅${r.manualLVT>0?"（實填）":"（概估）"}`} value={fmt(r.landTax)} sub/>
                {r.isNew&&r.txRate>0&&<Row label={`房地合一稅率（持有 ${r.hold} 年）`} value={`${r.txRate}%`} sub/>}
                <Row label={`${r.incomeTaxName}（概估）`} value={fmt(r.incomeTax)} sub/>
                <Row label="稅負合計（估算）" value={fmt(r.tax)} hi/>
                <p style={{color:"#555",fontSize:11,marginTop:8,lineHeight:1.6}}>ℹ️ {r.isNew?"新制：土地增值稅＋房地合一稅。房地合一稅基可再減除土地漲價總數額，實際稅額通常更低。":"舊制：土地增值稅＋財產交易所得稅，二者並存。"} {r.txNote}</p>
              </div>

              {/* Annual holding */}
              <div style={{backgroundColor:S1,borderRadius:9,padding:"16px",border:`1px solid ${BD}`}}>
                <p style={{color:"#666",fontSize:11,marginBottom:11}}>🏠 年度持有成本估算</p>
                <Row label="房屋稅（年）" value={fmt(r.hTax)} sub/>
                <Row label="地價稅（年）" value={fmt(r.lTax)} sub/>
                <Row label="管理費（年，估算）" value={fmt(r.mgmt)} sub/>
                <Row label="年度持有成本合計" value={fmt(r.hTax+r.lTax+r.mgmt)} hi/>
              </div>

              <p style={{color:"#444",fontSize:10.5,lineHeight:1.6}}>＊ 稅費皆為概估，土地增值稅依公告土地現值、所得稅依實際級距而定，請以代書/地政事務所精算為準。</p>

              <div style={{padding:"14px 16px",backgroundColor:"rgba(201,168,76,.05)",borderRadius:9,border:`1px solid ${G}22`}}>
                <p style={{color:"#666",fontSize:11.5,marginBottom:10,textAlign:"center"}}>想精算實拿金額與最佳出售時機？由我免費為您評估</p>
                <button className="btn-g" style={{...bG,fontSize:14,height:42}} onClick={()=>setPage("lead")}>免費取得完整報告 →</button>
              </div>

            </div>
          </div>
        </section>
      )}
    </Shell>
  );
}

// ─── PURCHASE PAGE ────────────────────────────────────────────
function Purchase({setPage}){
  const [f,setF]=useState({price:"",down:"30",rate:"2.0",years:"20"});
  const [r,setR]=useState(null);
  const ref=useRef(null);
  const mc=useCounter(r?.monthly||0);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const price=parseFloat(f.price)||0;
  const downAmt=Math.round(price*(parseFloat(f.down)||30)/100);
  const loanAmt=price-downAmt;
  function calc(){
    if(!f.price){alert("請填寫房屋總價");return;}
    const res=calcPurchase(f);setR(res);
    setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth",block:"start"}),80);
  }
  return(
    <Shell setPage={setPage} title="買房成本評估" sub="每月房貸・購置費用・持有稅費" active="rental">
      <section style={{padding:"36px 20px",maxWidth:640,margin:"0 auto"}}>
        <Hdr tag="買房試算" title="填寫購屋條件" desc="試算每月房貸負擔與一次性購置成本"/>
        <div style={{backgroundColor:S1,border:`1px solid ${BD}`,borderRadius:12,padding:"22px 20px"}}>

          <Field label="房屋總價（元）">
            <input style={iS} type="number" placeholder="例：12000000（1,200萬）" value={f.price} onChange={e=>s("price",e.target.value)}/>
          </Field>

          <Field label={`頭期款比例：${f.down}%${price>0?" (" + wan(downAmt) + "，貸款 " + wan(loanAmt) + ")":""}`}>
            <div style={{display:"flex",gap:8}}>
              {["20","30","40","50"].map(v=>(
                <button key={v} className="tog" style={{flex:1,padding:"10px 0",borderRadius:7,border:`1px solid ${f.down===v?G:"#2a2a2a"}`,backgroundColor:f.down===v?"rgba(201,168,76,.14)":"transparent",color:f.down===v?G:"#777",fontWeight:f.down===v?800:400,cursor:"pointer",fontSize:14}} onClick={()=>s("down",v)}>{v}%</button>
              ))}
            </div>
          </Field>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="貸款年利率（%）">
              <input style={iS} type="number" placeholder="2.0" step="0.05" value={f.rate} onChange={e=>s("rate",e.target.value)}/>
            </Field>
            <Field label="還款年限">
              <div style={{display:"flex",gap:8}}>
                {["20","30","40"].map(v=>(
                  <button key={v} className="tog" style={{flex:1,padding:"10px 0",borderRadius:7,border:`1px solid ${f.years===v?G:"#2a2a2a"}`,backgroundColor:f.years===v?"rgba(201,168,76,.14)":"transparent",color:f.years===v?G:"#777",fontWeight:f.years===v?800:400,cursor:"pointer",fontSize:14}} onClick={()=>s("years",v)}>{v}年</button>
                ))}
              </div>
            </Field>
          </div>

          <button className="btn-g" style={{...bG,marginTop:6,fontSize:16}} onClick={calc}>計算買房成本</button>
        </div>
      </section>

      {r&&(
        <section ref={ref} style={{padding:"0 20px 36px",maxWidth:640,margin:"0 auto"}}>
          <div className="fu" style={{backgroundColor:"#0C0C0C",border:`1px solid ${G}40`,borderRadius:14,overflow:"hidden"}}>
            <div style={{padding:"15px 20px 13px",borderBottom:`1px solid ${G}1A`,background:"linear-gradient(135deg,#111 0%,#0F0B00 100%)"}}>
              <p style={{color:G,fontSize:10,letterSpacing:"0.22em",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>試算結果</p>
              <h3 style={{fontSize:16,fontWeight:800}}>買房成本分析報告</h3>
            </div>
            <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>

              {/* Monthly hero */}
              <div style={{backgroundColor:"rgba(201,168,76,.06)",borderRadius:9,padding:"20px 16px",border:`1px solid ${G}33`,textAlign:"center"}}>
                <p style={{color:"#888",fontSize:12,marginBottom:8}}>每月應繳房貸金額</p>
                <p style={{color:G,fontSize:"clamp(26px,6vw,36px)",fontWeight:900}}>NT$ {mc.toLocaleString()}</p>
                <p style={{color:"#555",fontSize:12,marginTop:8}}>貸款 {wan(r.loan)} ｜ 利率 {f.rate}% ｜ {f.years} 年</p>
              </div>

              {/* Mortgage breakdown */}
              <div style={{backgroundColor:S1,borderRadius:9,padding:"16px",border:`1px solid ${BD}`}}>
                <p style={{color:"#666",fontSize:11,marginBottom:11}}>📊 房貸明細</p>
                <Row label="貸款金額"   value={fmt(r.loan)}/>
                <Row label="每月還款"   value={fmt(r.monthly)} hi/>
                <Row label="還款總額"   value={fmt(r.total)}/>
                <Row label="總利息支出" value={fmt(r.interest)}/>
              </div>

              {/* One-time costs */}
              <div style={{backgroundColor:S1,borderRadius:9,padding:"16px",border:`1px solid ${BD}`}}>
                <p style={{color:"#666",fontSize:11,marginBottom:11}}>📋 一次性購置費用</p>
                <Row label="契稅（約房價 1.2%）"  value={fmt(r.ctTax)} sub/>
                <Row label="印花稅（0.1%）"       value={fmt(r.stTax)} sub/>
                <Row label="登記規費（0.1%）"      value={fmt(r.reg)}   sub/>
                <Row label="仲介費（買方 2%）"     value={fmt(r.agentFee)} sub/>
                <Row label="代書費（估算）"        value={fmt(r.notary)} sub/>
                <Row label="搬家雜費（估算）"      value={fmt(r.move)} sub/>
                <Row label="一次性費用合計" value={fmt(r.once)} hi/>
              </div>

              {/* Total needed */}
              <div style={{backgroundColor:"rgba(201,168,76,.04)",borderRadius:9,padding:"16px",border:`1px solid ${G}22`}}>
                <p style={{color:"#666",fontSize:11,marginBottom:11}}>💰 購屋時需準備的總資金</p>
                <Row label={`頭期款（${f.down}%）`} value={fmt(Math.round(price*(parseFloat(f.down)||30)/100))}/>
                <Row label="一次性費用" value={fmt(r.once)}/>
                <Row label="合計需備妥資金" value={fmt(r.totalNeeded)} lg hi/>
              </div>

              {/* Annual holding */}
              <div style={{backgroundColor:S1,borderRadius:9,padding:"16px",border:`1px solid ${BD}`}}>
                <p style={{color:"#666",fontSize:11,marginBottom:11}}>🏠 年度持有成本估算</p>
                <Row label="房屋稅（年）" value={fmt(r.hTax)} sub/>
                <Row label="地價稅（年）" value={fmt(r.lTax)} sub/>
                <Row label="管理費（年，估算）" value={fmt(r.mgmt)} sub/>
                <Row label="年度持有成本合計" value={fmt(r.annual)} hi/>
                <p style={{color:"#444",fontSize:10.5,marginTop:8}}>＊ 房屋稅 / 地價稅依評定現值計算，此為概估；管理費因社區而異</p>
              </div>

            </div>
          </div>
        </section>
      )}
    </Shell>
  );
}

// ─── LEAD PAGE ────────────────────────────────────────────────
function Lead({setPage}){
  const [f,setF]=useState({name:"",phone:"",line:"",note:""});
  const [sent,setSent]=useState(false);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  async function submit(){
    if(!f.name||!f.phone){alert("請填寫姓名與手機號碼");return;}
    try{
      await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...f,source:"出租收益試算",timestamp:new Date().toISOString()})});
    }catch(err){ /* 名單寫入失敗不影響使用者體驗，仍顯示成功頁 */ }
    setSent(true);
  }
  if(sent) return(
    <div style={{backgroundColor:BG,color:"#fff",minHeight:"100vh",fontFamily:"'Noto Sans TC',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div className="fu" style={{textAlign:"center",maxWidth:440}}>
        <div style={{width:72,height:72,borderRadius:"50%",border:`2px solid ${G}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:30,color:G}}>✓</div>
        <h2 style={{color:G,fontFamily:"'Noto Serif TC',serif",fontSize:24,fontWeight:700,marginBottom:14}}>資料已送出</h2>
        <p style={{color:"#aaa",fontSize:15,lineHeight:1.8,marginBottom:28}}>感謝您的信任。我將於 <span style={{color:GL}}>1–2 個工作天</span>內與您聯繫，提供完整的不動產收益分析，完全免費。</p>
        <a href={LINE} style={{textDecoration:"none",display:"block",maxWidth:260,margin:"0 auto 12px"}}>
          <button className="btn-g" style={{...bG,backgroundColor:"#06C755",color:"#fff",fontWeight:800}}>💬 LINE 立即聯繫</button>
        </a>
        <button style={{background:"none",border:"none",color:"#555",fontSize:13,cursor:"pointer",marginTop:4}} onClick={()=>setPage("home")}>← 返回首頁</button>
      </div>
    </div>
  );
  return(
    <Shell setPage={setPage} title="免費取得完整報告" sub="由我親自提供個人化分析" active="lead">
      <section style={{padding:"36px 20px",maxWidth:580,margin:"0 auto"}}>
        <Hdr tag="免費諮詢" title="想知道您的房子還能多賺多少？" desc="留下資料，我會親自為您提供完整的不動產分析，完全免費"/>
        <div style={{backgroundColor:S1,border:`1px solid ${BD}`,borderRadius:12,padding:"24px 20px"}}>
          {[{k:"name",lb:"姓名 *",ph:"您的姓名",tp:"text"},{k:"phone",lb:"手機 *",ph:"09XX-XXXXXX",tp:"tel"},{k:"line",lb:"LINE ID",ph:"@您的LINE",tp:"text"}].map(({k,lb,ph,tp})=>(
            <Field key={k} label={lb}><input style={iS} type={tp} placeholder={ph} value={f[k]} onChange={e=>s(k,e.target.value)}/></Field>
          ))}
          <Field label="備註">
            <textarea style={{...iS,minHeight:80,resize:"vertical"}} placeholder="例：想了解包租代管方案，或有其他問題…" value={f.note} onChange={e=>s("note",e.target.value)}/>
          </Field>
          <button className="btn-g" style={{...bG,fontSize:16}} onClick={submit}>免費取得完整報告</button>
          <p style={{color:"#444",fontSize:11.5,marginTop:10,textAlign:"center"}}>＊ 您的資料僅用於聯繫您，絕不對外提供</p>
        </div>
      </section>
    </Shell>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("home");
  const [prop,setProp]=useState({city:"台北市",district:"大安區",ping:"",age:""});
  if(page==="rental")   return <Rental   setPage={setPage} prop={prop} setProp={setProp}/>;
  if(page==="sale")     return <Sale     setPage={setPage} prop={prop} setProp={setProp}/>;
  if(page==="purchase") return <Purchase setPage={setPage}/>;
  if(page==="lead")     return <Lead     setPage={setPage}/>;
  return <Home setPage={setPage}/>;
}
