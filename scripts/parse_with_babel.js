const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const file = path.resolve(__dirname, '..', 'frontend', 'src', 'pages', 'AdminPanel.jsx');
const code = fs.readFileSync(file, 'utf8');
try{
  const ast = parser.parse(code, {sourceType:'module', plugins:['jsx','classProperties','optionalChaining','nullishCoalescingOperator']});
  console.log('Parsed OK');
} catch (err){
  console.error('Parse error:', err.message);
  console.error(err.loc);
}
