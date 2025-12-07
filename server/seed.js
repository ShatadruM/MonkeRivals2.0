import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TypingContent from './src/models/TypingContent.js';

dotenv.config();

// --- 50+ Quotes Data ---
const quotes = [
  { text: "The quick brown fox jumps over the lazy dog.", source: "Traditional" },
  { text: "To be or not to be, that is the question.", source: "Hamlet" },
  { text: "All that we are is the result of what we have thought.", source: "Buddha" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", source: "Thomas Edison" },
  { text: "The only way to do great work is to love what you do.", source: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", source: "Albert Einstein" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", source: "Winston Churchill" },
  { text: "It does not matter how slowly you go as long as you do not stop.", source: "Confucius" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", source: "Eleanor Roosevelt" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", source: "Ralph Waldo Emerson" },
  { text: "It is during our darkest moments that we must focus to see the light.", source: "Aristotle" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", source: "Buddha" },
  { text: "Life is what happens when you're busy making other plans.", source: "John Lennon" },
  { text: "Get busy living or get busy dying.", source: "Stephen King" },
  { text: "You only live once, but if you do it right, once is enough.", source: "Mae West" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", source: "Thomas Edison" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", source: "Albert Einstein" },
  { text: "Money and success don't change people; they merely amplify what is already there.", source: "Will Smith" },
  { text: "Your time is limited, so don't waste it living someone else's life.", source: "Steve Jobs" },
  { text: "Not how long, but how well you have lived is the main thing.", source: "Seneca" },
  { text: "I love typing because it allows me to express my thoughts faster than I can speak them.", source: "Typing Enthusiast" },
  { text: "Programming is not about typing, it is about thinking.", source: "Rich Hickey" },
  { text: "The keyboard is mightier than the sword in the digital age.", source: "Unknown" },
  { text: "Consistency is key. Small daily improvements are the key to staggering long-term results.", source: "Unknown" },
  { text: "Web sockets allow for real-time bidirectional event-based communication.", source: "Tech Documentation" },
  { text: "React is a JavaScript library for building user interfaces based on components.", source: "React Docs" },
  { text: "MongoDB is a source-available cross-platform document-oriented database program.", source: "Wiki" },
  { text: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.", source: "Tailwind Docs" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", source: "Nelson Mandela" },
  { text: "The way to get started is to quit talking and begin doing.", source: "Walt Disney" },
  { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", source: "Steve Jobs" },
  { text: "Keep your face always toward the sunshine - and shadows will fall behind you.", source: "Walt Whitman" },
  { text: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", source: "Colin Powell" },
  { text: "Believe you can and you're halfway there.", source: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", source: "William James" },
  { text: "Success usually comes to those who are too busy to be looking for it.", source: "Henry David Thoreau" },
  { text: "Don't be afraid to give up the good to go for the great.", source: "John D. Rockefeller" },
  { text: "I find that the harder I work, the more luck I seem to have.", source: "Thomas Jefferson" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", source: "Winston Churchill" },
  { text: "Try not to become a man of success. Rather become a man of value.", source: "Albert Einstein" },
  { text: "Don't let yesterday take up too much of today.", source: "Will Rogers" },
  { text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.", source: "Unknown" },
  { text: "It's not whether you get knocked down, it's whether you get up.", source: "Vince Lombardi" },
  { text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.", source: "Steve Jobs" },
  { text: "People who are crazy enough to think they can change the world, are the ones who do.", source: "Rob Siltanen" },
  { text: "Failure will never overtake me if my determination to succeed is strong enough.", source: "Og Mandino" },
  { text: "Entrepreneurs are great at dealing with uncertainty and also very good at minimizing risk. That's the classic entrepreneur.", source: "Mohnish Pabrai" },
  { text: "We may encounter many defeats but we must not be defeated.", source: "Maya Angelou" },
  { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", source: "Johann Wolfgang Von Goethe" },
  { text: "Imagine your life is perfect in every respect; what would it look like?", source: "Brian Tracy" }
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await TypingContent.deleteMany({});
    console.log('Cleared old phrases.');

    // Insert new data
    await TypingContent.insertMany(quotes);
    console.log(`Successfully seeded ${quotes.length} phrases!`);

    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();