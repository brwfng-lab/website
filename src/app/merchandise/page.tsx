import { createClient } from '@/utils/supabase/server';
import MerchGrid from '@/components/MerchGrid';

export const metadata = {
  title: 'Merchandise - Book Reviews With Friends',
  description: 'Official community merchandise.',
};

export const revalidate = 0;

export default async function MerchandisePage() {
  const supabase = await createClient();
  const { data: merchandise } = await supabase.from('merchandise').select('*').order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-thin tracking-tight text-slate-900 mb-4">
            The <span className="font-normal italic text-blue-600">Store</span>
          </h1>
          <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">
            Show your love for reading with our official community merchandise. All proceeds go towards funding club activities and keeping our servers running.
          </p>
        </div>

        {merchandise && merchandise.length > 0 ? (
          <MerchGrid products={merchandise} />
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-light text-lg">Our shelves are currently empty. Check back soon for new drops!</p>
          </div>
        )}
      </div>
    </div>
  );
}
