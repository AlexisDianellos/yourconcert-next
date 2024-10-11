'use client';
import { useEffect, useState,useRef } from 'react';
import { useRouter,useParams } from 'next/navigation';
import Link from 'next/link';
import {useSession } from 'next-auth/react';
import { FaRegStar,FaStar } from "react-icons/fa";;
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';

export default function ReviewDetail(){
  const { id } = useParams();  
  const router = useRouter(); 
  const [review,setReview]=useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {data:session} = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const inputFileRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetch(`/api/reviews/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch review');
          }
          return res.json();
        })
        .then((data) => {
          setReview(data);
          setTitle(data.title);
          setContent(data.content); 
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching review:', error);
          setError('Failed to load the review');
          setLoading(false);
        });
    }
  }, [id]);


  const deleteReview = async(id)=>{
    
    if (!session) {
      console.error('You must be signed in to delete a review.');
      return;
    }
    
    const formdata = new FormData();
    formdata.append('image',review.image);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        body:formdata,
      });
      if (res.ok) {
        router.push("/");
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating ? (
        <FaStar key={index} className="text-2xl text-yellow-500 m-0.5" />
      ) : (
        <FaRegStar key={index} className="text-2xl text-yellow-500 m-0.5" />
      )
    ));
  };

  const calcualteOverallRating = ()=>{
    const pq = parseFloat(review.pq)||0;
    const songs=parseFloat(review.songs)||0;
    const crowd=parseFloat(review.crowd)||0;
    const visuals=parseFloat(review.visuals)||0;
    const venue=parseFloat(review.venue)||0;

    const rating = pq*0.4+songs*0.2+crowd*0.2+visuals*0.1+venue*0.1
    return rating;
  }
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return(
    <div className="p-6">

          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black backdrop-blur-sm">
              <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-96">
                <p className="font-bold text-2xl text-center mb-5">Are you sure you want to delete this review?</p>
                <div className="flex justify-center">
                  <button onClick={()=>deleteReview(review._id)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Yes
                  </button> 
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => setShowDeleteModal(false)}
                    >
                      No
                  </button>          
                </div>
              </div>
            </div>
          )}

      <div className="max-w-xl mx-auto p-5">
    <Link className="font-bold material-symbols-outlined mb-5" href="/">
      arrow_back
    </Link>
    <div className='flex lg:flex-row md:flex-row sm:flex-row lg:mb-8 md:mb-8 sm:mb-8 flex-col justify-center'>
      <h1 className="text-2xl font-bold text-center">{review.title}</h1>
      {review.createdBy._id===session?.user?.id && (
          <div className='text-center mt-3 mb-3 lg:mt-0 md:mt-0 sm:mt-0 lg:mb-0 md:mb-0 sm:mb-0'>
            <Link
              className='lg:ml-5 md:ml-5 sm:ml-5 text-center lg:mt-0 md:mt-0 sm:mt-0 lg:mb-0 md:mb-0 sm:mb-0 mb-2 mt-2 lg:p-0 md:p-0 sm:p-0 p-4'
              href={`/edit/${review._id}`}
              >
              <span
                className="material-symbols-outlined text-xl"
                >
                edit
              </span>
            </Link>
            <button
              className='lg:ml-5 md:ml-5 sm:ml-5 text-center lg:mt-0 md:mt-0 sm:mt-0 lg:mb-0 md:mb-0 sm:mb-0 mb-2 mt-2 p-4 lg:p-0 md:p-0 sm:p-0'
              onClick={()=>setShowDeleteModal(true)}
            >
              <span className="material-symbols-outlined text-xl">
                delete
              </span>
            </button>
          </div>
      )}
    </div>
    <div className="mb-5">
      <Image src={review.image} width={500} height={500} alt={review.title} priority className="w-full h-auto object-cover rounded-md" />
    </div>
    <div className='flex justify-center'>
      <hr className="w-full border-t border-gray-300 my-4 " />
    </div>
      <div className="text-xl space-y-6 mt-5">
        <div className='text-center font-semibold text-2xl'>Overall Rating:
        <p className='font-bold'>{calcualteOverallRating()} /5</p>
        <div className='flex justify-center mt-5'>
          <hr className="w-full border-t border-gray-300 my-4 " />
        </div>
        </div>

        <div className="font-semibold mb-1">
          <div className="p-2 flex">Performance Quality:&nbsp;
          <span className='flex'>
              {renderStars(review.pq)}
            </span>
          </div>
          <div className="p-2 flex">Setlist/Song Choices:&nbsp;
            <span className='flex'>
              {renderStars(review.songs)}
            </span>
          </div>
          <div className="p-2 flex">Crowd Interaction:&nbsp;
            <span className='flex'>
              {renderStars(review.crowd)}
            </span>
          </div>
          <div className="p-2 flex">Visuals:&nbsp;
            <span className='flex'>
              {renderStars(review.visuals)}
            </span>
          </div>
          <div className="p-2 flex">Venue:&nbsp;
            <span className='flex'>
              {renderStars(review.venue)}
            </span>
          </div>
        </div>
      </div>

    <div className='flex justify-center mt-10'>
      <hr className="w-full border-t border-gray-300 my-4 " />
    </div>
    <p className='text-2xl font-semibold text-center mb-5 mt-5'>Review</p>
    <div className='flex justify-center mb-10'>
      <hr className="w-full border-t border-gray-300 my-4 " />
    </div>
    <div className="max-w-none text-l lg:text-xl md:text-xl" dangerouslySetInnerHTML={{ __html: review.content }}></div>
    <div className="flex flex-col items-end mt-14 text-gray-300">
      <p>Review by {review.createdBy?.name}</p>
      <p>Created at {new Date(review.createdAt).toLocaleString()}</p>
    </div>
  </div>
    </div>
  );
};