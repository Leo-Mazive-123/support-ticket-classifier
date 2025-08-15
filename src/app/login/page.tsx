'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('Forgot Password?');
  const [resendMessage, setResendMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push('/');
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes('email not confirmed')) {
        setError('Please confirm your email first. Check your inbox.');
        setResendMessage('Resend confirmation email');
      } else {
        setError(error.message);
      }
      return;
    }

    // If login successful, check if email is confirmed
    if (data.user?.confirmation_sent_at && !data.user?.confirmed_at) {
      toast('Email successfully confirmed!', { icon: '✅', duration: 3000 });
    }

    toast.success('Login successful! Redirecting...', { duration: 2000 });
    setTimeout(() => router.push('/'), 2000);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email to reset password');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast.error(error.message);
    } else {
      setForgotMessage('Password reset email sent! Check your inbox.');
      toast.success('Password reset email sent!');
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) return;
    const { error } = await supabase.auth.signUp({ email, password: 'temporaryPassword123!' });
    if (error && error.message.includes('already registered')) {
      toast.success('Confirmation email resent! Check your inbox.');
    } else if (error) {
      toast.error(error.message);
    } else {
      toast.success('Confirmation email resent! Check your inbox.');
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Log In</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
              className={`
                absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 
                hover:text-gray-800 transition-transform duration-300 
                ${showPassword ? 'rotate-180' : 'rotate-0'}
                hover:scale-125
              `}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>

          {/* Forgot Password link */}
          <p
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer text-center mt-2"
          >
            {forgotMessage}
          </p>

          {/* Resend confirmation link */}
          {resendMessage && (
            <p
              onClick={handleResendConfirmation}
              className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer text-center mt-1"
            >
              {resendMessage}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
