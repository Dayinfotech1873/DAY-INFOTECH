const fs = require('fs');
const content = fs.readFileSync('form_content.txt', 'utf8');

const stack = [];
const regex = /<\/?([a-zA-Z0-9]+)[^>]*?(\/?)>/g;

let match;
while ((match = regex.exec(content)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const isSelfClosing = match[2] === '/';
    const isClosing = fullTag.startsWith('</');

    // Skip self-closing tags and DocumentUploader, input, etc that might not strictly have /> but are self closing in HTML
    const selfClosingTags = ['input', 'img', 'br', 'hr', 'DocumentUploader', 'FileText', 'User', 'AlertTriangle', 'RefreshCw'];
    if (isSelfClosing || selfClosingTags.includes(tagName)) {
        continue;
    }

    if (isClosing) {
        const last = stack.pop();
        if (!last || last.name !== tagName) {
            console.log(`Mismatch! Expected ${last ? last.name : 'nothing'}, found closing ${tagName} at index ${match.index}. Tag: ${fullTag}`);
            break;
        }
    } else {
        stack.push({ name: tagName, index: match.index });
    }
}

if (stack.length > 0) {
    console.log(`Unclosed tags remaining: ${stack.map(s => s.name).join(', ')}`);
} else {
    console.log("All tags perfectly matched.");
}
