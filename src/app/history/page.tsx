'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

type Ticket = {
  ticket_id: number;
  ticket_text: string;
  submitted_at: string;
  prediction?: {
    predicted_department: string;
    confidence_score: number;
  };
};

export default function HistoryPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    const { data: userRecord } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', user.email)
      .single();

    if (!userRecord) {
      setTickets([]);
      setLoading(false);
      return;
    }

    const { data: ticketData } = await supabase
      .from('tickets')
      .select(`ticket_id, ticket_text, submitted_at, predictions(predicted_department, confidence_score)`)
      .eq('user_id', userRecord.user_id)
      .order('submitted_at', { ascending: false });

    if (ticketData) {
      const mappedTickets: Ticket[] = ticketData.map((t: any) => ({
        ticket_id: t.ticket_id,
        ticket_text: t.ticket_text,
        submitted_at: t.submitted_at,
        prediction: t.predictions?.[0]
          ? {
              predicted_department: t.predictions[0].predicted_department,
              confidence_score: t.predictions[0].confidence_score,
            }
          : undefined,
      }));
      setTickets(mappedTickets);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/rob.png')" }}>
      <div className="absolute inset-0 bg-black/50"></div> {/* Overlay for readability */}
      <Navbar />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 text-white">
        <h1 className="text-4xl font-bold mb-6">Submitted Tickets History</h1>

        <div className="mt-6 w-full max-w-3xl space-y-4">
          {tickets.length === 0 ? (
            <p className="text-center text-gray-200">No tickets submitted yet.</p>
          ) : (
            tickets.map(ticket => (
              <div
                key={ticket.ticket_id}
                className="border border-white/30 p-4 rounded shadow backdrop-blur-sm bg-white/20"
              >
                <p><b>Ticket:</b> {ticket.ticket_text}</p>
                {ticket.prediction ? (
                  <p>
                    <b>Department:</b> {ticket.prediction.predicted_department} |{' '}
                    <b>Confidence:</b> {(ticket.prediction.confidence_score * 100).toFixed(2)}%
                  </p>
                ) : (
                  <p className="text-gray-200">Prediction pending...</p>
                )}
                <p className="text-gray-200 text-sm">
                  Submitted at: {new Date(ticket.submitted_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

