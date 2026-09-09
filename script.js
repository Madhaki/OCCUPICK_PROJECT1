const modal=document.getElementById('modal'), content=document.getElementById('modalContent'), toast=document.getElementById('toast');
function openModal(type){
 let html='';
 if(type==='signup') html=`<h2>Join OccuPick</h2><p>Create a profile and start finding your next opportunity.</p><form class="form" onsubmit="event.preventDefault();closeModal();showToast('Welcome to OccuPick!')"><input required placeholder="Full name"><input required type="email" placeholder="Email"><select><option>I'm looking for work</option><option>I'm hiring</option></select><button class="btn">Create account</button></form>`;
 if(type==='login') html=`<h2>Welcome back</h2><p>Log in to continue.</p><form class="form" onsubmit="event.preventDefault();closeModal();showToast('Logged in successfully')"><input required type="email" placeholder="Email"><input required type="password" placeholder="Password"><button class="btn">Log in</button></form>`;
 if(type==='task') html=`<h2>Post a task</h2><p>Tell OccuPick what you need.</p><form class="form" onsubmit="event.preventDefault();closeModal();showToast('Task posted — matching candidates…')"><input required placeholder="Task title"><select><option>Digital</option><option>Physical</option></select><input required placeholder="Budget (₱)"><textarea rows="4" required placeholder="Describe the task"></textarea><button class="btn">Post task</button></form>`;
 content.innerHTML=html;modal.classList.remove('hidden');
}
function closeModal(){modal.classList.add('hidden')}
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}
document.getElementById('themeBtn').onclick=()=>{document.body.classList.toggle('dark');document.getElementById('themeBtn').textContent=document.body.classList.contains('dark')?'☀':'☾'};

// Immersive Tinder-style swipe interaction
const stack=document.getElementById('matchStack');
let active= document.getElementById('activeCard');
let startX=0, currentX=0, dragging=false;
function refreshActive(){ active=stack?.querySelector('.active-card'); if(!active)return; active.onpointerdown=startDrag; }
function startDrag(e){
  dragging=true; startX=e.clientX; currentX=0; active.classList.add('dragging'); active.setPointerCapture?.(e.pointerId);
  active.onpointermove=dragMove; active.onpointerup=dragEnd; active.onpointercancel=dragEnd;
}
function dragMove(e){
  if(!dragging)return; currentX=e.clientX-startX; const rot=currentX*.08;
  active.style.transform=`translateX(${currentX}px) rotate(${rot}deg)`;
  active.classList.toggle('like-hint',currentX>55); active.classList.toggle('pass-hint',currentX<-55);
}
function dragEnd(){
  if(!dragging)return; dragging=false; active.classList.remove('dragging');
  active.onpointermove=null; active.onpointerup=null;
  if(Math.abs(currentX)>110) swipeCard(currentX>0?'right':'left');
  else {active.style.transform='';active.classList.remove('like-hint','pass-hint')}
}
function swipeCard(direction){
  if(!active)return;
  const old=active;
  const liked=direction==='right';
  old.classList.remove('dragging','like-hint','pass-hint');
  old.classList.add(liked?'swiping-right':'swiping-left');
  if(liked) createBurst(); else showToast('Passed — finding another match');
  setTimeout(()=>{
    old.remove();
    const backs=stack.querySelectorAll('.card-back');
    const next=backs[backs.length-1];
    if(next){next.classList.remove('card-back');next.classList.add('active-card');next.style.transform='';next.style.opacity='';next.style.filter='';refreshActive();}
    else{
      stack.innerHTML='<div class="match-card" style="display:grid;place-items:center;text-align:center"><div><div class="avatar" style="margin:auto auto 15px">✓</div><h3>All caught up!</h3><p>Check back soon for new opportunities.</p><button class="btn" onclick="location.reload()">Reload matches</button></div></div>';
    }
  },420);
}
function createBurst(){
  const burst=document.createElement('div'); burst.className='match-burst'; burst.innerHTML='<div class="bubble">It’s a match! 🎉</div>'; stack.appendChild(burst);
  for(let i=0;i<16;i++){const s=document.createElement('i');s.className='spark';s.style.setProperty('--x',`${Math.cos(i/16*Math.PI*2)*150}px`);s.style.setProperty('--y',`${Math.sin(i/16*Math.PI*2)*150}px`);burst.appendChild(s)}
  showToast('It’s a match! 🎉'); setTimeout(()=>burst.remove(),850);
}
refreshActive();
