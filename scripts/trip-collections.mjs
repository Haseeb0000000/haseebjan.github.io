import {readJson,validatePlain} from './content.mjs';
export const collections=readJson('content/trip-collections.json').collections;
validatePlain(collections,'Trip collections');
const heritage=['kashmir-heritage-stay','kashmir-sufi-shrines','kashmir-temple-trail','kashmir-gurdwara-journey','srinagar-church-heritage','katra-patnitop'];
export function matchesCollection(t,id){
 if(id==='winter')return t.tags?.includes('Winter');
 if(id==='honeymoon')return t.tags?.includes('Honeymoon');
 if(id==='heritage-faith')return heritage.includes(t.slug);
 if(id==='treks')return ['Trek','Day trip'].includes(t.type);
 return t.type===({'women-only':'Women-only',group:'Group',private:'Private',motorcycle:'Motorcycle'})[id];
}
export const collectionIds=t=>collections.filter(c=>matchesCollection(t,c.id)).map(c=>c.id).join(' ');
export function collectionPages({page,trips,img,cards,esc,pricingNote}){
 for(const c of collections){const list=trips.filter(t=>matchesCollection(t,c.id));
 page(c.slug+'.html',c.title,c.description,`<section class="collection-hero"><div class="wrap collection-hero-grid"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a href="explore.html">Explore</a><span>/</span><span>${esc(c.label)}</span></nav><span class="eyebrow">${list.length} itineraries · Your kind of journey</span><h1>${esc(c.title)}</h1><p>${esc(c.description)}</p><a class="button" href="#collection-trips">Find your journey ↓</a></div><div class="collection-hero-photo">${img(c.cover||c.image,'',true,c.coverAlt||c.imageAlt)}</div></div></section><section class="section collection-list" id="collection-trips"><div class="wrap"><nav class="collection-links" aria-label="Trip collections">${collections.map(x=>`<a href="${x.slug}.html" ${x.id===c.id?'aria-current="page"':''}>${esc(x.label)}</a>`).join('')}</nav><div class="section-head"><div><span class="eyebrow">Routes to look forward to</span><h2>Find the one for you.</h2></div><a href="departures.html?type=${encodeURIComponent(c.filter)}">Browse suggested dates ↗</a></div>${cards(list)}${pricingNote}<div class="collection-advice"><div><span class="eyebrow">Make it your own</span><h2>A little planning.<br>A better journey.</h2></div><ul>${c.advice.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div><div class="actions"><a class="button" href="contact.html?interest=${encodeURIComponent(c.title)}">Plan this kind of trip ↗</a><a class="button outline" href="packages.html">Browse all itineraries</a></div></div></section>`);
 }
}
