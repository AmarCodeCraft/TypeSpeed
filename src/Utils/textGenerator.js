// Text generator utility for typing test
export const generateText = (length = 200) => {
  const words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", 
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", 
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", 
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", 
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", 
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "code", "type", "fast", "learn", "practice", "skill", "improve", "speed", "accuracy", "keyboard",
    "developer", "programming", "software", "computer", "technology", "digital", "system", "data", "process", "function"
  ];
  
  let result = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
  }
  
  // Add some punctuation and capitalization for more realistic text
  let text = result.join(" ");
  
  // Capitalize first letter of some sentences
  text = text.replace(/\. [a-z]/g, match => match.toUpperCase());
  
  // Capitalize first letter of the text
  text = text.charAt(0).toUpperCase() + text.slice(1);
  
  return text;
};