export interface Registration {
  id: string; // Dynamic registration code, e.g., MM-4829
  fullName: string;
  phone: string;
  createdAt: string; // ISO String
  ticketNumber: number; // Incrementing ticket order
  checkedIn: boolean; // For organizer check-in tracking
  notes?: string;
}

export type AppView = 'form' | 'ticket' | 'admin';

export interface EventDetails {
  title: string;
  marathonName: string;
  sponsorName: string;
  sponsorSlogan: string;
  anniversary: string;
  location: string;
  address: string;
  addressDetail: string;
  dateStr: string;
  timeStr: string;
}
