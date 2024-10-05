// components/CreatePostForm.js
'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function CreatePostForm() {

  const [searchContent,setSearchContent]=useState('');
  const { data: session } = useSession();

 function handleKeyDown(e) {
  if (e.key === 'Enter') {
    handleSearch();
  }
}

const handleLogout = async()=>{
  await signOut({ callbackUrl: '/' });
}

  return (
    <nav className='fixed top-0 left-0 w-full shadow-xl flex flex-col lg:flex-row md:flex-y sm:flex-row items-center justify-center px-4 py-3 lg:py-6 md:py-6 sm:py-6 sm:px-10 md:px-32 lg:px-80 backdrop-blur-xl z-50'>
      
      <div className='flex'>
      <Link className="flex items-center text-xl font-bold mr-3" href='/'>
        YourConcert
        <span className="material-symbols-outlined text-xl ml-1">
          music_note
        </span>
      </Link>
        <div className='flex items-center bg-blue-950 rounded-lg border border-gray-700 px-4 py-2 '>
          <span className="material-symbols-outlined text-xl text-gray-500 mr-2">
            search
          </span>
          <input
            type="text"
            placeholder='Find concerts'
            className=" w-24 focus:outline-none bg-blue-950 rounded-lg"
            onChange={(e)=>setSearchContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {session ? (
        <div className='flex items-center px-2 py-1 mt-1'>
          <Link className="mr-4 ml-2" href="/create">
            <span className="material-symbols-outlined text-2xl">
              add
            </span>
          </Link>
          <button onClick={handleLogout}>
            <span className="material-symbols-outlined text-2xl">
              logout
            </span>
          </button>
        </div>
      ) : (
        <div className='font-bold flex items-center mt-1'>
          <Link className='hover:underline py-2 px-4 text-gray-400' href="/about">About</Link>
          <Link className='bg-teal-300 hover:bg-teal-500 text-blue-950 font-bold py-2 px-4 rounded-full inline-block no-underline' href='/auth/signup '>Register</Link>
        </div>
      )}
    </nav>
  );
}
