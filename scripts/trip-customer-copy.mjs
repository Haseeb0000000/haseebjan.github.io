// Presentation edits keep supplier costing/provenance in CMS data, not in sales copy.
// Optional services, access conditions and estimated pricing remain explicit.
export function customerTrip(t){
 const replacements=[
 ['Accommodation for the stated nights on the quoted sharing basis','Accommodation for the itinerary nights on a shared-room basis'],
 ['Trip-route vehicle, driver, fuel, tolls, and parking as itemised in the final quote','Route transport with driver, fuel, tolls and parking'],
 ['Transfers at the agreed starting and finishing points','Arrival and departure transfers for the itinerary'],
 ['Local coordination and the guided visits named in your proposal','Local coordination and the guided visits listed in your package'],
 ['Named local visits and guiding arrangements to be specified','Local visits and guiding tailored to your chosen itinerary'],
 ['Any tax, permit, entry ticket, or local transport charge not explicitly itemised in your final quote','Taxes, permits, entry tickets and local transport not listed in your package'],
 ['An evening shikara requested in the quote','Optional evening shikara on Dal Lake'],
 ['Dinner, if included in your quote','Dinner option'],
 ['Breakfast & dinner proposed; hosted lunch only if confirmed','Breakfast & dinner; hosted lunch optional'],
 ['Private bathroom requested where available; exact room category, heating and hot-water arrangements require written confirmation.','Tell us your preferred room category, heating and hot-water needs when choosing your stay.'],
 ['Request child-specific costing, bedding, meals and activity eligibility. No child discount or infant arrangement is assumed.','Share children’s ages so we can discuss rooms, meals and suitable activities.'],
 ['The final quote must identify any Gondola phase and local vehicle charges.','Gondola phases and local transfers are priced separately unless included in your package.'],
 ['Verinag: an alternative stop, not a promised third excursion','Verinag: an alternative to one of the garden stops'],
 ['Opening, worship, host participation and all fees must be confirmed.','Visits are arranged around opening times, worship and host availability.'],
 ['Keep weather alternatives and all hosted visits in the written quote.','Visits can be adapted around the weather and your interests.'],
 ['Optional route ideas, quoted separately.','Optional additions to your journey.'],
 ['The overnight base, road access, heating and return route need confirmation rather than being added to a busy transfer day.','Give this extension its own night, with time for the forest, springs and a relaxed return.'],
 ['This may change the main route; local transport, entry charges, hotel and extra cost are quoted separately.','This extension is priced separately, including the extra stay and local outings.']
 ];
 const clean=value=>typeof value==='string'?replacements.reduce((v,[from,to])=>v.replaceAll(from,to),value).replace(/\s*· dates to confirm/g,'').replace(/\s+proposal\b/g,''):Array.isArray(value)?value.map(clean):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,clean(v)])):value;
 const result=clean(t);
 result.start=result.start.replace(' / agreed meeting point','');
 if(result.bookingDetails?.pickup?.startsWith('Pickup/drop at '))result.bookingDetails.pickup=`Pickup and drop-off in ${result.start}, with times arranged around your travel.`;
 return result;
}

export function tripQuestions(t){
 const audience=t.type==='Women-only'?'Women travelling solo, with a friend or as a small group.':t.trek?'Travellers who enjoy walking and want a mountain-focused journey.':t.riding?'Experienced, licensed riders looking for a journey through the mountains.':t.type==='Pilgrimage'?'Travellers combining time at sacred places with a thoughtfully paced journey.':'Couples, friends, families and solo travellers who enjoy exploring at a comfortable pace.';
 return [
 ['Who is this trip for?',audience+' Tell us who is travelling and we’ll help you choose the right format.'],
 ['Where does the trip begin?',`The journey starts in ${t.start}. Share your arrival plans so pickup and the first day can fit around your travel.`],
 ['Can I personalise the itinerary?','Yes—tell us which places matter most, your preferred pace and the kind of stay you enjoy. Ask about extra nights, a private trip or a different starting date.'],
 ['How active is this trip?',`The itinerary is rated ${String(t.difficulty).toLowerCase()}. ${t.trek?'Talk to us about walking distances, terrain and preparation before choosing your dates.':t.riding?'Discuss daily riding distances, road conditions and the support you would like.':'Tell us if you prefer shorter walks, more rest time or fewer hotel changes.'}`],
 ['What if the weather changes?','Mountain weather and local access can affect the route. We’ll discuss suitable alternatives with you when planning your journey.'],
 ['How do I book?','Choose your dates and send us an enquiry. We’ll share the available stay options, final package price and booking terms so you can decide.']
 ];
}

export function tripPacking(t,{esc}){
 const winter=t.tags?.includes('Winter');
 const groups=[['Everyday essentials',['Photo ID and travel documents','Day bag and reusable water bottle','Phone charger and power bank']],['Clothing',winter?['Thermal layers and a warm jacket','Warm hat, gloves and wool socks','Weather-resistant outer layer']:['Comfortable layers for your travel dates','Light rain or wind protection','A warm layer for cool evenings']],['Footwear',t.riding?['Suitable riding boots and riding gear','Comfortable shoes for time off the bike']:t.trek?['Broken-in walking boots with good grip','Spare socks and comfortable camp footwear']:['Comfortable walking shoes with good grip','Spare socks and relaxed footwear']],['Personal items',['Your regular medicines','Sunglasses, sunscreen and lip balm','Personal toiletries']]];
 return `<section id="packing" class="trip-section"><span class="eyebrow">Ready for the journey</span><h2>What to pack</h2><div class="trip-packing-cards">${groups.map(([title,items])=>`<article><h3>${title}</h3><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}</div>${t.region==='Ladakh'||t.trek?'<p class="small muted">Ask us about altitude, walking preparation and the equipment needed for your route.</p>':''}</section>`;
}
