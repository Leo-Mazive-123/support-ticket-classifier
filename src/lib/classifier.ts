export function classify(text: string) {
  const keywords: Record<string, string[]> = {
    IT: ["password", "network", "printer", "computer", "email", "vpn", "wifi"],
    HR: ["leave", "hiring", "recruit", "benefit", "contract", "overtime", "policy"],
    Finance: ["salary", "payroll", "invoice", "budget", "refund", "account"],
  };

  const scores: Record<string, number> = { IT: 0, HR: 0, Finance: 0 };
  const lower = text.toLowerCase();

  for (const dept in keywords) {
    for (const kw of keywords[dept]) {
      if (lower.includes(kw)) scores[dept]++;
    }
  }

  const department = Object.keys(scores).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = total > 0 ? scores[department] / total : 0.34;

  return { department, confidence: parseFloat(confidence.toFixed(2)) };
}


// export function classify(text: string) {
//   // Define keywords for each department
//   const keywords: Record<string, string[]> = {
//     IT: ["password", "network", "printer", "computer", "email", "vpn", "wifi", "monitor", "office", "update", "outlook", "internet"],
//     HR: ["leave", "hiring", "recruit", "benefit", "contract", "overtime", "policy", "payslip", "onboarding", "resignation", "transfer", "job", "title"],
//     Finance: ["salary", "payroll", "invoice", "budget", "refund", "account", "bonus", "credit", "expense", "tax", "billing", "payment"],
//   };

//   // Initialize scores for each department
//   const scores: Record<string, number> = { IT: 0, HR: 0, Finance: 0 };
//   const lower = text.toLowerCase();

//   // Count keyword occurrences
//   for (const dept in keywords) {
//     for (const kw of keywords[dept]) {
//       if (lower.includes(kw)) scores[dept]++;
//     }
//   }

//   // Pick department with the highest score
//   const department = Object.keys(scores).reduce((a, b) =>
//     scores[a] >= scores[b] ? a : b
//   );

//   // Calculate confidence: fraction of hits over total hits
//   const total = Object.values(scores).reduce((a, b) => a + b, 0);
//   const confidence = total > 0 ? scores[department] / total : 0.34;

//   return { department, confidence: parseFloat(confidence.toFixed(2)) };
// }
