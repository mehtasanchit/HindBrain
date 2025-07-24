import { string } from "zod";

export function random(len:number){
    const options="abcdefghijklmnopqrstuvwxyz1234567890";
    const oplen=options.length;
    let ans="";
    for(let i=0;i<oplen;i++){
        ans+=options[Math.floor(Math.random()*oplen)];
    }
    return ans;
}