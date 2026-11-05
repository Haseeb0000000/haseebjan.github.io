import fs from 'node:fs';
import assert from 'node:assert/strict';
import {trips} from '../data/trips.mjs';
import {collections,matchesCollection} from './trip-collections.mjs';
const coverage=JSON.parse(fs.readFileSync('data/reference-trip-coverage.json','utf8'));
assert.equal(Object.keys(coverage.mapping).length,23);
assert.equal(new Set(Object.values(coverage.mapping)).size,23);
for(const [source,slug] of Object.entries(coverage.mapping))assert(trips.some(t=>t.slug===slug),'Missing reference counterpart '+source);
const expected={winter:4,'women-only':3,honeymoon:1};
for(const c of collections){
 const list=trips.filter(t=>matchesCollection(t,c.id));assert(list.length,'Empty collection '+c.id);
 if(expected[c.id])assert.equal(list.length,expected[c.id]);
 const html=fs.readFileSync(c.slug+'.html','utf8');
 for(const t of list)assert(html.includes(`data-trip-slug="${t.slug}"`),`${c.id}: missing ${t.slug}`);
}
const dates=fs.readFileSync('departures.html','utf8');
for(const t of trips){assert(dates.includes(`data-trip-slug="${t.slug}"`));for(const d of t.suggestedDates.filter(d=>d.date>=new Date().toISOString().slice(0,10)).slice(0,3))assert(dates.includes(`contact.html?trip=${t.slug}&amp;date=${d.date}`),'Lost date enquiry context');}
for(const slug of ['kashmir-women','kashmir-honeymoon','south-kashmir-winter']){
 const t=trips.find(t=>t.slug===slug);assert(t.tags.includes('Winter'));
 assert(t.suggestedDates.every(d=>[12,1,2].includes(Number(d.date.slice(5,7)))),'Winter date outside winter');
 assert(t.itinerary.every(d=>d.places.length&&d.experiences.length&&d.description.length>120),'Incomplete itinerary day');
}
const editor=JSON.parse(fs.readFileSync('.pages.yml','utf8'));assert(editor.content.some(c=>c.name==='tripCollections'&&c.fields[0].name==='collections'));
console.log('PASS: 23 reference counterparts, 8 collections, winter seasons and contextual date enquiry links.');
