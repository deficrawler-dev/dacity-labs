'use strict';
(() => {
 const grid=document.getElementById('archive-grid');if(!grid)return;
 const cards=[...grid.querySelectorAll('.discovery-card')],input=document.getElementById('archive-search'),sort=document.getElementById('archive-sort'),savedButton=document.querySelector('.saved-filter');
 const categories=[...document.querySelectorAll('[data-category]')];let category='All',savedOnly=false;
 const lookup={ 'dacity-detail':'Brands','leonida':'Places','trailer-library':'Media','jason-lucia':'Culture','music':'Culture','archive-method':'Research'};
 function filter(){const q=input.value.toLowerCase().trim();let count=0;const ordered=[...cards];if(sort.value==='az')ordered.sort((a,b)=>a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));ordered.forEach(card=>{grid.append(card);const matches=(!q||card.textContent.toLowerCase().includes(q))&&(category==='All'||lookup[card.dataset.id]===category)&&(!savedOnly||window.Dacity.isSaved(card.dataset.id));card.hidden=!matches;if(matches)count++;});document.getElementById('results-count').textContent=count+' '+(count===1?'file':'files')+' in this view';document.getElementById('empty-state').hidden=count!==0;}
 input.addEventListener('input',filter);sort.addEventListener('change',filter);
 categories.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;categories.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});filter();}));
 savedButton.addEventListener('click',()=>{savedOnly=!savedOnly;savedButton.setAttribute('aria-pressed',String(savedOnly));filter();});document.addEventListener('dacity:saved',filter);
 document.getElementById('reset-filters').addEventListener('click',()=>{input.value='';sort.value='featured';savedOnly=false;savedButton.setAttribute('aria-pressed','false');categories[0].click();input.focus();});filter();
 // This data is embedded so the archive also works when opened directly from disk.
 const data=[
  {
    "id": "dacity-detail",
    "title": "The DacityCoin detail",
    "category": "Brands",
    "image": "plane.webp",
    "status": "Reported reference",
    "kicker": "BRANDS / AVIATION",
    "summary": "A name on a pink stunt plane sparked a bigger conversation. Separate the fictional reference from real-world tokens.",
    "body": [
      "Reporting describes DacityCoin branding on a stunt plane in the GTA VI launch trailer. The reference has attracted attention from independent crypto communities.",
      "A fictional brand appearing in game material does not establish a relationship between Rockstar Games and a separately issued token. Dacity Labs is also independent.",
      "This file tracks the reported reference. The artwork here was created for Dacity Labs; it is not a frame from the trailer. Watch the original material and read the reporting before drawing conclusions."
    ],
    "question": "How much of the fictional brand\u2019s story will players encounter? That remains an open question.",
    "sources": [
      {
        "label": "Rockstar Games \u2014 official media hub",
        "url": "https://www.rockstargames.com/VI/"
      },
      {
        "label": "Decrypt \u2014 reporting on the Dacity reference",
        "url": "https://decrypt.co/381511/gta-6-trailer-features-dacity-meme-coin-heres-what-traders-think-itll-do"
      }
    ]
  },
  {
    "id": "leonida",
    "title": "A world called Leonida",
    "category": "Places",
    "image": "coast.webp",
    "status": "Official source",
    "kicker": "PLACES / WORLD",
    "summary": "The official story stretches across Leonida. Start with the setting, then follow the details.",
    "body": [
      "Rockstar\u2019s official GTA VI website describes a criminal conspiracy stretching across the state of Leonida. Vice City is part of the story\u2019s setting.",
      "That description gives us a starting point for a source-led archive: distinguish named places in official material from guesses about the map.",
      "The coastline artwork shown here is original concept art. Its buildings, roads, and islands are illustrative and do not map confirmed game geography."
    ],
    "question": "Which locations connect the story? We will add individual place files when supporting sources are available.",
    "sources": [
      {
        "label": "Rockstar Games \u2014 GTA VI",
        "url": "https://www.rockstargames.com/VI/"
      }
    ]
  },
  {
    "id": "trailer-library",
    "title": "Start with the original footage",
    "category": "Media",
    "image": "hero-desktop.webp",
    "status": "Official source",
    "kicker": "MEDIA / WATCHLIST",
    "summary": "The best place to investigate a detail is the source. Keep the official trailer library within reach.",
    "body": [
      "The official GTA VI site provides a media collection including Trailer 1, Trailer 2, An Extended Look, and the Launch Trailer.",
      "Use the original footage when checking observations. A screenshot needs context: a visible detail may tell us less than a community theory suggests.",
      "Our archive links out to sources rather than presenting generated artwork as evidence. Direct timestamps and supporting frames can be added as files are researched."
    ],
    "question": "What can you identify in the source itself, and what requires an assumption?",
    "sources": [
      {
        "label": "Rockstar Games \u2014 official videos and media",
        "url": "https://www.rockstargames.com/VI/"
      }
    ]
  },
  {
    "id": "jason-lucia",
    "title": "Two people. One complicated story.",
    "category": "Culture",
    "image": "workbench.webp",
    "status": "Official source",
    "kicker": "CULTURE / STORY",
    "summary": "Jason and Lucia sit at the center of Rockstar\u2019s official premise. Keep the story grounded in what is published.",
    "body": [
      "The official premise follows Jason and Lucia after an apparently easy score goes wrong. Rockstar describes the pair relying on each other amid a conspiracy across Leonida.",
      "This is a short source note, not a mission guide or a claim about unannounced mechanics. Future story observations should link back to the material they come from.",
      "The research-room artwork is an illustration for this archive and does not depict a location from the game."
    ],
    "question": "How will their perspectives shape the world we see? That is a topic for discussion, not a confirmed gameplay claim.",
    "sources": [
      {
        "label": "Rockstar Games \u2014 official story premise",
        "url": "https://www.rockstargames.com/VI/"
      }
    ]
  },
  {
    "id": "music",
    "title": "Listen to the world",
    "category": "Culture",
    "image": "coast.webp",
    "status": "Official source",
    "kicker": "CULTURE / SOUND",
    "summary": "Music is another way into the setting. Follow the official music collection and keep speculation separate.",
    "body": [
      "Rockstar\u2019s official GTA VI website includes a section for in-game radio and music. It links to music material from the publisher.",
      "This archive entry is a doorway to that source, not an independently verified track list. No unannounced artists or tracks are asserted here.",
      "The image is original coastal concept art, used to set the mood rather than document a particular game location."
    ],
    "question": "What can sound tell us about a place before we explore it?",
    "sources": [
      {
        "label": "Rockstar Games \u2014 music and media links",
        "url": "https://www.rockstargames.com/VI/"
      }
    ]
  },
  {
    "id": "archive-method",
    "title": "An observation is not an answer",
    "category": "Research",
    "image": "map.svg",
    "status": "Lab note",
    "kicker": "RESEARCH / METHOD",
    "summary": "Every file should make its evidence, interpretation, and unanswered questions easy to distinguish.",
    "body": [
      "Our archive uses three simple layers: the source, what it directly supports, and the questions that remain. This is the method we want every future file to follow.",
      "Official source means the linked publisher material supports the short factual note. Reported reference means we are relying on an attributed report. Lab note means a Dacity Labs editorial or product note.",
      "Artwork is labeled separately from evidence. The concept map here is a navigation illustration, not a leaked or reconstructed game map."
    ],
    "question": "Have a stronger source for a file? Keep its exact URL and timestamp so it can be reviewed.",
    "sources": [
      {
        "label": "Explore the official source material",
        "url": "https://www.rockstargames.com/VI/"
      }
    ]
  }
];
 const panel=document.getElementById('comparison');
 function addText(parent,tag,text){const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;}
 document.getElementById('compare-open').addEventListener('click',()=>{const a=document.getElementById('compare-a').value,b=document.getElementById('compare-b').value;if(a===b){window.Dacity.notify('Choose two different files to compare.');return;}panel.replaceChildren();for(const id of [a,b]){const r=data.find(item=>item.id===id);if(!r)continue;const article=document.createElement('article');addText(article,'p',r.kicker).className='eyebrow';addText(article,'h3',r.title);addText(article,'p',r.summary);addText(article,'h4','Open question');addText(article,'p',r.question);addText(article,'h4','Sources');const list=document.createElement('ul');r.sources.forEach(s=>{const li=document.createElement('li'),link=document.createElement('a');link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=s.label+' ↗';li.append(link);list.append(li);});article.append(list);const link=document.createElement('a');link.href='file-'+r.id+'.html';link.textContent='Open the full file →';article.append(link);panel.append(article);}panel.hidden=false;panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
})();
