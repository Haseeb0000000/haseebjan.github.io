import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,16);
const groups=new Map();
for(const name of fs.readdirSync('assets')){
 const match=name.match(/^(.+)-(\d+)\.jpg$/);if(!match)continue;
 const old=groups.get(match[1]);if(!old||Number(match[2])>old.size)groups.set(match[1],{src:'assets/'+name,size:Number(match[2])});
}
const uploads=JSON.parse(fs.readFileSync('data/upload-manifest.json','utf8'));
for(const p of Object.values(uploads))groups.set(path.basename(p.src,'.jpg'),{src:p.src});
fs.mkdirSync('assets/optimized',{recursive:true});
const manifest={};let originalBytes=0,optimizedBytes=0;
for(const [key,{src}]of groups){
 const bytes=fs.readFileSync(src),id=hash(Buffer.concat([bytes,Buffer.from('webp-q64-avif-q45-v2')]));
 const metadata=await sharp(bytes).metadata();const width=metadata.width;
 const widths=[...new Set([320,640,960,1280,1920,width].filter(w=>w<=width))].sort((a,b)=>a-b);
 const variants=[],avifVariants=[];
 for(const w of widths){const target=`assets/optimized/${key}-${id}-${w}.webp`;
  if(!fs.existsSync(target))await sharp(bytes).resize({width:w,withoutEnlargement:true}).webp({quality:64,effort:5}).toFile(target);
  const m=await sharp(target).metadata();variants.push({src:target,width:m.width,height:m.height});
  const avif=target.replace(/\.webp$/,'.avif');
  if(!fs.existsSync(avif))await sharp(bytes).resize({width:w,withoutEnlargement:true}).avif({quality:45,effort:4,chromaSubsampling:'4:2:0'}).toFile(avif);
  avifVariants.push({src:avif,width:m.width,height:m.height});
 }
 const entry={...variants.at(-1),variants,avifVariants};manifest[src]=entry;
 originalBytes+=bytes.length;optimizedBytes+=fs.statSync(avifVariants.at(-1).src).size;
}
fs.writeFileSync('assets/optimized/manifest.json',JSON.stringify(manifest,null,2)+'\n');
// Small, transparent logo variants instead of a 256px PNG in the navigation.
for(const w of [48,96,144])await sharp('assets/brand/holiday-host-256.png').resize(w,w).webp({quality:85,effort:5}).toFile(`assets/brand/holiday-host-${w}.webp`);

fs.mkdirSync('assets/fonts',{recursive:true});
const fontManifest='assets/fonts/manifest.json';
let fonts=fs.existsSync(fontManifest)?JSON.parse(fs.readFileSync(fontManifest,'utf8')):null;
if(!fonts||!fonts.every(f=>fs.existsSync(f.src))){
 const url='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&family=Playfair+Display:ital,wght@0,400..600;1,400&display=swap';
 const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}});if(!response.ok)throw Error('Font CSS download failed');
 const css=await response.text();fonts=[];
 for(const match of css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)){
  const block=match[1],family=block.match(/font-family:\s*'([^']+)'/)[1],style=block.match(/font-style:\s*([^;]+)/)[1],weight=block.match(/font-weight:\s*([^;]+)/)[1],remote=block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)[1];
  const download=await fetch(remote);if(!download.ok)throw Error('Font download failed');const bytes=Buffer.from(await download.arrayBuffer());
  const src=`assets/fonts/${family.toLowerCase().replaceAll(' ','-')}-${style}-${hash(bytes)}.woff2`;fs.writeFileSync(src,bytes);
  fonts.push({family,style,weight,src});
 }
 if(fonts.length!==3)throw Error('Expected three Latin variable font faces');
 for(const family of ['dmsans','playfairdisplay']){
  const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);if(!license.ok)throw Error('Font license download failed');
  fs.writeFileSync(`assets/fonts/${family}-OFL.txt`,await license.text());
 }
 fs.writeFileSync(fontManifest,JSON.stringify(fonts,null,2)+'\n');
}
fs.writeFileSync('assets/fonts/fonts.css',fonts.map(f=>`@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:swap;src:url('${f.src}') format('woff2')}`).join('\n')+'\n');
console.log(`Prepared ${groups.size} responsive AVIF/WebP sets: ${(originalBytes/1024).toFixed(0)}KB → ${(optimizedBytes/1024).toFixed(0)}KB at full size; ${fonts.length} self-hosted font faces.`);
