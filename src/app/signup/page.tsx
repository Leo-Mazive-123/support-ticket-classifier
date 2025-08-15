'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword || !fullName) {
      return setError('All fields are required');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      // Sign up user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          return setError('User already exists. Please login instead.');
        }
        return setError(signUpError.message);
      }

      if (!data.user) return setError('Signup failed');

      // Insert user info into public.users
      const { error: insertError } = await supabase.from('users').insert({
        name: fullName,
        email,
        password: '',
      });

      if (insertError) {
        // Friendly message for duplicate email
        if (insertError.message.includes('duplicate key value violates unique constraint "users_email_key"')) {
          return setError('User already exists. Please login instead.');
        }
        return setError(insertError.message);
      }

      // Show success toast
      toast.success('Signup successful! Redirecting to login...', {
        duration: 3000,
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (_err: unknown) {
      setError('An unexpected error occurred.');
      console.error('Signup error:', _err);
    }
  };

  return (
    <main
      className="flex justify-center items-center h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/robot.png')" }}
    >
      <Toaster position="top-right" reverseOrder={false} />

      <Link href="/" className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300">
        ×
      </Link>

      <div className="bg-white bg-opacity-80 p-8 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Sign Up</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <input
            className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-500"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* Email */}
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-500 pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 
                hover:text-gray-800 transition-transform duration-300 
                ${showPassword ? 'rotate-180' : 'rotate-0'} hover:scale-125`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-500 pr-10"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 
                hover:text-gray-800 transition-transform duration-300 
                ${showConfirmPassword ? 'rotate-180' : 'rotate-0'} hover:scale-125`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
}
