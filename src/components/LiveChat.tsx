'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Send } from 'lucide-react'

type Message = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles?: { display_name: string }
}

export default function LiveChat({ subgroupId, themeColorClass }: { subgroupId: string, themeColorClass: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id)
    })

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('subgroup_messages')
        .select('*, profiles(display_name)')
        .eq('subgroup_id', subgroupId)
        .order('created_at', { ascending: true })
        .limit(50)
      
      if (data) setMessages(data)
    }
    
    fetchMessages()

    // Subscribe to real-time
    const channel = supabase
      .channel(`room:${subgroupId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'subgroup_messages', filter: `subgroup_id=eq.${subgroupId}` },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', payload.new.user_id).single()
          const newMsg = { ...payload.new, profiles: profile } as Message
          setMessages(prev => [...prev, newMsg])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [subgroupId, supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUserId) return

    const { error } = await supabase.from('subgroup_messages').insert({
      subgroup_id: subgroupId,
      user_id: currentUserId,
      content: newMessage.trim()
    })

    if (error) {
      alert("Failed to send message: " + error.message)
    } else {
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 font-light mt-20">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === currentUserId
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-slate-400 font-light mb-1 px-1">
                  {isMe ? 'You' : msg.profiles?.display_name || 'Anonymous'}
                </span>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm font-light ${
                  isMe 
                    ? `${themeColorClass.replace('text-', 'bg-')} text-white rounded-tr-sm` 
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm font-light focus:outline-none focus:border-slate-400"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-50 ${themeColorClass.replace('text-', 'bg-')}`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
