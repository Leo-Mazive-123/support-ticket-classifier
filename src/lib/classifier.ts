// src/lib/classifier.ts
import records from '../data/tickets.json';

type TicketExample = {
  description: string;
  department: string;
};

// List of stopwords to ignore common words
const stopwords = new Set([
  'the', 'is', 'and', 'a', 'an', 'of', 'to', 'for', 'on', 'in', 'at', 
  'please', 'help', 'urgent', 'i', 'you', 'we', 'it'
]);

// Build keywords map from JSON
const keywords: Record<string, Set<string>> = {};

(records as TicketExample[]).forEach(({ description, department }) => {
  if (!keywords[department]) keywords[department] = new Set();
  description
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word && !stopwords.has(word))
    .forEach(word => keywords[department].add(word));
});

// Count how many departments each word appears in (for weighting)
const wordDeptCounts: Record<string, number> = {};
for (const dept in keywords) {
  for (const kw of keywords[dept]) {
    wordDeptCounts[kw] = (wordDeptCounts[kw] || 0) + 1;
  }
}

export function classify(text: string) {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const dept in keywords) {
    scores[dept] = 0;
    for (const kw of keywords[dept]) {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      const matches = lower.match(regex);
      if (matches) {
        // Weight by rarity across departments
        scores[dept] += matches.length / wordDeptCounts[kw];
      }
    }
  }

  // Determine department with highest score
  let department = 'Unknown';
  let maxScore = 0;
  for (const dept in scores) {
    if (scores[dept] > maxScore) {
      maxScore = scores[dept];
      department = dept;
    }
  }

  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalMatches > 0 ? maxScore / totalMatches : 0;

  return {
    predicted_department: department,
    confidence_score: parseFloat(confidence.toFixed(2))
  };
}
