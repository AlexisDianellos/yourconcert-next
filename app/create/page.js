'use client';
import React,{useEffect} from 'react';
import CreatePostForm from '@/components/createform';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Page = () => {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status==='unauthenticated' || session==='null'){
      router.push('/auth/signin');
    }
  }, [status,router,session]);
  

  return (
    <div ><CreatePostForm/></div>
  )
}

export default Page