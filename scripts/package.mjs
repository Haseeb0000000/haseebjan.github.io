import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
// Explicit public file allowlist; source, docs, config, and Git metadata stay out.
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html')||['robots.txt','sitemap.xml'].includes(f)))fs.copyFileSync(file,path.join(dist,file));
fs.cpSync('assets',path.join(dist,'assets'),{recursive:true});
console.log('Prepared dist/ for optional static Cloudflare hosting. No deployment or DNS change performed.');
