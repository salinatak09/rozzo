import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import LocationModal from '../components/LocationModal';

export const metadata: Metadata = {
  title: 'Rozzo - Everyday Tiffin | Affordable Homestyle Meals & Subscriptions',
  description:
    'Fresh, home-cooked daily tiffin subscriptions in Bengaluru. Phulkas made with pure wheat and desi ghee, comforting dals, and rotatable menus delivered to your PG or office.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FCFAF6] text-stone-900 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
        <AppProvider>
          <Header />
          <LocationModal />
          <main className="flex-1 pb-20 md:pb-12">{children}</main>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
