import fs from 'node:fs';
const images=JSON.parse(fs.readFileSync('assets/optimized/manifest.json','utf8'));
const fonts=JSON.parse(fs.readFileSync('assets/fonts/manifest.json','utf8'));
export function fastImages(html){return html.replace(/<img\b[^>]*>/g,tag=>{
 const source=tag.match(/\bsrc="([^"]+)"/)?.[1],image=images[source];if(!image)return tag;
 tag=tag.replace(/\bsrc="[^"]+"/,`src="${image.src}"`).replace(/\bsrcset="[^"]+"/,`srcset="${image.variants.map(v=>v.src+' '+v.width+'w').join(', ')}"`);
 if(tag.includes('loading="lazy"'))tag=tag.replace(/sizes="([^"]+)"/,'sizes="auto, $1"');
 const sizes=tag.match(/sizes="([^"]+)"/)?.[1]||'100vw';
 return `<picture><source type="image/avif" srcset="${image.avifVariants.map(v=>v.src+' '+v.width+'w').join(', ')}" sizes="${sizes}">${tag}</picture>`;
});}
export function fastStyles(file,isTrip,isCollection){
 const paths=['assets/site.css','assets/reviews.css',...(file==='index.html'?['assets/journey-cards.css']:[]),...(isTrip?['assets/trip-readability.css']:[]),...(file==='explore.html'?['assets/explore.css']:[]),...(['packages.html','departures.html'].includes(file)?['assets/catalogue.css']:[]),...(file==='departures.html'||isCollection?['assets/collections.css']:[]),'assets/date-picker.css','assets/form-controls.css'];
 const css=fs.readFileSync('assets/fonts/fonts.css','utf8')+'\npicture{display:contents}\n'+paths.map(p=>fs.readFileSync(p,'utf8').replace(/@import\s+url\([^;]+;/g,'').replace(/>\s*img/g,' img')).join('\n');
 return fonts.map(f=>`<link rel="preload" href="${f.src}" as="font" type="font/woff2" crossorigin>`).join('')+`<style data-site-styles>${css.replace(/<\/style/gi,'<\\/style')}</style>`;
}
