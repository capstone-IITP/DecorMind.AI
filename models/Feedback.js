import mongoose from 'mongoose';

// Define the Feedback schema
const FeedbackSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Feedback message is required'],
    trim: true
  },
  designId: {
    type: String,
    trim: true
  },
  roomType: {
    type: String,
    trim: true
  },
  styleType: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model if it doesn't exist, or use the existing one
export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema); 