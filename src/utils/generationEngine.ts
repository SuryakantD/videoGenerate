import { v4 as uuidv4 } from 'uuid';
import {
  Project,
  Scene,
  Character,
  Location,
  VisualStyle,
  CameraMovement,
  Transition,
  GenerationStep,
} from '../types';

const CAMERA_MOVEMENTS: CameraMovement[] = [
  'Static',
  'Slow Zoom In',
  'Slow Zoom Out',
  'Dolly In',
  'Dolly Out',
  'Pan Left',
  'Pan Right',
  'Tilt Up',
  'Tilt Down',
  'Tracking Shot',
  'Orbit',
  'Handheld',
  'Drone Movement',
];

const SCENE_PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=640&h=360&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop',
];

function generateTitle(prompt: string): string {
  const words = prompt.split(' ').filter((w) => w.length > 3);
  const keyWords = words.slice(0, 4).join(' ');
  const titles = [
    `A Journey Through ${keyWords}`,
    `${keyWords.charAt(0).toUpperCase() + keyWords.slice(1)}: A Visual Story`,
    `The Art of ${keyWords}`,
    `Beyond ${keyWords}`,
    `${keyWords.charAt(0).toUpperCase() + keyWords.slice(1)} in Motion`,
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateStory(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('airplane') || lowerPrompt.includes('flight') || lowerPrompt.includes('aviation')) {
    return `A breathtaking journey above the clouds. We begin with a sweeping view of a magnificent cityscape bathed in golden sunset light. A luxury aircraft glides gracefully through the amber sky, its silhouette cutting through wisps of cloud. Inside the pressurized cabin, warm light filters through oval windows. A distinguished passenger gazes out at the world below, lost in contemplation as the city transforms into a tapestry of light beneath him.`;
  }
  if (lowerPrompt.includes('nature') || lowerPrompt.includes('forest') || lowerPrompt.includes('mountain')) {
    return `An immersive journey through untouched wilderness. Morning mist rises from ancient forests as golden light pierces through the canopy. A lone figure traverses a mountain trail, dwarfed by towering peaks. The camera captures the raw beauty of nature — from cascading waterfalls to wildflower meadows — before culminating in a breathtaking summit view at golden hour.`;
  }
  if (lowerPrompt.includes('city') || lowerPrompt.includes('urban') || lowerPrompt.includes('street')) {
    return `A cinematic exploration of urban life. The story opens with an aerial view of a sprawling metropolis awakening at dawn. Streets come alive with movement and energy. We follow the rhythm of the city through its architecture, culture, and people, culminating in a stunning twilight panorama that captures the soul of the metropolis.`;
  }
  return `A visually stunning narrative brought to life. The story unfolds through a series of carefully composed scenes, each building upon the last to create a cohesive visual experience. From establishing shots that set the scene to intimate close-ups that reveal emotion, every frame is crafted to captivate and inspire.`;
}

function generateCharacters(prompt: string): Character[] {
  const lowerPrompt = prompt.toLowerCase();
  const characters: Character[] = [];

  if (lowerPrompt.includes('businessman') || lowerPrompt.includes('business') || lowerPrompt.includes('executive')) {
    characters.push({
      id: uuidv4(),
      name: 'Daniel',
      age: 35,
      gender: 'Male',
      ethnicity: 'Indian',
      skinTone: 'Medium warm',
      hair: 'Short black hair, neatly styled',
      eyes: 'Dark brown',
      face: 'Strong jawline, short trimmed beard, warm expression',
      body: 'Athletic build, 5\'11"',
      clothing: 'Navy blue tailored business suit, crisp white shirt, black leather shoes',
      accessories: 'Silver wristwatch, wedding band',
      personality: 'Calm, confident, contemplative',
    });
  }

  if (lowerPrompt.includes('woman') || lowerPrompt.includes('female') || lowerPrompt.includes('girl')) {
    characters.push({
      id: uuidv4(),
      name: 'Sarah',
      age: 28,
      gender: 'Female',
      ethnicity: 'Caucasian',
      skinTone: 'Fair with warm undertones',
      hair: 'Long flowing auburn hair',
      eyes: 'Green',
      face: 'High cheekbones, soft features, natural makeup',
      body: 'Slim build, 5\'6"',
      clothing: 'Elegant cream blouse, tailored dark trousers',
      accessories: 'Gold pendant necklace, small hoop earrings',
      personality: 'Graceful, determined, warm',
    });
  }

  if (lowerPrompt.includes('child') || lowerPrompt.includes('kid') || lowerPrompt.includes('boy') || lowerPrompt.includes('girl')) {
    characters.push({
      id: uuidv4(),
      name: 'Alex',
      age: 8,
      gender: 'Male',
      ethnicity: 'Mixed',
      skinTone: 'Light brown',
      hair: 'Curly dark brown hair',
      eyes: 'Bright hazel',
      face: 'Round face, freckles, wide curious eyes',
      body: 'Average build for age, 4\'2"',
      clothing: 'Blue striped t-shirt, khaki shorts, white sneakers',
      accessories: 'Colorful wristband',
      personality: 'Curious, adventurous, joyful',
    });
  }

  if (characters.length === 0) {
    characters.push({
      id: uuidv4(),
      name: 'Alex',
      age: 30,
      gender: 'Male',
      ethnicity: 'Caucasian',
      skinTone: 'Light',
      hair: 'Short brown hair',
      eyes: 'Blue',
      face: 'Clean-shaven, friendly features',
      body: 'Average build, 5\'10"',
      clothing: 'Casual dark jacket, white t-shirt, jeans',
      accessories: 'None',
      personality: 'Adventurous, calm',
    });
  }

  return characters;
}

function generateLocations(prompt: string): Location[] {
  const lowerPrompt = prompt.toLowerCase();
  const locations: Location[] = [];

  if (lowerPrompt.includes('dubai')) {
    locations.push({
      id: uuidv4(),
      name: 'Dubai Skyline',
      description: 'Iconic Dubai skyline featuring Burj Khalifa, Burj Al Arab, and modern skyscrapers against a golden sunset sky',
    });
  }

  if (lowerPrompt.includes('airplane') || lowerPrompt.includes('aircraft') || lowerPrompt.includes('cabin')) {
    locations.push({
      id: uuidv4(),
      name: 'Luxury Aircraft Cabin',
      description: 'Premium first-class airplane cabin with cream leather seats, ambient warm lighting, polished wood accents, and large oval windows',
    });
  }

  if (lowerPrompt.includes('city') || lowerPrompt.includes('urban')) {
    locations.push({
      id: uuidv4(),
      name: 'Modern Cityscape',
      description: 'A vibrant modern city with glass skyscrapers, wide boulevards, and dynamic urban energy',
    });
  }

  if (lowerPrompt.includes('nature') || lowerPrompt.includes('forest') || lowerPrompt.includes('mountain')) {
    locations.push({
      id: uuidv4(),
      name: 'Mountain Wilderness',
      description: 'Pristine mountain landscape with snow-capped peaks, alpine meadows, and crystal-clear streams',
    });
  }

  if (locations.length === 0) {
    locations.push({
      id: uuidv4(),
      name: 'Primary Location',
      description: `Setting inspired by: ${prompt.slice(0, 100)}`,
    });
  }

  return locations;
}

function generateScenes(
  prompt: string,
  characters: Character[],
  locations: Location[],
  style: VisualStyle
): Scene[] {
  const lowerPrompt = prompt.toLowerCase();
  const scenes: Scene[] = [];
  const totalDuration = 15;

  if (lowerPrompt.includes('airplane') || lowerPrompt.includes('flight') || lowerPrompt.includes('dubai')) {
    const sceneConfigs = [
      {
        startTime: 0,
        duration: 3,
        description: 'Dubai skyline at golden sunset, establishing shot',
        cameraAngle: 'Wide aerial',
        cameraMovement: 'Drone Movement' as CameraMovement,
        characters: [] as string[],
        location: locations[0]?.name || 'Dubai Skyline',
        objects: ['Skyscrapers', 'Sunset sky', 'Clouds'],
        lighting: 'Golden hour warm light',
        weather: 'Clear',
        timeOfDay: 'Sunset',
        emotion: 'Awe, wonder',
        transition: 'Dissolve' as Transition,
      },
      {
        startTime: 3,
        duration: 4,
        description: 'Luxury aircraft flying gracefully above Dubai',
        cameraAngle: 'Medium tracking',
        cameraMovement: 'Tracking Shot' as CameraMovement,
        characters: [] as string[],
        location: 'Sky above Dubai',
        objects: ['Aircraft', 'Clouds', 'City below'],
        lighting: 'Warm sunset backlight',
        weather: 'Clear with light clouds',
        timeOfDay: 'Sunset',
        emotion: 'Elegance, freedom',
        transition: 'Cut' as Transition,
      },
      {
        startTime: 7,
        duration: 4,
        description: 'Interior of luxury airplane cabin, warm ambient lighting',
        cameraAngle: 'Medium shot',
        cameraMovement: 'Slow Dolly In' as CameraMovement,
        characters: characters.map((c) => c.name),
        location: locations.find((l) => l.name.includes('Cabin'))?.name || 'Luxury Aircraft Cabin',
        objects: ['Leather seat', 'Window', 'Cabin interior'],
        lighting: 'Warm ambient cabin lighting with sunset glow through window',
        weather: 'N/A',
        timeOfDay: 'Sunset',
        emotion: 'Comfort, luxury',
        transition: 'Dissolve' as Transition,
      },
      {
        startTime: 11,
        duration: 4,
        description: 'Passenger looking through airplane window at Dubai skyline',
        cameraAngle: 'Over-the-shoulder close-up',
        cameraMovement: 'Slow Zoom In' as CameraMovement,
        characters: characters.map((c) => c.name),
        location: 'Luxury Aircraft Cabin',
        objects: ['Window', 'Dubai skyline visible through window'],
        lighting: 'Golden light streaming through window onto face',
        weather: 'Clear',
        timeOfDay: 'Sunset',
        emotion: 'Contemplation, peace',
        transition: 'Fade' as Transition,
      },
    ];

    sceneConfigs.forEach((config, index) => {
      const charDescriptions = characters
        .filter((c) => config.characters.includes(c.name))
        .map((c) => `${c.name}, ${c.age}-year-old ${c.ethnicity} ${c.gender.toLowerCase()} with ${c.skinTone.toLowerCase()} skin, ${c.hair}, ${c.eyes} eyes, wearing ${c.clothing}`)
        .join(', ');

      scenes.push({
        id: uuidv4(),
        sceneNumber: index + 1,
        startTime: config.startTime,
        duration: config.duration,
        description: config.description,
        cameraAngle: config.cameraAngle,
        cameraMovement: config.cameraMovement,
        characters: config.characters,
        location: config.location,
        objects: config.objects,
        lighting: config.lighting,
        weather: config.weather,
        timeOfDay: config.timeOfDay,
        emotion: config.emotion,
        visualStyle: style,
        imagePrompt: `${style} style shot. ${config.description}. ${charDescriptions ? `Featuring: ${charDescriptions}.` : ''} Location: ${config.location}. Objects: ${config.objects.join(', ')}. ${config.cameraAngle} camera angle. ${config.lighting}. Time: ${config.timeOfDay}. Weather: ${config.weather}. Emotion: ${config.emotion}. High quality, detailed, consistent visual style.`,
        videoPrompt: `${config.cameraMovement} camera movement. ${config.description}. Subtle natural movement. ${config.emotion} mood. Smooth cinematic motion.`,
        status: 'pending',
        transition: config.transition,
        generatedImage: SCENE_PLACEHOLDER_IMAGES[index % SCENE_PLACEHOLDER_IMAGES.length],
      });
    });
  } else {
    const numScenes = Math.min(4, Math.max(3, Math.floor(totalDuration / 4)));
    const sceneDuration = totalDuration / numScenes;

    for (let i = 0; i < numScenes; i++) {
      const movement = CAMERA_MOVEMENTS[Math.floor(Math.random() * CAMERA_MOVEMENTS.length)];
      const transitions: Transition[] = ['Cut', 'Dissolve', 'Fade', 'Cut'];

      scenes.push({
        id: uuidv4(),
        sceneNumber: i + 1,
        startTime: Math.round(i * sceneDuration),
        duration: i === numScenes - 1 ? totalDuration - Math.round(i * sceneDuration) : Math.round(sceneDuration),
        description: `Scene ${i + 1}: ${prompt.slice(0, 50)}${i === 0 ? ' - establishing' : i === numScenes - 1 ? ' - conclusion' : ' - development'}`,
        cameraAngle: i === 0 ? 'Wide establishing' : i === numScenes - 1 ? 'Close-up detail' : 'Medium shot',
        cameraMovement: movement,
        characters: characters.map((c) => c.name),
        location: locations[i % locations.length]?.name || 'Primary Location',
        objects: ['Environment details'],
        lighting: i === 0 ? 'Natural ambient' : i === numScenes - 1 ? 'Dramatic golden hour' : 'Balanced natural',
        weather: 'Clear',
        timeOfDay: 'Golden hour',
        emotion: i === 0 ? 'Introduction' : i === numScenes - 1 ? 'Resolution' : 'Development',
        visualStyle: style,
        imagePrompt: `${style} style. Scene ${i + 1} of ${numScenes}. ${prompt}. ${characters.map((c) => `${c.name}: ${c.clothing}, ${c.hair}`).join('. ')}. Location: ${locations[i % locations.length]?.description}. Cinematic composition, high detail.`,
        videoPrompt: `${movement} camera. Smooth cinematic motion. Natural movement. ${style} aesthetic.`,
        status: 'pending',
        transition: transitions[i % transitions.length],
        generatedImage: SCENE_PLACEHOLDER_IMAGES[i % SCENE_PLACEHOLDER_IMAGES.length],
      });
    }
  }

  return scenes;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateProject(
  prompt: string,
  duration: 15,
  aspectRatio: '16:9' | '9:16' | '1:1',
  style: VisualStyle,
  quality: 'Standard' | 'High Quality',
  dispatch: React.Dispatch<any>,
  projectId: string,
  updateStep: (stepId: string, status: GenerationStep['status'], progress: number) => void
): Promise<Project> {
  const steps: GenerationStep[] = [
    { id: 'understanding', label: 'Understanding your idea', status: 'pending', progress: 0 },
    { id: 'story', label: 'Creating story', status: 'pending', progress: 0 },
    { id: 'characters', label: 'Creating characters', status: 'pending', progress: 0 },
    { id: 'locations', label: 'Creating locations', status: 'pending', progress: 0 },
    { id: 'storyboard', label: 'Creating storyboard', status: 'pending', progress: 0 },
    { id: 'images', label: 'Generating scene images', status: 'pending', progress: 0 },
    { id: 'video', label: 'Creating video clips', status: 'pending', progress: 0 },
    { id: 'rendering', label: 'Rendering final video', status: 'pending', progress: 0 },
  ];

  dispatch({ type: 'SET_GENERATION_STEPS', payload: steps });

  // Step 1: Understanding
  updateStep('understanding', 'active', 0);
  await delay(800);
  updateStep('understanding', 'completed', 100);

  // Step 2: Story
  updateStep('story', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Story' } });
  await delay(1200);
  updateStep('story', 'completed', 100);
  const title = generateTitle(prompt);
  const story = generateStory(prompt);
  dispatch({ type: 'UPDATE_PROJECT', payload: { id: projectId, title, story } });

  // Step 3: Characters
  updateStep('characters', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Characters' } });
  await delay(1000);
  const characters = generateCharacters(prompt);
  dispatch({ type: 'UPDATE_CHARACTERS', payload: { projectId, characters } });
  updateStep('characters', 'completed', 100);

  // Step 4: Locations
  updateStep('locations', 'active', 0);
  await delay(800);
  const locations = generateLocations(prompt);
  dispatch({ type: 'UPDATE_LOCATIONS', payload: { projectId, locations } });
  updateStep('locations', 'completed', 100);

  // Step 5: Storyboard
  updateStep('storyboard', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Storyboard' } });
  await delay(1000);
  const scenes = generateScenes(prompt, characters, locations, style);
  dispatch({
    type: 'UPDATE_PROJECT',
    payload: { id: projectId, scenes, aspectRatio, quality },
  });
  updateStep('storyboard', 'completed', 100);

  // Step 6: Images
  updateStep('images', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Images' } });
  for (let i = 0; i < scenes.length; i++) {
    await delay(1500);
    const progress = ((i + 1) / scenes.length) * 100;
    updateStep('images', 'active', progress);
    dispatch({
      type: 'UPDATE_SCENE',
      payload: {
        projectId,
        scene: { ...scenes[i], status: 'completed', generatedImage: SCENE_PLACEHOLDER_IMAGES[i % SCENE_PLACEHOLDER_IMAGES.length] },
      },
    });
  }
  updateStep('images', 'completed', 100);

  // Step 7: Video
  updateStep('video', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Video' } });
  for (let i = 0; i < scenes.length; i++) {
    await delay(2000);
    const progress = ((i + 1) / scenes.length) * 100;
    updateStep('video', 'active', progress);
  }
  updateStep('video', 'completed', 100);

  // Step 8: Rendering
  updateStep('rendering', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Rendering' } });
  await delay(3000);
  updateStep('rendering', 'completed', 100);

  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Completed' } });
  dispatch({ type: 'UPDATE_PROJECT', payload: { id: projectId, finalVideo: 'ready' } });

  const project: Project = {
    id: projectId,
    title,
    originalPrompt: prompt,
    duration,
    aspectRatio,
    visualStyle: style,
    quality,
    status: 'Completed',
    story,
    characters,
    locations,
    scenes,
    musicStyle: 'Cinematic',
    voiceover: '',
    voiceGender: 'Male',
    voiceLanguage: 'English',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return project;
}

export function estimateCost(numScenes: number, quality: 'Standard' | 'High Quality'): { images: number; videos: number; estimatedCost: number } {
  const imageCost = quality === 'High Quality' ? 0.04 : 0.02;
  const videoCost = quality === 'High Quality' ? 0.15 : 0.08;
  const images = numScenes;
  const videos = numScenes;
  const estimatedCost = images * imageCost + videos * videoCost;
  return { images, videos, estimatedCost: Math.round(estimatedCost * 100) / 100 };
}
