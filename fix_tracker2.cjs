const fs = require('fs');
let code = fs.readFileSync('src/components/ApplicationTracker.tsx', 'utf8');

code = code.replace("{\n    {\n    type: 'NEW_BIRTH_CERTIFICATE',", "{\n    type: 'NEW_BIRTH_CERTIFICATE',");

fs.writeFileSync('src/components/ApplicationTracker.tsx', code);
