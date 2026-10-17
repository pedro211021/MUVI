(() => {
const $ = id => document.getElementById(id), cv = $('canvas'), ctx = cv.getContext('2d');
const NAMES = {'#ffffff':'Blanco','#111111':'Negro','#d9d9de':'Gris','#efe3d0':'Crema','#f4d8e9':'Rosa','#d94b98':'Fucsia','#6b2c91':'Morado','#cdb4e6':'Lila','#2b4c9b':'Azul rey','#9fd3ea':'Celeste','#2f8f6b':'Verde','#c0392b':'Rojo','#f2c94c':'Amarillo'};
const rr = (x,y,w,h,r) => { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); };
const money = n => '$' + n.toLocaleString('es-CO');
const light = c => { const n = parseInt(c.slice(1),16); return ((n>>16)*299 + (n>>8&255)*587 + (n&255)*114)/1000 > 150; };

const PRODUCTS = {
 camiseta:{name:'Camiseta',icon:'shirt',price:35000,kind:'cloth',b:[110,590],colors:Object.keys(NAMES),
  tallas:['Niño 6','Niño 8','Niño 10','Niño 12','S','M','L','XL','XXL'],
  zones:[{k:'pizq',n:'Pecho izquierdo (logo empresa)',a:[372,192,72,72],v:'f'},{k:'pder',n:'Pecho derecho',a:[256,192,72,72],v:'f'},{k:'centro',n:'Centro del pecho',a:[262,232,176,226],v:'f'},{k:'esp',n:'Espalda completa',a:[252,190,196,270],v:'b'},{k:'nuca',n:'Espalda alta (nombre)',a:[300,158,100,50],v:'b'}],
  shape(back){ctx.beginPath();ctx.moveTo(255,120);ctx.quadraticCurveTo(350,back?135:200,445,120);ctx.lineTo(540,150);ctx.lineTo(590,245);ctx.lineTo(520,285);ctx.lineTo(470,255);ctx.lineTo(470,560);ctx.lineTo(230,560);ctx.lineTo(230,255);ctx.lineTo(180,285);ctx.lineTo(110,245);ctx.lineTo(160,150);ctx.closePath();}},
 gorra:{name:'Gorra',icon:'hat-cowboy',price:30000,kind:'cloth',b:[190,510],colors:['#ffffff','#111111','#efe3d0','#f4d8e9','#d94b98','#6b2c91','#2b4c9b','#c0392b'],tallas:['Única','Niño'],
  zones:[{k:'frente',n:'Frente',a:[240,205,220,115]}],
  shape(){ctx.beginPath();ctx.moveTo(190,360);ctx.bezierCurveTo(190,170,510,170,510,360);ctx.quadraticCurveTo(350,330,190,360);ctx.moveTo(190,360);ctx.quadraticCurveTo(350,330,510,360);ctx.quadraticCurveTo(570,405,420,412);ctx.quadraticCurveTo(300,425,190,360);}},
 taza:{name:'Taza',icon:'mug-hot',price:20000,kind:'gloss',wrap:true,body:[190,510],b:[190,480],colors:['#ffffff','#111111','#f4d8e9','#d94b98','#6b2c91','#9fd3ea','#c0392b','#f2c94c'],tallas:['11 oz','15 oz'],
  zones:[{k:'wrap',n:'Todo alrededor',a:[205,225,270,235]}],
  shape(){rr(190,190,290,320,26);ctx.moveTo(480,260);ctx.bezierCurveTo(600,250,600,430,480,430);ctx.lineTo(480,395);ctx.bezierCurveTo(540,395,540,295,480,295);ctx.closePath();}},
 llavero:{name:'Llavero',icon:'key',price:10000,kind:'gloss',b:[250,450],colors:['#ffffff','#f4d8e9','#cdb4e6','#9fd3ea','#111111'],tallas:['Único'],
  zones:[{k:'cara',n:'Cara',a:[268,252,164,190]}],
  shape(){rr(250,225,200,240,28);ctx.moveTo(380,180);ctx.arc(350,180,30,0,Math.PI*2);ctx.closePath();}},
 termo:{name:'Termo',icon:'bottle-water',price:38000,kind:'gloss',wrap:true,body:[130,520],b:[260,440],colors:['#ffffff','#111111','#f4d8e9','#cdb4e6','#9fd3ea','#d94b98'],tallas:['500 ml','750 ml'],
  zones:[{k:'wrap',n:'Todo alrededor',a:[262,190,176,290]}],
  shape(){rr(260,130,180,390,36);ctx.rect(275,95,150,40);}},
 mousepad:{name:'Mouse pad',icon:'computer-mouse',price:25000,kind:'matte',b:[120,580],colors:['#ffffff','#111111'],tallas:['Normal','Grande'],
  zones:[{k:'full',n:'Completo',a:[130,215,440,270]}],shape(){rr(120,205,460,290,30);}},
 cojin:{name:'Cojín',icon:'couch',price:45000,kind:'cloth',b:[150,550],colors:['#ffffff','#efe3d0','#f4d8e9','#cdb4e6','#111111'],tallas:['35x35 cm','45x45 cm'],
  zones:[{k:'full',n:'Frente completo',a:[190,190,320,320]}],shape(){rr(150,150,400,400,70);}},
 rompecabezas:{name:'Rompecabezas',icon:'puzzle-piece',price:28000,kind:'matte',b:[150,550],colors:['#ffffff'],tallas:['120 piezas','252 piezas'],
  zones:[{k:'full',n:'Completo',a:[160,190,380,320]}],shape(){rr(150,180,400,340,10);}}
};

const S = {p:'camiseta',zone:'pizq',view:'f',color:'#ffffff',talla:'M',qty:1,layers:[],act:-1,off:0,n:{img:0,txt:0}};
const P = () => PRODUCTS[S.p], Z = () => P().zones.find(z => z.k === S.zone), act = () => S.layers[S.act];

/* ---------- capas ---------- */
const cropSize = L => ({w:L.img.width*(1-L.c.l-L.c.r), h:L.img.height*(1-L.c.t-L.c.b)});
function fit(L,a){ if(L.t==='img'){const c=cropSize(L);return Math.min(a[2]/c.w,a[3]/c.h);} return Math.min(a[3]*.45,a[2]/(Math.max(4,L.text.length)*.62)); }
function drawLayer(g,L,a){
  const f = fit(L,a)*L.s; g.save(); g.translate(L.x,L.y); g.rotate(L.r*Math.PI/180); g.scale(L.fl,1);
  if(L.t==='img'){ const c=L.c,w=L.img.width,h=L.img.height,sw=w*(1-c.l-c.r),sh=h*(1-c.t-c.b); g.scale(f,f);
    if(L.round){g.beginPath();g.ellipse(0,0,sw/2,sh/2,0,0,7);g.clip();}
    g.drawImage(L.img,w*c.l,h*c.t,sw,sh,-sw/2,-sh/2,sw,sh);
  } else { g.font=`${L.font==='Montserrat'?700:400} ${f}px "${L.font}"`; g.fillStyle=L.col; g.textAlign='center'; g.textBaseline='middle'; g.fillText(L.text,0,0); }
  g.restore();
}
const A = document.createElement('canvas');
function art(){ const a=Z().a, w=P().wrap?Math.round(a[2]*Math.PI):a[2]; A.width=w; A.height=a[3]; const g=A.getContext('2d'); g.translate(w/2,a[3]/2); S.layers.forEach(L=>drawLayer(g,L,a)); }

/* ---------- dibujo ---------- */
function render(guides=true,flat=false){
  const p=P(), z=Z(), [ax,ay,aw,ah]=z.a, back=S.view==='b';
  ctx.clearRect(0,0,700,700);
  if(!flat){ctx.save(); ctx.fillStyle='rgba(53,16,79,.14)'; ctx.filter='blur(18px)'; ctx.beginPath(); ctx.ellipse(350,588,190,20,0,0,7); ctx.fill(); ctx.restore();}
  ctx.save(); p.shape(back); ctx.fillStyle=S.color; ctx.fill(); ctx.lineJoin='round'; ctx.lineWidth=2; ctx.strokeStyle='rgba(0,0,0,.15)'; ctx.stroke(); ctx.restore();
  art();
  ctx.save(); p.shape(back); ctx.clip(); ctx.beginPath(); ctx.rect(ax,ay,aw,ah); ctx.clip();
  ctx.globalCompositeOperation = light(S.color)?'multiply':'source-over';
  if(p.wrap){ const N=aw,d=Math.PI/N;
    for(let i=0;i<N;i++){ const ph=((i+.5)/N*2-1)*Math.PI/2, cx=ax+aw/2+aw/2*Math.sin(ph), dw=aw/2*Math.cos(ph)*d, sw=A.width*d/(2*Math.PI), u=.5+(ph+S.off)/(2*Math.PI);
      const sx=((u*A.width-sw/2)%A.width+A.width)%A.width; if(sx+sw>A.width) continue;
      ctx.drawImage(A,sx,0,sw,ah,cx-dw/2,ay,dw+.7,ah); }
  } else ctx.drawImage(A,ax,ay);
  ctx.restore();
  /* luz, pliegues y volumen */
  ctx.save(); p.shape(back); ctx.clip();
  const g=ctx.createLinearGradient(p.b[0],0,p.b[1],0);
  if(p.kind==='gloss'){ g.addColorStop(0,'rgba(0,0,0,.30)'); g.addColorStop(.28,'rgba(255,255,255,.26)'); g.addColorStop(.42,'rgba(255,255,255,0)'); g.addColorStop(.8,'rgba(0,0,0,.06)'); g.addColorStop(1,'rgba(0,0,0,.32)'); }
  else { g.addColorStop(0,'rgba(0,0,0,.14)'); g.addColorStop(.3,'rgba(255,255,255,.10)'); g.addColorStop(.7,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.16)'); }
  ctx.fillStyle=g; ctx.fillRect(0,0,700,700);
  if(p.kind==='cloth' && S.p==='camiseta'){
    ctx.strokeStyle='rgba(0,0,0,.07)'; ctx.lineWidth=3;
    [[300,300,288,430,300,550],[405,290,418,420,402,550],[215,260,205,300,190,330]].forEach(c=>{ctx.beginPath();ctx.moveTo(c[0],c[1]);ctx.quadraticCurveTo(c[2],c[3],c[4],c[5]);ctx.stroke();});
    ctx.beginPath(); ctx.moveTo(255,120); ctx.quadraticCurveTo(350,back?135:200,445,120); ctx.lineWidth=9; ctx.strokeStyle='rgba(0,0,0,.20)'; ctx.stroke();
  }
  ctx.restore();
  if(guides){ ctx.save(); ctx.setLineDash([8,6]); ctx.strokeStyle='rgba(217,75,152,.9)'; ctx.lineWidth=2; ctx.strokeRect(ax,ay,aw,ah); ctx.restore(); }
}

/* ---------- interfaz ---------- */
function ui(){
  const p=P();
  $('productOptions').innerHTML=Object.entries(PRODUCTS).map(([k,x])=>`<button class="product-option ${k===S.p?'active':''}" data-p="${k}"><i class="fa-solid fa-${x.icon}"></i><span>${x.name}</span></button>`).join('');
  $('productName').textContent=p.name; $('price').textContent=money(p.price);
  $('swatches').innerHTML=p.colors.map(c=>`<span class="swatch ${c===S.color?'active':''}" data-c="${c}" title="${NAMES[c]}" style="background:${c}"></span>`).join('');
  $('colorName').textContent=NAMES[S.color]; $('warn').style.display=light(S.color)?'none':'block';
  $('tallas').innerHTML=p.tallas.map(t=>`<button class="chip ${t===S.talla?'active':''}" data-t="${t}">${t}</button>`).join('');
  $('qty').textContent=S.qty;
  const hasV=p.zones.some(z=>z.v); $('viewRow').style.display=hasV?'flex':'none';
  document.querySelectorAll('#viewRow .chip').forEach(b=>b.classList.toggle('active',b.dataset.v===S.view));
  $('zones').innerHTML=p.zones.filter(z=>!hasV||z.v===S.view).map(z=>`<button class="chip ${z.k===S.zone?'active':''}" data-z="${z.k}">${z.n}</button>`).join('');
  $('wrapRow').style.display=p.wrap?'block':'none';
  $('layers').innerHTML=S.layers.length?S.layers.map((L,i)=>`<button class="chip ${i===S.act?'active':''}" data-i="${i}">${L.t==='img'?'Imagen':'Texto'} ${L.num}</button>`).join(''):'<small class="tip">Aún no hay diseño</small>';
  syncCtl();
}
function syncCtl(){
  const L=act(); $('adjust').classList.toggle('off',!L); if(!L) return;
  $('scale').value=Math.round(L.s*100); $('scaleValue').textContent=$('scale').value+'%'; $('rotation').value=L.r; $('rotationValue').textContent=L.r+'°';
  $('cropBox').style.display=L.t==='img'?'block':'none';
  if(L.t==='img'){ ['l','r','t','b'].forEach(k=>$('c'+k).value=Math.round(L.c[k]*100)); $('roundChk').checked=L.round; }
  else { $('txtIn').value=L.text; $('txtFont').value=L.font; $('txtCol').value=L.col; }
}
function addLayer(L){ L.num=++S.n[L.t]; S.layers.push(L); S.act=S.layers.length-1; $('hint').classList.remove('hide'); ui(); render(); }
function setZone(k){ S.zone=k; S.layers.forEach(L=>{L.x=L.y=0;}); ui(); render(); }

function setProduct(k){
  S.p=k; const p=P(); S.view='f'; if(!p.colors.includes(S.color)) S.color=p.colors[0];
  S.talla=p.tallas.includes('M')?'M':p.tallas[0]; S.zone=(p.zones.find(z=>!z.v||z.v==='f')||p.zones[0]).k;
  S.layers.forEach(L=>{L.x=L.y=0;}); ui(); render();
}
$('productOptions').onclick=e=>{const b=e.target.closest('button'); if(b) setProduct(b.dataset.p);};
$('swatches').onclick=e=>{const s=e.target.closest('.swatch'); if(s){S.color=s.dataset.c; ui(); render();}};
$('tallas').onclick=e=>{const b=e.target.closest('button'); if(b){S.talla=b.dataset.t; ui();}};
$('qMinus').onclick=()=>{S.qty=Math.max(1,S.qty-1); $('qty').textContent=S.qty;};
$('qPlus').onclick=()=>{S.qty=Math.min(999,S.qty+1); $('qty').textContent=S.qty;};
$('zones').onclick=e=>{const b=e.target.closest('button'); if(b) setZone(b.dataset.z);};
$('viewRow').onclick=e=>{const b=e.target.closest('button'); if(!b) return; S.view=b.dataset.v; S.zone=P().zones.find(z=>z.v===S.view).k; S.layers.forEach(L=>{L.x=L.y=0;}); ui(); render();};
$('layers').onclick=e=>{const b=e.target.closest('button'); if(b){S.act=+b.dataset.i; ui();}};

/* subir imágenes */
function loadFile(f){
  if(!f||!/^image\/(png|jpe?g|webp)$/.test(f.type)) return toast('Usa PNG, JPG o WEBP');
  const img=new Image(); img.onload=()=>addLayer({t:'img',img,x:0,y:0,s:1,r:0,fl:1,c:{l:0,r:0,t:0,b:0},round:false}); img.src=URL.createObjectURL(f);
}
$('imageUpload').onchange=e=>{[...e.target.files].forEach(loadFile); e.target.value='';};
const dz=$('dropzone');
['dragover','dragenter'].forEach(v=>dz.addEventListener(v,e=>{e.preventDefault();dz.classList.add('drag');}));
['dragleave','drop'].forEach(v=>dz.addEventListener(v,e=>{e.preventDefault();dz.classList.remove('drag');}));
dz.addEventListener('drop',e=>[...e.dataTransfer.files].forEach(loadFile));

/* texto */
$('addTxt').onclick=()=>addLayer({t:'txt',text:$('txtIn').value||'Tu texto',font:$('txtFont').value,col:$('txtCol').value,x:0,y:0,s:1,r:0,fl:1});
$('txtIn').oninput=e=>{const L=act(); if(L&&L.t==='txt'){L.text=e.target.value||' '; render();}};
$('txtFont').onchange=e=>{const L=act(); if(L&&L.t==='txt'){L.font=e.target.value; render();}};
$('txtCol').oninput=e=>{const L=act(); if(L&&L.t==='txt'){L.col=e.target.value; render();}};

/* ajustes */
$('scale').oninput=e=>{const L=act(); if(!L) return; L.s=e.target.value/100; $('scaleValue').textContent=e.target.value+'%'; render();};
$('rotation').oninput=e=>{const L=act(); if(!L) return; L.r=+e.target.value; $('rotationValue').textContent=L.r+'°'; render();};
['l','r','t','b'].forEach(k=>$('c'+k).oninput=e=>{const L=act(); if(!L||L.t!=='img') return; L.c[k]=e.target.value/100; const o={l:'r',r:'l',t:'b',b:'t'}[k];
  if(L.c[k]+L.c[o]>.9){L.c[o]=.9-L.c[k]; $('c'+o).value=Math.round(L.c[o]*100);} render();});
$('roundChk').onchange=e=>{const L=act(); if(L){L.round=e.target.checked; render();}};
$('mugAngle').oninput=e=>{S.off=e.target.value*Math.PI/180; $('offValue').textContent=e.target.value+'°'; render();};
$('fitBtn').onclick=()=>{const L=act(); if(L){L.s=1;L.x=L.y=0;L.r=0; syncCtl(); render();}};
$('centerBtn').onclick=()=>{const L=act(); if(L){L.x=L.y=0; render();}};
$('flipBtn').onclick=()=>{const L=act(); if(L){L.fl*=-1; render();}};
$('removeDesign').onclick=()=>{if(!act()) return; S.layers.splice(S.act,1); S.act=S.layers.length-1; ui(); render();};
$('resetButton').onclick=()=>{S.layers=[]; S.act=-1; S.off=0; $('mugAngle').value=0; ui(); render();};
function copy(){const c=document.createElement('canvas');c.width=c.height=700;c.getContext('2d').drawImage(cv,0,0);return c;}
function snap3D(){
  const p=P(), keep={v:S.view,z:S.zone,l:S.layers}, out={id:S.p,kind:p.kind,wrap:!!p.wrap,color:S.color};
  render(false,true);
  if(p.wrap){ const b=p.body,T=document.createElement('canvas'); T.width=A.width; T.height=b[1]-b[0];
    const g=T.getContext('2d'); g.fillStyle=S.color; g.fillRect(0,0,T.width,T.height);
    g.globalCompositeOperation=light(S.color)?'multiply':'source-over'; g.drawImage(A,0,Z().a[1]-b[0]);
    out.side=T; out.R=Z().a[2]/200; out.H=(b[1]-b[0])/100;
  } else { out.front=copy();
    if(p.zones.some(z=>z.v)){ S.view=S.view==='f'?'b':'f'; S.zone=p.zones.find(z=>z.v===S.view).k; }
    S.layers=[]; render(false,true); out.back=copy(); }
  S.view=keep.v; S.zone=keep.z; S.layers=keep.l; render(); return out;
}
$('view3d').onclick=async()=>{ try{ await MUVI3D.open(snap3D()); }catch(e){ toast('No se pudo cargar la vista 3D (revisa tu internet)'); } };

/* arrastrar capa activa */
let drag=null;
const pos=e=>{const r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)*700/r.width,y:(e.clientY-r.top)*700/r.height};};
cv.addEventListener('pointerdown',e=>{const L=act(); if(!L) return; const p=pos(e); drag={dx:p.x-L.x,dy:p.y-L.y}; cv.setPointerCapture(e.pointerId); cv.classList.add('grabbing'); $('hint').classList.add('hide');});
cv.addEventListener('pointermove',e=>{if(!drag) return; const L=act(),p=pos(e); L.x=p.x-drag.dx; L.y=p.y-drag.dy; render();});
['pointerup','pointercancel'].forEach(v=>cv.addEventListener(v,()=>{drag=null; cv.classList.remove('grabbing');}));
cv.addEventListener('wheel',e=>{const L=act(); if(!L) return; e.preventDefault(); L.s=Math.min(3,Math.max(.05,L.s*(e.deltaY<0?1.05:.95))); syncCtl(); render();},{passive:false});

/* descargar y carrito */
$('downloadBtn').onclick=()=>{render(false); const a=document.createElement('a'); a.download=`muvi-${S.p}.png`; a.href=cv.toDataURL('image/png'); a.click(); render();};
function thumb(){render(false); const c=document.createElement('canvas'); c.width=c.height=260; c.getContext('2d').drawImage(cv,0,0,260,260); render(); return c.toDataURL('image/jpeg',.7);}
$('addCart').onclick=()=>{
  if(!S.layers.length) return toast('Primero sube tu diseño o agrega un texto');
  const P_=P(), cart=JSON.parse(localStorage.getItem('muviCart')||'[]');
  cart.push({id:Date.now(),producto:P_.name,color:S.color,colorName:NAMES[S.color],talla:S.talla,qty:S.qty,zona:Z().n,precio:P_.price,img:thumb()});
  try{localStorage.setItem('muviCart',JSON.stringify(cart));}catch{return toast('No se pudo guardar el pedido');}
  count(); toast('¡Agregado a tu pedido!');
};
function count(){const n=JSON.parse(localStorage.getItem('muviCart')||'[]').reduce((a,i)=>a+(i.qty||1),0),c=$('cartCount'); if(c) c.textContent=n;}
function toast(t){const el=$('toast'); el.textContent=t; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2400);}

/* inicio */
count();
const q=new URLSearchParams(location.search).get('producto');
setProduct(PRODUCTS[q]?q:'camiseta');
Promise.all(['Montserrat','Playfair Display','Pacifico','Bebas Neue','Dancing Script'].map(f=>document.fonts.load(`40px "${f}"`))).then(render);
})();
