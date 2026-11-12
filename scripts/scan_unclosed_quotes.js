const fs = require('fs');
const path = 'c:/Users/USER/Documents/trae_projects/SURESPORTPICKS/frontend/src/pages/AdminPanel.jsx';
const s = fs.readFileSync(path, 'utf8');
const lines = s.split(/\r?\n/);
let inDouble = false, inSingle = false, inBacktick = false;
let lineOpenedDouble = -1, lineOpenedSingle = -1, lineOpenedBacktick = -1;
for (let i=0;i<lines.length;i++){
  const line = lines[i];
  for (let j=0;j<line.length;j++){
    const ch = line[j];
    const prev = j>0?line[j-1]:'\n';
    if (ch === '"' && !inSingle && !inBacktick) {
      if (prev !== '\\') {
        inDouble = !inDouble;
        if (inDouble) lineOpenedDouble = i+1; else lineOpenedDouble = -1;
      }
    } else if (ch === "'" && !inDouble && !inBacktick) {
      if (prev !== '\\') {
        inSingle = !inSingle;
        if (inSingle) lineOpenedSingle = i+1; else lineOpenedSingle = -1;
      }
    } else if (ch === '`' && !inSingle && !inDouble) {
      if (prev !== '\\') {
        inBacktick = !inBacktick;
        if (inBacktick) lineOpenedBacktick = i+1; else lineOpenedBacktick = -1;
      }
    }
  }
}
console.log('inDouble', inDouble, 'opened at', lineOpenedDouble);
console.log('inSingle', inSingle, 'opened at', lineOpenedSingle);
console.log('inBacktick', inBacktick, 'opened at', lineOpenedBacktick);
if (inDouble) console.log('Excerpt after opened double:', lines.slice(lineOpenedDouble-1, lineOpenedDouble+5).join('\n'));
if (inSingle) console.log('Excerpt after opened single:', lines.slice(lineOpenedSingle-1, lineOpenedSingle+5).join('\n'));
if (inBacktick) console.log('Excerpt after opened backtick:', lines.slice(lineOpenedBacktick-1, lineOpenedBacktick+5).join('\n'));
