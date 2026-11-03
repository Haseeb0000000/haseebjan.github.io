import fs from 'node:fs';
import assert from 'node:assert/strict';
export const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
export function loadCollection(folder){return fs.readdirSync(folder).filter(f=>f.endsWith('.json')).map(f=>readJson(`${folder}/${f}`)).sort((a,b)=>(a.order??0)-(b.order??0));}
export function validatePlain(value,where='content'){
  if(typeof value==='string')assert(!/[<>]/.test(value),`${where}: use plain text without HTML tags`);
  else if(Array.isArray(value))value.forEach((v,i)=>validatePlain(v,`${where}[${i}]`));
  else if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))validatePlain(v,`${where}.${k}`);
}
export function editablePage(file,title,description,body,esc,renderImage){
 const source=`content/pages/${file.replace('.html','.json')}`;
 if(!fs.existsSync(source))return {title,description,body};
 const data=readJson(source);
 for(const item of data.copy||[]){if(!item.original||item.value===undefined)continue;body=body.split(item.original).join(esc(item.value));}
 for(const item of data.photos||[]){
  if(!item.image)continue;
  const replacement=renderImage(item.image,'',false,item.alt||'Destination photograph');
  const imageSource=replacement.match(/\bsrc="([^"]+)"/)[1];
  body=body.replace(/<img\b[^>]*>/g,tag=>tag.match(/\bsrc="([^"]+)"/)?.[1]===item.original?replacement:tag);
  body=body.replace(/<button\b[^>]*>/g,tag=>tag.includes(`data-photo="${item.original}"`)?tag.replace(`data-photo="${item.original}"`,`data-photo="${imageSource}"`).replace(/data-caption="[^"]*"/,`data-caption="${esc(item.alt||'Destination photograph')}"`):tag);
 }
 return {title:data.title||title,description:data.description||description,body};
}
