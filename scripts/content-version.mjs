import fs from 'node:fs';
import {createHash} from 'node:crypto';
export function contentVersion(){
 const files=['site.config.json'];
 function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=`${dir}/${entry.name}`;if(entry.isDirectory())scan(file);else if(file.endsWith('.json'))files.push(file);}}
 scan('content');
 const hash=createHash('sha256');
 for(const file of files.sort())hash.update(file+'\0').update(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')).update('\0');
 return hash.digest('hex');
}
