const fs = require('fs');
const esbuild = require('esbuild');
const path = 'c:/Users/USER/Documents/trae_projects/SURESPORTPICKS/frontend/src/pages/AdminPanel.jsx';
const src = fs.readFileSync(path, 'utf8');
try {
  esbuild.transformSync(src, { loader: 'jsx', sourcemap: true, sourcefile: path });
  console.log('esbuild parsed file successfully');
} catch (err) {
  console.error('esbuild failed with error:');
  console.error(err.message);
  if (err.errors) console.error(err.errors);
}
