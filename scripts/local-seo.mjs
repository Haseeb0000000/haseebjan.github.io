// Owner-confirmed business details; do not add ratings or unconfirmed credentials.
export function localSeo({config,file,title,description,body,trips}){
 const url=config.url+(file==='index.html'?'/':'/'+file);
 const businessId=config.url+'/#business';
 const map='https://www.google.com/maps?cid=12690408647320868569';
 const firstImage=body.match(/<img\b[^>]*>/)?.[0]||'';
 const source=firstImage.match(/\bsrc="([^"]+)"/)?.[1]||'assets/brand/holiday-host-256.png';
 const image=new URL(source,config.url+'/').href;
 const imageAlt=firstImage.match(/\balt="([^"]*)"/)?.[1]||config.name;
 const business={'@type':'TravelAgency','@id':businessId,name:config.name,url:config.url+'/',telephone:config.phone,email:config.email,logo:config.url+'/assets/brand/holiday-host-256.png',image:config.url+'/assets/brand/holiday-host-256.png',description:'Srinagar-based tour operator arranging personalised holidays, heritage visits and mountain journeys across Kashmir, Ladakh and Jammu.',address:{'@type':'PostalAddress',streetAddress:'Saida Kadal Bridge, Rainawari',addressLocality:'Srinagar',addressRegion:'Jammu and Kashmir',postalCode:'190003',addressCountry:'IN'},hasMap:map,sameAs:[map],areaServed:['Kashmir','Ladakh','Jammu'].map(name=>({'@type':'Place',name})),openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:'09:00',closes:'18:00'},{'@type':'OpeningHoursSpecification',dayOfWeek:'Sunday',opens:'10:00',closes:'13:00'}]};
 const graph=[business,{'@type':'WebPage','@id':url+'#webpage',url,name:title+' | '+config.name,description,isPartOf:{'@id':config.url+'/#website'},about:{'@id':businessId},primaryImageOfPage:{'@type':'ImageObject',url:image}}];
 if(file==='index.html')graph.push({'@type':'WebSite','@id':config.url+'/#website',url:config.url+'/',name:config.name,publisher:{'@id':businessId}});
 const trip=trips.find(t=>file===t.slug+'.html');
 if(file!=='index.html'&&!['404.html','admin.html'].includes(file)){
  const trail=[['Home',config.url+'/'],...(trip?[['Trips',config.url+'/packages.html']]:[]),[trip?.name||title,url]];
  graph.push({'@type':'BreadcrumbList',itemListElement:trail.map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))});
 }
 return {image,imageAlt,json:JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')};
}
