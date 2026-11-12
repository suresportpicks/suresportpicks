const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'frontend', 'src', 'pages', 'AdminPanel.jsx');
const text = fs.readFileSync(file, 'utf8');
const lines = text.split(/\r?\n/);
const target = 2209;
const start = Math.max(0, target-6-1);
const end = Math.min(lines.length, target+6);
for(let i=start;i<end;i++){
  const n=i+1;
  console.log('Line', n, ':', lines[i]);
  const chars = lines[i].split('').map(c=> c.charCodeAt(0));
  console.log(chars.join(' '));
}
