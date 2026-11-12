const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'frontend', 'src', 'pages', 'AdminPanel.jsx');
const text = fs.readFileSync(file, 'utf8');
let inSingle=false, inDouble=false, inBacktick=false, inBlock=false, inLine=false;
let line=1, col=0;
const slashes = [];
for(let i=0;i<text.length;i++){
  const ch=text[i];
  const prev = text[i-1] || '';
  const next=text[i+1] || '';
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
  // record slash if not in string/comment and not part of a closing tag </
  if(ch==='/' && !inSingle && !inDouble && !inBacktick && !inBlock && !inLine){
    const prevNonSpace = (() => {let k=i-1; while(k>=0 && /\s/.test(text[k])) k--; return text[k] || ''})();
    const nextNonSpace = (() => {let k=i+1; while(k<text.length && /\s/.test(text[k])) k++; return text[k] || ''})();
    if(prevNonSpace !== '<'){
      slashes.push({i, line, col, prev: prevNonSpace, next: nextNonSpace});
    }
  }
}
console.log('Found', slashes.length, 'potential problematic slashes (not closing tags). Sample:');
console.log(slashes.slice(0,50));
for(const s of slashes){
  if(s.line>=2180 && s.line<=2220){
    console.log('Problematic slash near', s.line, s.col, 'prev=', s.prev, 'next=', s.next);
    break;
  }
}
