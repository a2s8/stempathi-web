/* STEMpathi site: balance toy. Plain JS, no storage, no network. */
(()=>{const st={L:3,R:1},MAX=10,el=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let ang=0,vel=0,target=0,raf=null;
function pan(g,x,y,n){let h='<line x1="'+x+'" y1="'+y+'" x2="'+(x-46)+'" y2="'+(y+120)+'" stroke="#1f7a74" stroke-width="3"/><line x1="'+x+'" y1="'+y+'" x2="'+(x+46)+'" y2="'+(y+120)+'" stroke="#1f7a74" stroke-width="3"/><ellipse cx="'+x+'" cy="'+(y+124)+'" rx="66" ry="14" fill="#f1ece0" stroke="#d9d2c0" stroke-width="2"/>';
 for(let i=0;i<n;i++){const c=i%4,r=Math.floor(i/4);h+='<g transform="translate('+(x-50+c*25)+','+(y+96-r*25)+')"><rect width="23" height="23" rx="5" fill="#8fdcc0" stroke="#5bb79a"/><text x="11.5" y="16" font-size="10" text-anchor="middle" fill="#173d40" font-weight="700">+1</text></g>';}
 g.innerHTML=h;}
function draw(){const a=ang*Math.PI/180,cx=260,cy=104,d=170;el('beam').setAttribute('transform','rotate('+ang+' 260 104)');
 pan(el('panL'),cx-d*Math.cos(a),cy-d*Math.sin(a),st.L);pan(el('panR'),cx+d*Math.cos(a),cy+d*Math.sin(a),st.R);}
function step(){vel+=(target-ang)*0.08;vel*=0.82;ang+=vel;draw();if(Math.abs(target-ang)>0.05||Math.abs(vel)>0.05)raf=requestAnimationFrame(step);else{ang=target;draw();raf=null}}
function update(){target=Math.max(-MAX,Math.min(MAX,(st.R-st.L)*3));const r=document.querySelector('.toy-read');
 r.textContent=st.L+' and '+st.R+' — '+(st.L===st.R?'Level! Both sides match.':(st.L>st.R?'The left side is heavier.':'The right side is heavier.'));
 if(reduce){ang=target;draw()}else if(!raf)raf=requestAnimationFrame(step)}
document.querySelectorAll('.toy-btns button').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.a;
 if(a==='0'){st.L=3;st.R=1}else{const k=a[0];st[k]=Math.max(0,Math.min(12,st[k]+(a[1]==='+'?1:-1)))}update()}));
update();})();
