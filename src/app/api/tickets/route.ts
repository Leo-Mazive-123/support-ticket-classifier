// import { NextRequest, NextResponse } from 'next/server';
// import natural from 'natural';

// // Create classifier
// const classifier = new natural.BayesClassifier();

// // Train with sample tickets
// classifier.addDocument('password reset login issue', 'IT');
// classifier.addDocument('cannot login', 'IT');
// classifier.addDocument('salary raise payment query', 'HR');
// classifier.addDocument('invoice payment money issue', 'Finance');
// classifier.train();

// // Replace with actual department UUIDs from Supabase
// const departmentMap: Record<string, string> = {
//   IT: 'PUT_IT_DEPARTMENT_UUID_HERE',
//   HR: 'PUT_HR_DEPARTMENT_UUID_HERE',
//   Finance: 'PUT_FINANCE_DEPARTMENT_UUID_HERE',
// };

// export async function POST(req: NextRequest) {
//   const { ticket_text } = await req.json();

//   const predicted = classifier.classify(ticket_text); // 'IT', 'HR', 'Finance'
//   const scores = classifier.getClassifications(ticket_text);

//   const confidence = scores.find((s) => s.label === predicted)?.value || 0;
//   const department_id = departmentMap[predicted];

//   return NextResponse.json({ department_id, confidence });
// }





import { NextRequest, NextResponse } from 'next/server';

// Map numeric keys to departments
const departmentMap: Record<string, string> = {
  '0': 'IT',
  '1': 'HR',
  '2': 'Finance',
};

// Simple keyword-based classifier
const keywords: Record<string, string[]> = {
  '0': [
    'computer', 'network', 'password', 'system', 'login', 'vpn', 'printer', 'outlook', 'email', 'monitor',
    'office', 'installation', 'hardware', 'software', 'internet', 'update', 'blue screen', 'battery'
  ],
  '1': [
    'leave', 'recruitment', 'interview', 'hiring', 'hr', 'payslip', 'emergency contact', 'appraisal',
    'onboarding', 'benefits', 'time off', 'policy', 'training', 'resignation', 'job title', 'transfer', 'staff id'
  ],
  '2': [
    'payroll', 'salary', 'finance', 'payment', 'invoice', 'budget', 'credit card', 'reimbursement',
    'tax', 'supplier', 'expenses', 'bonus', 'billing'
  ],
};

// Preprocessing function
function preprocess(text: string) {
  return text.toLowerCase().replace(/[^\w\s]/gi, '').trim();
}

export async function POST(req: NextRequest) {
  const { ticket_text } = await req.json();

  if (!ticket_text)
    return NextResponse.json({ error: 'No ticket text provided' }, { status: 400 });

  const text = preprocess(ticket_text);
  const scores: Record<string, number> = { '0': 0, '1': 0, '2': 0 };

  // Count keyword matches
  Object.keys(keywords).forEach((key) => {
    keywords[key].forEach((word) => {
      if (text.includes(word)) scores[key] += 1;
    });
  });

  // Find department with highest score
  let maxKey: string = '0';
  Object.keys(scores).forEach((key) => {
    if (scores[key] > scores[maxKey]) maxKey = key;
  });

  const confidence = scores[maxKey] / Math.max(...Object.values(scores));
  const department = departmentMap[maxKey];

  return NextResponse.json({ department, confidence });
}
