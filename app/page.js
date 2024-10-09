'use client';
import { useEffect, useState } from 'react';
import {useSession} from 'next-auth/react';
import Review from '@/components/Review';

export default function Home() {
  
  const [reviews, setReviews] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      {session?
        <p className="text-xl font-bold text-start mb-5">Welcome back, {session.user?.name}</p>
        :<></>
      }  
      <div className="w-full max-w-2xl ml-5 mr-5 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 pb-5">
          {reviews.length>0 && reviews.map((review) => (
              <Review
                key={review._id}
                {...review}
              />
          ))}
      </div>
    </div>
  );
}
