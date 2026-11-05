import {execFileSync} from 'node:child_process';
import {mkdirSync,renameSync,readFileSync,unlinkSync} from 'node:fs';
mkdirSync('public/images',{recursive:true});
const photos={warehouse:'photo-1586528116311-ad8dd3c8310d','warehouse-contact':'photo-1586528116311-ad8dd3c8310d',electronics:'photo-1546435770-a3e426bf472b',household:'photo-1507473885765-e6ed057f782c',general:'photo-1586023492125-27b2c045efd7'};
for(const[name,id]of Object.entries(photos)){
 const target=`public/images/${name}.jpg`,temp=target+'.tmp';
 try{execFileSync('curl',['--fail','--location','--max-time','45','--silent','--show-error',`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${name==='warehouse'?1600:1000}&q=82&fm=jpg`,'-o',temp],{stdio:'inherit'});const b=readFileSync(temp);if(b[0]!==255||b[1]!==216)throw Error('Not a JPEG');renameSync(temp,target);console.log(`Downloaded ${target}`);}catch(e){try{unlinkSync(temp)}catch{}throw e;}
}
