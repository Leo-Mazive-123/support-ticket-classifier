'use client';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SubmitTicket() {
  const [ticketText, setTicketText] = useState('');
  const [prediction, setPrediction] = useState<{ department: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setPrediction(null);

    if (!ticketText.trim()) {
      setError('Ticket text cannot be empty');
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('User not found');
      setLoading(false);
      return;
    }

    const { data: userRecord } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', user.email)
      .single();

    const userId = userRecord?.user_id;
    if (!userId) {
      setError('User record not found');
      setLoading(false);
      return;
    }

    const { data: ticketData, error: ticketError } = await supabase.from('tickets').insert({
      user_id: userId,
      ticket_text: ticketText,
      actual_department: null,
      confidence_score: null,
    }).select().single();

    if (!ticketData || ticketError) {
      setError(ticketError?.message || 'Ticket submission failed');
      setLoading(false);
      return;
    }

    // Simulate prediction
    const departments = ['IT', 'HR', 'Finance'];
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const confidence = Math.random() * 0.5 + 0.5;

    const { data: predictionData } = await supabase.from('predictions').insert({
      ticket_id: ticketData.ticket_id,
      predicted_department: dept,
      confidence_score: confidence,
    }).select().single();

    if (predictionData) {
      setPrediction({
        department: predictionData.predicted_department,
        confidence: predictionData.confidence_score,
      });
    }

    setTicketText('');
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center "
      style={{ backgroundImage: "url('/robo.png') " }}
    >
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
          <textarea
            placeholder="Describe your issue"
            value={ticketText}
            onChange={(e) => setTicketText(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>

        {prediction && (
          <div className="mt-6 p-4 rounded shadow bg-green-100 w-full max-w-md text-center">
            <p><b>Department:</b> {prediction.department}</p>
            <p><b>Confidence:</b> {(prediction.confidence * 100).toFixed(2)}%</p>
          </div>
        )}
      </main>
    </div>
  );
}
