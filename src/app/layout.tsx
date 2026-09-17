import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Review With Friends",
  description: "A community book club",
};

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let clubName = undefined;
  let clubTagline = undefined;
  let isDashboard = false;
  
  try {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    isDashboard = host.startsWith('admin.') || host.startsWith('member.');
    
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await supabase.from('club_settings').select('club_name, club_tagline').eq('id', 1).single();
    if (data) {
      clubName = data.club_name;
      clubTagline = data.club_tagline;
    }
  } catch (e) {
    console.error(e)
  }

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 font-light overflow-x-hidden`}>
        <CartProvider>
          <SiteLayoutWrapper clubName={clubName} clubTagline={clubTagline} isDashboard={isDashboard}>
            {children}
          </SiteLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
