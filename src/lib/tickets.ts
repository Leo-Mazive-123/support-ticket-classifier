import ticketsData from '@/data/tickets.json';

export type Ticket = {
  id: number;
  description: string;
  department: string;
};

export const tickets: Ticket[] = ticketsData as Ticket[];
