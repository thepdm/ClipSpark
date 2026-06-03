export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  bpm: number;
  duration: string;
  color: string;
  source?: 'library' | 'ai_generated';
}

export const TRACKS: Track[] = [
  { id: 'track-1', title: 'Electric Rise', artist: 'AI Composer', genre: 'Electronic', mood: 'Energetic', bpm: 128, duration: '0:32', color: '#E8445A', source: 'library' },
  { id: 'track-2', title: 'Soft Morning', artist: 'AI Composer', genre: 'Ambient', mood: 'Calm', bpm: 72, duration: '0:30', color: '#7C5CFC', source: 'library' },
  { id: 'track-3', title: 'Urban Drive', artist: 'AI Composer', genre: 'Hip-Hop', mood: 'Confident', bpm: 95, duration: '0:28', color: '#1C1C1E', source: 'library' },
  { id: 'track-4', title: 'Golden Flow', artist: 'AI Composer', genre: 'Lo-Fi', mood: 'Nostalgic', bpm: 84, duration: '0:35', color: '#F59E0B', source: 'library' },
  { id: 'track-5', title: 'Neon Pulse', artist: 'AI Composer', genre: 'Synthwave', mood: 'Cinematic', bpm: 110, duration: '0:30', color: '#06B6D4', source: 'library' },
  { id: 'track-6', title: 'Pure Joy', artist: 'AI Composer', genre: 'Pop', mood: 'Happy', bpm: 118, duration: '0:28', color: '#10B981', source: 'library' },
];

const GENRE_MAP: Record<string, string> = {
  Energetic: 'Electronic',
  Calm: 'Ambient',
  Confident: 'Hip-Hop',
  Dark: 'Cinematic',
  Playful: 'Pop',
  Epic: 'Orchestral',
  Romantic: 'Lo-Fi',
  Mysterious: 'Synthwave',
};

const COLOR_MAP: Record<string, string> = {
  Energetic: '#E8445A',
  Calm: '#7C5CFC',
  Confident: '#1C1C1E',
  Dark: '#374151',
  Playful: '#10B981',
  Epic: '#F59E0B',
  Romantic: '#EC4899',
  Mysterious: '#06B6D4',
};

export function generateAITracks(description: string, moods: string[], tempo: string): [Track, Track] {
  const bpmBase = tempo === 'Slow' ? 72 : tempo === 'Fast' ? 128 : 95;
  const primaryMood = moods[0] || 'Energetic';
  const genre = GENRE_MAP[primaryMood] || 'Electronic';
  const color = COLOR_MAP[primaryMood] || '#E8445A';
  const label = description.trim().slice(0, 24) || primaryMood;

  return [
    {
      id: 'gen-a',
      title: `${label} – Variant A`,
      artist: 'AI Composer',
      genre,
      mood: primaryMood,
      bpm: bpmBase,
      duration: '0:30',
      color,
      source: 'ai_generated',
    },
    {
      id: 'gen-b',
      title: `${label} – Variant B`,
      artist: 'AI Composer',
      genre,
      mood: primaryMood,
      bpm: bpmBase + 8,
      duration: '0:30',
      color: COLOR_MAP[moods[1]] || '#7C5CFC',
      source: 'ai_generated',
    },
  ];
}
