'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', pages: 300 },
  { month: 'Feb', pages: 450 },
  { month: 'Mar', pages: 320 },
  { month: 'Apr', pages: 500 },
  { month: 'May', pages: 620 },
  { month: 'Jun', pages: 480 },
  { month: 'Jul', pages: 800 },
  { month: 'Aug', pages: 600 }
]

export default function ReadingChart({ themeColorClass }: { themeColorClass: string }) {
  // Extract a rough hex color based on the theme word to pass into Recharts
  // Since Recharts uses SVG standard colors, we map our Tailwind classes to hex
  let strokeColor = '#3b82f6' // default blue
  let fillColor = '#dbeafe'

  if (themeColorClass.includes('rose')) {
    strokeColor = '#f43f5e'
    fillColor = '#ffe4e6'
  } else if (themeColorClass.includes('emerald')) {
    strokeColor = '#10b981'
    fillColor = '#d1fae5'
  } else if (themeColorClass.includes('violet')) {
    strokeColor = '#8b5cf6'
    fillColor = '#ede9fe'
  } else if (themeColorClass.includes('slate')) {
    strokeColor = '#475569'
    fillColor = '#f1f5f9'
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 300 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 300 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: strokeColor, fontWeight: 300 }}
            labelStyle={{ color: '#64748b', fontWeight: 300, marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="pages" 
            stroke={strokeColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPages)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
