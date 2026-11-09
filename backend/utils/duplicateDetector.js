/**
 * Utility for detecting duplicate complaints using text tokenization and similarity algorithms.
 */

// Simple tokenizer: lowercase, strip punctuation, remove stop words
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'my', 'our', 'this', 'there', 'please', 'complaint', 'issue', 'problem',
  'urgently', 'help', 'not', 'working', 'broken', 'near'
]);

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

// Jaccard similarity between two token sets
function calculateJaccardSimilarity(tokens1, tokens2) {
  if (tokens1.length === 0 || tokens2.length === 0) return 0;
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  let intersection = 0;
  for (const token of set1) {
    if (set2.has(token)) intersection++;
  }

  const union = new Set([...set1, ...set2]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Compare target text (title + description) against an array of existing complaints
 * @param {Object} input - { title, description, category }
 * @param {Array} existingComplaints - Array of complaint documents
 * @param {Number} threshold - similarity threshold (default 0.35 = 35%)
 * @returns {Array} List of potential duplicates with similarity percentage
 */
function findPotentialDuplicates(input, existingComplaints, threshold = 0.35) {
  const inputTitleTokens = tokenize(input.title);
  const inputDescTokens = tokenize(input.description);
  const inputAllTokens = [...inputTitleTokens, ...inputDescTokens];

  if (inputAllTokens.length === 0) return [];

  const results = [];

  for (const comp of existingComplaints) {
    // If category matches, give higher priority check
    const sameCategory = input.category && comp.category === input.category;

    const compTitleTokens = tokenize(comp.title);
    const compDescTokens = tokenize(comp.description);
    const compAllTokens = [...compTitleTokens, ...compDescTokens];

    const titleSim = calculateJaccardSimilarity(inputTitleTokens, compTitleTokens);
    const overallSim = calculateJaccardSimilarity(inputAllTokens, compAllTokens);

    // Weighted similarity: title matches carry heavy weight
    let score = (titleSim * 0.6) + (overallSim * 0.4);
    if (sameCategory) {
      score = Math.min(1.0, score * 1.15); // bonus boost for same category
    }

    if (score >= threshold) {
      // Find matching words
      const inputSet = new Set(inputAllTokens);
      const matchedTokens = compAllTokens.filter(t => inputSet.has(t));
      const uniqueMatched = [...new Set(matchedTokens)].slice(0, 5);

      results.push({
        complaintId: comp._id,
        trackingId: comp.trackingId,
        title: comp.title,
        category: comp.category,
        status: comp.status,
        similarityPercentage: Math.round(score * 100),
        matchingKeywords: uniqueMatched,
        createdAt: comp.createdAt
      });
    }
  }

  // Sort by highest similarity
  return results.sort((a, b) => b.similarityPercentage - a.similarityPercentage).slice(0, 5);
}

module.exports = {
  findPotentialDuplicates,
  tokenize,
  calculateJaccardSimilarity
};
