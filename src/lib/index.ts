// ============================================================
// Routes
// ============================================================
export const ROUTE_PATHS = {
  HOME: "/",
} as const;

// ============================================================
// Types
// ============================================================
export interface RSVPFormData {
  name: string;
  email: string;
  guestCount: number;
  message: string;
}

export interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

// ============================================================
// Constants
// ============================================================
export const EVENT_DATE = new Date("2026-08-29T12:00:00");

export const EVENT_DETAILS = {
  date: "Saturday, August 29, 2026",
  time: "17:00 PM",
  venue: "Angke Heritage - PIK 2, Lounge Room",
  address: "Jl. M.H Thamrin Kav DJ-09, Jl. M.H. Thamrin, Salembaran, Kec. Kosambi, Kabupaten Tangerang, Banten",
  dressCode: "Black Semi-Formal",
  rsvpDeadline: "August 1, 2026",
};

export const CONFETTI_COLORS = [
  "#6b5344",
  "#8b7355",
  "#9d8b7e",
  "#5d4e47",
  "#a0836d",
  "#704d3d",
  "#8d7964",
  "#6d5d4f",
];

// ============================================================
// Utility functions
// ============================================================
export function getTimeRemaining(eventDate: Date) {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 2,
    velocityY: 1 + Math.random() * 2,
  }));
}
