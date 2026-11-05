// Keep native form values and validation rules; present feedback in the site UI.
(()=>{
 const steppers=[],searches=[];
 const errors=new Map();let handlingInvalid=false;
 const updateError=(field,message)=>{
  let error=errors.get(field);
  if(!error){error=document.createElement('p');error.className='site-control-error';error.id=(field.id||'site-field-'+errors.size)+'-error';error.setAttribute('role','alert');error.hidden=true;
   const anchor=field.closest('.catalogue-select,.site-number-control,.consent')||document.getElementById(field.id+'-control')||field;
   anchor.after(error);errors.set(field,error);
  }
  const target=document.getElementById(field.id+'-control')||field;
  const described=new Set((target.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));described.add(error.id);target.setAttribute('aria-describedby',[...described].join(' '));
  error.textContent=message;error.hidden=!message;
  if(message){field.setAttribute('aria-invalid','true');target.setAttribute('aria-invalid','true');}
  else{field.removeAttribute('aria-invalid');target.removeAttribute('aria-invalid');}
 };
 document.addEventListener('invalid',event=>{
  const field=event.target;if(!field.matches('input,select,textarea'))return;
  event.preventDefault();updateError(field,field.validationMessage||'Please check this field.');
  if(!handlingInvalid){handlingInvalid=true;setTimeout(()=>handlingInvalid=false,0);
   const target=document.getElementById(field.id+'-control')||field;target.focus();
   if(target!==field&&target.getAttribute('aria-expanded')!=='true')target.click();
  }
 },true);
 for(const name of ['input','change'])document.addEventListener(name,event=>{const field=event.target;if(errors.has(field)&&field.validity.valid)updateError(field,'');});
 for(const input of document.querySelectorAll('input[type="number"]')){
  const root=document.createElement('div');root.className='site-number-control';
  const label=(input.labels?.[0]?.textContent||'travellers').replace(/\*/g,'').trim().toLowerCase();
  const minus=document.createElement('button');minus.type='button';minus.className='site-number-minus';minus.textContent='−';minus.setAttribute('aria-label','Decrease '+label);
  const plus=document.createElement('button');plus.type='button';plus.className='site-number-plus';plus.textContent='+';plus.setAttribute('aria-label','Increase '+label);
  input.before(root);root.append(minus,input,plus);
  const refresh=()=>{const number=Number(input.value);minus.disabled=input.disabled||Boolean(input.value&&input.min!==''&&number<=Number(input.min));plus.disabled=input.disabled||Boolean(input.value&&input.max!==''&&number>=Number(input.max));};
  const step=direction=>{if(!input.value)input.value=input.min||'0';else if(direction>0)input.stepUp();else input.stepDown();input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));refresh();};
  minus.addEventListener('click',()=>step(-1));plus.addEventListener('click',()=>step(1));input.addEventListener('input',refresh);input.addEventListener('change',refresh);steppers.push(refresh);refresh();
 }
 for(const input of document.querySelectorAll('input[type="search"]')){
  const root=document.createElement('div');root.className='site-search-control';input.before(root);root.append(input);
  const clear=document.createElement('button');clear.type='button';clear.className='site-search-clear';clear.textContent='×';clear.setAttribute('aria-label','Clear '+(input.labels?.[0]?.textContent||'search').toLowerCase());root.append(clear);
  const refresh=()=>clear.hidden=!input.value;input.addEventListener('input',refresh);
  clear.addEventListener('click',()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();refresh();});searches.push(refresh);refresh();
  input.form?.addEventListener('reset',()=>setTimeout(refresh,0));
 }
 document.addEventListener('holiday:controls-updated',()=>{steppers.forEach(refresh=>refresh());searches.forEach(refresh=>refresh());for(const field of errors.keys())if(field.validity.valid)updateError(field,'');});
 document.addEventListener('reset',()=>setTimeout(()=>{steppers.forEach(refresh=>refresh());for(const field of errors.keys())updateError(field,'');},0),true);
})();
