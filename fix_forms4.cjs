const fs = require('fs');
let code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');

const lines = code.split('\n');
const formContent = fs.readFileSync('form_content.txt', 'utf8');

// Replace lines 5390 (index 5390 is line 5391) to 5752 (index 5752 is line 5753)
const newLines = [
    ...lines.slice(0, 5390),
    formContent,
    ...lines.slice(5753)
];

fs.writeFileSync('src/components/FormRenderer.tsx', newLines.join('\n'));
console.log("Successfully replaced lines 5391 to 5753");
