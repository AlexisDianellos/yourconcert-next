import { hash } from 'bcrypt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, email, password } = await req.json();
  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  const existingName = await User.findOne({name});

  if(existingName){
    return NextResponse.json({error:'Username already taken.'},{
      status:400
    })
  }

  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use.' }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return NextResponse.json({ success: true, user: newUser });
}
