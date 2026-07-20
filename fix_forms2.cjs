const fs = require('fs');
let code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');

const startMarker = "{/* ================= NEW BIRTH CERTIFICATE ================= */}";
const endMarker = "{/* ================= OTHER SERVICE ================= */}";

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  // Found them, let's look for where the actual line starts for startMarker
  const actualStartIndex = code.lastIndexOf("        {/* ================= NEW BIRTH CERTIFICATE", startIndex) || startIndex;
  const actualEndIndex = code.lastIndexOf("        {/* ================= OTHER SERVICE", endIndex) || endIndex;
  console.log("Found indices:", actualStartIndex, actualEndIndex);
} else {
  // Let's try matching with flexible whitespace
  const startRegex = /\{\/\*\s*=================\s*NEW BIRTH CERTIFICATE\s*=================\s*\*\/\}/;
  const endRegex = /\{\/\*\s*=================\s*OTHER SERVICE\s*=================\s*\*\/\}/;
  const startMatch = code.match(startRegex);
  const endMatch = code.match(endRegex);
  if (startMatch && endMatch) {
    console.log("Matched with regex at:", startMatch.index, endMatch.index);
    const formContent = fs.readFileSync('form_content.txt', 'utf8');
    code = code.substring(0, startMatch.index) + formContent + "\n        " + code.substring(endMatch.index);
    fs.writeFileSync('src/components/FormRenderer.tsx', code);
    console.log("Successfully replaced the forms using regex.");
  } else {
    console.log("Could not find markers with regex either.");
  }
}
