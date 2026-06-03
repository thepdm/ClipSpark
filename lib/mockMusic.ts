export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  bpm: number;
  duration: string;
  color: string;
}

export const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Electric Rise',
    artist: 'AI Composer',
    genre: 'Electronic',
    mood: 'Energetic',
    bpm: 128,
    duration: '0:32',
    color: '#E8445A',
  },
  {
    id: 'track-2',
    title: 'Soft Morning',
    artist: 'AI Composer',
    genre: 'Ambient',
    mood: 'Calm',
    bpm: 72,
    duration: '0:30',
    color: '#7C5CFC',
  },
  {
    id: 'track-3',
    title: 'Urban Drive',
    artist: 'AI Composer',
    genre: 'Hip-Hop',
    mood: 'Confident',
    bpm: 95,
    duration: '0:28',
    color: '#1C1C1E',
  },
  {
    id: 'track-4',
    title: 'Golden Flow',
    artist: 'AI Composer',
    genre: 'Lo-Fi',
    mood: 'Nostalgic',
    bpm: 84,
    duration: '0:35',
    color: '#F59E0B',
  },
  {
    id: 'track-5',
    title: 'Neon Pulse',
    artist: 'AI Composer',
    genre: 'Synthwave',
    mood: 'Cinematic',
    bpm: 110,
    duration: '0:30',
    color: '#06B6D4',
  },
  {
    id: 'track-6',
    title: 'Pure Joy',
    artist: 'AI Composer',
    genre: 'Pop',
    mood: 'Happy',
    bpm: 118,
    duration: '0:28',
    color: '#10B981',
  },
];
