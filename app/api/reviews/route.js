import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { put } from '@vercel/blob';

export async function GET(req) {
  await connectToDatabase();
  const reviews = await Review.find().populate('createdBy','name').exec();
  return new Response(JSON.stringify(reviews), { status: 200 });
}

export async function POST(req) {
  
  try{
    const session = await getServerSession(authOptions);
    
    if(!session){
      return NextResponse.json({error:"Not Authenticated"},{status:401});
    }
    await connectToDatabase();
    
    const {searchParams}=new URL(req.url);
    const filename = searchParams.get('filename') || "";

    if (filename){
      const formData = await req.formData();
      const title = formData.get('title');
      const content = formData.get('content');
      const file = formData.get('file');
      const pq = formData.get('pq');
      const songs = formData.get('songs');
      const crowd = formData.get('crowd');
      const visuals = formData.get('visuals');
      const venue = formData.get('venue');

      if (!title || !content || !pq || !songs || !crowd || !visuals || !venue) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const blob = await put(filename, file, {
        access: 'public',
      });

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const newReview = await Review.create({title,content,pq,songs,crowd,visuals,venue,image:blob.url,createdBy:userId});

    const populatedPost = await Review.findById(newReview._id).populate('createdBy', 'name').exec();

    return NextResponse.json(populatedPost, { status: 200 });
  }
  }catch(error){
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
