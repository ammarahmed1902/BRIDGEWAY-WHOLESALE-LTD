import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {stockImageUrl} from './public/image-sources.js';
const root=resolve('public'), port=Number(process.env.PORT||3000);
const siteOrigin='https://www.bridgewaywholesale.co.uk';
const sitePages={
 '/':{title:'UK Wholesale & Order Fulfilment',description:'BRIDGEWAY WHOLESALE LTD provides general wholesale products and UK order fulfilment for online sellers, with weekly or monthly billing by agreement.'},
 '/about':{title:'About Us',description:'About BRIDGEWAY WHOLESALE LTD, company 17555644: UK general wholesale and order fulfilment for online sellers.'},
 '/our-business':{title:'Our Business',description:'Product information, order-sheet fulfilment, UK delivery and weekly or monthly billing for online sellers.'},
 '/products':{title:'Products',description:'Enquire about watch chargers, car accessories, cables, an RGB mouse and 3M earplugs. Confirm current quantities and UK shipping rates with Bridgeway.'},
 '/contact':{title:'Contact',description:'Contact BRIDGEWAY WHOLESALE LTD at info@bridgewaywholesale.co.uk or +44 7367 064379 for wholesale and UK fulfilment enquiries.'},
 '/privacy':{title:'Privacy Policy',description:'How BRIDGEWAY WHOLESALE LTD handles business enquiries, email and WhatsApp communications and order-fulfilment data.'},
 '/terms':{title:'Terms & Conditions',description:'Business wholesale and UK fulfilment terms, weekly or monthly billing, and reporting damaged or incorrect goods within 15 days of delivery.'}
};
const escapeHtml=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const attempts=new Map(), completed=new Map(), pending=new Set();
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const json=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
export async function handler(req,res){
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/enquiry'){
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed.'});
  if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return json(res,403,{error:'Please submit from this website.'});}catch{return json(res,403,{error:'Invalid request origin.'});}}
  let raw='';try{if(req.body!==undefined){raw=typeof req.body==='string'?req.body:Buffer.isBuffer(req.body)?req.body.toString('utf8'):JSON.stringify(req.body);}else{for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>16000)return json(res,413,{error:'Your message is too long.'});}}if(Buffer.byteLength(raw)>16000)return json(res,413,{error:'Your message is too long.'});}catch{return json(res,400,{error:'Unable to read your enquiry.'});}
  let data;try{data=JSON.parse(raw);}catch{return json(res,400,{error:'Invalid request.'});}
  if(!data||typeof data!=='object'||Array.isArray(data))return json(res,400,{error:'Invalid request.'});
  if(data.website)return json(res,400,{error:'Unable to accept this enquiry.'});
  const errors={};for(const [key,label,max] of [['name','Name',100],['business','Business name',160],['email','Email',254],['requirements','Your requirements',5000]]){if(typeof data[key]!=='string'||!data[key].trim())errors[key]=`${label} is required.`;else if(data[key].length>max)errors[key]=`${label} must be ${max} characters or fewer.`;}
  if(!errors.email&&!email.test(data.email))errors.email='Enter a valid email address.';
  if(Object.keys(errors).length)return json(res,422,{error:'Please check the highlighted fields.',errors});
  if(!process.env.RESEND_API_KEY||!process.env.ENQUIRY_TO||!process.env.ENQUIRY_FROM)return json(res,503,{error:'Enquiry delivery is not configured yet. Your message has not been sent. Please try again once this service is available.'});
  const fingerprint=createHash('sha256').update(JSON.stringify([data.name.trim(),data.business.trim(),data.email.trim(),data.requirements.trim()])).digest('hex');
  const now=Date.now();for(const[k,v]of completed)if(now-v>3600000)completed.delete(k);for(const[k,v]of attempts)if(now-v.time>600000)attempts.delete(k);
  if(completed.has(fingerprint))return json(res,200,{message:'This enquiry has already been accepted. Thank you.'});
  if(pending.has(fingerprint))return json(res,409,{error:'This enquiry is already being sent. Please wait.'});
  const ip=req.socket.remoteAddress, bucket=attempts.get(ip)||{count:0,time:now};if(bucket.count>=5)return json(res,429,{error:'Too many attempts. Please try again in ten minutes.'});bucket.count++;attempts.set(ip,bucket);pending.add(fingerprint);
  try{
   const response=await fetch(process.env.RESEND_API_URL||'https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':fingerprint},body:JSON.stringify({from:process.env.ENQUIRY_FROM,to:[process.env.ENQUIRY_TO],reply_to:data.email.trim(),subject:'New Bridgeway website enquiry',text:`Name: ${data.name.trim()}\nBusiness: ${data.business.trim()}\nEmail: ${data.email.trim()}\n\n${data.requirements.trim()}`}),signal:AbortSignal.timeout(15000)});
   const result=await response.json();if(!response.ok||!result.id)throw Error('Provider did not accept enquiry');completed.set(fingerprint,now);return json(res,200,{message:'Thank you. Your enquiry has been accepted and sent to our team.'});
  }catch{return json(res,502,{error:'We could not send your enquiry. Your information is still here. Please try again later.'});}finally{pending.delete(fingerprint);}
 }
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
 const pageMeta=Object.hasOwn(sitePages,url.pathname)?sitePages[url.pathname]:null;let path=pageMeta?'/index.html':url.pathname;
 try{const file=resolve(root,'.'+decodeURIComponent(path));if(!file.startsWith(root+'/'))throw Error();let body=await readFile(file);if(path==='/index.html'){let html=body.toString('utf8');for(const asset of ['styles.css','products.js','app.js']){const content=await readFile(resolve(root,asset));const version=createHash('sha256').update(content).digest('hex').slice(0,12);html=html.replaceAll(`/${asset}\"`,`/${asset}?v=${version}\"`);}if(pageMeta){const title=escapeHtml(`${pageMeta.title} | Bridgeway Wholesale Ltd`),description=escapeHtml(pageMeta.description),canonical=siteOrigin+url.pathname;html=html.replace(/<title>.*?<\/title>/,`<title>${title}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${description}">`).replace('</head>',`<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"></head>`);}body=Buffer.from(html);}const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp'};res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':path==='/index.html'||['.js','.css'].includes(extname(file))?'no-cache':'public, max-age=3600'});res.end(req.method==='HEAD'?undefined:body);}catch{if(/^\/images\/(warehouse|warehouse-contact|electronics|household|general)\.jpg$/.test(path)){const name=path.slice('/images/'.length,-4);res.writeHead(307,{'Location':stockImageUrl(name),'Cache-Control':'public, max-age=300'});return res.end();}res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found');}
}
export const server=http.createServer(handler);
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 server.listen(port,'0.0.0.0',()=>console.log(`Bridgeway website listening on port ${port}`));
}
