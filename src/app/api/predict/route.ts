// app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { classify } from '@/lib/classifier';
import { createClient } from '@supabase/supabase-js';

// Read environment variables safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing!');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define request body type
interface PredictRequestBody {
  ticket_text: string;
  user_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PredictRequestBody = await req.json();

    const { ticket_text, user_id } = body;

    if (!ticket_text || !user_id) {
      return NextResponse.json(
        { error: 'Missing ticket text or user ID' },
        { status: 400 }
      );
    }

    // Run the classifier
    const result = classify(ticket_text);

    // Insert into Supabase tickets table
    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          user_id,
          ticket_text,
          predictions: [result],
        },
      ])
      .select(); // select returns inserted rows

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] ?? null);

  } catch (err) {
    console.error('Predict route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
