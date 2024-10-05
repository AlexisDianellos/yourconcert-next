'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from 'react';

export default function SignIn() {

  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
    });

    if (res.ok) {
      router.push('/');
    } else {
      setError(res.error);
    }
  };

  return (
      <div className="flex h-screen justify-center items-start">
      <div className="w-full max-w-md p-8 text-center  border-gray-500">
        <h1 className="text-4xl font-bold">YourConcert</h1>
        <p className="mt-3 mb-10 text-gray-300 text-lg">Welcome back,</p>
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
            <p className='mr-1'>Dont have an account?</p>
            <Link href="/auth/signup" className='text-blue-400 hover:text-blue-300'>Register</Link>
          </div>
          <button type="submit" className="w-full bg-blue-900 rounded-2xl py-3 font-semibold text-white hover:bg-blue-800 transition-colors duration-300">Sign in</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
