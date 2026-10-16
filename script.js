const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuButton=document.querySelector('.menu-button');const mobileMenu=document.querySelector('.mobile-menu');
function setMenu(open){menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');mobileMenu.classList.toggle('open',open);mobileMenu.inert=!open;document.body.style.overflow=open?'hidden':''}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
// An interruptible, velocity-aware press spring. Pointer down acts immediately;
// moving beyond 10px cancels the pressed state so scrolling remains natural.
document.querySelectorAll('.pressable').forEach(el=>{
 let x=1,v=0,target=1,raf=0,last=0,pointer=null,startX=0,startY=0;
 const paint=()=>{if(reduced){el.style.transform='';return}const now=performance.now(),dt=Math.min((now-last||16)/1000,.032);last=now;const acceleration=(target-x)*650-v*34;v+=acceleration*dt;x+=v*dt;el.style.transform=`scale(${x})`;if(Math.abs(target-x)>.001||Math.abs(v)>.01)raf=requestAnimationFrame(paint);else{raf=0;el.style.transform=target===1?'':`scale(${target})`}};
 const aim=n=>{target=n;if(reduced){el.style.transform=n===1?'':`scale(${n})`;return}if(!raf){last=performance.now();raf=requestAnimationFrame(paint)}};
 el.addEventListener('pointerdown',e=>{if(e.button!==0)return;pointer=e.pointerId;startX=e.clientX;startY=e.clientY;el.classList.add('pressed');aim(.957)});
 el.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;if(Math.hypot(e.clientX-startX,e.clientY-startY)>10){pointer=null;el.classList.remove('pressed');aim(1)}});
 const release=e=>{if(pointer!==null&&e.pointerId!==pointer)return;pointer=null;el.classList.remove('pressed');aim(1)};
 el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('pointerleave',release);
});
if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.section-head,.about-grid,.services-head,.service,.brands h2,.contact-grid').forEach(el=>{el.classList.add('reveal');io.observe(el)})}
const glow=document.querySelector('.cursor-glow');if(matchMedia('(pointer:fine)').matches&&!reduced){window.addEventListener('pointermove',e=>{glow.style.opacity='1';glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true})}
document.getElementById('enquiry').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const subject=`SMV strategy enquiry — ${d.get('company')}`;const body=`Name: ${d.get('first')} ${d.get('last')}\nEmail: ${d.get('email')}\nCompany: ${d.get('company')}\nCountry: ${d.get('country')}\n\nGoals:\n${d.get('message')}`;const url=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;location.href=url});
