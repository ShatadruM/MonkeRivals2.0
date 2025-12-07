import mongoose from 'mongoose';

const TypingContentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 10 
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  source: {
    type: String, // e.g., "The Matrix", "Steve Jobs", or "Unknown"
    default: 'Unknown'
  },
  length: { // Useful for filtering later
    type: Number 
  }
}, { timestamps: true });

// Pre-save hook to calculate length automatically
TypingContentSchema.pre('save', function(next) {
  this.length = this.text.length;
  next();
});

const TypingContent = mongoose.model('TypingContent', TypingContentSchema);
export default TypingContent;