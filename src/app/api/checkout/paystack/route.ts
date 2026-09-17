import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to checkout' }, { status: 401 });
    }

    const { items, total } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY is not set in environment variables');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // Paystack expects amount in Kobo (1 NGN = 100 Kobo)
    const amountInKobo = Math.round(total * 100);

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInKobo,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/merchandise/success`,
        metadata: {
          cart_items: items.map((i: any) => ({ id: i.id, quantity: i.quantity }))
        }
      })
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok) {
      throw new Error(paystackData.message || 'Failed to initialize transaction');
    }

    return NextResponse.json({ authorization_url: paystackData.data.authorization_url });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
