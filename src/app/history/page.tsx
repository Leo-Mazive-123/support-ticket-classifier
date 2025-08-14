'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

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

      // Fetch user_id
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

      // Fetch tickets
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('ticket_id, ticket_text, submitted_at, predictions(predicted_department, confidence_score)')
        .eq('user_id', userRecord.user_id)
        .order('submitted_at', { ascending: false });

      setTickets((ticketData as Ticket[]) || []);
      setIsLoading(false);
    };

    fetchTickets();
  }, []);

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/rob.png')" }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <Navbar />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 text-white">
        <h1 className="text-4xl font-bold mb-6">Submitted Tickets History</h1>

        {isLoading ? (
          <p className="text-center text-gray-200">Loading tickets...</p>
        ) : (
          <div className="mt-6 w-full max-w-3xl space-y-4">
            {tickets.length === 0 ? (
              <p className="text-center text-gray-200">No tickets submitted yet.</p>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.ticket_id} className="border border-white/30 p-4 rounded shadow backdrop-blur-sm bg-white/20">
                  <p><b>Ticket:</b> {ticket.ticket_text}</p>
                  {ticket.predictions?.[0] ? (
                    <p>
                      <b>Department:</b> {ticket.predictions[0].predicted_department} |{' '}
                      <b>Confidence:</b> {(ticket.predictions[0].confidence_score * 100).toFixed(2)}%
                    </p>
                  ) : (
                    <p className="text-gray-200">Prediction pending...</p>
                  )}
                  <p className="text-gray-200 text-sm">Submitted at: {new Date(ticket.submitted_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
