import fs from 'node:fs';
import {createHash} from 'node:crypto';
export function versionAssets(pages){
  const replacements=new Map();
  for(const original of ['assets/catalogue.json','assets/site.css','assets/explore.css','assets/catalogue.css','assets/contact-config.js','assets/site.js']){
    let content=fs.readFileSync(original,'utf8').replace(/\r\n/g,'\n');
    if(original.endsWith('site.js'))content=content.replaceAll('assets/catalogue.json',replacements.get('assets/catalogue.json'));
    const hash=createHash('sha256').update(content).digest('hex').slice(0,12);
    const versioned=original.replace(/\.(css|js|json)$/,`.${hash}.$1`);
    fs.writeFileSync(versioned,content);replacements.set(original,versioned);
  }
  for(const file of pages){let html=fs.readFileSync(file,'utf8');for(const [original,versioned] of replacements)html=html.replaceAll(original,versioned);fs.writeFileSync(file,html);}
}
