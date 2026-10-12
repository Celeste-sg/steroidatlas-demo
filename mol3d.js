/* Dependency-free molecule viewer: rotating 3D ball-and-stick / stick / space-filling on a canvas,
   with a 2D drawing toggle. Data: {atoms:[[el,x,y,z],...], bonds:[[i,j,order],...]} (angstrom). */
(function(){
const COL={C:'#9db4e8',H:'#e8eefc',O:'#ff5d73',N:'#6f9bff',F:'#5eeab4',S:'#f5cf62',Cl:'#5eeab4',P:'#ffa85c'};
const VDW={C:1.7,H:1.1,O:1.52,N:1.55,F:1.47,S:1.8,Cl:1.75,P:1.8};
const col=e=>COL[e]||'#c9a8ff';
function shade(hex,k){const n=parseInt(hex.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v*k)));return `rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`}
function lighten(hex,k){const n=parseInt(hex.slice(1),16),f=v=>Math.round(v+(255-v)*k);return `rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`}
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

function Viewer(canvas,data){
 const s=this;s.c=canvas;s.ctx=canvas.getContext('2d');s.data=data;s.mode='ball';s.hydrogens=false;s.spin=true;s.speed=1;
 s.yaw=0.6;s.pitch=-0.35;s.zoom=1;s.visible=true;s.drag=null;
 const xs=data.atoms;let cx=0,cy=0,cz=0;xs.forEach(a=>{cx+=a[1];cy+=a[2];cz+=a[3]});const n=xs.length||1;cx/=n;cy/=n;cz/=n;
 s.P=xs.map(a=>[a[1]-cx,a[2]-cy,a[3]-cz]);s.R=Math.max(1,...s.P.map(p=>Math.hypot(p[0],p[1],p[2])))+1.0;
 canvas.addEventListener('pointerdown',e=>{s.drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('grab')});
 canvas.addEventListener('pointermove',e=>{if(!s.drag)return;s.yaw+=(e.clientX-s.drag.x)*.011;s.pitch+=(e.clientY-s.drag.y)*.011;s.pitch=Math.max(-1.5,Math.min(1.5,s.pitch));s.drag={x:e.clientX,y:e.clientY};s.draw()});
 const end=()=>{s.drag=null;canvas.classList.remove('grab')};
 canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 canvas.addEventListener('wheel',e=>{e.preventDefault();s.zoom=Math.max(.6,Math.min(2.4,s.zoom*(e.deltaY<0?1.08:.925)));s.draw()},{passive:false});
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{s.visible=es[0].isIntersecting}).observe(canvas);
 const tick=()=>{if(!s.dead){if(s.spin&&s.visible&&!s.drag&&s.c.offsetParent){s.yaw+=.00425*s.speed;s.draw()}requestAnimationFrame(tick)}};
 s.draw();requestAnimationFrame(tick);
}
Viewer.prototype.draw=function(){
 const s=this,c=s.c,dpr=window.devicePixelRatio||1,W=c.clientWidth,H=c.clientHeight;if(!W||!H)return;
 if(c.width!==Math.round(W*dpr)||c.height!==Math.round(H*dpr)){c.width=Math.round(W*dpr);c.height=Math.round(H*dpr)}
 const g=s.ctx;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 const cy=Math.cos(s.yaw),sy=Math.sin(s.yaw),cp=Math.cos(s.pitch),sp=Math.sin(s.pitch);
 const base=Math.min(W,H)/(2*(s.R+(s.mode==='fill'?.9:0)))*s.zoom,D=s.R*4.2;
 const A=s.data.atoms,show=i=>s.hydrogens||A[i][0]!=='H';
 const T=s.P.map(p=>{let x=p[0]*cy+p[2]*sy,z=-p[0]*sy+p[2]*cy,y=p[1];const y2=y*cp-z*sp,z2=y*sp+z*cp;const f=D/(D-z2);return{x:W/2+x*base*f,y:H/2-y2*base*f,z:z2,f}});
 const items=[];
 if(s.mode!=='fill')s.data.bonds.forEach(b=>{if(show(b[0])&&show(b[1]))items.push({k:'b',z:(T[b[0]].z+T[b[1]].z)/2,b})});
 A.forEach((a,i)=>{if(show(i))items.push({k:'a',z:T[i].z,i})});
 items.sort((p,q)=>p.z-q.z);
 const bw=s.mode==='stick'?.24:.14;
 for(const it of items){
  if(it.k==='b'){
   const [i,j,o]=it.b,p=T[i],q=T[j],w=bw*base*(p.f+q.f)/2,dx=q.x-p.x,dy=q.y-p.y,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
   const offs=o>=2?[-.62,.62]:[0];const ww=o>=2?w*.62:w;
   g.lineCap='round';
   for(const off of offs){
    const ox=nx*off*w*1.15,oy=ny*off*w*1.15,mx=(p.x+q.x)/2+ox,my=(p.y+q.y)/2+oy;
    for(const [a,b,h] of [[p,[mx,my],i],[q,[mx,my],j]]){
     g.beginPath();g.moveTo(a.x+ox,a.y+oy);g.lineTo(b[0],b[1]);g.strokeStyle='rgba(2,5,14,.55)';g.lineWidth=ww+2;g.stroke();
     g.beginPath();g.moveTo(a.x+ox,a.y+oy);g.lineTo(b[0],b[1]);g.strokeStyle=col(A[h][0]);g.lineWidth=ww;g.stroke();
    }
   }
  }else{
   const a=A[it.i],t=T[it.i];
   let r=s.mode==='fill'?VDW[a[0]]||1.7:s.mode==='stick'?bw/2:(a[0]==='H'?.27:.47);
   r=Math.max(1.2,r*base*t.f*(s.mode==='stick'?1:1));
   const base0=col(a[0]),gr=g.createRadialGradient(t.x-r*.35,t.y-r*.38,r*.1,t.x,t.y,r);
   gr.addColorStop(0,lighten(base0,.55));gr.addColorStop(.45,base0);gr.addColorStop(1,shade(base0,.42));
   g.beginPath();g.arc(t.x,t.y,r,0,6.2832);g.fillStyle=gr;g.fill();
  }
 }
};
Viewer.prototype.destroy=function(){this.dead=true};

/* mount(container,{svg2d, data|url, caption}) */
function mount(box,o){
 box.classList.add('mol-view');box.innerHTML='';
 const bar=el('div','mv-bar'),stage=el('div','mv-stage');
 const img=el('img','mv-2d');img.src=o.svg2d;img.alt=o.alt||'2D 结构';img.hidden=true;
 const cv=el('canvas','mv-3d');
 const msg=el('div','mv-msg','正在生成 3D 构象…');
 stage.append(img,cv,msg);
 const grp=(items,onPick,init)=>{const g=el('div','mv-seg');items.forEach(([k,t])=>{const b=el('button',k===init?'on':'',t);b.type='button';b.dataset.k=k;b.onclick=()=>{g.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));onPick(k)};g.append(b)});return g};
 let viewer=null,data=o.data||null;
 const modeG=grp([['ball','球棍'],['stick','棍状'],['fill','空间填充']],k=>{if(viewer){viewer.mode=k;viewer.draw()}},'ball');
 const spin=el('button','mv-tool on','旋转');spin.type='button';
 spin.onclick=()=>{if(!viewer)return;viewer.spin=!viewer.spin;spin.classList.toggle('on',viewer.spin)};
 const hy=el('button','mv-tool','氢原子');hy.type='button';
 hy.onclick=()=>{if(!viewer)return;viewer.hydrogens=!viewer.hydrogens;hy.classList.toggle('on',viewer.hydrogens);viewer.draw()};
 const spd=el('label','mv-speed','转速 ');const rng=el('input');rng.type='range';rng.min='0.25';rng.max='5';rng.step='0.25';rng.value='1';rng.setAttribute('aria-label','旋转速度');
 const val=el('span','mv-speed-val','1×');spd.append(rng,val);
 rng.oninput=()=>{const v=parseFloat(rng.value);val.textContent=v+'×';if(viewer){viewer.speed=v;if(!viewer.spin){viewer.spin=true;spin.classList.add('on')}}};
 const tools=el('div','mv-tools');tools.append(modeG,spin,spd,hy);
 const view=grp([['3d','3D'],['2d','2D 结构式']],k=>{const is3=k==='3d';img.hidden=is3;cv.hidden=!is3||!viewer&&!data;tools.hidden=!is3;msg.hidden=!is3||!!viewer;if(viewer)viewer.draw()},'3d');
 bar.append(view,tools);
 const note=el('p','mv-note',o.caption||'3D 构象由 RDKit（ETKDG + MMFF94）生成，用于展示立体形状；不是量化计算或实验结构。拖动旋转，滚轮缩放。');
 box.append(bar,stage,note);
 if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){spin.classList.remove('on')}
 const start=d=>{data=d;msg.hidden=true;viewer=new Viewer(cv,d);if(!spin.classList.contains('on'))viewer.spin=false;box._viewer=viewer;requestAnimationFrame(()=>viewer.draw())};
 if(data)start(data);
 else fetch(o.url).then(r=>{if(!r.ok)throw 0;return r.json()}).then(start).catch(()=>{msg.textContent='3D 构象暂不可用，已显示 2D 结构式。';img.hidden=false;cv.hidden=true});
}
window.Mol3D={mount,Viewer};
})();
