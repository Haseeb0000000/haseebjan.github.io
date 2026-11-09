
function enhanceSelects(form){
 const controls=[];
 for(const select of form.querySelectorAll('select:not([data-custom-select])')){
  select.dataset.customSelect='true';
  const label=form.querySelector('label[for="'+select.id+'"]');
  const root=document.createElement('div');root.className='catalogue-select';
  const trigger=document.createElement('button');trigger.type='button';trigger.disabled=select.disabled;trigger.className='catalogue-select-trigger';
  trigger.id=select.id+'-control';trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',select.id+'-options');
  const value=document.createElement('span');value.id=select.id+'-value';
  const arrow=document.createElement('span');arrow.className='catalogue-select-arrow';arrow.setAttribute('aria-hidden','true');trigger.append(value,arrow);
  if(label){label.id=select.id+'-label';label.htmlFor=trigger.id;select.setAttribute('aria-labelledby',label.id);trigger.setAttribute('aria-labelledby',label.id+' '+value.id);}
  const list=document.createElement('div');list.id=select.id+'-options';list.className='catalogue-select-options';list.setAttribute('role','listbox');list.setAttribute('aria-labelledby',label?.id||value.id);list.hidden=true;
  const options=[...select.options].map((option,index)=>{const item=document.createElement('div');item.id=select.id+'-option-'+index;item.className='catalogue-select-option';item.setAttribute('role','option');item.setAttribute('aria-selected','false');item.textContent=option.textContent;item.dataset.index=index;list.append(item);return item;});
  select.before(root);root.append(trigger,list,select);select.hidden=true;select.tabIndex=-1;
  let active=select.selectedIndex,typed='',typedAt=0;
  const paint=()=>{value.textContent=select.selectedOptions[0]?.textContent||'';options.forEach((option,index)=>{option.setAttribute('aria-selected',String(index===select.selectedIndex));option.classList.toggle('is-active',index===active);});};
  const mark=index=>{active=Math.max(0,Math.min(options.length-1,index));paint();trigger.setAttribute('aria-activedescendant',options[active].id);options[active].scrollIntoView({block:'nearest'});};
  const close=()=>{list.hidden=true;root.classList.remove('is-open');trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-activedescendant');};
  const open=()=>{controls.forEach(c=>c.close());const rect=trigger.getBoundingClientRect();const below=innerHeight-rect.bottom,above=rect.top;const upward=below<230&&above>below;root.classList.toggle('opens-up',upward);list.style.maxHeight=Math.max(120,Math.min(300,(upward?above:below)-18))+'px';list.hidden=false;root.classList.add('is-open');trigger.setAttribute('aria-expanded','true');mark(select.selectedIndex);};
  const choose=index=>{select.selectedIndex=index;active=index;paint();close();trigger.focus();select.dispatchEvent(new Event('change',{bubbles:true}));};
  trigger.addEventListener('click',()=>list.hidden?open():close());
  list.addEventListener('mousedown',event=>event.preventDefault());
  list.addEventListener('click',event=>{const option=event.target.closest('[role="option"]');if(option)choose(Number(option.dataset.index));});
  trigger.addEventListener('keydown',event=>{
   if(event.key==='Escape'){if(!list.hidden){event.preventDefault();event.stopPropagation();close();}return;}
   if(event.key==='Tab'){close();return;}
   if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const wasClosed=list.hidden;if(wasClosed)open();if(event.key==='Home')mark(0);else if(event.key==='End')mark(options.length-1);else if(!wasClosed)mark(active+(event.key==='ArrowDown'?1:-1));return;}
   if(event.key==='Enter'||event.key===' '){event.preventDefault();if(list.hidden)open();else choose(active);return;}
   if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){event.preventDefault();const now=Date.now();typed=now-typedAt>700?event.key:typed+event.key;typedAt=now;if(list.hidden)open();const match=options.findIndex(o=>o.textContent.toLowerCase().startsWith(typed.toLowerCase()));if(match>=0)mark(match);}
  });
  root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget))close();});
  select.addEventListener('change',()=>{active=select.selectedIndex;paint();});
  select.form?.addEventListener('reset',()=>setTimeout(()=>{active=select.selectedIndex;paint();close();},0));
  controls.push({root,close,refresh:()=>{active=select.selectedIndex;paint();}});paint();
 }
 document.addEventListener('click',event=>controls.forEach(c=>{if(!c.root.contains(event.target))c.close();}));
 return ()=>controls.forEach(c=>c.refresh());
}

const menu=document.querySelector('.menu');
const navigation=document.querySelector('#navigation');
const mobile=matchMedia('(max-width: 960px)');
function setMenu(open){navigation.hidden=!open;menu.setAttribute('aria-expanded',String(open));}
setMenu(!mobile.matches);
menu.addEventListener('click',()=>setMenu(navigation.hidden));
mobile.addEventListener('change',()=>setMenu(!mobile.matches));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelectorAll('.nav-drop[open]').forEach(e=>e.open=false);if(mobile.matches&&!navigation.hidden){setMenu(false);menu.focus();}}});
navigation.addEventListener('click',event=>{if(event.target.closest('a')&&mobile.matches)setMenu(false);});
document.addEventListener('click',event=>{document.querySelectorAll('.nav-drop[open]').forEach(e=>{if(!e.contains(event.target))e.open=false;});});
const syncHeader=()=>document.querySelector('.header').classList.toggle('is-scrolled',scrollY>40);
addEventListener('scroll',syncHeader,{passive:true});syncHeader();
const parameters=new URLSearchParams(location.search);
const today=new Date();
const minDate=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.querySelectorAll('input[type="date"]').forEach(input=>input.min=minDate);
const filterForm=document.querySelector('#trip-filters');
if(filterForm){
  const cards=[...filterForm.querySelectorAll('[data-trip-card]')];
  const grid=filterForm.querySelector('.trip-grid');
  const chips=filterForm.querySelector('.catalogue-active-filters');
  const filterPanel=filterForm.querySelector('.catalogue-filter-panel');
  const panelCount=filterForm.querySelector('[data-filter-count]');
  const narrowCatalogue=matchMedia('(max-width: 800px)');
  const field=name=>filterForm.elements.namedItem(name);
  const names=['q','region','type','duration','sort'];
  for(const name of names){const input=field(name),value=parameters.get(name);if(value&&(input.tagName!=='SELECT'||[...input.options].some(o=>o.value===value)))input.value=value;}
  const syncSelects=enhanceSelects(filterForm);
  const syncFilterPanel=()=>{if(filterPanel)filterPanel.open=!narrowCatalogue.matches;};
  syncFilterPanel();narrowCatalogue.addEventListener('change',syncFilterPanel);
  function filterTrips(syncUrl=true){
    const data=new FormData(filterForm);
    const aliases={trekking:'trek',biking:'motorcycle',honeymoon:'couples'};
    const search=String(data.get('q')||'').trim().toLocaleLowerCase().split(/\s+/).map(term=>aliases[term]||term).join(' ');
    const region=data.get('region'),type=data.get('type'),duration=data.get('duration'),sort=data.get('sort');
    const ordered=[...cards].sort((a,b)=>{if(sort==='price-low'||sort==='price-high'){if(a.dataset.price==='999999')return b.dataset.price==='999999'?0:1;if(b.dataset.price==='999999')return -1;return (Number(a.dataset.price)-Number(b.dataset.price))*(sort==='price-high'?-1:1);}if(sort==='duration')return Number(a.dataset.days)-Number(b.dataset.days);return cards.indexOf(a)-cards.indexOf(b);});
    let count=0;
    for(const card of ordered){
      const days=Number(card.dataset.days);
      const typeMatches=!type||(['Winter','Honeymoon'].includes(type)?(card.dataset.collections||'').split(' ').includes(type.toLowerCase()):type==='Heritage & faith'?card.dataset.collection==='heritage-faith':type==='Treks & walks'?['Trek','Day trip'].includes(card.dataset.type):type===card.dataset.type);
      const matches=(!search||search.split(/\s+/).every(term=>card.dataset.search.includes(term)))&&(!region||card.dataset.region.includes(region))&&typeMatches&&(!duration||(duration==='short'&&days<=4)||(duration==='week'&&days>=5&&days<=7)||(duration==='long'&&days>=8));
      card.hidden=!matches;if(matches)count++;grid.append(card);
    }
    filterForm.querySelector('#results-count').textContent='Showing '+count+' of '+cards.length+' itineraries';
    filterForm.querySelector('#no-results').hidden=count!==0;
    const active=names.filter(name=>name!=='sort'&&String(data.get(name)||'').trim());
    if(panelCount)panelCount.textContent=active.filter(name=>name!=='q').length||'';
    if(chips){
      chips.replaceChildren();chips.hidden=active.length===0;
      for(const name of active){
        const input=field(name);
        const value=name==='q'?'Search: '+input.value.trim():input.selectedOptions[0].textContent;
        const button=document.createElement('button');button.type='button';button.className='catalogue-filter-chip';button.dataset.clearFilter=name;button.setAttribute('aria-label','Remove '+value+' filter');
        const label=document.createElement('span');label.textContent=value;
        const close=document.createElement('span');close.textContent='×';close.setAttribute('aria-hidden','true');button.append(label,close);chips.append(button);
      }
    }
    syncSelects();document.dispatchEvent(new Event('holiday:controls-updated'));
    if(syncUrl){const query=new URLSearchParams();for(const name of names){const value=String(data.get(name)||'').trim();if(value&&!(name==='sort'&&value==='recommended'))query.set(name,value);}history.replaceState(null,'',location.pathname+(query.size?'?'+query.toString():''));}
  }
  chips?.addEventListener('click',event=>{const button=event.target.closest('[data-clear-filter]');if(!button)return;const input=field(button.dataset.clearFilter);input.value='';filterTrips();field('q').focus();});
  filterForm.addEventListener('input',()=>filterTrips());
  filterForm.addEventListener('change',()=>filterTrips());
  filterForm.addEventListener('submit',event=>{event.preventDefault();filterTrips();});
  // Reset defaults are applied after the reset event; refresh in the next task.
  filterForm.addEventListener('reset',()=>setTimeout(()=>filterTrips(),0));
  filterForm.querySelector('#clear-search').addEventListener('click',()=>{filterForm.reset();field('q').focus();});
  filterTrips(false);
}
const datePlanner=document.querySelector('#date-planner');
if(datePlanner&&['Kashmir','Ladakh','Jammu'].includes(parameters.get('region')))datePlanner.elements.region.value=parameters.get('region');
const config=window.HOLIDAY_HOST_CONTACT;
let cataloguePromise;
function catalogue(){return cataloguePromise??=fetch('assets/catalogue.7f4cd6069b5f.json').then(response=>{if(!response.ok)throw Error('Catalogue unavailable');return response.json();});}
document.querySelectorAll('[data-enquiry]').forEach(form=>{
  if(!config?.whatsapp||!config?.email)return;
  form.querySelector('[data-enquiry-fields]').disabled=false;
  const result=form.querySelector('.enquiry-result');let summary='';
  const field=name=>form.elements.namedItem(name);
  if(form.id==='enquiry'){
    const interest=parameters.get('interest');if(interest)field('notes').value='I would like to discuss: '+interest.slice(0,200);
    const region=parameters.get('region');if(['Kashmir','Ladakh','Jammu','Combined journey'].includes(region))field('destination').value=region;
    const date=parameters.get('date');if(/^\d{4}-\d{2}-\d{2}$/.test(date||'')&&date>=minDate)field('date').value=date;
    const trip=parameters.get('trip');if([...field('trip').options].some(o=>o.value===trip)){field('trip').value=trip;catalogue().then(items=>{const selected=items.find(t=>t.slug===trip);if(selected)field('destination').value=selected.region.includes('&')?'Combined journey':selected.region;document.dispatchEvent(new Event('holiday:controls-updated'));}).catch(()=>{});}
  }
  field('trip').addEventListener('change',async()=>{try{const selected=(await catalogue()).find(t=>t.slug===field('trip').value);if(selected)field('destination').value=selected.region.includes('&')?'Combined journey':selected.region;document.dispatchEvent(new Event('holiday:controls-updated'));}catch{ /* Keep manual destination selection usable if catalogue cannot load. */ }});
  const hideResult=()=>result.hidden=true;
  form.addEventListener('input',hideResult);form.addEventListener('change',hideResult);
  form.addEventListener('submit',event=>{
    event.preventDefault();for(const name of ['name','phone','email'])field(name).value=field(name).value.trim();
    if(!form.reportValidity())return;
    summary=`Hello The Holiday Host,\n\nI would like to discuss a trip.\n\nName: ${field('name').value}\nPhone: ${field('phone').value}\nEmail: ${field('email').value}\nDestination: ${field('destination').value}\nJourney: ${field('trip').selectedOptions[0].textContent}\nTravellers: ${field('travellers').value}\nPreferred start date: ${field('date').value||'Flexible'}\nLand budget / person: ${field('budget')?.value||'To discuss'}\nStay preference: ${field('comfort')?.value||'To discuss'}\nTravel pace: ${field('pace')?.value||'To discuss'}\n\nPreferences:\n${field('notes').value.trim()||'To be discussed'}\n\nPlease share a suggested itinerary and a quote for my trip.`;
    result.querySelector('.enquiry-summary').textContent=summary;
    result.querySelector('.send-whatsapp').href=`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(summary)}`;
    result.querySelector('.send-email').href=`mailto:${config.email}?subject=${encodeURIComponent('Trip enquiry — '+field('destination').value)}&body=${encodeURIComponent(summary)}`;
    result.querySelector('.copy-status').textContent='';result.hidden=false;result.focus();
  });
  result.querySelector('.copy-enquiry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary);result.querySelector('.copy-status').textContent='Trip details copied.';}catch{result.querySelector('.copy-status').textContent='Please select the trip details to copy them.';}});
  result.querySelector('.edit-enquiry').addEventListener('click',()=>{result.hidden=true;field('name').focus();});
});
const preferredDate=document.querySelector('[data-preferred-date]');
document.querySelector('.request-date')?.addEventListener('click',event=>{if(preferredDate.value&&!preferredDate.reportValidity()){event.preventDefault();return;}const form=document.querySelector('[data-enquiry]');if(preferredDate.value&&form){form.elements.date.value=preferredDate.value;document.dispatchEvent(new Event('holiday:dates-updated'));form.querySelector('.enquiry-result').hidden=true;}});
document.querySelector('.expand-days')?.addEventListener('click',event=>{const days=[...document.querySelectorAll('.itinerary-day')];const open=!days.every(d=>d.open);days.forEach(d=>d.open=open);event.currentTarget.textContent=open?'Collapse all days':'Expand all days';});
document.querySelectorAll('.route-overview a').forEach(a=>a.addEventListener('click',()=>{const detail=document.getElementById(a.hash.slice(1));if(detail)detail.open=true;}));
const dialog=document.querySelector('#photo-dialog');let previousFocus;
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{previousFocus=button;dialog.querySelector('img').src=button.dataset.photo;dialog.querySelector('img').alt=button.dataset.caption;dialog.querySelector('#photo-caption').textContent=button.dataset.caption;dialog.showModal();}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
dialog.addEventListener('close',()=>previousFocus?.focus());

const tripPlanner=document.querySelector('#trip-planner');
if(tripPlanner){
  const quickPlan=document.querySelector('#quick-trip-plan');
  let plannerTrigger;
  const updateGuide=()=>{const rate=Number(tripPlanner.dataset.guidePrice);const count=Number(quickPlan.elements.travellers.value);if(rate)tripPlanner.querySelector('[data-plan-total]').textContent=count>=1&&count<=30?new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(rate*count):'Choose 1–30 travellers';};
  quickPlan.addEventListener('input',updateGuide);updateGuide();
  document.querySelectorAll('[data-open-planner]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();plannerTrigger=link;const form=document.querySelector('#trip-enquiry-form');quickPlan.elements.date.value=preferredDate?.value||form.elements.date.value;quickPlan.elements.travellers.value=form.elements.travellers.value||2;document.dispatchEvent(new Event('holiday:controls-updated'));updateGuide();document.dispatchEvent(new Event('holiday:dates-updated'));tripPlanner.showModal();}));
  tripPlanner.querySelector('[data-close-planner]').addEventListener('click',()=>tripPlanner.close());
  tripPlanner.addEventListener('close',()=>plannerTrigger?.focus());
  quickPlan.addEventListener('submit',event=>{event.preventDefault();if(!quickPlan.reportValidity())return;const form=document.querySelector('#trip-enquiry-form');form.elements.date.value=quickPlan.elements.date.value;form.elements.travellers.value=quickPlan.elements.travellers.value;document.dispatchEvent(new Event('holiday:controls-updated'));if(preferredDate)preferredDate.value=quickPlan.elements.date.value;document.dispatchEvent(new Event('holiday:dates-updated'));form.querySelector('.enquiry-result').hidden=true;tripPlanner.close();location.hash='trip-enquiry';form.elements.namedItem('name').focus();});
}
document.querySelector('[data-print-trip]')?.addEventListener('click',()=>{document.querySelectorAll('.itinerary-day').forEach(d=>d.open=true);window.print();});
document.querySelector('[data-share-trip]')?.addEventListener('click',async()=>{const status=document.querySelector('[data-share-status]');try{await navigator.clipboard.writeText(location.origin+location.pathname);status.textContent='Trip link copied';}catch{status.textContent='Copy this page’s address from your browser.';}});

const guideSearch=document.querySelector('#guide-search');
guideSearch?.addEventListener('input',()=>{const terms=guideSearch.value.trim().toLocaleLowerCase().split(/\s+/);let count=0;document.querySelectorAll('[data-guide-card]').forEach(card=>{card.hidden=!terms.every(term=>card.textContent.toLocaleLowerCase().includes(term));if(!card.hidden)count++;});document.querySelector('#guide-count').textContent=count?`${count} ${count===1?'guide':'guides'} to explore`:'No matching guides. Try a different word.';});

const syncPublicSelects=enhanceSelects(document);
document.addEventListener('holiday:controls-updated',syncPublicSelects);
