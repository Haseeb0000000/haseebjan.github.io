import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const files=[];
function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else if(e.name.endsWith('.json'))files.push(p);}}
scan('content');
const refs=new Set();
function find(value){if(typeof value==='string'&&/^\/?assets\/uploads\/[a-zA-Z0-9_./ -]+\.(jpe?g|png|webp)$/i.test(value))refs.add(value.replace(/^\//,''));else if(Array.isArray(value))value.forEach(find);else if(value&&typeof value==='object')Object.values(value).forEach(find);}
files.forEach(file=>find(JSON.parse(fs.readFileSync(file,'utf8'))));
fs.mkdirSync('assets/managed',{recursive:true});
const manifest={};
for(const ref of refs){
 const absolute=path.resolve(ref);if(!absolute.startsWith(path.resolve('assets/uploads')+path.sep))throw Error('Upload path must stay inside assets/uploads');
 const bytes=fs.readFileSync(absolute);if(bytes.length>20*1024*1024)throw Error(`${ref}: upload limit is 20MB`);
 const id=createHash('sha256').update(bytes).digest('hex').slice(0,16);
 const metadata=await sharp(bytes,{limitInputPixels:40000000}).rotate().metadata();
 const width=Math.min(1280,metadata.autoOrient?.width||metadata.width);
 const variants=[];
 for(const w of [...new Set([Math.min(640,width),width])]){
  const target=`assets/managed/${id}-${w}.jpg`;let output;
  for(let quality=80;quality>=38;quality-=7){output=await sharp(bytes,{limitInputPixels:40000000}).rotate().resize({width:w,withoutEnlargement:true}).jpeg({quality,mozjpeg:true}).toBuffer();if(output.length<290000)break;}
  if(output.length>=300000)throw Error(`${ref}: could not optimize below 300KB`);
  fs.writeFileSync(target,output);const m=await sharp(output).metadata();variants.push({src:target,width:m.width,height:m.height});
 }
 const large=variants.at(-1);manifest[ref]={...large,variants};
}
fs.writeFileSync('data/upload-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${refs.size} uploaded photos, with responsive sizes and metadata removed.`);
