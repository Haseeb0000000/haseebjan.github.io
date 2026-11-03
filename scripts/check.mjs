import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
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
  assert.match(html,/assets\/site\.[a-f0-9]{12}\.css/,'Page must load content-versioned styles');
  assert.match(html,/assets\/site\.[a-f0-9]{12}\.js/,'Page must load matching content-versioned scripts');
  assert.doesNotMatch(html,/assets\/(?:valley|mountain-road|dal-lake)-\d+\.jpg/,'Public pages must use licence-verified replacement photos');
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
assert.match(JSON.parse(fs.readFileSync('site.config.json')).whatsapp,/^\d{10,15}$/,'WhatsApp must use country-code digits');
assert(trips.length>=26);
assert.deepEqual([...new Set(trips.map(t=>t.region))].sort(),['Jammu','Kashmir','Kashmir & Ladakh','Ladakh']);
for(const trip of trips){assert.equal(trip.days,trip.itinerary.length,`${trip.slug}: itinerary length`);assert.equal(trip.nights,trip.days-1);assert.equal(trip.dates.length,0,'Confirmed dates need a separately reviewed inventory feature');assert(trip.price==null||Number.isFinite(trip.price)&&trip.price>0,`${trip.slug}: a positive guide price or no price`);const html=fs.readFileSync(trip.slug+'.html','utf8');for(const section of ['itinerary','inclusions','dates','packing','trip-faq','trip-enquiry'])assert(html.includes(`id="${section}"`));assert(html.includes('data-enquiry-fields disabled'));}
assert.equal(regions.length,3);
const photoCredits=JSON.parse(fs.readFileSync('data/photo-credits.json','utf8').replace(/^\uFEFF/,''));
assert(photoCredits.length>=30);
assert.equal(new Set(photoCredits.map(p=>p.source)).size,photoCredits.length,'Photo credits must not alias the same source under multiple names');
for(const photo of photoCredits){assert(photo.source.startsWith('https://commons.wikimedia.org/'));assert(photo.license&&photo.author&&photo.licenseUrl);}
for(const asset of fs.readdirSync('assets').filter(f=>/\.[a-f0-9]{12}\.(css|js|json)$/.test(f))){const expected=asset.match(/\.([a-f0-9]{12})\./)[1];const text=fs.readFileSync('assets/'+asset,'utf8').replace(/\r\n/g,'\n');assert.equal(createHash('sha256').update(text).digest('hex').slice(0,12),expected,`${asset}: content-version match`);}
for(const file of fs.readdirSync('assets').filter(f=>f.endsWith('.jpg')))assert(fs.statSync('assets/'+file).size<300000,`${file}: image size budget`);
for(const file of pages){const photoPaths=[...fs.readFileSync(file,'utf8').matchAll(/<img\b[^>]*\bsrc="([^"]+\.jpg)"/g)].map(m=>m[1]);assert.equal(photoPaths.length,new Set(photoPaths).size,`${file}: photographs must not repeat within a page`);}
assert.equal(new Set(trips.map(t=>t.cover||t.image)).size,trips.length,'Every trip needs a distinct main photograph');
assert(fs.existsSync('.pages.yml'),'Online editor configuration');
const editorConfig=JSON.parse(fs.readFileSync('.pages.yml','utf8'));
for(const collection of editorConfig.content.filter(c=>c.type==='collection'))assert(collection.filename.endsWith('.json'),`${collection.name}: editor must list JSON files rather than default Markdown files`);
assert(fs.readFileSync('admin.html','utf8').includes('noindex,follow'),'Owner entry page must stay out of search');
console.log(`PASS: ${pages.length} pages, ${links} local references, ${images} image elements, unique SEO metadata, structured data, labels, sitemap, image budgets, and preserved CNAME.`);
