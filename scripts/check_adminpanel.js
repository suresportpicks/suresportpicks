const fs = require('fs');
const path = 'c:/Users/USER/Documents/trae_projects/SURESPORTPICKS/frontend/src/pages/AdminPanel.jsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
const upTo = 2210;
const slice = lines.slice(0, upTo).join('\n');
function count(str, sub) { return (str.split(sub).length - 1); }
console.log('Lines in file:', lines.length);
console.log('Counting up to line', upTo);
console.log('Backticks:', count(slice, '`'));
console.log("Single quotes:", count(slice, "'"));
console.log('Double quotes:', count(slice, '"'));
console.log('Block comment opens /*:', count(slice, '/*'));
console.log('Block comment closes */:', count(slice, '*/'));
console.log('Number of < and > up to line:', count(slice, '<'), count(slice, '>'));

// Show the exact snippet around the reported error (lines 2195-2215)
const start = 2195; const end = 2215;
console.log('\n--- File excerpt lines ' + start + ' to ' + end + ' ---');
for (let i = start; i <= end && i <= lines.length; i++) {
  const l = lines[i-1];
  const idx = (i === 2210) ? '>>' : '  ';
  console.log((('    ' + i).slice(-6)) + ' ' + idx + ' ' + l);
}
