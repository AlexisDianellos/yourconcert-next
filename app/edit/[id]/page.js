'use client';
import { useState,useRef,useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HeaderStar from '@/components/HeaderStar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

const Edit = () => {
  
  const { id } = useParams();  
  const { data: session } = useSession();
  const [review,setReview]=useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pq,setPq]=useState(0);
  const [songs,setSongs]=useState(0);
  const [crowd,setCrowds]=useState(0);
  const [visuals,setVisuals]=useState(0);
  const [venue,setVenue]=useState(0);
  const [image,setImage]=useState(null);
  const inputFileRef = useRef(null);
  const router = useRouter();

  const [helpText,setHelpText]=useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disabled,setDisabled]=useState(null);


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
          setPq(data.pq);
          setSongs(data.songs);
          setCrowds(data.crowd);
          setVisuals(data.visuals);
          setVenue(data.venue);   
          setImage(data.image);
          setLoading(null);
        })
        .catch((error) => {
          console.error('Error fetching review:', error);
          setError('Failed to load the review');
          setLoading(null);
        });
    }
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    if (!session) {
      console.error('You must be signed in to edit a review.');
      setError('You must be signed in to edit a review.');
      return;
    }
    if(review.createdBy._id!==session?.user?.id ){
      console.error('This isnt your review.');
      return;
    }

    const file = inputFileRef.current.files[0];

    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('content', content);

    formData.append('pq', pq);
    formData.append('songs', songs);
    formData.append('crowd', crowd);
    formData.append('visuals', visuals);
    formData.append('venue', venue);

    if (file) {
      formData.append('file', file);
    }

    if(!title || !content || !songs || !visuals || !venue){
      setError('Please fill in all fields.');
      setDisabled(null);
      return;
    }

    try{
    const response = await fetch(`/api/reviews/${id}${file ?`?filename=${file?.name}`:''}`, {
      method: 'PATCH',
      body: formData,
    });
    if (response.ok) {
      const updatedReview = await response.json();
      setReview(updatedReview);
      router.push(`/review/${review._id}`);
      
    }else{
      console.error('Failed to edit review');
      setError('Failed to edit review.');
      setDisabled(null);
    }
    }catch(error){
      console.error('Error editing review:', error);
      setLoading(null);
      setError(error);
      setDisabled(null)
    }
  };

  const handleClick = async (option)=>{
    
    let sentence=null;

    if(option==='pq'){
      sentence="(40%) How well did the artists or band perform musically? Were they skilled and engaging? Vocal/Instrumental Performance: How did the vocals sound live? Were the instruments clear and well-played?"
    }else if (option==="song"){
      sentence="(20%) Did the concert feature a good mix of the artists hits, deep cuts, and possibly new songs? Was there a balance between popular and lesser-known tracks? Pacing of Songs: Was the setlist paced well, with an effective mix of high-energy and slower songs? Was there good track mix or abrupt cuts between tracks?"
    }else if (option==="crowd"){
      sentence="(20%) Was the artist or band engaging with the audience? How was their overall energy and interaction with the crowd?"
    }else if (option==="visuals"){
      sentence="(10%) Was the stage visually interesting? Did it match the artist's theme or style? Special Effects: Were there any additional visual elements like pyrotechnics or screens? Did they add to the experience? Was the lighting appropriate for the performance? Did it enhance the atmosphere of the show? "
    }else if (option ==="venue"){
      sentence="(10%) How was the acoustics of the venue? Did the sound come through clearly or were there technical issues like feedback or muffling?Was there enough space for the crowd to enjoy the concert? How accessible was the venue? Was it conveniently located, and did it offer adequate parking or transportation options? Was the price of the tickets worth it?"
    }else if (option ==="review"){
      sentence="Your GOAL is to Help someone to decide if they should attend this Artists concert or festival Set, if its a unique experince. Summarize your observations and insights, highlighting the most impactful elements of the concert. An analytical review not only provides an overview of the performance but also invites readers to reflect on their concert experiences and encourages a deeper appreciation for live music."
    }
    setHelpText(sentence);

  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-7 w-full lg:w-2/3 mx-auto flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-center mb-10">Edit Review</h1>
        <label type="title" className="text-2xl font-bold">Concert Title</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-3/4 lg:w-1/2 px-3 py-2 rounded-md shadow-sm focus:outline-none sm:text-sm text-black"
        />
        <div className="flex items-center">
          <HeaderStar header="Performance Quality" onRatingChange={setPq} value={pq}/>
          <span className="material-symbols-outlined text-gray-400" onClick={() => handleClick('pq')}>
            help
          </span>
        </div>

        <div className="flex items-center">
          <HeaderStar header="Setlist/Song Choices" onRatingChange={setSongs} value={songs}/>
          <span className="material-symbols-outlined text-gray-400" onClick={() => handleClick('song')}>
            help
          </span>
        </div>
        <div className="flex items-center">
        <HeaderStar header="Crowd Interaction" onRatingChange={setCrowds} value={crowd}/>
        <span className="material-symbols-outlined text-gray-400" onClick={() => handleClick('crowd')}>
          help
        </span>
        </div>
        <div className="flex items-center">
        <HeaderStar header="Visuals" onRatingChange={setVisuals} value={visuals}/>
        <span className="material-symbols-outlined text-gray-400" onClick={() => handleClick('visuals')}>
          help
        </span>
        </div>
        <div className="flex items-center">
        <HeaderStar header="Venue"onRatingChange={setVenue} value={venue}/>
        <span className="material-symbols-outlined text-gray-400" onClick={() => handleClick('venue')}>
          help
        </span>
        </div>

  {helpText && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black backdrop-blur-sm">
      <div className="bg-gray-200 rounded-lg shadow-lg p-10 relative max-w-md mx-auto ">
      <button className="material-symbols-outlined absolute top-2 right-2 rounded p-3" onClick={() => setHelpText(null)}>
        cancel
      </button>
      <p className="text-lg text-gray-700">{helpText}</p>
      </div>
    </div>
  )}


      <hr className="w-full border-t border-gray-300 p-3" />
        <div className="flex items-center">
          <p className='text-center text-2xl font-bold p-5'>Review</p>
          <span className="material-symbols-outlined text-gray-400" onClick={() => handleClick('review')}>
            help
          </span>
        </div>
              <ReactQuill
              value={content}
              modules={modules}
              formats={formats}
              onChange={(newValue) => setContent(newValue)}
              className='bg-white text-black lg:w-1/2 md:w-1/2 w-5/6'
              />
  
      <hr className="w-full border-t border-gray-300 p-3 mt-10" />
       <div>
          <label className="block text-2xl p-5 font-bold text-center">Review Cover</label>
          <h1 className="font-bold text-xl p-5">Current Review Cover</h1>
          <div className="flex justify-center">
          <div className='w-3/4 h-96 overflow-hidden rounded-md mt-2 mb-2'>
            <Image src={image} width={500} height={500} alt={title} className='w-full h-full object-cover'></Image>
          </div>
          </div>
          <p className="font-bold text-xl p-5">OR</p>
          <input
            type="file"
            ref={inputFileRef}
            className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none sm:text-sm text-black bg-white"
          />
        </div>
        <button
          type="submit"
          className="w-1/2 mt-10 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600"
          disabled={disabled}
        >
        {disabled?'Editing...':'Edit Review'}
      </button>
      {error&&<p className="text-red-500 p-3">{error}</p>}
    </form>
  )
}

export default Edit