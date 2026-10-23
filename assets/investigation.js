'use strict';
(() => {
  const KEY='dacity-investigations-v1', $=id=>document.getElementById(id);
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL=value=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}};
  const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  let files=[],cases=[],active=null,timer,blocked=false;
  const tell=message=>{ $('save-state').textContent=message; window.Dacity?.notify(message); };
  function validate(data){
    if(data?.format!=='dacity-investigations'||data.version!==1||!Array.isArray(data.cases)||data.cases.length>100)throw Error('Choose a Dacity Labs investigation backup (version 1, up to 100 investigations).');
    const seen=new Set();
    return data.cases.map(c=>{
      if(!c||typeof c.id!=='string'||!c.id||c.id.length>100||seen.has(c.id)||typeof c.title!=='string'||c.title.length>120||typeof c.notes!=='string'||c.notes.length>20000||!['open','researching','reviewed'].includes(c.status)||!Array.isArray(c.files)||c.files.length>100||c.files.some(id=>typeof id!=='string'||id.length>100)||!Array.isArray(c.evidence)||c.evidence.length>30)throw Error('The backup contains invalid investigation data. Nothing was imported.');
      seen.add(c.id);
      const evidence=c.evidence.map(e=>{if(!e||typeof e.label!=='string'||e.label.length>150||typeof e.url!=='string'||e.url.length>2000||typeof e.timestamp!=='string'||e.timestamp.length>100)throw Error('A source in this backup has an invalid link or field. Nothing was imported.');return {label:e.label,url:e.url,timestamp:e.timestamp};});
      return {id:c.id,title:c.title,notes:c.notes,status:c.status,files:[...new Set(c.files)],evidence,updated:typeof c.updated==='string'&&!isNaN(Date.parse(c.updated))?c.updated:new Date().toISOString()};
    });
  }
  function payload(){return {format:'dacity-investigations',version:1,cases};}
  function persist(){
    if(blocked){tell('Storage has changed or is unreadable. Export a backup before refreshing.');return false;}
    try{localStorage.setItem(KEY,JSON.stringify(payload()));$('save-state').textContent='Saved on this device';return true;}
    catch{tell('Not saved to this device. Export a backup before leaving.');return false;}
  }
  function current(){return cases.find(c=>c.id===active);}
  function sync(){
    const c=current();if(!c)return;
    c.title=$('case-title').value;c.notes=$('case-notes').value;c.status=$('case-status').value;
    c.files=[...$('file-options').querySelectorAll('input:checked')].map(el=>el.value);
    c.evidence=[...$('evidence-list').querySelectorAll('.evidence-row')].map(row=>({label:row.querySelector('[data-field="label"]').value,url:row.querySelector('[data-field="url"]').value,timestamp:row.querySelector('[data-field="timestamp"]').value}));
    const snapshot=JSON.stringify({title:c.title,notes:c.notes,status:c.status,files:c.files,evidence:c.evidence});
    if(c._snapshot!==snapshot){c.updated=new Date().toISOString();Object.defineProperty(c,'_snapshot',{value:snapshot,writable:true,configurable:true,enumerable:false});}
  }
  function save(){clearTimeout(timer);sync();persist();renderList();}
  function renderList(){
    const q=$('case-search').value.toLowerCase().trim();
    const visible=cases.filter(c=>(c.title+' '+c.notes).toLowerCase().includes(q)).sort((a,b)=>b.updated.localeCompare(a.updated));
    $('case-list').innerHTML=visible.map(c=>`<button type="button" class="case-item ${c.id===active?'selected':''}" data-case="${escape(c.id)}" aria-pressed="${c.id===active}"><span class="case-status-dot ${escape(c.status)}"></span><span><strong>${escape(c.title||'Untitled investigation')}</strong><small>${escape(({open:'Open question',researching:'Researching',reviewed:'Reviewed'})[c.status])} · ${c.files.length} connected files</small></span><span aria-hidden="true">↗</span></button>`).join('')||'<p class="list-empty">'+(cases.length?'No investigations match your search.':'Your investigations will appear here.')+'</p>';
    $('board-total').textContent=cases.length;$('board-open').textContent=cases.filter(c=>c.status==='open').length;
  }
  function evidenceRow(e={label:'',url:'',timestamp:''}){
    const row=document.createElement('div');row.className='evidence-row';
    row.innerHTML=`<label>Source name<input data-field="label" maxlength="150" value="${escape(e.label)}" placeholder="e.g. Official trailer"></label><label>Original URL<input type="url" data-field="url" maxlength="2000" value="${escape(e.url)}" placeholder="https://…"></label><label>Timestamp / reference<input data-field="timestamp" maxlength="100" value="${escape(e.timestamp)}" placeholder="e.g. 01:24"></label><button type="button" class="remove-source" aria-label="Remove this source">Remove</button>`;
    row.querySelector('button').addEventListener('click',()=>{row.remove();save();$('add-source').focus();});return row;
  }
  function openCase(id){
    clearTimeout(timer);active=id;const c=current();$('case-editor').hidden=!c;$('board-empty').hidden=!!c;
    if(c){
      Object.defineProperty(c,'_snapshot',{value:JSON.stringify({title:c.title,notes:c.notes,status:c.status,files:c.files,evidence:c.evidence}),writable:true,configurable:true,enumerable:false});
      $('case-title').value=c.title;$('case-notes').value=c.notes;$('case-status').value=c.status;
      $('file-options').innerHTML=files.map(f=>`<div class="connected-file"><label><input type="checkbox" value="${escape(f.id)}" ${c.files.includes(f.id)?'checked':''}><span><strong>${escape(f.title)}</strong><small>${escape(f.category)} · ${escape(f.status)}</small></span></label><a href="/discoveries/${encodeURIComponent(f.id)}/" target="_blank" rel="noopener" aria-label="Open ${escape(f.title)} in a new tab">Read file ↗</a></div>`).join('');
      $('evidence-list').replaceChildren(...c.evidence.map(evidenceRow));$('save-state').textContent=blocked?'Export before refreshing':'Notes save automatically';
    }
    renderList();
  }
  function newCase(){if(cases.length>=100){tell('Your board holds up to 100 investigations. Export a backup before removing older work.');return;}if(current())save();const c={id:uid(),title:'',notes:'',status:'open',files:[],evidence:[],updated:new Date().toISOString()};cases.unshift(c);persist();openCase(c.id);$('case-title').focus();}
  function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function init(){
    try{const r=await fetch('/assets/discoveries.json');if(!r.ok)throw Error();files=await r.json();if(!Array.isArray(files))throw Error();}
    catch{$('board-loading').textContent='Discovery files could not load. Reload this page to try again.';return;}
    try{const raw=localStorage.getItem(KEY);if(raw)cases=validate(JSON.parse(raw));}catch{blocked=true;}
    $('board-loading').hidden=true;openCase(cases[0]?.id||null);
    if(blocked)tell('Saved research could not be read. Existing storage will not be overwritten. Export new work before leaving.');
    $('new-case').addEventListener('click',newCase);$('start-case').addEventListener('click',newCase);
    $('case-search').addEventListener('input',renderList);
    $('case-list').addEventListener('click',event=>{const button=event.target.closest('[data-case]');if(button){save();openCase(button.dataset.case);}});
    $('case-editor').addEventListener('input',()=>{sync();$('save-state').textContent='Unsaved changes…';clearTimeout(timer);timer=setTimeout(save,500);});
    $('case-editor').addEventListener('change',save);
    $('case-editor').addEventListener('submit',event=>{event.preventDefault();save();});
    $('add-source').addEventListener('click',()=>{if($('evidence-list').children.length>=30){tell('Use up to 30 sources per investigation.');return;}$('evidence-list').append(evidenceRow());save();$('evidence-list').lastElementChild.querySelector('input').focus();});
    $('connect-saved').addEventListener('click',()=>{let ids;try{ids=JSON.parse(localStorage.getItem('dacity-saved-files')||'[]');}catch{ids=[];}if(!Array.isArray(ids))ids=[];if(!ids.length){tell('Save a file in Discoveries first, then connect it here.');return;}$('file-options').querySelectorAll('input').forEach(el=>{if(ids.includes(el.value))el.checked=true;});save();});
    $('delete-case').addEventListener('click',()=>{if(!confirm('Delete this investigation and its notes? Export a backup first if you want to keep it.'))return;clearTimeout(timer);cases=cases.filter(c=>c.id!==active);persist();openCase(cases[0]?.id||null);$('new-case').focus();});
    $('export-board').addEventListener('click',()=>{if(current())save();download('dacity-investigations-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(payload(),null,2),'application/json');});
    $('export-note').addEventListener('click',()=>{save();const c=current();const related=files.filter(f=>c.files.includes(f.id));const text=[c.title||'Untitled investigation','Dacity Labs · Personal research',`Status: ${c.status}`,`Updated: ${c.updated}`,'',c.notes,'','CONNECTED FILES',...related.flatMap(f=>[f.title,'https://dacitylabs.fun/discoveries/'+f.id+'/',...f.sources.map(s=>s.label+': '+s.url),'']),'YOUR SOURCES',...c.evidence.map(e=>[e.label,e.url,e.timestamp].filter(Boolean).join(' — '))].join('\n');download('dacity-research-notes.txt',text,'text/plain;charset=utf-8');});
    $('import-board').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>5000000)throw Error('This backup is too large. Choose a file under 5 MB.');const imported=validate(JSON.parse(await file.text()));sync();const byId=new Map(cases.map(c=>[c.id,c]));let added=0,updated=0;for(const c of imported){const old=byId.get(c.id);if(!old){byId.set(c.id,c);added++;}else if(Date.parse(c.updated)>Date.parse(old.updated)){byId.set(c.id,c);updated++;}}if(byId.size>100)throw Error('Merging this backup would exceed 100 investigations. Nothing was imported.');cases=[...byId.values()];persist();openCase(active||cases[0]?.id||null);tell(`Restored ${added} new investigations; updated ${updated}.`);}catch(error){tell(error instanceof SyntaxError?'This file is not valid JSON. Nothing was imported.':error.message);}finally{event.target.value='';}});
    window.addEventListener('pagehide',()=>{if(current())save();});
    window.addEventListener('storage',event=>{if(event.key===KEY){blocked=true;tell('Your board changed in another tab. Export unsaved work, then refresh to load those changes.');}});
  }
  init();
})();
