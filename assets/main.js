'use strict';
(() => {
  const config=window.DACITY_CONFIG||{};
  // Keep the homepage URL clean, including when opened from an older link.
  if (/^https?:$/.test(location.protocol) && /\/index\.html$/.test(location.pathname) && window.history?.replaceState) {
    window.history.replaceState(window.history.state, '', location.pathname.replace(/index\.html$/, '') + (location.search || '') + (location.hash || ''));
  }

  const toastEl=document.querySelector('.toast');let toastTimer;
  const notify=message=>{if(!toastEl)return;toastEl.textContent=message;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),3000);};
  function readStorage(key,fallback){try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v);}catch{return fallback;}}
  function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
  let saved=readStorage('dacity-saved-files',[]);if(!Array.isArray(saved))saved=[];saved=saved.filter(id=>typeof id==='string');
  function syncSaved(){document.querySelectorAll('[data-save]').forEach(button=>{const on=saved.includes(button.dataset.save);button.setAttribute('aria-pressed',String(on));if(button.classList.contains('save-button'))button.textContent=on?'♥':'♡';else button.textContent=on?'Saved file ♥':'Save file ♡';});const count=document.getElementById('saved-count');if(count)count.textContent=saved.length;}
  document.querySelectorAll('[data-save]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.save;const existed=saved.includes(id);saved=existed?saved.filter(x=>x!==id):[...saved,id];const stored=writeStorage('dacity-saved-files',saved);syncSaved();document.dispatchEvent(new CustomEvent('dacity:saved'));notify((existed?'File removed.':'File saved.')+(stored?'':' Available for this visit only.'));}));syncSaved();
  async function copy(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);}else{const field=document.createElement('textarea');field.value=text;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw new Error('Clipboard unavailable');}return true;}catch{notify('Copy unavailable in this browser. Select and copy the text manually.');return false;}}
  window.Dacity={notify,copy,readStorage,writeStorage,isSaved:id=>saved.includes(id)};
  const toggle=document.querySelector('.menu-toggle'),menu=document.getElementById('mobile-nav');
  const header=document.querySelector('.site-header');
  let menuScroll=0;
  const backgroundSections=[document.querySelector('main'),document.querySelector('.site-footer')].filter(Boolean);
  const headerSearch=document.querySelector('.search-icon');
  function closeMenu(returnFocus=false){
    if(!toggle||!menu||menu.hidden)return;
    toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');
    menu.hidden=true;header?.classList.remove('menu-open');document.body.classList.remove('menu-open');
    document.body.style.removeProperty('--menu-scroll-top');backgroundSections.forEach(el=>el.inert=false);
    if(headerSearch)headerSearch.inert=false;
    window.scrollTo({top:menuScroll,behavior:'instant'});
    if(returnFocus)toggle.focus({preventScroll:true});
  }
  function openMenu(){
    menuScroll=window.scrollY||0;
    document.body.style.setProperty('--menu-scroll-top',(-menuScroll)+'px');
    document.body.classList.add('menu-open');header?.classList.add('menu-open');
    toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close navigation');
    menu.hidden=false;backgroundSections.forEach(el=>el.inert=true);
    if(headerSearch)headerSearch.inert=true;
  }
  if(toggle&&menu){
    toggle.addEventListener('click',()=>menu.hidden?openMenu():closeMenu(true));
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
    document.addEventListener('keydown',e=>{
      if(menu.hidden)return;
      if(e.key==='Escape'){e.preventDefault();closeMenu(true);return;}
      if(e.key==='Tab'){
        const focusable=[document.querySelector('.nav-row .brand'),toggle,...menu.querySelectorAll('a')].filter(Boolean);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    window.addEventListener('resize',()=>{if(innerWidth>640)closeMenu();});
    window.addEventListener('pageshow',()=>closeMenu());
  }
  document.querySelectorAll('.year').forEach(el=>el.textContent=new Date().getFullYear());
  document.querySelectorAll('[data-copy-link]').forEach(button=>button.addEventListener('click',async()=>{let url=location.href;if(location.protocol==='file:'&&config.canonicalOrigin)url=config.canonicalOrigin.replace(/\/$/,'')+'/'+location.pathname.split('/').pop();if(await copy(url))notify('File link copied.');}));
  document.querySelectorAll('[data-config]').forEach(el=>{const value=config[el.dataset.config];if(typeof value==='string'&&value.trim())el.textContent=value;});
  const contract=config.contractAddress?.trim(),contractEl=document.getElementById('contract-value'),contractButton=document.getElementById('copy-contract');
  if(contract&&contractEl&&contractButton){contractEl.textContent=contract;contractButton.hidden=false;contractButton.addEventListener('click',async()=>{if(await copy(contract))notify('Contract address copied.');});}
  function safeUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null;}}
  const buy=document.getElementById('buy-token');if(buy&&safeUrl(config.buyUrl)){buy.href=safeUrl(config.buyUrl);buy.target='_blank';buy.rel='noopener noreferrer';buy.hidden=false;}
  const socials=document.getElementById('community-links');if(socials){for(const [key,label] of [['xUrl','X'],['telegramUrl','Telegram'],['githubUrl','GitHub']]){const url=safeUrl(config[key]);if(!url)continue;const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.className='button outline';link.textContent=label+' ↗';socials.append(link);}if(socials.childElementCount)document.getElementById('community-message').textContent='Project links configured by Dacity Labs:';}
  const projectFilters=document.querySelectorAll('[data-project-filter]');projectFilters.forEach(button=>button.addEventListener('click',()=>{const type=button.dataset.projectFilter;projectFilters.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-project-type]').forEach(card=>card.hidden=type!=='All'&&card.dataset.projectType!==type);}));
})();
