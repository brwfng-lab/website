"use client";

import { useEffect, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    // Clear the cart when they successfully return from Paystack
    if (reference) {
      clearCart();
    }
  }, [reference, clearCart]);

  return (
    <div className="relative z-10 max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-10 text-center animate-in zoom-in-95 duration-500">
      <div className="mx-auto w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center mb-6">
        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
      </div>

      <h1 className="text-3xl font-thin tracking-tight text-slate-900 mb-4">Payment Successful!</h1>
      <p className="text-slate-500 font-light mb-8">
        Thank you for supporting Book Review With Friends. Your order has been received and is being processed.
      </p>

      {reference && (
        <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm">
          <p className="text-slate-400 font-medium uppercase tracking-wider text-xs mb-1">Transaction Reference</p>
          <p className="text-slate-700 font-mono">{reference}</p>
        </div>
      )}

      <Link 
        href="/merchandise" 
        className="inline-block w-full py-3 bg-slate-900 text-white font-light rounded-lg hover:bg-slate-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      <Suspense fallback={<div className="relative z-10">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
