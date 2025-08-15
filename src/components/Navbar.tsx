'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Poppins } from 'next/font/google';
import { Menu, X } from 'lucide-react';

const poppins = Poppins({
  weight: ['700', '900'],
  subsets: ['latin'],
});

type User = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 text-white fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className={`text-2xl font-extrabold tracking-wide flex items-center ${poppins.className}`}>
            <Link href="/">Support Ticket System</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-7">
            <Link href="/" className="hover:text-blue-200 transition">Home</Link>
            <Link href="/about" className="hover:text-blue-200 transition">About</Link>
            <Link href="/submit" className="hover:text-blue-200 transition">Submit</Link>
            <Link href="/history" className="hover:text-blue-200 transition">History</Link>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 animate-slide-down">
          <div className="px-4 py-3 flex flex-col items-center space-y-3">
            <Link href="/" className="block hover:text-blue-200">Home</Link>
            <Link href="/about" className="block hover:text-blue-200">About</Link>
            <Link href="/submit" className="block hover:text-blue-200">Submit</Link>
            <Link href="/history" className="block hover:text-blue-200">History</Link>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500 w-full px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
