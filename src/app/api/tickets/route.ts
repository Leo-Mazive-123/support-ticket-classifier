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
// @ts-ignore
import brain from 'brain.js'; // ignore missing type declarations

// Map for departments
const departmentMap: Record<string, string> = {
  '0': 'IT',
  '1': 'HR',
  '2': 'Finance',
};

// Preprocessing function: lowercase, remove punctuation, trim
function preprocess(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .trim();
}

// Training data (all examples you provided)
const trainingData = [
  // IT
  { input: preprocess("My computer won’t start. I think it's a hardware issue."), output: { '0': 1 } },
  { input: preprocess("Unable to access the VPN. Need help ASAP."), output: { '0': 1 } },
  { input: preprocess("I need assistance installing Microsoft Office."), output: { '0': 1 } },
  { input: preprocess("My Outlook keeps crashing. Please check."), output: { '0': 1 } },
  { input: preprocess("I can’t connect to the printer in Block C."), output: { '0': 1 } },
  { input: preprocess("I forgot my password and can’t log in."), output: { '0': 1 } },
  { input: preprocess("Need help resetting my account password."), output: { '0': 1 } },
  { input: preprocess("My internet connection is very slow."), output: { '0': 1 } },
  { input: preprocess("Software updates are not installing."), output: { '0': 1 } },
  { input: preprocess("I lost access to my email account."), output: { '0': 1 } },
  { input: preprocess("Laptop battery is draining quickly."), output: { '0': 1 } },
  { input: preprocess("Blue screen error when booting up."), output: { '0': 1 } },
  { input: preprocess("My account was locked out after multiple login attempts."), output: { '0': 1 } },
  { input: preprocess("Help me configure my new monitor."), output: { '0': 1 } },
  { input: preprocess("Cannot connect to the shared network drive."), output: { '0': 1 } },
  { input: preprocess("System update caused software error."), output: { '0': 1 } },
  { input: preprocess("Can't access the internet."), output: { '0': 1 } },
  { input: preprocess("Monitor not displaying anything."), output: { '0': 1 } },
  { input: preprocess("Microsoft Teams not connecting."), output: { '0': 1 } },

  // HR
  { input: preprocess("How do I apply for maternity leave?"), output: { '1': 1 } },
  { input: preprocess("Requesting my payslip for June."), output: { '1': 1 } },
  { input: preprocess("Need to update my emergency contact info."), output: { '1': 1 } },
  { input: preprocess("When will appraisals be completed?"), output: { '1': 1 } },
  { input: preprocess("Help needed with employee onboarding."), output: { '1': 1 } },
  { input: preprocess("How do I change my benefits plan?"), output: { '1': 1 } },
  { input: preprocess("Requesting time off for next week."), output: { '1': 1 } },
  { input: preprocess("I want to update my bank details for salary."), output: { '1': 1 } },
  { input: preprocess("What is the company policy on remote work?"), output: { '1': 1 } },
  { input: preprocess("How can I access my training records?"), output: { '1': 1 } },
  { input: preprocess("Please provide information on health insurance."), output: { '1': 1 } },
  { input: preprocess("Requesting details about pension contributions."), output: { '1': 1 } },
  { input: preprocess("How to report workplace harassment?"), output: { '1': 1 } },
  { input: preprocess("Need help with resignation process."), output: { '1': 1 } },
  { input: preprocess("How do I update my job title and department?"), output: { '1': 1 } },
  { input: preprocess("Need help with internal job transfer"), output: { '1': 1 } },
  { input: preprocess("My job title is listed incorrectly"), output: { '1': 1 } },
  { input: preprocess("Lost my staff ID badge"), output: { '1': 1 } },
  { input: preprocess("Need to update emergency contact details"), output: { '1': 1 } },

  // Finance
  { input: preprocess("My travel expense claims have not been reimbursed."), output: { '2': 1 } },
  { input: preprocess("Budget report for Q2 is missing some entries."), output: { '2': 1 } },
  { input: preprocess("I need a breakdown of this month’s payroll."), output: { '2': 1 } },
  { input: preprocess("How do I request a company credit card?"), output: { '2': 1 } },
  { input: preprocess("Payment to a vendor is still pending."), output: { '2': 1 } },
  { input: preprocess("Need clarification on invoice #12345."), output: { '2': 1 } },
  { input: preprocess("Requesting reimbursement for office supplies."), output: { '2': 1 } },
  { input: preprocess("When will bonuses be paid this year?"), output: { '2': 1 } },
  { input: preprocess("How to submit a budget proposal?"), output: { '2': 1 } },
  { input: preprocess("Details about tax deductions on my salary."), output: { '2': 1 } },
  { input: preprocess("Help with expense report submission."), output: { '2': 1 } },
  { input: preprocess("What is the approval process for large purchases?"), output: { '2': 1 } },
  { input: preprocess("Requesting a copy of last year’s financial statement."), output: { '2': 1 } },
  { input: preprocess("How to update my billing information?"), output: { '2': 1 } },
  { input: preprocess("I have questions about payroll taxes."), output: { '2': 1 } },
  { input: preprocess("Need to update supplier billing details."), output: { '2': 1 } },
  { input: preprocess("I did not get paid for weekend shift."), output: { '2': 1 } },
  { input: preprocess("My bank account was not updated."), output: { '2': 1 } },
  { input: preprocess("Late payment for project invoice."), output: { '2': 1 } },
];

// Create and train neural network
const net = new brain.NeuralNetwork({ hiddenLayers: [15] });
net.train(trainingData, { iterations: 3000, log: true, logPeriod: 100 });

// POST handler
export async function POST(req: NextRequest) {
  const { ticket_text } = await req.json();

  if (!ticket_text)
    return NextResponse.json({ error: 'No ticket text provided' }, { status: 400 });

  const processedText = preprocess(ticket_text);
  const output = net.run(processedText) as Record<string, number>;

  let maxKey = Object.keys(output)[0];
  Object.keys(output).forEach((key) => {
    if (output[key] > output[maxKey]) maxKey = key;
  });

  const confidence = output[maxKey];
  const department = departmentMap[maxKey];

  return NextResponse.json({ department, confidence });
}
