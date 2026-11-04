export function dayPlanning(d,esc){
 return `${d.pace?`<p class="day-pace"><strong>Day rhythm</strong> ${esc(d.pace)}</p>`:''}${d.routeNote&&!d.routeNote.startsWith('Choose the stops that fit daylight')?`<p class="small muted day-route-note">${esc(d.routeNote)}</p>`:''}`;
}
export function sidebarDates(t,esc){
 return `<div class="sidebar-dates"><h3>Suggested starts</h3><p class="small muted">Dates to discuss · availability unconfirmed</p><div>${(t.suggestedDates||[]).map(d=>`<a href="contact.html?trip=${t.slug}&date=${d.date}"><strong>${new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(d.date+'T00:00:00Z'))}</strong><small>${esc(d.date.slice(0,4))}</small></a>`).join('')}</div></div>`;
}
export function journeyExtensions(t,{esc,wa}){
 if(!t.extensions?.length)return '';
 return `<section id="extra-time" class="trip-section"><span class="eyebrow">Stay a little longer</span><h2>Less rushing. More of the place.</h2><p class="muted">Optional route ideas, quoted separately. Extra nights are additional to this ${t.days}-day proposal.</p><div class="extension-grid">${t.extensions.map(e=>`<article class="extension-card"><span class="eyebrow">+ ${esc(String(e.nights))} ${e.nights===1?'night':'nights'} on request</span><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p><a class="text-link" href="${wa}?text=${encodeURIComponent(`Hello The Holiday Host, please quote ${t.name} with the optional extension: ${e.title} (+${e.nights} ${e.nights===1?'night':'nights'}). Please confirm the revised route, hotels, inclusions and total.`)}">Ask about this extension ↗</a></article>`).join('')}</div></section>`;
}
