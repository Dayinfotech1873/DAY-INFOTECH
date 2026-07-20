const fs = require('fs');

const content = fs.readFileSync('form_content.txt', 'utf8');
const blocks = content.split('{/* ================= ');

blocks.forEach(block => {
    if (!block.trim()) return;
    const name = block.split(' =================')[0];
    const openDivs = (block.match(/<div/g) || []).length;
    const closeDivs = (block.match(/<\/div/g) || []).length;
    console.log(`${name}: open=${openDivs}, close=${closeDivs}`);
});
