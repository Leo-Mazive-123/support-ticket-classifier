import { NextRequest, NextResponse } from 'next/server';
import { classify } from '@/lib/classifier';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { ticket_text, user_id } = await req.json();

  if (!ticket_text || !user_id) {
    return NextResponse.json({ error: 'Missing ticket text or user ID' }, { status: 400 });
  }

  // Run the improved classifier
  const result = classify(ticket_text);

  // Insert into Supabase with predictions
  const { data, error } = await supabase
    .from('tickets')
    .insert([{
      user_id,
      ticket_text,
      predictions: [result],
    }])
    .select(); // select returns the inserted row(s)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0]); // return the inserted ticket with predictions
}
