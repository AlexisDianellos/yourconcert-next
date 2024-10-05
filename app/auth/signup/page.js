'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignUp() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/auth/signin');
    } else {
      setError(data.error);
    }
  };

  return (
      <div className="flex h-screen justify-center items-start">
      <div className="w-full max-w-md p-8 text-center  border-gray-500">
        <h1 className="text-4xl font-bold">YourConcert</h1>
        <p className="mt-3 mb-10 text-gray-300 text-lg">Sign up to start reviewing concerts<br/> and guiding other music enthusiasts.</p>

        <div>
          <button onClick={() => signIn('google',{callbackUrl:'/'})} className="px-3">
            <FcGoogle size={40}/>
          </button>
          <button onClick={() => signIn('github',{callbackUrl:'/'})} className="px-3">
            <FaGithub size={40}/>
          </button>
        </div>
          
        <div class="flex items-center my-4">
          <hr class="flex-grow border-t border-gray-300" />
          <span class="mx-2 font-semibold">OR</span>
          <hr class="flex-grow border-t border-gray-300" />
        </div>

        <form className="space-y-7" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              className="w-full rounded-2xl px-4 py-2 focus:outline-none text-white bg-blue-800 placeholder-gray-300"
              placeholder='Username'
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="email"
              className="w-full rounded-2xl px-4 py-2 focus:outline-none text-white bg-blue-800 placeholder-gray-300"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              className="w-full rounded-2xl px-4 py-2 focus:outline-none text-white bg-blue-800 placeholder-gray-300"
              placeholder='Password'
              required
            />
          </div>
          <div className='flex justify-center'>
            <p className='mr-1'>Already on YourConcert?</p>
            <Link href="/auth/signin" className='text-blue-400 hover:text-blue-300'>Login</Link>
          </div>
          <button type="submit" className="w-full bg-blue-900 rounded-2xl py-3 font-semibold text-white hover:bg-blue-800 transition-colors duration-300">Register</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
