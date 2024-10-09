import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try{
  await connectToDatabase();

  const user = params.id;
  const reviews = await Review.find({createdBy: user}).populate('createdBy','name').exec();;

  if (reviews.length === 0) {
    return NextResponse.json({ error: 'No reviews found' }, { status: 404 });
  }
  
  return new Response(JSON.stringify(reviews), { status: 200 });
}catch(error){
  console.error('Error fetching reviews:', error);
  return new Response('Server Error', { status: 500 });
}

}