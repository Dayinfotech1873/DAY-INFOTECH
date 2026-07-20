const fs = require('fs');
const content = fs.readFileSync('form_content.txt', 'utf8');

const blocks = content.split('{/* ================= ');

blocks.forEach(block => {
    if (!block.trim()) return;
    const name = block.split(' =================')[0];
    const lines = block.split('\n');
    let depth = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Count <div and </div (ignore self closing if any, but div is not self closing)
        const opens = (line.match(/<div/g) || []).length;
        const closes = (line.match(/<\/div/g) || []).length;
        
        depth += opens;
        depth -= closes;
        
        if (depth < 0) {
            console.log(`[${name}] Negative depth at line ${i}: ${line}`);
            break;
        }
    }
    console.log(`[${name}] Final depth: ${depth}`);
});
