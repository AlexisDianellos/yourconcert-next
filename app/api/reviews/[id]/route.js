import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/authOptions';
import { del,put } from '@vercel/blob';

export async function GET(req, { params }) {
  await connectToDatabase();
  const review = await Review.findById(params.id).populate('createdBy','name').exec();;
  if (!review) return new Response('Review not found', { status: 404 });
  return new Response(JSON.stringify(review), { status: 200 });
}

export async function PATCH(req, { params }) {
  try{
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || "";

      const reviewId = params.id;

      const formData = await req.formData();
      const title = formData.get('title');
      const content = formData.get('content');
      const file = formData.get('file'); 
      const pq = formData.get('pq');
      const songs = formData.get('songs');
      const crowd = formData.get('crowd');
      const visuals = formData.get('visuals');
      const venue = formData.get('venue');

      const review = await Review.findById(reviewId);

      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }

      if (review.createdBy.toString() !== session.user.id) {
        return NextResponse.json({ error: 'You do not have permission to edit this review' }, { status: 403 });
      }

      let image = review.image;

      if (file && filename){
        await del(review.image);

        const blob = await put(filename, file, {
          access: 'public',
        });

        image=blob.url;
      }

      const updatedReview = await Review.findByIdAndUpdate(reviewId, {title,content,image, pq, songs, crowd, visuals, venue }, { new: true });

      return NextResponse.json(updatedReview, { status: 200 });
  }catch(err){
    console.error("Error editing review ",err);
    return NextResponse.json({ error: 'Failed to edit review' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try{
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    await connectToDatabase();

    const reviewId = params.id;
    const formData = await req.formData();
    const url = formData.get('image')||"";

    if(!url){
      return NextResponse.json({ error: 'Error, no image url' }, { status: 400 });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'You do not have permission to delete this review' }, { status: 403 });
    }

    await review.deleteOne();
    await del(url);

    return NextResponse.json({ success: 'Review deleted' }, { status: 200 });

  }catch(err){
    console.error("Error deleting review ",err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
