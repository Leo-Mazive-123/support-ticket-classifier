'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { classify } from '@/lib/classifier';

type Prediction = {
  predicted_department: string;
  confidence_score: number;
};

type Ticket = {
  ticket_id: number;
  ticket_text: string;
  submitted_at: string;
  predictions?: Prediction[];
};

type UserRecord = {
  user_id: string;
};

export const dynamic = 'force-dynamic';

export default function HistoryPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTickets([]);
        setIsLoading(false);
        return;
      }

      const { data: userRecordData } = await supabase
        .from('users')
        .select('user_id')
        .eq('email', user.email)
        .single();

      const userRecord = userRecordData as UserRecord | null;
      if (!userRecord) {
        setTickets([]);
        setIsLoading(false);
        return;
      }

      const { data: ticketData } = await supabase
        .from('tickets')
        .select('ticket_id, ticket_text, submitted_at')
        .eq('user_id', userRecord.user_id)
        .order('submitted_at', { ascending: false });

      // Run improved classifier locally for each ticket
      const ticketsWithPrediction = (ticketData as Ticket[]).map(ticket => {
        const result = classify(ticket.ticket_text);
        return {
          ...ticket,
          predictions: [{
            predicted_department: result.predicted_department,
            confidence_score: result.confidence_score
          }]
        };
      });

      setTickets(ticketsWithPrediction || []);
      setIsLoading(false);
    };

    fetchTickets();
  }, []);

  const getDeptColor = (dept: string) => {
    switch (dept) {
      case 'IT': return 'text-blue-400';
      case 'HR': return 'text-purple-400';
      case 'Finance': return 'text-green-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/rob.png')" }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <Navbar />

      <div className="relative mt-24 max-w-4xl mx-auto p-4 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center sticky top-24 bg-black/50 z-10 py-2 rounded">
          Submitted Tickets History
        </h1>

        <div className="max-h-[70vh] overflow-y-auto space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-300">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-center text-gray-300">No tickets submitted yet.</p>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.ticket_id} className="border border-white/30 p-4 rounded shadow backdrop-blur-sm bg-white/20">
                <p><b>Ticket:</b> {ticket.ticket_text}</p>
                {ticket.predictions?.[0] ? (
                  <p>
                    <b>Department:</b>{' '}
                    <span className={`${getDeptColor(ticket.predictions[0].predicted_department)} font-semibold`}>
                      {ticket.predictions[0].predicted_department}
                    </span>{' '}
                    | <b>Confidence:</b> {(ticket.predictions[0].confidence_score * 100).toFixed(2)}%
                    {ticket.predictions[0].confidence_score < 0.5 && (
                      <span className="text-red-400 font-bold ml-2">(Low confidence)</span>
                    )}
                  </p>
                ) : (
                  <p className="text-gray-300">Prediction pending...</p>
                )}
                <p className="text-gray-300 text-sm">Submitted at: {new Date(ticket.submitted_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
