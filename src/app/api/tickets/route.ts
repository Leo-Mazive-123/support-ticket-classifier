import { NextRequest, NextResponse } from 'next/server';
import { classify } from '@/lib/classifier';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

type PredictionResult = {
  predicted_department: string;
  confidence_score: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ticket_text = body.ticket_text as string | undefined;
    const user_id = body.user_id as string | undefined;

    if (!ticket_text || !user_id) {
      return NextResponse.json(
        { error: 'Missing ticket text or user ID' },
        { status: 400 }
      );
    }

    // Get prediction using CSV-based classifier
    const prediction: PredictionResult = classify(ticket_text);

    // Save ticket and prediction to Supabase
    const { error } = await supabase.from('tickets').insert({
      user_id,
      ticket_text,
      predictions: [prediction],
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Tickets POST error:', error);
    return NextResponse.json(
      { error: 'Failed to submit ticket' },
      { status: 500 }
    );
  }
}
