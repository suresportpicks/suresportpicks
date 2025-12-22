const fs = require('fs');
const esbuild = require('c:/Users/USER/Documents/trae_projects/SURESPORTPICKS/frontend/node_modules/esbuild');
const path = 'c:/Users/USER/Documents/trae_projects/SURESPORTPICKS/frontend/src/pages/AdminPanel.jsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
let low = 1, high = lines.length, failAt = -1;
while (low <= high) {
  const mid = Math.floor((low + high) / 2);
  const slice = lines.slice(0, mid).join('\n');
  try {
    esbuild.transformSync(slice, { loader: 'jsx', sourcemap: false });
    // parses fine up to mid
    low = mid + 1;
  } catch (err) {
    // parse failed within first mid lines
    failAt = mid;
    high = mid - 1;
  }
}
console.log('First failing line (approx):', failAt);
console.log('Excerpt around failing line:');
for (let i = Math.max(1, failAt-5); i <= Math.min(lines.length, failAt+5); i++) {
  console.log((('   '+i).slice(-4)) + ' | ' + lines[i-1]);
}
