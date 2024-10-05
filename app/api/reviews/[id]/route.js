import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(req, { params }) {
  await connectToDatabase();
  const post = await Post.findById(params.id);
  if (!post) return new Response('Post not found', { status: 404 });
  return new Response(JSON.stringify(post), { status: 200 });
}

export async function PUT(req, { params }) {
  await connectToDatabase();
  const data = await req.json();
  const updatedPost = await Post.findByIdAndUpdate(params.id, data, { new: true });
  return new Response(JSON.stringify(updatedPost), { status: 200 });
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  await Post.findByIdAndDelete(params.id);
  return new Response(null, { status: 204 });
}
