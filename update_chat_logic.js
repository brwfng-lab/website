/* eslint-disable */
const fs = require('fs');
const path = require('path');

const clientFilePath = path.join(__dirname, 'src', 'components', 'DashboardClient.tsx');
let content = fs.readFileSync(clientFilePath, 'utf8');

// Add import
if (!content.includes("import LiveChat")) {
  content = content.replace("import ReadingChart from './ReadingChart';", "import ReadingChart from './ReadingChart';\nimport LiveChat from './LiveChat';");
}

// Add state
if (!content.includes("const [activeGroup, setActiveGroup]")) {
  content = content.replace("const [activeTab, setActiveTab] = useState('overview');", "const [activeTab, setActiveTab] = useState('overview');\n  const [activeGroup, setActiveGroup] = useState<string | null>(null);");
}

// Replace subgroups tab render block
const newSubgroupsRender = `
            {/* Sub-Groups Tab */}
            {activeTab === 'subgroups' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                      <Layers className={\`w-8 h-8 \${currentTheme.text}\`} />
                      {activeGroup ? activeGroup.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Sub-Groups I'm In"}
                    </h1>
                    <p className="text-slate-500 font-light">
                      {activeGroup ? "Live Chat Room" : "Smaller, niche reading circles within the main club."}
                    </p>
                  </div>
                  {activeGroup ? (
                    <button onClick={() => setActiveGroup(null)} className={\`px-4 py-2 rounded-lg text-sm font-light text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50\`}>
                      Leave Chat
                    </button>
                  ) : (
                    <button className={\`px-4 py-2 rounded-lg text-sm font-light text-white shadow-sm \${currentTheme.bg} hover:opacity-90\`}>
                      Browse All Groups
                    </button>
                  )}
                </div>

                {activeGroup ? (
                  <LiveChat subgroupId={activeGroup} themeColorClass={currentTheme.text} />
                ) : (
                  <div className="space-y-4">
                    {[
                      { id: 'scifi-geeks', name: 'The Sci-Fi Geeks', members: 12, activity: 'Very Active', desc: 'Exploring the outer limits of space and time.' },
                      { id: 'nonfiction-nerds', name: 'Non-Fiction Nerds', members: 34, activity: 'Active', desc: 'Biographies, history, and wealth creation.' },
                      { id: 'fantasy-realm', name: 'Fantasy Realm', members: 56, activity: 'Active', desc: 'Dragons, magic, and epic quests.' },
                    ].map((group, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center hover:border-slate-300 transition-colors">
                        <div className={\`w-16 h-16 rounded-xl flex items-center justify-center \${currentTheme.light} \${currentTheme.text}\`}>
                          <Layers className="w-8 h-8" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-xl font-light text-slate-900 mb-1">{group.name}</h3>
                          <p className="text-sm text-slate-500 font-light mb-2">{group.desc}</p>
                          <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-400 font-light">
                            <span>{group.members} Members</span>
                            <span>&bull;</span>
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span> {group.activity}</span>
                          </div>
                        </div>
                        <button onClick={() => setActiveGroup(group.id)} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-light text-slate-600 hover:bg-slate-50 transition-colors w-full md:w-auto">
                          Enter Chat
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
`;

content = content.replace(/\{\/\* Sub-Groups Tab \*\/\}.*?\{\/\* Appearance Tab \*\/\}/s, newSubgroupsRender + "\n\n            {/* Appearance Tab */}");

fs.writeFileSync(clientFilePath, content);
console.log('Hooked up LiveChat to DashboardClient');
