'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !fullName) return setError('All fields are required');

    // Sign up user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) return setError(signUpError.message);
    if (!data.user) return setError('Signup failed');

    // Insert user info into public.users (integer user_id)
    const { error: insertError } = await supabase.from('users').insert({
      name: fullName,
      email,
      password: '', // do NOT store raw passwords
    });
    if (insertError) return setError(insertError.message);
  };

  return (
    <main
      className="flex justify-center items-center h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/robot.png')" }}
    >
      <Link href="/" className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300">
        ×
      </Link>

      <div className="bg-white bg-opacity-80 p-8 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Sign Up</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-500"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
}
