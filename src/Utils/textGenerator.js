export const generateText = (wordCount = 20) => {
  // Sample text snippets
  const snippets = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet.",
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
    "Artificial intelligence is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.",
    "The World Wide Web, commonly known as the Web, is an information system enabling documents and other web resources to be accessed over the Internet.",
    "Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.",
    "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks that aim to access, change, or destroy sensitive information."
  ];
  
  // Combine all snippets and split into words
  const allWords = snippets.join(' ').split(/\s+/);
  
  // Select random starting point
  const startIndex = Math.floor(Math.random() * (allWords.length - wordCount));
  
  // Get the requested number of words
  const selectedWords = allWords.slice(startIndex, startIndex + wordCount);
  
  return selectedWords.join(' ');
};