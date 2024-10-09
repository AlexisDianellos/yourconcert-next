import mongoose from 'mongoose';
import User from './User';

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  pq: {
    type: String,
    required: [true, 'Please provide performance quality rating'],
  },
  songs: {
    type: String,
    required: [true, 'Please provide songs rating'],
  },
  crowd: {
    type: String,
    required: [true, 'Please provide crowd interaction rating'],
  },
  visuals: {
    type: String,
    required: [true, 'Please provide visuals rating'],
  },
  venue: {
    type: String,
    required: [true, 'Please provide venue rating'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image:{
    type:String,
    required:true,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true,
  }
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
