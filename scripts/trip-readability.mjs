// Keep full owner-editable itinerary content, but give the reader a short first view.
export function readableItinerary(t,{esc,img,trips,dayPlanning}) {
  const defaults=t.slug==='kashmir-heritage-stay'?['jamia','pashmina-loom']:t.region==='Jammu'?['sanasar','bhaderwah','katra','patnitop']:t.region==='Ladakh'?['zanskar-road','alchi','nubra','pangong','khardung']:['aru','verinag','kokernag','gurez-village','dal','gulmarg'];
  const related=trips.filter(x=>x.slug!==t.slug&&x.region===t.region).slice(0,3);
  const seasonal=t.tags?.includes('Winter')?['winter-gulmarg-view','winter-gulmarg-road','dal-dusk',...defaults]:defaults;
  const photos=[...new Set(t.gallery?.length?t.gallery:seasonal)].filter(key=>key!==t.image&&key!==t.cover&&key!=='houseboat'&&!related.some(x=>x.image===key)).slice(0,t.days>3?2:1);
  const photo=index=>photos[index]?`<figure class="journey-interlude">${img(photos[index])}<figcaption>${esc(t.region)} · landscape & culture inspiration <a href="credits.html">Photo credits ↗</a></figcaption></figure>`:'';
  const days=t.itinerary.map((d,i)=>{
    const description=d.description||'';
    const first=description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||description;
    const remainder=description.slice(first.length).trim();
    return `<details class="itinerary-day journey-day" id="day-${i+1}" ${i===0?'open':''}><summary><span class="day-number"><small>DAY</small>${String(i+1).padStart(2,'0')}</span><span class="journey-day-heading"><small>${esc(d.place)}</small><strong>${esc(d.title)}</strong><span class="day-preview">${esc(first)}</span></span><span class="plus" aria-hidden="true">+</span><span class="sr-only">Toggle day details</span></summary><div class="day-content">${remainder?`<p class="day-story">${esc(remainder)}</p>`:''}<div class="day-discoveries">${d.places?.length?`<div class="day-places"><h4>Places & stops</h4><ul>${d.places.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`:''}${d.experiences?.length?`<div class="day-experiences"><h4>Experiences</h4><ul>${d.experiences.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`:''}</div>${dayPlanning(d,esc)}<div class="day-meta"><span><small>Overnight</small>${esc(d.stay)}</span><span><small>Meals</small>${esc(d.meals)}</span></div></div></details>${photos[1]&&i===Math.max(0,Math.floor(t.days/2)-1)?photo(1):''}`;
  }).join('');
  return `<section id="itinerary" class="trip-section readable-itinerary"><span class="eyebrow">The journey</span><h2>Your ${t.days}-day itinerary</h2><p class="section-intro">See the route at a glance. Open a day for places, experiences and stay details.</p>${photo(0)}<div class="itinerary-toolbar"><span>${t.days} days · ${esc(t.start)} start</span><button type="button" class="text-button expand-days">Expand all days</button></div><div class="journey-days">${days}</div></section>`;
}

export function readableBooking(t,{esc,price,wa}) {
  return `<aside class="booking-card readable-booking" aria-label="Plan this trip"><span class="eyebrow">Make it your journey</span><h2>Plan your trip</h2><p class="booking-duration">${t.days} days · ${t.nights} nights · ${esc(t.region)}</p><div class="booking-price">${price(t)}</div><p class="small muted">Guide price. Your quote confirms the total and inclusions.</p><label for="preferred-date">Preferred start date</label><input id="preferred-date" type="date" data-preferred-date><a class="button request-date" href="#trip-enquiry">Request availability ↗</a><a class="booking-whatsapp" href="${wa}?text=${encodeURIComponent('Hello The Holiday Host, I would like to discuss '+t.name+'.')}">Talk to our team on WhatsApp ↗</a><a class="booking-dates-link" href="#dates">View suggested dates</a><p class="booking-note">Dates subject to confirmation.<br>No payment taken on this website.</p></aside>`;
}
