const fs = require('fs');
const path = require('path');

const clientFilePath = path.join(__dirname, 'src', 'components', 'LiveChat.tsx');
let content = fs.readFileSync(clientFilePath, 'utf8');

content = content.replace(/\\`/g, '`');

fs.writeFileSync(clientFilePath, content);
console.log('Fixed backticks in LiveChat');
