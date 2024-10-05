import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

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
    const {title,content} = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const newReview = await Review.create({title,content,createdBy:userId})
    const populatedPost = await Review.findById(newReview._id).populate('createdBy', 'name').exec();
    return new Response(JSON.stringify(populatedPost), { status: 201 });

  }catch(error){
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
