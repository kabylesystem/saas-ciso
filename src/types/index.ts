export type HairType = 'straight' | 'wavy' | 'curly' | 'coily';

export interface Client {
  id: string;
  name: string;
  phone: string;
  hairType: HairType;
  visitCount: number;
  noShowCount: number;
  lastVisit?: string;
  notes?: string;
  preferredProducts?: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  scheduledStartTime: string;
  duration: number;
  price: number;
  isActive: boolean;
  isCompleted?: boolean;
  isNoShow?: boolean;
  recalculatedStartTime?: string;
  client?: Client;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  forHairTypes: HairType[];
  emoji: string;
}

export interface PerformanceMetrics {
  totalRevenue: number;
  appRevenue: number;
  timeManaged: number;
  clientsNotified: number;
  tipsTotal: number;
  completedToday: number;
  noShowsToday: number;
}

export type ThemeMode = 'dark' | 'light';
