export enum Task {
  Concierge = 'Conciergerie',
  Cleaning = 'Ménage',
  Laundry = 'Entretien du linge',
}

// FIX: Added ChecklistItem interface to define the shape of a checklist item.
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// FIX: Added CleaningStatus enum to define possible cleaning statuses for an apartment.
export enum CleaningStatus {
  ToBeCleaned = 'À nettoyer',
  InProgress = 'En cours',
  Clean = 'Propre',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Personnel';
  tasks: Task[];
}

export interface Apartment {
  id:string;
  name: string;
  address: string;
  description: string;
  personnel: {
    [key in Task]?: string; // UserId
  };
  // FIX: Added status and checklist properties to the Apartment interface.
  status: CleaningStatus;
  checklist: ChecklistItem[];
}

export enum ReservationStatus {
  Upcoming = 'À venir',
  Cleaning = 'Ménage en cours',
  Laundry = 'Linge en cours',
  Archived = 'Archivée',
}

export interface Reservation {
  id: string;
  apartmentId: string;
  tenantName: string;
  guestCount: number;
  arrival: string; // ISO Date string
  departure: string; // ISO Date string
  personnel: {
    [key in Task]?: string; // UserId
  };
  remarks: string;
  status: ReservationStatus;
  cleaningCompleted?: boolean;
  laundryCompleted?: boolean;
}

export type Page = 'flux' | 'reservations' | 'calendar' | 'archives' | 'settings';