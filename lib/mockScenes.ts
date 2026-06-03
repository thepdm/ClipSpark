export interface Scene {
  id: string;
  prompt: string;
  unsplashId: string;
  duration: number;
  status: 'done' | 'generating';
  regenCount: number;
}

export const CHARACTER_IMAGES = [
  'photo-1534528741775-53994a69daeb',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1544005313-94ddf0286df2',
  'photo-1438761681033-6461ffad8d80',
  'photo-1524504388940-b1c1722653e0',
  'photo-1463453091185-61582044d556',
  'photo-1472099645785-5658abf4ff4e',
  'photo-1573496359142-b8d87734a5a2',
];

export const REGEN_POOL: string[] = [
  'photo-1441974231531-c6227db76b6e',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1448375240586-882707db888b',
  'photo-1469474968028-56623f02e42e',
  'photo-1426604966848-d7adac402bff',
  'photo-1447752875215-b2761acb3c5d',
  'photo-1501854140801-50d01698950b',
  'photo-1439853949212-36589f3d8b20',
  'photo-1516117172878-fd2c41f4a759',
  'photo-1493246507139-91e8fad9978e',
];

const STORY_SCENES: Array<{ prompt: string; unsplashId: string; duration: number }> = [
  {
    prompt: '{character} appears in the opening shot — wide angle, full atmosphere',
    unsplashId: 'photo-1516117172878-fd2c41f4a759',
    duration: 4,
  },
  {
    prompt: '{character} moves through the scene — medium shot, energy building',
    unsplashId: 'photo-1493246507139-91e8fad9978e',
    duration: 3,
  },
  {
    prompt: 'Close-up of {character} — peak emotion, cinematic lighting',
    unsplashId: 'photo-1448375240586-882707db888b',
    duration: 3,
  },
  {
    prompt: '{character} at the key story moment — dynamic angle, dramatic action',
    unsplashId: 'photo-1470071459604-3b5ec3a7fe05',
    duration: 4,
  },
  {
    prompt: 'Final shot — {character} and the world, epic outro, camera pulls back',
    unsplashId: 'photo-1426604966848-d7adac402bff',
    duration: 5,
  },
];

export function getStoryScenes(characterName: string): Scene[] {
  const name = characterName || 'the character';
  return STORY_SCENES.map((s, i) => ({
    id: `scene-${i + 1}`,
    prompt: s.prompt.replace(/{character}/g, name),
    unsplashId: s.unsplashId,
    duration: s.duration,
    status: 'done' as const,
    regenCount: 0,
  }));
}

export interface VideoTemplate {
  format: 'reels' | 'ad' | 'cinematic';
  scenes: Scene[];
}

export const TEMPLATES: Record<string, VideoTemplate> = {
  reels: {
    format: 'reels',
    scenes: [
      { id: 's1', prompt: 'Close-up product shot, vibrant colors, dynamic angle', unsplashId: 'photo-1611532736597-de2d4265fba3', duration: 3, status: 'done', regenCount: 0 },
      { id: 's2', prompt: 'Person using product, lifestyle moment, natural light', unsplashId: 'photo-1529156069898-49953e39b3ac', duration: 3, status: 'done', regenCount: 0 },
      { id: 's3', prompt: 'Detail shot, texture and quality, macro lens', unsplashId: 'photo-1506905925346-21bda4d32df4', duration: 2, status: 'done', regenCount: 0 },
      { id: 's4', prompt: 'Final hero shot, brand moment, clean background', unsplashId: 'photo-1523275335684-37898b6baf30', duration: 4, status: 'done', regenCount: 0 },
    ],
  },
  ad: {
    format: 'ad',
    scenes: [
      { id: 's1', prompt: 'Problem scene — relatable everyday struggle, candid', unsplashId: 'photo-1556742049-0cfed4f6a45d', duration: 4, status: 'done', regenCount: 0 },
      { id: 's2', prompt: 'Solution reveal — product in action, confident', unsplashId: 'photo-1542038374332-57f43b1a3a0c', duration: 4, status: 'done', regenCount: 0 },
      { id: 's3', prompt: 'Happy customer, genuine smile, real environment', unsplashId: 'photo-1494790108377-be9c29b29330', duration: 3, status: 'done', regenCount: 0 },
      { id: 's4', prompt: 'Call to action — product hero, clean studio look', unsplashId: 'photo-1585386959984-a4155224a1ad', duration: 4, status: 'done', regenCount: 0 },
    ],
  },
  cinematic: {
    format: 'cinematic',
    scenes: [
      { id: 's1', prompt: 'Wide establishing shot, dramatic sky, anamorphic lens', unsplashId: 'photo-1536440136628-849c177e76a1', duration: 5, status: 'done', regenCount: 0 },
      { id: 's2', prompt: 'Close-up face, emotion, teal & orange color grade', unsplashId: 'photo-1507003211169-0a1dd7228f2d', duration: 4, status: 'done', regenCount: 0 },
      { id: 's3', prompt: 'Slow motion action, motion blur, golden light', unsplashId: 'photo-1540959733332-eab4deabeeaf', duration: 4, status: 'done', regenCount: 0 },
      { id: 's4', prompt: 'Epic final frame, silhouette, sunset, lens flare', unsplashId: 'photo-1506905925346-21bda4d32df4', duration: 5, status: 'done', regenCount: 0 },
    ],
  },
};

export function getScenesForFormat(format: string): Scene[] {
  return TEMPLATES[format]?.scenes ?? TEMPLATES.reels.scenes;
}
