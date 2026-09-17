const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => { const [k,v] = line.split('='); if (k && v) acc[k.trim()] = v.trim(); return acc; }, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const tables = ['profiles', 'books', 'events', 'rsvps', 'club_settings', 'merchandise'];
  const schema = {};
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) console.error(error);
    else schema[table] = data;
  }
  fs.writeFileSync('bwrf_data.json', JSON.stringify(schema, null, 2));
  console.log('Exported data to bwrf_data.json');
}
run();
