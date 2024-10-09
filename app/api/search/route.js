import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectToDatabase();
  
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const query = searchParams.get('query') || '';

  let reviews;

  if (query) {
    reviews = await Review.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ]
    }).populate('createdBy', 'name').exec();
  } else {
    return NextResponse.json({ error: 'No query' }, { status: 404 });
  }

  return NextResponse.json(reviews);
}
