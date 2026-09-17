const fs = require('fs');
const path = require('path');

const clientFilePath = path.join(__dirname, 'src', 'components', 'DashboardClient.tsx');
let content = fs.readFileSync(clientFilePath, 'utf8');

if (content.includes('\\`')) {
  content = content.replace(/\\`/g, '`');
  fs.writeFileSync(clientFilePath, content);
  console.log('Fixed backticks in DashboardClient');
} else {
  console.log('No backticks to fix in DashboardClient');
}
