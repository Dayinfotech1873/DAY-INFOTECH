const fs = require('fs');
const content = fs.readFileSync('form_content.txt', 'utf8');

const blocks = content.split('{/* ================= ');

blocks.forEach(block => {
    if (!block.trim()) return;
    const name = block.split(' =================')[0];
    const lines = block.split('\n');
    let depth = 0;
    
    // find the first line with <div
    let started = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        const opens = (line.match(/<div/g) || []).length;
        const closes = (line.match(/<\/div/g) || []).length;
        
        if (!started && opens > 0) started = true;
        
        depth += opens;
        depth -= closes;
        
        if (started && depth === 0 && i < lines.length - 3) {
            console.log(`[${name}] Depth reached 0 prematurely at line ${i}: ${line}`);
        }
    }
});
