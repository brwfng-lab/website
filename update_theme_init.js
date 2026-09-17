/* eslint-disable */
const fs = require('fs');
const path = require('path');

const clientFilePath = path.join(__dirname, 'src', 'components', 'DashboardClient.tsx');
let content = fs.readFileSync(clientFilePath, 'utf8');

content = content.replace(
  "if (saved && themeClasses[saved]) setThemeColor(saved);",
  "if (profile?.theme_color && themeClasses[profile.theme_color]) {\n      setThemeColor(profile.theme_color);\n    } else if (saved && themeClasses[saved]) {\n      setThemeColor(saved);\n    }"
);

fs.writeFileSync(clientFilePath, content);
console.log('Fixed theme init');
