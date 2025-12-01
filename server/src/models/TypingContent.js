import { Schema, model } from 'mongoose';

const TypingContentSchema = new Schema({
  text: {
    type: String,
    required: true,
    minlength: 50
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  source: {
    type: String,
    default: 'Unknown'
  }
}, { timestamps: true });

export default model('TypingContent', TypingContentSchema);