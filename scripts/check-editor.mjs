import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const tripFile='content/trips/kashmir-autumn.json';const homeFile='content/home.json';
const originalTrip=fs.readFileSync(tripFile);const originalHome=fs.readFileSync(homeFile);
const fixture='assets/uploads/editor-check.png';let generated=[];
const initialAssets=new Set(fs.readdirSync('assets'));
try{
 await sharp({create:{width:2400,height:1600,channels:3,background:'#356655'}}).png().toFile(fixture);
 let trip=JSON.parse(originalTrip);trip.name='Autumn owner edit & preview';trip.cover='/'+fixture;trip.coverAlt='Owner uploaded landscape';trip.gallery=['/'+fixture];
 // Cover and gallery intentionally use the same fixture only for media processing;
 // the production duplicate-photo check is verified on the restored real catalogue.
 fs.writeFileSync(tripFile,JSON.stringify(trip));
 execFileSync(process.execPath,['scripts/prepare-media.mjs']);const manifest=JSON.parse(fs.readFileSync('data/upload-manifest.json'));const photo=manifest[fixture];
 generated=photo.variants.map(v=>v.src);assert.equal(photo.width,1280);assert.equal(photo.variants[0].width,640);assert(photo.variants.every(v=>fs.statSync(v.src).size<300000));
 trip.gallery=[];fs.writeFileSync(tripFile,JSON.stringify(trip));let home=JSON.parse(originalHome);home.heroTitle='A new owner headline';fs.writeFileSync(homeFile,JSON.stringify(home));
 execFileSync(process.execPath,['scripts/build.mjs']);const html=fs.readFileSync('kashmir-autumn.html','utf8');assert(html.includes('Autumn owner edit &amp; preview'));assert(html.includes(photo.src));assert(html.includes('alt="Owner uploaded landscape"'));assert(html.includes('class="trip-hero wrap"'));assert(fs.readFileSync('index.html','utf8').includes('A new owner headline'));
 console.log('PASS: editor data changes reach the unchanged layouts; uploaded photos resize, escape and render correctly.');
}finally{
 fs.writeFileSync(tripFile,originalTrip);fs.writeFileSync(homeFile,originalHome);if(fs.existsSync(fixture))fs.unlinkSync(fixture);
 for(const file of generated)if(fs.existsSync(file))fs.unlinkSync(file);
 execFileSync(process.execPath,['scripts/prepare-media.mjs']);execFileSync(process.execPath,['scripts/build.mjs']);
 const liveHtml=fs.readdirSync('.').filter(f=>f.endsWith('.html')).map(f=>fs.readFileSync(f,'utf8')).join('');
 for(const file of fs.readdirSync('assets'))if(/\.[a-f0-9]{12}\.(?:json|js|css)$/.test(file)&&!initialAssets.has(file)&&!liveHtml.includes('assets/'+file))fs.unlinkSync('assets/'+file);
}
