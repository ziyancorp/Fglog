export type StoryboardStyle =
  | 'tomkins_asmr'
  | 'tiny_world'
  | 'ugc_vlog'
  | 'product_feature'
  | 'custom';

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export type SoundFocusType = 'asmr' | 'voiceover' | 'music' | 'ambient' | 'silent';

export interface SceneItem {
  sceneNumber: number;
  title: string;
  timestamp: string; // e.g. "0:00 - 0:01"
  durationSeconds: number;
  visualDescription: string;
  visualPrompt?: string;
  imageUrl?: string;
  textOnScreen?: string;
  cameraDirection?: string;
  soundDirection?: string;
  microAction?: string;
  dialogSubtitle?: string;
}

export interface StoryboardData {
  id: string;
  title: string;
  subtitle?: string;
  productName: string;
  productCategory: string;
  durationTotal: string; // e.g. "10 DETIK"
  durationSeconds: number;
  orientation: string; // e.g. "9:16 (VERTICAL)"
  aspectRatio: AspectRatio;
  targetAudience: string;
  style: StoryboardStyle;
  vibe?: string;
  difficultyRating?: number; // 1-5
  scenes: SceneItem[];
  continuityRules?: string[];
  transitions?: string[];
  asmrDetails?: string[];
  productionNotes?: string[];
  finalVisual?: string;
  creatorTips?: string[];
  parts?: {
    partNumber: number;
    partTitle: string;
    scenes: SceneItem[];
  }[];
}

export interface LookbookItem {
  id: string;
  category: 'top' | 'bottom' | 'shoes' | 'outerwear' | 'bag' | 'headwear' | 'accessory';
  label: string;
  imageUrl: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'unisex';
  imageUrl: string;
}

export interface LookbookShot {
  id: string;
  title: string;
  imageUrl: string;
  prompt: string;
  angle: string;
  pose: string;
  lighting: string;
}

export interface LookbookProject {
  id: string;
  title: string;
  items: LookbookItem[];
  model: ModelOption;
  theme: string;
  aspectRatio: AspectRatio;
  cameraAngle: string;
  shots: LookbookShot[];
}
