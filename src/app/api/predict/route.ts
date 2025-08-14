import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import brain from 'brain.js'; // ignore missing type declarations

// Use string keys to satisfy TypeScript
const departmentMap: Record<string, string> = {
  '0': 'IT',
  '1': 'HR',
  '2': 'Finance',
};

// Dummy training data
const trainingData = [
  { input: 'computer network issue', output: { '0': 1 } }, // IT
  { input: 'password reset', output: { '0': 1 } },        // IT
  { input: 'payroll problem', output: { '2': 1 } },       // Finance
  { input: 'leave request', output: { '1': 1 } },         // HR
  { input: 'recruitment question', output: { '1': 1 } },  // HR
];

const net = new brain.NeuralNetwork({ hiddenLayers: [3] });
net.train(trainingData);

export async function POST(req: NextRequest) {
  const { ticket_text } = await req.json();

  if (!ticket_text)
    return NextResponse.json({ error: 'No ticket text provided' }, { status: 400 });

  const output = net.run(ticket_text.toLowerCase()) as Record<string, number>;

  // Find the department with the highest confidence
  let maxKey = Object.keys(output)[0];
  Object.keys(output).forEach((key) => {
    if (output[key] > output[maxKey]) maxKey = key;
  });

  const confidence = output[maxKey];
  const department = departmentMap[maxKey];

  return NextResponse.json({ department, confidence });
}
