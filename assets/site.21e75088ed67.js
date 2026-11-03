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
  const cards=[...document.querySelectorAll('[data-trip-card]')];
  const grid=document.querySelector('.trip-grid');
  for(const name of ['q','region','type','duration','sort']){const field=filterForm.elements.namedItem(name);const value=parameters.get(name);if(value&&(field.tagName!=='SELECT'||[...field.options].some(o=>o.value===value)))field.value=value;}
  function filterTrips(syncUrl=true){
    const data=new FormData(filterForm);const aliases={trekking:'trek',biking:'motorcycle',honeymoon:'couples'};const search=String(data.get('q')).trim().toLocaleLowerCase().split(/\s+/).map(term=>aliases[term]||term).join(' ');
    const region=data.get('region');const type=data.get('type');const duration=data.get('duration');const sort=data.get('sort');
    const ordered=[...cards].sort((a,b)=>{if(sort==='price-low'||sort==='price-high'){if(a.dataset.price==='999999')return b.dataset.price==='999999'?0:1;if(b.dataset.price==='999999')return -1;return (Number(a.dataset.price)-Number(b.dataset.price))*(sort==='price-high'?-1:1);}if(sort==='duration')return Number(a.dataset.days)-Number(b.dataset.days);return cards.indexOf(a)-cards.indexOf(b);});
    let count=0;
    ordered.forEach(card=>{const days=Number(card.dataset.days);const matches=(!search||search.split(/\s+/).every(term=>card.dataset.search.includes(term)))&&(!region||card.dataset.region.includes(region))&&(!type||type===card.dataset.type)&&(!duration||(duration==='short'&&days<=4)||(duration==='week'&&days>=5&&days<=7)||(duration==='long'&&days>=8));card.hidden=!matches;if(matches)count++;grid.append(card);});
    document.querySelector('#results-count').textContent=`${count} ${count===1?'journey proposal':'journey proposals'} to explore`;
    document.querySelector('#no-results').hidden=count!==0;
    if(syncUrl){const query=new URLSearchParams();for(const [k,v] of data){if(v&&!(k==='sort'&&v==='recommended'))query.set(k,String(v));}history.replaceState(null,'',location.pathname+(query.size?'?'+query.toString():''));}
  }
  filterForm.addEventListener('input',()=>filterTrips());
  filterForm.addEventListener('change',()=>filterTrips());
  filterForm.addEventListener('submit',event=>{event.preventDefault();filterTrips();});
  filterForm.addEventListener('reset',()=>{queueMicrotask(()=>filterTrips());});
  document.querySelector('#clear-search').addEventListener('click',()=>{filterForm.reset();filterForm.querySelector('input').focus();});
  filterTrips(false);
}
const datePlanner=document.querySelector('#date-planner');
if(datePlanner&&['Kashmir','Ladakh','Jammu'].includes(parameters.get('region')))datePlanner.elements.region.value=parameters.get('region');
const config=window.HOLIDAY_HOST_CONTACT;
let cataloguePromise;
function catalogue(){return cataloguePromise??=fetch('assets/catalogue.504389ef8200.json').then(response=>{if(!response.ok)throw Error('Catalogue unavailable');return response.json();});}
document.querySelectorAll('[data-enquiry]').forEach(form=>{
  if(!config?.whatsapp||!config?.email)return;
  form.querySelector('[data-enquiry-fields]').disabled=false;
  const result=form.querySelector('.enquiry-result');let summary='';
  const field=name=>form.elements.namedItem(name);
  if(form.id==='enquiry'){
    const region=parameters.get('region');if(['Kashmir','Ladakh','Jammu','Combined journey'].includes(region))field('destination').value=region;
    const date=parameters.get('date');if(/^\d{4}-\d{2}-\d{2}$/.test(date||'')&&date>=minDate)field('date').value=date;
    const trip=parameters.get('trip');if([...field('trip').options].some(o=>o.value===trip)){field('trip').value=trip;catalogue().then(items=>{const selected=items.find(t=>t.slug===trip);if(selected)field('destination').value=selected.region;}).catch(()=>{});}
  }
  field('trip').addEventListener('change',async()=>{try{const selected=(await catalogue()).find(t=>t.slug===field('trip').value);if(selected)field('destination').value=selected.region;}catch{ /* Keep manual destination selection usable if catalogue cannot load. */ }});
  const hideResult=()=>result.hidden=true;
  form.addEventListener('input',hideResult);form.addEventListener('change',hideResult);
  form.addEventListener('submit',event=>{
    event.preventDefault();for(const name of ['name','phone','email'])field(name).value=field(name).value.trim();
    if(!form.reportValidity())return;
    summary=`Hello The Holiday Host,\n\nI would like to discuss a trip.\n\nName: ${field('name').value}\nPhone: ${field('phone').value}\nEmail: ${field('email').value}\nDestination: ${field('destination').value}\nJourney: ${field('trip').selectedOptions[0].textContent}\nTravellers: ${field('travellers').value}\nPreferred start date: ${field('date').value||'Flexible'}\n\nPreferences:\n${field('notes').value.trim()||'To be discussed'}\n\nPlease confirm availability, the final price, taxes, sharing basis, accommodation, transport, meals, activities, inclusions, exclusions, and booking terms in writing. I understand guide prices are not confirmed offers.`;
    result.querySelector('.enquiry-summary').textContent=summary;
    result.querySelector('.send-whatsapp').href=`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(summary)}`;
    result.querySelector('.send-email').href=`mailto:${config.email}?subject=${encodeURIComponent('Trip enquiry — '+field('destination').value)}&body=${encodeURIComponent(summary)}`;
    result.querySelector('.copy-status').textContent='';result.hidden=false;result.focus();
  });
  result.querySelector('.copy-enquiry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary);result.querySelector('.copy-status').textContent='Copied. Paste the message into your email or chat, review it, and send when ready.';}catch{result.querySelector('.copy-status').textContent='Copy is unavailable here. Select the summary above and copy it manually.';}});
  result.querySelector('.edit-enquiry').addEventListener('click',()=>{result.hidden=true;field('name').focus();});
});
const preferredDate=document.querySelector('[data-preferred-date]');
document.querySelector('.request-date')?.addEventListener('click',event=>{if(preferredDate.value&&!preferredDate.reportValidity()){event.preventDefault();return;}const form=document.querySelector('[data-enquiry]');if(preferredDate.value&&form){form.elements.date.value=preferredDate.value;form.querySelector('.enquiry-result').hidden=true;}});
document.querySelector('.expand-days')?.addEventListener('click',event=>{const days=[...document.querySelectorAll('.itinerary-day')];const open=!days.every(d=>d.open);days.forEach(d=>d.open=open);event.currentTarget.textContent=open?'Collapse all days':'Expand all days';});
document.querySelectorAll('.route-overview a').forEach(a=>a.addEventListener('click',()=>{const detail=document.getElementById(a.hash.slice(1));if(detail)detail.open=true;}));
const dialog=document.querySelector('#photo-dialog');let previousFocus;
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{previousFocus=button;dialog.querySelector('img').src=button.dataset.photo;dialog.querySelector('img').alt=button.dataset.caption;dialog.querySelector('#photo-caption').textContent=button.dataset.caption;dialog.showModal();}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
dialog.addEventListener('close',()=>previousFocus?.focus());
