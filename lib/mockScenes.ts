export interface Scene {
  id: string;
  prompt: string;
  unsplashId: string;
  duration: number;
}

export interface VideoTemplate {
  format: 'reels' | 'ad' | 'cinematic';
  scenes: Scene[];
}

export const TEMPLATES: Record<string, VideoTemplate> = {
  reels: {
    format: 'reels',
    scenes: [
      { id: 's1', prompt: 'Close-up product shot, vibrant colors, dynamic angle', unsplashId: 'photo-1611532736597-de2d4265fba3', duration: 3 },
      { id: 's2', prompt: 'Person using product, lifestyle moment, natural light', unsplashId: 'photo-1529156069898-49953e39b3ac', duration: 3 },
      { id: 's3', prompt: 'Detail shot, texture and quality, macro lens', unsplashId: 'photo-1506905925346-21bda4d32df4', duration: 2 },
      { id: 's4', prompt: 'Final hero shot, brand moment, clean background', unsplashId: 'photo-1523275335684-37898b6baf30', duration: 4 },
    ],
  },
  ad: {
    format: 'ad',
    scenes: [
      { id: 's1', prompt: 'Problem scene — relatable everyday struggle, candid', unsplashId: 'photo-1556742049-0cfed4f6a45d', duration: 4 },
      { id: 's2', prompt: 'Solution reveal — product in action, confident', unsplashId: 'photo-1542038374332-57f43b1a3a0c', duration: 4 },
      { id: 's3', prompt: 'Happy customer, genuine smile, real environment', unsplashId: 'photo-1494790108377-be9c29b29330', duration: 3 },
      { id: 's4', prompt: 'Call to action — product hero, clean studio look', unsplashId: 'photo-1585386959984-a4155224a1ad', duration: 4 },
    ],
  },
  cinematic: {
    format: 'cinematic',
    scenes: [
      { id: 's1', prompt: 'Wide establishing shot, dramatic sky, anamorphic lens', unsplashId: 'photo-1536440136628-849c177e76a1', duration: 5 },
      { id: 's2', prompt: 'Close-up face, emotion, teal & orange color grade', unsplashId: 'photo-1507003211169-0a1dd7228f2d', duration: 4 },
      { id: 's3', prompt: 'Slow motion action, motion blur, golden light', unsplashId: 'photo-1540959733332-eab4deabeeaf', duration: 4 },
      { id: 's4', prompt: 'Epic final frame, silhouette, sunset, lens flare', unsplashId: 'photo-1506905925346-21bda4d32df4', duration: 5 },
    ],
  },
};

export function getScenesForFormat(format: string): Scene[] {
  return TEMPLATES[format]?.scenes ?? TEMPLATES.reels.scenes;
}
