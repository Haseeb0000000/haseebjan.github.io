// Keep the visitor journey concise; detailed attribution and policy wording
// remain on their dedicated pages. Owner-authored changes pass through unchanged.
export function publicCopy(file,body){
 if(['credits.html','admin.html','privacy.html','terms.html','cancellation.html'].includes(file))return body;
 const replacements=[
 ['Our owner introduction, team profiles, and approved founder video are coming soon.',''],
 ['Business registration and accreditation details will appear only after evidence is supplied.',''],
 ['Real people, real stories','Your kind of journey'],
 ['Guest feedback and team credentials appear only when verified and approved.','We’ll help you shape a journey around your interests and pace.'],
 ['Owner-authorised planning estimate. Supplier costs, hotel selection, taxes and exact inclusions must be checked before a final offer.','Guide price; your tailored quote confirms the final cost and inclusions.'],
 ['Planning suggestions, not confirmed departures, available seats or official event dates.','Suggested dates · request availability.'],
 ['These are independently verified examples, not Holiday Host partner claims or guaranteed inclusions.','Hotel options to discuss. Your quote confirms the selected property.'],
 ['Proposed booking &amp; payment terms','Booking &amp; payment terms'],
 ['Proposed booking & payment terms','Booking & payment terms'],
 ['Draft cancellation &amp; refund policy','Cancellation &amp; refunds'],
 ['Draft cancellation & refund policy','Cancellation & refunds'],
 ['Destination inspiration, not photographs of a confirmed Holiday Host departure.','Destination gallery.'],
 ['Photo credits & licences','Photo credits'],
 ['They are owner-authorised guide prices for planning, not live inventory or a promise of availability. The final quote must confirm dates, occupancy, transport, meals, activities, taxes, and supplements.','Guide prices help you plan. Your quote confirms availability, the total and exactly what is included.'],
 ['Your target budget, excluding travel to the starting point; this is not a package price.','Excluding travel to the starting point.'],
 ['Explore suggested seasonal starts below, or choose your own date. These are sample planning dates, not confirmed departures or event schedules.','Explore suggested travel dates or choose your own. Ask us to confirm availability.'],
 ['Not confirmed departures or festival schedules. Request a date and get availability in writing.','Request your preferred date; we’ll confirm availability.'],
 ['These are planning ideas, not confirmed Holiday Host departures or guaranteed services. Your quote must list inclusions, exclusions, timings and cancellation terms.','Your quote confirms the experience, timing, inclusions and price.'],
 ['Public sources inform these original planning proposals. They do not establish a Holiday Host partnership, current opening hours or permission to enter. Current arrangements must be verified with the institution.','Opening and visitor arrangements are checked with each institution before your visit.'],
 ['Yes. The owner supplied +91 99062 69900 as the business WhatsApp number. Review your enquiry, open WhatsApp, and press Send yourself.','Yes. Message us on +91 99062 69900. You can review your enquiry before sending it.'],
 ['Houseboat inspiration in Srinagar. This is not a photograph of a reserved or shortlisted hotel; a houseboat stay is optional unless specified in your quote.','Houseboats on Dal Lake, Srinagar. Ask about adding a houseboat stay.'],
 ['Khanqah-e-Moula · destination inspiration','Khanqah-e-Moula, Srinagar'],
 ['Verified property example for discussion only; no allocation, affiliation or rate is claimed.','Property option; availability and price confirmed in your quote.'],
 ['Verified property example where the route visits Pahalgam. Not reserved and not promised within the guide price.','Property option for your Pahalgam stay; availability and price to confirm.'],
 ['Jammu figures are owner-requested sample planning estimates, not verified supplier rates. Final costs and services require a written quote.','Jammu guide prices are estimates. Request a tailored quote for your dates.'],
 ['Licensed photograph of pashmina weaving in Srinagar. These makers are not advertised as Holiday Host partners or confirmed hosts.','Pashmina weaving in Srinagar. Workshop visits are arranged separately.'],
 ['Photography licences & credits','Photo credits'],
 ['Self-drive is an enquiry option only. We do not advertise an owned fleet or confirmed rental rates. Supplier availability, licence eligibility, permitted areas and vehicle documents must be checked first.','Ask about self-drive availability, eligible licences, permitted routes and supplier terms.'],
 ['This proposal allows extra arrival time and differs in duration from some price benchmarks. It is not a like-for-like confirmed offer.','Extra arrival time is included in the itinerary. Your quote confirms the final package.'],
 ['A sample accommodation plan for discussion. No hotel, room or campsite is booked by viewing this page.','Suggested overnight stops. Your quote confirms the named stays and room details.'],
 ['Property not selected or reserved. The final quote must name it and confirm facilities.','Hotel and room details confirmed in your quote.'],
 ['Proposed inclusions need supplier confirmation. Only your accepted written quote determines the actual package.','Your personalised quote confirms the exact inclusions.'],
 ['This proposal is a starting point: routing and services are confirmed in writing around your dates.','We’ll tailor the route and services to your dates.'],
 ['No departure, staffing, accommodation, or seat count is confirmed on this page.','Availability confirmed on enquiry.'],
 ['Public heritage and craft references inform these original route proposals. No partnership or endorsement is implied. Access and opening arrangements must be checked for your date.','Access and opening arrangements are checked for your date.'],
 ['Original route suggestions; no partnership or confirmed host is implied.','Visits and hosts are arranged on request.'],
 ['No named guide, artisan partnership or entry permission is promised by this proposal.','Your quote confirms the guide and visit arrangements.'],
 ['Price & availability on request','Price and availability on request'],
 ['journey · itinerary proposal','journey · tailored itinerary'],
 ['Private visit proposals · price on request · guide and access to confirm','Private visits · enquire for availability and pricing']
 ];
 for(const [from,to]of replacements)body=body.split(from).join(to);
 body=body.replace(/<p[^>]*>Phone and WhatsApp supplied by the owner\. Email carried over from the existing website\.<\/p>/g,'');
 body=body.replace(/<p[^>]*>Opening hours to be confirmed\.<\/p>/g,'');
 return body.replaceAll('Opening hours to be confirmed.','').replace(/<p[^>]*>\s*<\/p>/g,'');
}
