/* eslint-disable */
const fs = require('fs');
const path = require('path');

const clientFilePath = path.join(__dirname, 'src', 'components', 'DashboardClient.tsx');
let content = fs.readFileSync(clientFilePath, 'utf8');

// Inject handleThemeChange function
const handleThemeFunc = `
  const handleThemeChange = async (color: string) => {
    setThemeColor(color);
    localStorage.setItem('brwf_theme_color', color);
    
    // Save to DB if profile exists
    try {
      await updateThemePreference(color);
    } catch (e) {
      console.error("Failed to save theme to DB", e);
    }
  };
`;
content = content.replace('const supabase = createClient();', 'const supabase = createClient();\n' + handleThemeFunc);

// Replace onClick hooks
content = content.replace(/onClick=\{\(\) => \{\n\s*setThemeColor\(key\);\n\s*localStorage.setItem\('brwf_theme_color', key\);\n\s*\}\}/g, 'onClick={() => handleThemeChange(key)}');

fs.writeFileSync(clientFilePath, content);
console.log('Updated theme logic');
