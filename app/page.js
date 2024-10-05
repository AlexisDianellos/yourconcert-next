'use client';
import { useEffect, useState } from 'react';
import CreatePostForm from '@/components/createform';
import {useSession} from 'next-auth/react';

export default function Home() {
  
  const [reviews, setReviews] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  return (
    <div className="p-6">
      {session?
        <p className="text-xl font-bold text-start mb-5">Welcome back, {session.user?.name}</p>
        :<></>
      }
      
      <ul>
        {reviews.map((review) => (
          <li key={review._id} className="mt-4">
            <h2 className="text-xl font-semibold">{review.title}</h2>
            <p>{review.content} {review.createdBy?.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
