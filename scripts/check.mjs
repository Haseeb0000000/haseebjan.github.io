import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {trips,regions} from '../data/trips.mjs';
const root=process.cwd();
const pages=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
let links=0,images=0;
const titles=new Set();
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: exactly one h1`);
  assert.match(html,/<html lang="en-IN">/);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  assert.match(html,/<link rel="canonical" href="https:\/\/theholidayhost.in\//);
  assert.match(html,/href="#main"/);
  assert.match(html,/<main id="main">/);
  assert.doesNotMatch(html,/Sterial|Passport\s*(?:&|—|template)|mydomain|Raymouth|11234567890|9186210167|Menu One|John Doe|Lorem ipsum/i);
  const title=html.match(/<title>(.*?)<\/title>/)[1];
  assert(!titles.has(title),`${file}: duplicate title`);titles.add(title);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`${file}: duplicate IDs`);
  for(const match of html.matchAll(/(?:href|src)="([^"]*)"/g)){
    const ref=match[1];assert(ref.length,`${file}: empty reference`);if(/^(https?:|mailto:|tel:)/.test(ref))continue;
    const [local,fragment]=ref.split('#');const target=(local.split('?')[0]||file);
    assert(fs.existsSync(path.join(root,target)),`${file}: missing ${target}`);
    if(fragment){const targetHtml=fs.readFileSync(target,'utf8');assert(targetHtml.includes(`id="${fragment}"`),`${file}: missing fragment ${fragment}`);}
    links++;
  }
  for(const match of html.matchAll(/srcset="([^"]+)"/g)){for(const candidate of match[1].split(','))assert(fs.existsSync(candidate.trim().split(' ')[0]),`${file}: missing srcset`);}
  for(const match of html.matchAll(/<img\b[^>]*>/g)){assert.match(match[0],/\balt="[^"]*"/);assert.match(match[0],/\bwidth="\d+"/);assert.match(match[0],/\bheight="\d+"/);images++;}
  for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(match[1]);
  for(const match of html.matchAll(/<(input|select|textarea)\b[^>]*\bid="([^"]+)"[^>]*>/g)){if(match[2]!=='consent')assert(html.includes(`for="${match[2]}"`),`${file}: missing label for ${match[2]}`);}
}
assert.equal(fs.readFileSync('CNAME','utf8').trim(),'theholidayhost.in');
const sitemap=fs.readFileSync('sitemap.xml','utf8');for(const page of pages.filter(p=>!fs.readFileSync(p,'utf8').includes('noindex,follow')))assert(sitemap.includes(page==='index.html'?'<loc>https://theholidayhost.in/</loc>':`/${page}</loc>`));
assert.equal(JSON.parse(fs.readFileSync('site.config.json')).whatsapp,'919906269900','Only use the owner-supplied WhatsApp number');
assert.equal(trips.length,12);
assert.deepEqual([...new Set(trips.map(t=>t.region))].sort(),['Jammu','Kashmir','Ladakh']);
for(const trip of trips){assert.equal(trip.days,trip.itinerary.length,`${trip.slug}: itinerary length`);assert.equal(trip.nights,trip.days-1);assert.equal(trip.dates.length,0,'Never invent confirmed departures');if(trip.benchmark){assert(trip.price<trip.benchmark);assert(Math.abs(trip.price/trip.benchmark-.95)<.003,`${trip.slug}: about 5% below benchmark`);}else assert.equal(trip.price,null,'Unbenchmarked Jammu rates stay on request');const html=fs.readFileSync(trip.slug+'.html','utf8');for(const section of ['itinerary','inclusions','dates','packing','trip-faq','trip-enquiry'])assert(html.includes(`id="${section}"`));assert(html.includes('data-enquiry-fields disabled'));}
assert.equal(regions.length,3);
for(const file of fs.readdirSync('assets').filter(f=>f.endsWith('.jpg')))assert(fs.statSync('assets/'+file).size<300000,`${file}: image size budget`);
console.log(`PASS: ${pages.length} pages, ${links} local references, ${images} image elements, unique SEO metadata, structured data, labels, sitemap, image budgets, and preserved CNAME.`);
