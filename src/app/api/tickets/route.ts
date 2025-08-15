// app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { classify } from '@/lib/classifier';
import { createClient } from '@supabase/supabase-js';

// Use correct environment variables with NEXT_PUBLIC_ prefix
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing!');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Prediction result type
type PredictionResult = {
  predicted_department: string;
  confidence_score: number;
};

// Request body type
interface TicketRequestBody {
  ticket_text: string;
  user_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: TicketRequestBody = await req.json();
    const { ticket_text, user_id } = body;

    if (!ticket_text || !user_id) {
      return NextResponse.json(
        { error: 'Missing ticket text or user ID' },
        { status: 400 }
      );
    }

    // Get prediction using classifier
    const prediction: PredictionResult = classify(ticket_text);

    // Save ticket and prediction to Supabase
    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          user_id,
          ticket_text,
          predictions: [prediction],
        },
      ])
      .select(); // Return inserted row

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] ?? null); // Return inserted ticket
  } catch (err) {
    console.error('Tickets POST error:', err);
    return NextResponse.json(
      { error: 'Failed to submit ticket' },
      { status: 500 }
    );
  }
}
