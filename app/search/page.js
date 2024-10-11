// app/search/page.js
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Review from '@/components/Review';
import Suspense from 'react'

const SearchPage = () => {
  const searchParams =  useSearchParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      fetchResults(query);
    }
  }, [searchParams]);

  const fetchResults = async (query) => {
    try{
    const res = await fetch(`/api/search?query=${query}`);
    const data = await res.json();
    setReviews(data);
    }
    catch(err){
      console.error('Error fetching search results: ',err);
    }
  };

  return (
  <div className="flex flex-col items-center p-6">  
  <div className="w-full max-w-2xl ml-5 mr-5 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 pb-5">
      {reviews.length>0 ?( reviews.map((review) => (
          <Review
            key={review._id}
            {...review}
          />
      ))):(<p className="text-center text-xl">No reviews found</p>)}
  </div>
  </div>

  );
};

const PageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchPage />
  </Suspense>
);

export default SearchPage;