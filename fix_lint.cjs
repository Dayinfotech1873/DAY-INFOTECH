const fs = require('fs');
let code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');
const lines = code.split('\n');
console.log(lines.find(l => l.includes('formType === \'OTHER_SERVICE\' && (')));
