'use client';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['700', '900'],
  subsets: ['latin'],
});

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav
      className="bg-blue-600 text-white px-4 h-20 flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-md"
    >
      <div className={`text-2xl font-extrabold tracking-wide ${poppins.className}`}>
        <Link href="/">Support Ticket System</Link>
      </div>
      <div className="space-x-7">
        <Link href="/" className="hover:text-gray-200">Home</Link>
        <Link href="/about" className="hover:text-gray-200">About</Link>
        <Link href="/submit" className="hover:text-gray-200">Submit</Link>
        <Link href="/history" className="hover:text-gray-200">History</Link>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
