const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'frontend', 'src', 'pages', 'AdminPanel.jsx');
const text = fs.readFileSync(file, 'utf8');
let inSingle=false, inDouble=false, inBacktick=false, inBlock=false, inLine=false;
let line=1, col=0;
const slashes = [];
for(let i=0;i<text.length;i++){
  const ch=text[i];
  const next=text[i+1];
  if(ch==='\n'){ line++; col=0; inLine=false; continue; }
  col++;
  if(inLine){ continue; }
  if(inBlock){ if(ch==='*' && next==='/' ){ inBlock=false; i++; col++; continue; } else continue; }
  // detect comment start
  if(!inSingle && !inDouble && !inBacktick){
    if(ch==='/' && next==='*'){ inBlock=true; i++; col++; continue; }
    if(ch==='/' && next==='/'){ inLine=true; i++; col++; continue; }
  }
  // toggle quotes
  if(ch==='"' && !inSingle && !inBacktick){ let esc=false; let j=i-1; while(j>=0 && text[j]==='\\'){ esc=!esc; j--; } if(!esc) inDouble=!inDouble; }
  else if(ch==="'" && !inDouble && !inBacktick){ let esc=false; let j=i-1; while(j>=0 && text[j]==='\\'){ esc=!esc; j--; } if(!esc) inSingle=!inSingle; }
  else if(ch==='`' && !inSingle && !inDouble){ let esc=false; let j=i-1; while(j>=0 && text[j]==='\\'){ esc=!esc; j--; } if(!esc) inBacktick=!inBacktick; }
  // record slash if not in string/comment
  if(ch==='/' && !inSingle && !inDouble && !inBacktick && !inBlock && !inLine){
    slashes.push({i, line, col, next});
  }
}
console.log('Found', slashes.length, 'slashes outside strings/comments. Sample:');
console.log(slashes.slice(0,50));
// print the nearby lines for any slashes around target region
const lines = text.split(/\r?\n/);
for(const s of slashes.slice(0,200)){
  if(s.line>=2180 && s.line<=2220){
    console.log('Slash near', s.line, s.col, 'next=', s.next);
    const ctxStart=Math.max(0,s.line-3-1);
    for(let k=ctxStart;k<Math.min(lines.length, s.line+3);k++){
      console.log((k+1)+': '+lines[k]);
    }
    break;
  }
}
