// Enhance native date values without changing form payloads or enquiry routing.
(()=>{
 const inputs=[...document.querySelectorAll('input[type="date"]')];
 if(!inputs.length||typeof HTMLDialogElement==='undefined')return;
 const format=new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric'});
 const monthFormat=new Intl.DateTimeFormat('en-IN',{month:'long',year:'numeric'});
 const iso=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
 const parse=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')?new Date(value+'T12:00:00'):null;
 const sameMonth=(a,b)=>a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear();
 const controls=[];
 for(const input of inputs){
  const required=input.required;input.required=false;
  const label=document.querySelector(`label[for="${input.id}"]`);
  const trigger=document.createElement('button');trigger.type='button';trigger.className='date-picker-trigger';trigger.id=input.id+'-control';trigger.setAttribute('aria-haspopup','dialog');
  const value=document.createElement('span');value.id=input.id+'-display';
  const icon=document.createElement('span');icon.className='date-picker-icon';icon.setAttribute('aria-hidden','true');trigger.append(value,icon);
  if(label){label.id=input.id+'-label';label.htmlFor=trigger.id;input.setAttribute('aria-labelledby',label.id);trigger.setAttribute('aria-labelledby',label.id+' '+value.id);}
  else{trigger.setAttribute('aria-label','Choose a travel date');input.setAttribute('aria-label','Choose a travel date');}
  input.before(trigger);input.hidden=true;input.tabIndex=-1;
  const calendar=document.createElement('dialog');calendar.className='date-picker-dialog';calendar.id=input.id+'-calendar';calendar.setAttribute('aria-labelledby',input.id+'-calendar-title');trigger.setAttribute('aria-controls',calendar.id);
  calendar.innerHTML=`<div class="date-picker-top"><div><span class="date-picker-eyebrow">Make room for a journey</span><h2 id="${input.id}-calendar-title">Choose your date</h2></div><button type="button" class="date-picker-close" aria-label="Close calendar">×</button></div><p class="date-picker-help" id="${input.id}-calendar-help">Choose a preferred start date. Availability is confirmed separately.</p><div class="date-picker-navigation"><button type="button" data-calendar-prev aria-label="Previous month">‹</button><button type="button" class="date-picker-month" aria-label="Choose month and year"></button><button type="button" data-calendar-next aria-label="Next month">›</button></div><div class="date-picker-content"></div><div class="date-picker-footer"><button type="button" data-calendar-clear>Clear date</button><button type="button" data-calendar-today>Today</button></div><p class="sr-only" aria-live="polite" data-calendar-status></p>`;
  calendar.setAttribute('aria-describedby',input.id+'-calendar-help');
  (input.closest('dialog')||document.body).append(calendar);
  const content=calendar.querySelector('.date-picker-content');
  const heading=calendar.querySelector('.date-picker-month');
  const previous=calendar.querySelector('[data-calendar-prev]');
  const next=calendar.querySelector('[data-calendar-next]');
  let view=new Date(),focusDate=new Date(),mode='days';
  const minimum=()=>parse(input.min)||new Date(new Date().setHours(12,0,0,0));
  const maximum=()=>parse(input.max);
  const allowed=date=>iso(date)>=iso(minimum())&&(!maximum()||iso(date)<=iso(maximum()));
  const refresh=()=>{value.textContent=parse(input.value)?format.format(parse(input.value)):'Choose a date';trigger.classList.toggle('has-date',Boolean(input.value));};
  const notify=()=>{refresh();input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));};
  const commit=date=>{input.value=date?iso(date):'';notify();calendar.close();};
  const focused=()=>content.querySelector('[tabindex="0"]')?.focus();
  function render(focus=false){
   const first=new Date(view.getFullYear(),view.getMonth(),1,12),min=minimum(),max=maximum();
   heading.textContent=mode==='months'?String(view.getFullYear()):monthFormat.format(view);
   previous.setAttribute('aria-label',mode==='months'?'Previous year':'Previous month');next.setAttribute('aria-label',mode==='months'?'Next year':'Next month');
   previous.disabled=mode==='months'?view.getFullYear()<=min.getFullYear():new Date(view.getFullYear(),view.getMonth(),0,12)<min;
   next.disabled=Boolean(max&&(mode==='months'?view.getFullYear()>=max.getFullYear():new Date(view.getFullYear(),view.getMonth()+1,1,12)>max));
   if(mode==='months'){
    content.innerHTML=`<div class="date-picker-month-grid" aria-label="Choose month">${Array.from({length:12},(_,m)=>{const start=new Date(view.getFullYear(),m,1,12),end=new Date(view.getFullYear(),m+1,0,12);const disabled=end<min||Boolean(max&&start>max);return `<button type="button" data-month="${m}" ${disabled?'disabled':''} ${m===view.getMonth()?'aria-current="true"':''}>${start.toLocaleDateString('en-IN',{month:'short'})}</button>`;}).join('')}</div>`;
   }else{
    const length=new Date(view.getFullYear(),view.getMonth()+1,0).getDate(),offset=(first.getDay()+6)%7;
    if(!sameMonth(focusDate,view)||!allowed(focusDate))focusDate=new Date(view.getFullYear(),view.getMonth(),sameMonth(min,view)?min.getDate():1,12);
    const cells=Array.from({length:Math.ceil((offset+length)/7)*7},(_,index)=>{const day=index-offset+1;if(day<1||day>length)return '<td></td>';const date=new Date(view.getFullYear(),view.getMonth(),day,12),key=iso(date),selected=key===input.value,today=key===iso(new Date());return `<td><button type="button" data-day="${key}" tabindex="${key===iso(focusDate)?'0':'-1'}" aria-label="${date.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}" aria-pressed="${selected}" ${today?'aria-current="date"':''} ${allowed(date)?'':'disabled'}>${day}</button></td>`;});
    content.innerHTML=`<table class="date-picker-grid" role="grid" aria-label="${monthFormat.format(view)}"><thead><tr>${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day=>`<th scope="col"><abbr title="${({Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'})[day]}">${day.slice(0,2)}</abbr></th>`).join('')}</tr></thead><tbody>${Array.from({length:cells.length/7},(_,row)=>'<tr>'+cells.slice(row*7,row*7+7).join('')+'</tr>').join('')}</tbody></table>`;
   }
   calendar.querySelector('[data-calendar-today]').disabled=!allowed(new Date());
   calendar.querySelector('[data-calendar-clear]').disabled=required;
   calendar.querySelector('[data-calendar-status]').textContent=heading.textContent;
   if(focus)focused();
  }
  function open(){
   const selected=parse(input.value);focusDate=selected&&allowed(selected)?selected:minimum();view=new Date(focusDate);mode='days';render();
   calendar.showModal();focused();
  }
  function moveMonth(amount){const day=focusDate.getDate();view=new Date(view.getFullYear(),view.getMonth()+amount,1,12);focusDate=new Date(view.getFullYear(),view.getMonth(),Math.min(day,new Date(view.getFullYear(),view.getMonth()+1,0).getDate()),12);render();}
  trigger.addEventListener('click',open);
  calendar.querySelector('.date-picker-close').addEventListener('click',()=>calendar.close());
  calendar.addEventListener('close',()=>trigger.focus());
  calendar.addEventListener('click',event=>{if(event.target===calendar){const box=calendar.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)calendar.close();}});
  previous.addEventListener('click',()=>{if(mode==='months'){view.setFullYear(view.getFullYear()-1);render();}else moveMonth(-1);});
  next.addEventListener('click',()=>{if(mode==='months'){view.setFullYear(view.getFullYear()+1);render();}else moveMonth(1);});
  heading.addEventListener('click',()=>{mode=mode==='days'?'months':'days';render();});
  content.addEventListener('click',event=>{const day=event.target.closest('[data-day]'),month=event.target.closest('[data-month]');if(day&&!day.disabled)commit(parse(day.dataset.day));if(month&&!month.disabled){view.setMonth(Number(month.dataset.month),1);mode='days';render(true);}});
  content.addEventListener('keydown',event=>{
   const button=event.target.closest('[data-day]');if(!button)return;
   let date=parse(button.dataset.day),handled=true;
   if(event.key==='ArrowLeft')date.setDate(date.getDate()-1);else if(event.key==='ArrowRight')date.setDate(date.getDate()+1);else if(event.key==='ArrowUp')date.setDate(date.getDate()-7);else if(event.key==='ArrowDown')date.setDate(date.getDate()+7);else if(event.key==='Home')date.setDate(date.getDate()-(date.getDay()+6)%7);else if(event.key==='End')date.setDate(date.getDate()+6-(date.getDay()+6)%7);else if(['PageUp','PageDown'].includes(event.key)){const day=date.getDate();date.setDate(1);date.setMonth(date.getMonth()+(event.key==='PageDown'?1:-1)*(event.shiftKey?12:1));date.setDate(Math.min(day,new Date(date.getFullYear(),date.getMonth()+1,0).getDate()));}else handled=false;
   if(!handled)return;event.preventDefault();if(!allowed(date))date=date<minimum()?minimum():maximum();focusDate=date;view=new Date(date);render(true);
  });
  calendar.querySelector('[data-calendar-clear]').addEventListener('click',()=>commit(null));
  calendar.querySelector('[data-calendar-today]').addEventListener('click',()=>commit(new Date()));
  input.addEventListener('change',refresh);input.form?.addEventListener('reset',()=>setTimeout(refresh,0));
  if(required)input.form?.addEventListener('submit',event=>{if(!input.disabled&&!input.value){event.preventDefault();event.stopImmediatePropagation();open();calendar.querySelector('[data-calendar-status]').textContent='Choose a start date to continue.';}},true);
  controls.push({refresh});refresh();
 }
 document.addEventListener('holiday:dates-updated',()=>controls.forEach(c=>c.refresh()));
})();
