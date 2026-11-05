import {execFileSync} from 'node:child_process';
import {imageSources, stockImageUrl} from '../public/image-sources.js';
import {mkdirSync,renameSync,readFileSync,unlinkSync} from 'node:fs';
mkdirSync('public/images',{recursive:true});
for(const name of Object.keys(imageSources)){
 const target=`public/images/${name}.jpg`,temp=target+'.tmp';
 try{execFileSync('curl',['--fail','--location','--max-time','45','--silent','--show-error',stockImageUrl(name),'-o',temp],{stdio:'inherit'});const b=readFileSync(temp);if(b[0]!==255||b[1]!==216)throw Error('Not a JPEG');renameSync(temp,target);console.log(`Downloaded ${target}`);}catch(e){try{unlinkSync(temp)}catch{}throw e;}
}
