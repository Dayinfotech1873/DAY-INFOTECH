const fs = require('fs');
let code = fs.readFileSync('src/utils/formDefaults.ts', 'utf8');
code = code.replace(/import\s*\{\s*NewBirthCertificateDetails[\s\S]*?from\s*'..\/types';\s*/g, '');
fs.writeFileSync('src/utils/formDefaults.ts', code);
