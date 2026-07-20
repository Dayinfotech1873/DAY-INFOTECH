const fs = require('fs');
let code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');

const startStr = "{/* ================= NEW BIRTH CERTIFICATE ================= */}";
const endStr = "{/* ================= OTHER SERVICE ================= */}";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const actualStart = code.lastIndexOf("\n", startIndex);
    const formContent = fs.readFileSync('form_content.txt', 'utf8');
    
    code = code.substring(0, actualStart) + "\n        " + formContent + "\n        " + code.substring(endIndex);
    fs.writeFileSync('src/components/FormRenderer.tsx', code);
    console.log("Successfully replaced forms.");
} else {
    console.log("Could not find markers.");
}
