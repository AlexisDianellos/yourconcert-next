import React from 'react';
import Link from 'next/link';

const page = () => {
  return (
    <div><div className="mt-32 p-8">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to YourConcert</h1>
        <p className="text-lg ">Your ultimate destination for concert reviews and discovering live music experiences.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold mb-4">Create Reviews</h2>
          <p className="text-lg mb-4">Share your experiences from concerts you’ve attended. Rate performances, share photos, and let the world know about the unforgettable moments.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold mb-4">Search Reviews</h2>
          <p className="text-lg mb-4">Looking for concert reviews? Use our search feature to find reviews by concert name, artist, or venue. Discover what others are saying about recent performances.</p>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose YourConcert?</h2>
        <p className="text-lg mb-8">We believe in the power of live music and the shared experiences it brings. Our platform is dedicated to creating a community of concert enthusiasts who love to share and discover amazing live performances.</p>
        
        <div className="flex justify-center space-x-4">
          <Link href="/" className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">Start exploring now</Link>
          <Link href="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">Join the Community</Link>
        </div>
      </div>
    </div>
  </div></div>
  )
}

export default page