/* THE WALK HOME — vanilla Canvas game. All art is drawn here; no assets required. */
'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const ui = Object.fromEntries(['distance','best','lives','level','checkpoint','drift','overlay','screen-title','screen-copy','result','start','pause','motion','toast'].map(id => [id,document.getElementById(id)]));
const W=960, H=600, ROAD_LEFT=285, ROAD_RIGHT=675, PLAYER_Y=475;
const keys = new Set();
const locations=['Campus Bar District','High Street','The Library','Campus Construction','Wrong Way','Almost Home'];
const types=['scooter','cone','pothole','trash','car','students','sign','puddle','barrier'];
const sizes={scooter:[30,55],cone:[34,38],pothole:[57,28],trash:[35,43],car:[58,100],students:[63,43],sign:[33,46],puddle:[65,28],barrier:[66,35]};
const jokes={scooter:'Defeated by a Lime scooter.',cone:'The construction cone won.',pothole:'A pothole with a minor in sabotage.',trash:'Your night has been officially binned.',car:'Parked cars: still undefeated.',students:'The group project blocked your path.',sign:'The sign said stop. You listened.',puddle:'Your shoes have left the chat.',barrier:'Expected completion: never.'};
let best=0;
try{const saved=Number(localStorage.getItem('walkHomeBest'));best=Number.isFinite(saved)?Math.max(0,Math.floor(saved)):0;}catch{/* Private browsing must not prevent play. */}
let state='ready',distance=0,level=1,lives=3,speed=180,scroll=0,elapsed=0,spawnTimer=1,invincible=0;
let playerX=480,obstacles=[],particles=[],lastTime=0,toastTimer=0,driftForce=0,driftTimer=2;
let reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
ui.motion.textContent=`Sway: ${reducedMotion?'OFF':'ON'}`;ui.motion.setAttribute('aria-pressed',String(reducedMotion));
const random=(min,max)=>min+Math.random()*(max-min);
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
function updateHUD(){
  ui.distance.innerHTML=`${String(Math.floor(distance)).padStart(4,'0')} <small>m</small>`;
  ui.best.innerHTML=`${String(best).padStart(4,'0')} <small>m</small>`;
  ui.lives.textContent='♥ '.repeat(lives)+'♡ '.repeat(3-lives);ui.lives.setAttribute('aria-label',`${lives} lives`);
  ui.level.innerHTML=`${String(level).padStart(2,'0')} <small>${level<3?'FRESH LEGS':level<6?'SIDEWALK SHUFFLE':'LATE-NIGHT LEGEND'}</small>`;
  ui.checkpoint.textContent=locations[Math.floor(distance/250)%locations.length];
  ui.drift.textContent=level<3?'STEADY FEET • FOR NOW':'MILD DRIFT • KEEP STEERING';
}
function toast(message){ui.toast.textContent=message;toastTimer=2.5;ui.toast.classList.add('visible');}
function startGame(){
  state='playing';distance=0;level=1;lives=3;speed=180;elapsed=0;scroll=0;spawnTimer=1;invincible=0;
  playerX=480;obstacles=[];particles=[];driftForce=0;driftTimer=2;keys.clear();toastTimer=0;ui.toast.classList.remove('visible');
  ui.overlay.hidden=true;ui.pause.disabled=false;ui.pause.textContent='Ⅱ';ui.pause.setAttribute('aria-label','Pause game');updateHUD();
}
function endGame(type){
  state='over';keys.clear();best=Math.max(best,Math.floor(distance));
  try{localStorage.setItem('walkHomeBest',String(best));}catch{/* Best still works in memory when storage is blocked. */}
  ui['screen-title'].innerHTML="YOU DIDN’T<br>MAKE IT <span>HOME</span>";
  ui['screen-title'].style.fontSize='clamp(30px, 4.7vw, 57px)';
  const messages=[jokes[type],"So close. Yet so far.","Should've called an Uber.",'High Street claims another victim.'];
  ui['screen-copy'].textContent=messages[Math.floor(Math.random()*messages.length)];
  ui.result.hidden=false;ui.result.textContent=`DISTANCE ${Math.floor(distance)} m  /  BEST ${best} m`;
  ui.start.innerHTML='PLAY AGAIN <span>↗</span>';ui.overlay.hidden=false;ui.pause.disabled=true;ui.start.focus();updateHUD();
}
function togglePause(){
  if(state!=='playing'&&state!=='paused')return;
  state=state==='playing'?'paused':'playing';keys.clear();ui.overlay.hidden=state==='playing';
  ui.pause.textContent=state==='paused'?'▶':'Ⅱ';ui.pause.setAttribute('aria-label',state==='paused'?'Resume game':'Pause game');
  if(state==='paused'){ui['screen-title'].innerHTML='TAKE A<br><span>BREATHER</span>';ui['screen-title'].style.fontSize='';ui['screen-copy'].textContent='Your sidewalk will be right here.';ui.result.hidden=true;ui.start.innerHTML='RESUME <span>↗</span>';ui.start.focus();}
}
ui.start.addEventListener('click',()=>state==='paused'?togglePause():startGame());
ui.pause.addEventListener('click',togglePause);
ui.motion.addEventListener('click',()=>{reducedMotion=!reducedMotion;ui.motion.textContent=`Sway: ${reducedMotion?'OFF':'ON'}`;ui.motion.setAttribute('aria-pressed',String(reducedMotion));});
window.addEventListener('keydown',event=>{
  const key=event.key.toLowerCase();
  if(['arrowleft','arrowright','a','d'].includes(key)){if(state==='playing')event.preventDefault();keys.add(key);}
  if((key==='p'||key==='escape')&&!event.repeat)togglePause();
});
window.addEventListener('keyup',event=>keys.delete(event.key.toLowerCase()));
// Pause on tab changes so the player cannot lose lives while away.
window.addEventListener('blur',()=>{keys.clear();if(state==='playing')togglePause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')togglePause();});
for(const [id,key] of [['left','arrowleft'],['right','arrowright']]){
  const button=document.getElementById(id);
  button.addEventListener('pointerdown',event=>{event.preventDefault();button.setPointerCapture(event.pointerId);keys.add(key);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(key));
}
// One obstacle per row preserves escape routes. Separation gives time to steer.
function spawnObstacle(){
  const type=types[Math.floor(Math.random()*types.length)];const [w,h]=sizes[type];
  const lane=Math.floor(Math.random()*5);const x=324+lane*78;
  obstacles.push({type,x,y:-110,w,h,vx:type==='car'&&level>3?random(-12,12):0});
}
function overlaps(a,b){return Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.y-b.y)<(a.h+b.h)/2;}
function update(dt){
  elapsed+=dt;distance+=speed*dt/12;scroll+=speed*dt;
  const newLevel=1+Math.floor(distance/200);
  if(newLevel!==level){level=newLevel;toast(`LEVEL ${level} · ${level===3?'Your feet have entered freestyle mode.':'The sidewalk has other plans.'}`);}
  speed=Math.min(390,180+(level-1)*23);
  // Drift is a small extra velocity, at most 24px/sec versus 300px/sec steering.
  driftTimer-=dt;
  if(driftTimer<=0){driftForce=level>=3?random(-1,1)*Math.min(24,(level-2)*5):0;driftTimer=random(1.4,2.8);}
  const direction=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'));
  playerX=clamp(playerX+(direction*300+driftForce)*dt,ROAD_LEFT+18,ROAD_RIGHT-18);
  spawnTimer-=dt;if(spawnTimer<=0){spawnObstacle();spawnTimer=Math.max(.62,1.08-(level-1)*.045);}
  invincible=Math.max(0,invincible-dt);
  for(const obstacle of obstacles){
    obstacle.y+=speed*dt;obstacle.x=clamp(obstacle.x+obstacle.vx*dt,ROAD_LEFT+obstacle.w/2,ROAD_RIGHT-obstacle.w/2);
    // Smaller-than-art hitboxes make close calls feel fair.
    if(invincible===0&&overlaps({x:playerX,y:PLAYER_Y,w:22,h:29},{...obstacle,w:obstacle.w*.78,h:obstacle.h*.78})){
      lives--;invincible=1.6;toast(jokes[obstacle.type]);
      for(let i=0;i<12;i++)particles.push({x:playerX,y:PLAYER_Y,vx:random(-90,90),vy:random(-100,60),life:.6});
      if(lives===0){endGame(obstacle.type);break;}
    }
  }
  obstacles=obstacles.filter(o=>o.y<H+120);
  particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);
  toastTimer-=dt;if(toastTimer<=0)ui.toast.classList.remove('visible');updateHUD();
}
// Canvas drawing helpers. Original shapes keep the project fully self-contained.
function rect(x,y,w,h,color,r=0){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function oval(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function label(text,x,y,size,color){ctx.fillStyle=color;ctx.font=`bold ${size}px monospace`;ctx.textAlign='center';ctx.fillText(text,x,y);}
function person(x,y,color,walking=false){
  const step=walking?Math.sin(elapsed*13)*3:0;
  oval(x+4,y+17,17,8,'#10171b66');rect(x-10,y+7,8,17+step,'#252939',3);rect(x+3,y+7,8,17-step,'#252939',3);
  rect(x-13,y-9,26,28,color,7);rect(x-17,y-5,6,20,'#d8a17b',3);rect(x+11,y-5,6,20,'#d8a17b',3);
  oval(x,y-13,10,10,'#d9a17c');oval(x,y-17,11,7,'#3b2b2a');rect(x-7,y-6,14,15,'#ffffff15',3);
}
function scenery(){
  rect(-10,-10,W+20,H+20,'#26312f');
  // Building strips, brick joints, lit windows and fictional storefronts.
  for(let i=-1;i<4;i++){
    const y=i*230+(scroll*.7%230);
    for(const side of [0,1]){
      const x=side?747:15;
      rect(x+8,y+10,195,209,'#101b2088',5);rect(x,y,195,205,side?'#4a373a':'#593d40',4);rect(x,y,195,12,'#6a5050');
      for(let row=0;row<8;row++)for(let col=0;col<6;col++)rect(x+col*34+(row%2?15:0),y+25+row*22,27,1,'#77555255');
      for(let row=0;row<3;row++)for(let col=0;col<4;col++){
        rect(x+17+col*43,y+25+row*45,23,28,'#242b32',2);rect(x+20+col*43,y+28+row*45,17,21,(col+row+i+5)%3?'#b697635c':'#e8be75b0');
      }
      rect(x+10,y+161,175,30,'#18252a',3);label(side?'FOURTH & GOAL':'LAST SLICE PIZZA',x+97,y+180,12,side?'#d2b7a6':'#f08083');
    }
  }
  rect(222,0,63,H,'#787b7a');rect(675,0,63,H,'#787b7a');rect(277,0,8,H,'#b0b0a3');rect(675,0,8,H,'#b0b0a3');rect(285,0,390,H,'#343b43');
  for(let y=-120;y<H;y+=100){const sy=y+scroll%100;rect(478,sy,4,40,'#c6ba8144',2);rect(222,sy,55,1,'#4b5556');rect(683,sy,55,1,'#4b5556');}
  for(let i=-1;i<3;i++){
    const y=i*310+scroll%310;
    for(const x of [247,711]){
      oval(x,y+100,28,15,'#152321');oval(x,y+87,25,27,'#2b4540');oval(x-9,y+80,17,18,'#37564a');
      rect(x-3,y-57,6,57,'#1d272d',3);rect(x<400?x-3:x-15,y-61,30,6,'#1d272d',3);
      const lx=x+(x<400?23:-10);const glow=ctx.createRadialGradient(lx,y-53,0,lx,y-53,83);glow.addColorStop(0,'#ffcf722b');glow.addColorStop(1,'#ffcf7200');ctx.fillStyle=glow;ctx.fillRect(lx-83,y-136,166,166);oval(lx,y-56,8,5,'#ffe1a0');
    }
  }
  // Crosswalk repeats between blocks.
  const crossing=scroll%1200-90;for(let x=301;x<661;x+=48)rect(x,crossing,30,52,'#bac3bf38',2);
}
function drawObstacle(o){
  ctx.save();ctx.translate(o.x,o.y);oval(4,o.h/2, o.w*.6,8,'#10182077');
  switch(o.type){
    case 'cone':rect(-19,10,38,9,'#372f30',3);ctx.fillStyle='#ed8d4d';ctx.beginPath();ctx.moveTo(0,-21);ctx.lineTo(16,13);ctx.lineTo(-16,13);ctx.fill();rect(-7,-2,14,6,'#ffe2b0');break;
    case 'scooter':ctx.rotate(-.28);rect(-8,-22,5,51,'#243030',3);rect(-10,6,20,22,'#7cbd82',5);rect(-18,-25,35,6,'#a6cf91',3);oval(-6,-23,5,5,'#19272b');oval(-6,26,5,5,'#19272b');break;
    case 'pothole':oval(0,0,29,15,'#737474');oval(0,0,23,11,'#171f27');oval(-5,-3,12,4,'#0b151c');break;
    case 'trash':rect(-17,-19,34,42,'#417b70',5);rect(-21,-24,42,8,'#6a9b87',3);rect(-9,-12,3,28,'#275448');rect(7,-12,3,28,'#275448');break;
    case 'car':rect(-31,-38,6,18,'#111b22',3);rect(25,-38,6,18,'#111b22',3);rect(-29,-50,58,100,'#ae5c63',9);rect(-23,-26,46,31,'#23323f',5);rect(-22,13,44,20,'#2b3943',4);rect(-23,-46,11,6,'#ffe4ad',2);rect(12,-46,11,6,'#ffe4ad',2);rect(-22,41,11,5,'#ed7c78');rect(11,41,11,5,'#ed7c78');break;
    case 'students':person(-17,0,'#ad485c');person(17,5,'#969f9f');break;
    case 'sign':rect(-3,-10,6,40,'#9ea6a3');rect(-17,-25,34,29,'#b25561',5);label('NOPE',0,-6,10,'#fff0da');break;
    case 'puddle':oval(0,0,33,15,'#438093');oval(-7,-3,19,4,'#85aeb3');break;
    case 'barrier':rect(-28,2,6,25,'#a8a69c');rect(22,2,6,25,'#a8a69c');rect(-34,-15,68,25,'#e4b477',3);for(let i=0;i<4;i++)rect(-30+i*18,-15,8,25,'#c96849');break;
  }ctx.restore();
}
function render(){
  ctx.clearRect(0,0,W,H);ctx.save();
  if(!reducedMotion&&state==='playing'&&level>=3){ctx.translate(W/2,H/2);ctx.rotate(Math.sin(elapsed*.8)*.004);ctx.translate(-W/2,-H/2);}
  scenery();
  if(state==='ready'){[{type:'cone',x:365,y:130},{type:'scooter',x:590,y:235},{type:'car',x:330,y:540},{type:'puddle',x:585,y:540}].forEach(drawObstacle);}
  obstacles.forEach(drawObstacle);
  if(invincible===0||Math.floor(invincible*8)%2===0)person(playerX,PLAYER_Y,'#d84b64',state==='playing');
  particles.forEach(p=>rect(p.x,p.y,4,4,'#f7d7a2'));
  ctx.restore();
  const vignette=ctx.createRadialGradient(480,300,160,480,300,580);vignette.addColorStop(0,'#06101b00');vignette.addColorStop(1,'#06101b66');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
}
// Fixed coordinate space, elapsed-time movement, and a capped delta avoid jumps.
function frame(timestamp){const dt=Math.min((timestamp-lastTime)/1000,.04);lastTime=timestamp;if(state==='playing')update(dt);render();requestAnimationFrame(frame);}
updateHUD();requestAnimationFrame(frame);
