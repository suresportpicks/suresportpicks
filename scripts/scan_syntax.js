const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'frontend', 'src', 'pages', 'AdminPanel.jsx');
const text = fs.readFileSync(file, 'utf8');
let inSingle=false, inDouble=false, inBacktick=false, inBlockComment=false, inLineComment=false;
let line=1, col=0;
for (let i=0;i<text.length;i++){
  const ch = text[i];
  const next = text[i+1];
  if (ch==='\n'){
    line++; col=0; inLineComment=false; continue;
  }
  col++;

  if (inLineComment){ continue; }
  if (inBlockComment){
    if (ch==='*' && next==='/' ) { inBlockComment=false; i++; col++; }
    continue;
  }

  if (!inSingle && !inDouble && !inBacktick){
    if (ch==='/' && next==='*'){ inBlockComment=true; i++; col++; continue; }
    if (ch==='/' && next==='/'){ inLineComment=true; i++; col++; continue; }
  }

  if (ch==='"' && !inSingle && !inBacktick){
    // check escaped
    let esc=false; let j=i-1; while(j>=0 && text[j]==='\\'){ esc=!esc; j--; }
    if(!esc) inDouble=!inDouble;
  } else if (ch==="'" && !inDouble && !inBacktick){
    let esc=false; let j=i-1; while(j>=0 && text[j]==='\\'){ esc=!esc; j--; }
    if(!esc) inSingle=!inSingle;
  } else if (ch==='`' && !inSingle && !inDouble){
    let esc=false; let j=i-1; while(j>=0 && text[j]==='\\'){ esc=!esc; j--; }
    if(!esc) inBacktick=!inBacktick;
  }
}

console.log('inSingle=', inSingle, 'inDouble=', inDouble, 'inBacktick=', inBacktick, 'inBlockComment=', inBlockComment);

// Also print nearby lines around 2209
const lines = text.split(/\r?\n/);
const target=2209;
const start=Math.max(0,target-10-1);
const end=Math.min(lines.length, target+10);
console.log('--- lines', start+1, 'to', end, '---');
for (let i=start;i<end;i++){
  const n=i+1;
  console.log((n===target? '>>':'  ')+String(n).padStart(5)+': '+lines[i]);
}
