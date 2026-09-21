export type VideoDuration = 15 | 30 | 60;
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type VisualStyle =
  | 'Cinematic'
  | 'Photorealistic'
  | '3D Animation'
  | 'Pixar-style Animation'
  | 'Anime'
  | 'Cartoon'
  | 'Commercial'
  | 'Luxury Advertisement'
  | 'Documentary'
  | 'Sci-Fi'
  | 'Fantasy';

export type VideoQuality = 'Standard' | 'High Quality';

export type ProjectStatus =
  | 'Draft'
  | 'Generating Story'
  | 'Generating Characters'
  | 'Generating Storyboard'
  | 'Generating Images'
  | 'Generating Video'
  | 'Rendering'
  | 'Completed'
  | 'Failed';

export type SceneStatus = 'pending' | 'generating' | 'completed' | 'failed';

export type CameraMovement =
  | 'Static'
  | 'Slow Zoom In'
  | 'Slow Zoom Out'
  | 'Dolly In'
  | 'Dolly Out'
  | 'Slow Dolly In'
  | 'Slow Dolly Out'
  | 'Pan Left'
  | 'Pan Right'
  | 'Tilt Up'
  | 'Tilt Down'
  | 'Tracking Shot'
  | 'Orbit'
  | 'Handheld'
  | 'Drone Movement';

export type Transition = 'Cut' | 'Fade' | 'Dissolve' | 'Zoom' | 'Motion';

export type MusicStyle =
  | 'Cinematic'
  | 'Emotional'
  | 'Corporate'
  | 'Luxury'
  | 'Epic'
  | 'Suspense'
  | 'Happy'
  | 'Inspirational'
  | 'No Music';

export interface Character {
  id: string;
  name: string;
  age: number;
  gender: string;
  ethnicity: string;
  skinTone: string;
  hair: string;
  eyes: string;
  face: string;
  body: string;
  clothing: string;
  accessories: string;
  personality: string;
  referenceImage?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  referenceImage?: string;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  startTime: number;
  duration: number;
  description: string;
  cameraAngle: string;
  cameraMovement: CameraMovement;
  characters: string[];
  location: string;
  objects: string[];
  lighting: string;
  weather: string;
  timeOfDay: string;
  emotion: string;
  visualStyle: string;
  imagePrompt: string;
  videoPrompt: string;
  generatedImage?: string;
  generatedVideo?: string;
  status: SceneStatus;
  transition: Transition;
}

export interface Project {
  id: string;
  title: string;
  originalPrompt: string;
  duration: VideoDuration;
  aspectRatio: AspectRatio;
  visualStyle: VisualStyle;
  quality: VideoQuality;
  status: ProjectStatus;
  story: string;
  characters: Character[];
  locations: Location[];
  scenes: Scene[];
  musicStyle: MusicStyle;
  voiceover: string;
  voiceGender: 'Male' | 'Female';
  voiceLanguage: string;
  finalVideo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
}

export interface CostEstimate {
  images: number;
  videos: number;
  estimatedCost: number;
}
