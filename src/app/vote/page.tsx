import { createClient } from '@/utils/supabase/server'
import VoteButton from './VoteButton'

export const revalidate = 0;

export default async function VotePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch nominated books
  const { data: nominatedBooks } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'nominated')

  // Fetch votes count
  const { data: votesData } = await supabase
    .from('votes')
    .select('book_id, user_id')

  const voteCounts: Record<string, number> = {}
  const userVotes = new Set<string>()

  votesData?.forEach((v) => {
    voteCounts[v.book_id] = (voteCounts[v.book_id] || 0) + 1
    if (user && v.user_id === user.id) {
      userVotes.add(v.book_id)
    }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light text-slate-900 mb-4">Vote for the Next Book</h1>
        <p className="text-slate-500 font-light">Review the nominations and cast your vote.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {nominatedBooks?.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:border-slate-300 transition-colors">
            {book.cover_image_url && (
              <img 
                src={book.cover_image_url} 
                alt={book.title}
                className="w-full h-64 object-cover rounded-md mb-4 shadow-sm"
              />
            )}
            <h2 className="text-xl font-light text-slate-900 mb-1">{book.title}</h2>
            <p className="text-slate-500 font-light mb-6 flex-1 text-sm">by {book.author}</p>
            
            <VoteButton 
              bookId={book.id}
              hasVoted={userVotes.has(book.id)}
              initialCount={voteCounts[book.id] || 0}
            />
          </div>
        ))}
      </div>
      
      {(!nominatedBooks || nominatedBooks.length === 0) && (
        <div className="text-center text-slate-400 py-12 font-light">
          No books currently nominated for voting.
        </div>
      )}
    </div>
  )
}
