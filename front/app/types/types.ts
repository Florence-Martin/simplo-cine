// Interface générale pour les attributs d'une entité
export interface BaseAttributes {
  id: number;
  created_at?: Date;
  updated_at?: Date;
}

// Définissez les RoomAttributes sans id obligatoire
export interface RoomAttributes {
  room_id?: number; // Peut être optionnel, généré par la BDD
  name: string;
  seatsNumber: number;
  available?: boolean;
}

// HallAttributes étend RoomAttributes et ajoute un identifiant unique obligatoire
export interface HallAttributes extends RoomAttributes {
  id: number; // Utilisé pour l'identification dans l'application
}

// Interface pour les films (Movies)
export interface MovieAttributes extends BaseAttributes {
  title: string;
  description?: string;
  release_date?: Date;
  duration?: number;
  poster?: File | null;
  hall_id?: number;
  hall?: HallAttributes;
}

// Interface pour les séances (Screenings)
export interface ScreeningAttributes extends BaseAttributes {
  movieId: number;
  hallId: number;
  date: Date;
  startTime: string;
  duration: number;
  endTime: string;
  spectatorsCount: number;
}

// Si l'interface Screening est la même que ScreeningAttributes, vous pouvez simplement faire :
export type Screening = ScreeningAttributes;

// Interface pour les événements du calendrier
export interface MovieEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  desc: string;
}

export interface Movie {
  id: number;
  title: string;
  description?: string;
  image: string;
  type: string;
  release_date?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}
