// 'use client';
// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import Navbar from '@/components/Navbar';

// export default function HomePage() {
//   const [userName, setUserName] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserName = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data, error } = await supabase
//         .from('users')
//         .select('name')
//         .eq('email', user.email)
//         .single();

//       if (error) {
//         console.error('Error fetching user name:', error.message);
//         return;
//       }

//       setUserName(data?.name || user.email);
//     };

//     fetchUserName();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <main className="flex flex-col justify-center items-center min-h-screen p-6 bg-cover bg-center" style={{ backgroundImage: "url('/tech.png')" }}>
//         <h1 className="text-4xl font-bold mb-6 text-white">Welcome {userName ? userName : 'Guest'}</h1>
//         {!userName && (
//           <div className="space-x-4">
//             <a href="/signup" className="bg-blue-500 px-6 py-3 rounded text-white hover:bg-blue-600">Sign Up</a>
//             <a href="/login" className="bg-green-500 px-6 py-3 rounded text-white hover:bg-green-600">Log In</a>
//           </div>
//         )}
//       </main>
//     </>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('email', user.email)
        .maybeSingle(); // changed from .single()

      if (error) {
        console.error('Error fetching user name:', error.message);
        return;
      }

      setUserName(data?.name || user.email);
    };

    fetchUserName();
  }, []);

  return (
    <>
      <Navbar />
      <main
        className="flex flex-col justify-center items-center min-h-screen p-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/tech.png')" }}
      >
        <h1 className="text-4xl font-bold mb-6 text-white">
          Welcome {userName ? userName : 'Guest'}
        </h1>
        {!userName && (
          <div className="space-x-4">
            <a
              href="/signup"
              className="bg-blue-500 px-6 py-3 rounded text-white hover:bg-blue-600"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="bg-green-500 px-6 py-3 rounded text-white hover:bg-green-600"
            >
              Log In
            </a>
          </div>
        )}
      </main>
    </>
  );
}
