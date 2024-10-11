'use client';
import { useEffect, useState } from 'react';
import {useSession} from 'next-auth/react';
import Review from '@/components/Review';

export default function Home() {
  
  const [reviews, setReviews] = useState([]);
  const { data: session } = useSession();
  const [loading,setLoading]=useState(true);
  const[error,setError]=useState(null);

  useEffect(() => {
    try{
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(null);
      });
    }catch(error){
      console.error('Error fetching reviews ',error);
      setLoading(null);
      setError('An error occured.');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      {session?
        <p className="text-xl font-bold text-start mb-5">Welcome back, {session.user?.name}</p>
        :<></>
      }
      {error&&<p className="text-red-500 p-3">{error}</p>}
      <div className="w-full max-w-2xl ml-5 mr-5 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 pb-5">
          {reviews.length>0 && reviews.slice(0,20).reverse().map((review) => (
              <Review
                key={review._id}
                {...review}
              />
          ))}
      </div>
    </div>
  );
}
