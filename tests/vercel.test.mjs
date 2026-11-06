import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import handler from '../api/index.js';
import {server as standalone} from '../server.js';
let server,base;
before(async()=>{
 assert.equal(standalone.listening,false,'Importing the Vercel function must not bind a port');
 server=http.createServer(async(req,res)=>{
  if(req.headers['x-test-parsed-body']){let raw='';for await(const chunk of req)raw+=chunk;req.body=JSON.parse(raw);}
  return handler(req,res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}`;
});
after(async()=>{await new Promise(resolve=>server.close(resolve));});
test('Vercel handler serves every direct page route and bundled assets',async()=>{
 for(const path of ['/','/about','/our-business','/products','/contact','/privacy','/terms']){
  const res=await fetch(base+path);assert.equal(res.status,200);assert.match(await res.text(),/id="app"/);
 }
 for(const path of ['/styles.css','/app.js','/products.js','/products/watch.svg','/logo.svg','/favicon.svg']){const res=await fetch(base+path);assert.equal(res.status,200);assert.ok((await res.text()).length>50);}
 assert.equal((await fetch(base+'/not-a-page')).status,404);
});
test('Vercel pre-parsed request bodies retain field validation and size limits',async()=>{
 const data={name:'QA',business:'QA business',email:'invalid',requirements:'Testing the serverless handler'};
 const response=await fetch(base+'/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json','x-test-parsed-body':'1'},body:JSON.stringify(data)});
 assert.equal(response.status,422);assert.deepEqual(Object.keys((await response.json()).errors),['email']);
 const oversized=await fetch(base+'/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json','x-test-parsed-body':'1'},body:JSON.stringify({...data,requirements:'x'.repeat(17000)})});assert.equal(oversized.status,413);
});
test('missing local photographs redirect to the selected genuine stock source',async()=>{
 for(const name of ['warehouse','warehouse-contact','electronics','household','general']){
  const response=await fetch(`${base}/images/${name}.jpg`,{redirect:'manual'});
  if(response.status===307){const destination=new URL(response.headers.get('location'));assert.equal(destination.origin,'https://images.unsplash.com');assert.match(destination.pathname,/^\/photo-/);assert.equal(destination.searchParams.get('fm'),'jpg');}
  else {assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/jpeg');}
 }
});
test('page assets use versioned URLs and mutable code revalidates instead of staying stale',async()=>{
 const response=await fetch(base+'/contact');assert.equal(response.headers.get('cache-control'),'no-cache');
 const html=await response.text();for(const asset of ['styles.css','products.js','app.js']){
  const match=html.match(new RegExp('/'+asset.replace('.','\\.')+'\\?v=([a-f0-9]{12})'));assert.ok(match,`${asset} must have a content version`);
  const code=await fetch(base+match[0]);assert.equal(code.status,200);assert.equal(code.headers.get('cache-control'),'no-cache');
 }
 const script=await fetch(base+'/app.js');assert.equal(script.headers.get('cache-control'),'no-cache');assert.match(await script.text(),/info@bridgewaywholesale\.co\.uk/);
});
test('each public page has server-rendered metadata on the real company domain',async()=>{
 for(const path of ['/','/about','/our-business','/products','/contact','/privacy','/terms']){
  const res=await fetch(base+path+'?qa=1');const html=await res.text();assert.ok(html.includes(`<link rel="canonical" href="https://www.bridgewaywholesale.co.uk${path}">`));assert.ok(html.includes(`<meta property="og:url" content="https://www.bridgewaywholesale.co.uk${path}">`));assert.match(html,/<meta name="description" content="[^\"]+">/);
 }
 const terms=await (await fetch(base+'/terms')).text();assert.match(terms,/<title>Terms &amp; Conditions \| Bridgeway Wholesale Ltd<\/title>/);
});
