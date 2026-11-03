import {loadCollection,validatePlain} from '../scripts/content.mjs';
export const trips=loadCollection('content/trips');
export const regions=loadCollection('content/regions');
for(const trip of trips){
 validatePlain(trip,'trip '+trip.slug);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trip.slug))throw Error('Invalid trip slug');
 trip.days=trip.itinerary.length;trip.nights=Math.max(0,trip.days-1);trip.dates??=[];trip.highlights??=[];trip.gallery??=[];
}
regions.forEach(r=>validatePlain(r,'destination '+r.slug));