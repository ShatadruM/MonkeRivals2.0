import TypingContent from '../models/TypingContent.js';

export const getRandomContent = async (req, res) => {
  try {
    // Get 1 random document from the collection
    const randomDocs = await TypingContent.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (randomDocs.length > 0) {
      res.status(200).json({ 
        content: randomDocs[0].text, 
        source: randomDocs[0].source 
      });
    } else {
      // Fallback if DB is empty
      res.status(200).json({ 
        content: "The quick brown fox jumps over the lazy dog.", 
        source: "Fallback" 
      });
    }
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Server Error fetching content" });
  }
};