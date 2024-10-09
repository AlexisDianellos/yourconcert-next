'use client';
import React,{useEffect,useState} from 'react'
import { useParams } from 'next/navigation';
import Review from '@/components/Review';

const Profile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);  
  const [reviews, setReviews]=useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/user/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch users reviews');
          }
          return res.json();
        })
        .then((data) => {
          setReviews(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
          setLoading(false);
        });
    }
  }, [id]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }
  
  
  return (
    <div className="flex flex-col items-center p-6">
    <div className="shadow-md w-full max-w-5xl mx-auto p-6 rounded-b-lg flex flex-col items-center text-center space-y-4">
      <h1 className="text-3xl font-semibold">{reviews && reviews[0].createdBy?.name}</h1>
      <p className="text-gray-500">{reviews?.length || 0} Reviews</p>
    </div>
    
      <div className="w-full max-w-5xl mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 p-5 m-5">
        {reviews && reviews.length > 0 &&
          reviews.map((review) => (
            <div>
              <Review key={review._id} {...review} />
            </div>
          ))
        }
      </div>
  </div>
  )
}

export default Profile;