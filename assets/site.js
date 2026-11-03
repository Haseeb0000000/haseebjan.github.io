const menu=document.querySelector('.menu');
const navigation=document.querySelector('#navigation');
const mobile=window.matchMedia('(max-width: 900px)');
function setMenu(open){navigation.hidden=!open;menu.setAttribute('aria-expanded',String(open));}
setMenu(!mobile.matches);
menu.addEventListener('click',()=>setMenu(navigation.hidden));
mobile.addEventListener('change',()=>setMenu(!mobile.matches));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobile.matches&&!navigation.hidden){setMenu(false);menu.focus();}});
navigation.addEventListener('click',event=>{if(event.target.closest('a')&&mobile.matches)setMenu(false);});
const form=document.querySelector('#enquiry');
if(form){
  // Configuration is loaded only on the enquiry page, before enabling the form.
  const script=document.createElement('script');script.src='assets/contact-config.js';
  script.onload=()=>setupEnquiry(window.HOLIDAY_HOST_CONTACT);
  script.onerror=()=>{const p=document.createElement('p');p.textContent='The enquiry form could not load. Please use the email address alongside it.';form.append(p);};
  document.head.append(script);
}
function setupEnquiry(contact){
  document.querySelector('#enquiry-fields').disabled=false;
  const date=document.querySelector('#date');
  const now=new Date();date.min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const trip=document.querySelector('#trip');
  const selected=new URLSearchParams(location.search).get('trip');
  if([...trip.options].some(o=>o.value===selected)){trip.value=selected;document.querySelector('#destination').value=selected.startsWith('ladakh')?'Ladakh':'Kashmir';}
  const result=document.querySelector('#enquiry-result');let summary='';
  form.addEventListener('submit',event=>{
    event.preventDefault();
    for(const id of ['name','email'])document.getElementById(id).value=document.getElementById(id).value.trim();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    summary=`Hello The Holiday Host,\n\nI would like to discuss a trip.\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')||'Not provided'}\nDestination: ${data.get('destination')}\nPreferred date: ${data.get('date')||'Flexible'}\nTravellers: ${data.get('travellers')}\nTrip length: ${data.get('duration')}\nJourney inspiration: ${trip.selectedOptions[0].textContent}\n\nPreferences:\n${data.get('notes')||'To be discussed'}\n\nPlease share a written proposal with availability, itemised pricing, inclusions, exclusions, and booking terms.`;
    document.querySelector('#enquiry-summary').textContent=summary;
    document.querySelector('#email-draft').href=`mailto:${contact.email}?subject=${encodeURIComponent('Trip enquiry — '+data.get('destination'))}&body=${encodeURIComponent(summary)}`;
    const whatsapp=document.querySelector('#whatsapp-enquiry');
    if(typeof contact.whatsapp==='string'&&/^[1-9]\d{7,14}$/.test(contact.whatsapp)){whatsapp.href=`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(summary)}`;whatsapp.hidden=false;}
    document.querySelector('#copy-status').textContent='';result.hidden=false;result.focus();
  });
  document.querySelector('#copy-enquiry').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(summary);status.textContent='Copied. Paste this into your email and send it when ready.';}catch{status.textContent='Copy is unavailable here. Select the enquiry text above and copy it manually.';}});
  document.querySelector('#edit-enquiry').addEventListener('click',()=>{result.hidden=true;document.querySelector('#name').focus();});
  form.addEventListener('input',()=>{result.hidden=true;});
}
