const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'frontend', 'src', 'pages', 'AdminPanel.jsx');
const text = fs.readFileSync(file, 'utf8');
let brace=0, paren=0, angle=0;
const lines = text.split(/\r?\n/);
for(let i=0;i<lines.length;i++){
  const line = lines[i];
  for(let j=0;j<line.length;j++){
    const ch = line[j];
    if(ch==='{') brace++;
    if(ch==='}') brace--;
    if(ch==='(') paren++;
    if(ch===')') paren--;
    // angle brackets count is noisy due to JSX; skip
  }
  if((i+1) % 100 === 0 || Math.abs(brace) > 2 || Math.abs(paren) > 2){
    console.log('line', i+1, 'brace=', brace, 'paren=', paren, '->', line);
  }
}
console.log('final counts brace=', brace, 'paren=', paren);
// print lines around 2209
const target=2209;
const start=Math.max(0,target-10-1);
const end=Math.min(lines.length, target+10);
console.log('--- lines', start+1, 'to', end, '---');
for (let i=start;i<end;i++){
  const n=i+1;
  console.log((n===target? '>>':'  ')+String(n).padStart(5)+': '+lines[i]);
}
