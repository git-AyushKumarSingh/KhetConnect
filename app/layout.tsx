import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'KhetConnect | Fresh Direct AgriTech & B2B Marketplace (Pune)',
  description: 'Farm-fresh harvest direct from Pune growers with 5% lower prices than BigBasket & Instamart.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900 selection:bg-emerald-500 selection:text-white font-sans">
        <Navbar />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <CartDrawer />
        
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 font-display">KhetConnect Platform</span>
              <span>•</span>
              <span>Connecting Pune & Maharashtra Farmers Directly with Consumers & B2B Kitchens</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-emerald-700 font-semibold">🌱 100% Farm Fresh</span>
              <span>•</span>
              <span>⚡ Guaranteed 5% Lower than Supermarket Retail</span>
              <span>•</span>
              <span>🚚 Pune Regional Direct Dispatch</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
