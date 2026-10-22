'use strict';
(() => {
 const canvas=document.getElementById('flight-canvas');if(!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const stage=document.querySelector('.game-stage'),overlay=document.getElementById('flight-overlay'),title=document.getElementById('flight-title'),description=document.getElementById('flight-description'),startButton=document.getElementById('start-flight'),pauseButton=document.getElementById('pause-flight'),status=document.getElementById('flight-status');
 const scoreLabel=document.getElementById('flight-score'),bestLabel=document.getElementById('flight-best');
 let W=1000,H=560,state='idle',y=H/2,score=0,gates=[],elapsed=0,spawnIn=1,last=0,frame=0,target=null,holding=false;
 let best=window.Dacity.readStorage('dacity-flight-best',0);if(!Number.isSafeInteger(best)||best<0)best=0;bestLabel.textContent=best;
 const keys=new Set();const background=new Image();background.src='/assets/hero-desktop.webp';background.onload=()=>{if(state!=='running')draw();};
 function fit(){const rect=canvas.getBoundingClientRect();const oldH=H;H=Math.max(450,Math.round(W*rect.height/Math.max(rect.width,1)));canvas.width=W;canvas.height=H;y=y/oldH*H;gates.forEach(g=>{g.center=g.center/oldH*H;g.gap=g.gap/oldH*H;});if(state==='running')pause();draw();}
 const resize=new ResizeObserver(fit);resize.observe(canvas);
 function draw(){
  ctx.clearRect(0,0,W,H);const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#161e30');sky.addColorStop(.65,'#5c3c59');sky.addColorStop(1,'#1a242d');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  if(background.complete&&background.naturalWidth){const ratio=Math.max(W/background.naturalWidth,H/background.naturalHeight),iw=background.naturalWidth*ratio,ih=background.naturalHeight*ratio;ctx.globalAlpha=.45;ctx.drawImage(background,(W-iw)/2,(H-ih)/2,iw,ih);ctx.globalAlpha=1;ctx.fillStyle='#10152033';ctx.fillRect(0,0,W,H);}
  ctx.strokeStyle='#eee6dc0a';ctx.lineWidth=1;for(let x=0;x<W;x+=65){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(const gate of gates){const top=gate.center-gate.gap/2,bottom=gate.center+gate.gap/2;ctx.fillStyle='#17252ae6';ctx.fillRect(gate.x,0,55,top);ctx.fillRect(gate.x,bottom,55,H-bottom);ctx.fillStyle='#e593b7';ctx.fillRect(gate.x,top-6,55,6);ctx.fillRect(gate.x,bottom,55,6);ctx.strokeStyle='#9ca4ad55';ctx.strokeRect(gate.x,0,55,top);ctx.strokeRect(gate.x,bottom,55,H-bottom);}
  const px=210;ctx.save();ctx.translate(px,y);const tilt=keys.has('ArrowUp')||keys.has('w')?-.12:keys.has('ArrowDown')||keys.has('s')?.12:0;ctx.rotate(tilt);ctx.fillStyle='#ef8fb8';ctx.beginPath();ctx.moveTo(36,0);ctx.lineTo(-23,-11);ctx.lineTo(-29,-3);ctx.lineTo(-34,-19);ctx.lineTo(-42,-19);ctx.lineTo(-36,7);ctx.lineTo(27,10);ctx.closePath();ctx.fill();ctx.fillStyle='#f9c0d8';ctx.fillRect(-17,-20,34,5);ctx.fillRect(-13,10,28,5);ctx.strokeStyle='#f3e9de';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-9,-15);ctx.lineTo(-6,10);ctx.moveTo(9,-15);ctx.lineTo(10,10);ctx.moveTo(38,-14);ctx.lineTo(38,18);ctx.stroke();ctx.restore();
  ctx.fillStyle='#f3e9de66';ctx.font='12px monospace';ctx.fillText('FLIGHT MODE / ORIGINAL PROTOTYPE',22,H-20);
 }
 function setOverlay(heading,copy,button){title.textContent=heading;description.textContent=copy;startButton.textContent=button;overlay.hidden=false;}
 function updateBest(){if(score>best){best=score;window.Dacity.writeStorage('dacity-flight-best',best);bestLabel.textContent=best;}}
 function crash(){state='over';cancelAnimationFrame(frame);keys.clear();holding=false;target=null;stage.classList.remove('running');pauseButton.disabled=true;updateBest();setOverlay('Flight complete.','You cleared '+score+' '+(score===1?'gate':'gates')+'. Personal best: '+best+'.','Fly again →');status.textContent='Flight complete. Score '+score+'. Personal best '+best+'.';startButton.focus({preventScroll:true});}
 function tick(now){if(state!=='running')return;const dt=Math.min((now-last)/1000,.033);last=now;elapsed+=dt;const up=keys.has('ArrowUp')||keys.has('w'),down=keys.has('ArrowDown')||keys.has('s');if(up)y-=H*.64*dt;if(down)y+=H*.64*dt;if(holding&&target!==null)y+=(target-y)*Math.min(1,dt*13);
  spawnIn-=dt;if(spawnIn<=0){const gap=H*Math.max(.29,.39-score*.002);const margin=gap/2+H*.1;const center=score===0&&gates.length===0?H/2:margin+Math.random()*(H-2*margin);gates.push({x:W+20,center,gap,scored:false});spawnIn=1.55;}
  const speed=245+Math.min(score*3,95);for(const gate of gates){gate.x-=speed*dt;const hitX=gate.x<250&&gate.x+55>170;if(hitX&&(y-20<gate.center-gate.gap/2||y+20>gate.center+gate.gap/2)){draw();crash();return;}if(!gate.scored&&gate.x+55<170){gate.scored=true;score++;scoreLabel.textContent=score;}}
  gates=gates.filter(g=>g.x>-65);if(y<25||y>H-25){draw();crash();return;}draw();frame=requestAnimationFrame(tick);
 }
 function begin(){if(state==='paused'){state='running';}else{score=0;elapsed=0;gates=[];spawnIn=.75;y=H/2;scoreLabel.textContent=0;state='running';}keys.clear();holding=false;target=null;overlay.hidden=true;stage.classList.add('running');pauseButton.disabled=false;pauseButton.textContent='Pause';status.textContent='Flying. Steer through the gates.';canvas.focus({preventScroll:true});last=performance.now();cancelAnimationFrame(frame);frame=requestAnimationFrame(tick);}
 function pause(){if(state!=='running')return;state='paused';cancelAnimationFrame(frame);keys.clear();holding=false;target=null;stage.classList.remove('running');pauseButton.textContent='Resume';setOverlay('Take a breath.','Your flight is paused. Resume whenever you’re ready.','Resume flight →');status.textContent='Flight paused.';}
 startButton.addEventListener('click',begin);pauseButton.addEventListener('click',()=>{if(state==='running')pause();else if(state==='paused')begin();});
 document.addEventListener('keydown',event=>{if(state!=='running')return;const key=event.key.length===1?event.key.toLowerCase():event.key;if(['ArrowUp','ArrowDown','w','s'].includes(key)){event.preventDefault();keys.add(key);}if(event.key==='Escape'||event.key.toLowerCase()==='p'){event.preventDefault();pause();}});
 document.addEventListener('keyup',event=>keys.delete(event.key.length===1?event.key.toLowerCase():event.key));
 function targetFrom(event){const rect=canvas.getBoundingClientRect();target=Math.max(25,Math.min(H-25,(event.clientY-rect.top)/rect.height*H));}
 canvas.addEventListener('pointerdown',event=>{if(state!=='running'||!event.isPrimary)return;event.preventDefault();holding=true;targetFrom(event);canvas.setPointerCapture(event.pointerId);});canvas.addEventListener('pointermove',event=>{if(holding&&state==='running')targetFrom(event);});
 function release(){holding=false;target=null;}canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('blur',()=>{keys.clear();pause();});
 document.getElementById('share-flight').addEventListener('click',async()=>{const origin=window.DACITY_CONFIG?.canonicalOrigin||location.origin;const text='My Flight Mode personal best: '+best+' gates. Try the Dacity Labs browser prototype: '+origin.replace(/\/$/,'')+'/flight-mode/';if(await window.Dacity.copy(text))window.Dacity.notify('Score copied.');});fit();
})();
