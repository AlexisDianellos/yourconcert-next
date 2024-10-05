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
