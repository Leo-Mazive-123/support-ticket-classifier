// src/lib/classifier.ts
import records from '../data/tickets.json';

type TicketExample = {
  description: string;
  department: string;
};

// Build keywords map from JSON
const keywords: Record<string, Set<string>> = {};

(records as TicketExample[]).forEach(({ description, department }) => {
  if (!keywords[department]) keywords[department] = new Set();
  description
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean)
    .forEach(word => keywords[department].add(word));
});

export function classify(text: string) {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const dept in keywords) {
    scores[dept] = 0;
    for (const kw of keywords[dept]) {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      const matches = lower.match(regex);
      if (matches) scores[dept] += matches.length;
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
  const confidence = totalMatches > 0 ? maxScore / totalMatches : 0.34;

  return {
    predicted_department: department,
    confidence_score: parseFloat(confidence.toFixed(2))
  };
}
