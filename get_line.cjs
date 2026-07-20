const fs = require('fs');
let code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');
const lines = code.split('\n');
const targetLine = lines.findIndex(l => l.includes("formType === 'OTHER_SERVICE'"));
console.log('Line number: ' + targetLine);
