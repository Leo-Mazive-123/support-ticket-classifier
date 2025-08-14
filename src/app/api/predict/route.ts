import { NextRequest, NextResponse } from 'next/server';

// Map numeric keys to departments
const departmentMap: Record<string, string> = {
  '0': 'IT',
  '1': 'HR',
  '2': 'Finance',
};

// Simple keyword-based classifier
const keywords: Record<string, string[]> = {
  '0': ['computer', 'network', 'password', 'system', 'login'],
  '1': ['leave', 'recruitment', 'interview', 'hiring', 'hr'],
  '2': ['payroll', 'salary', 'finance', 'payment', 'invoice'],
};

export async function POST(req: NextRequest) {
  const { ticket_text } = await req.json();

  if (!ticket_text)
    return NextResponse.json({ error: 'No ticket text provided' }, { status: 400 });

  const text = ticket_text.toLowerCase();
  const scores: Record<string, number> = { '0': 0, '1': 0, '2': 0 };

  // Count keyword matches for each department
  Object.keys(keywords).forEach((key) => {
    keywords[key].forEach((word) => {
      if (text.includes(word)) scores[key] += 1;
    });
  });

  // Find the department with the highest score
  let maxKey: string = '0';
  Object.keys(scores).forEach((key) => {
    if (scores[key] > scores[maxKey]) maxKey = key;
  });

  const confidence = scores[maxKey] / Math.max(...Object.values(scores));
  const department = departmentMap[maxKey];

  return NextResponse.json({ department, confidence });
}
