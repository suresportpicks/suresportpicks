const fs = require('fs');
const path = 'c:/Users/USER/Documents/trae_projects/SURESPORTPICKS/frontend/src/pages/AdminPanel.jsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
const start = 2196; const end = 2202;
for (let i = start; i <= end; i++) {
  const l = lines[i-1];
  console.log('Line', i, 'len', l.length);
  const codes = [];
  for (let j=0;j<l.length;j++) {
    const c = l.charCodeAt(j);
    codes.push((c<32?'<'+c+'>':String.fromCharCode(c)));
  }
  console.log(l);
  console.log('Chars:', codes.join(' '));
  console.log('---');
}
