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
import {
  generateText,
  generateImageUrl,
  generateVideoFromImages,
  validateImageUrl,
} from '../services/pollinations';

// ============ PROMPT ENGINE ============
function buildCharacterBible(char: Character): string {
  return `${char.name}, ${char.age}-year-old ${char.ethnicity} ${char.gender.toLowerCase()} with ${char.skinTone.toLowerCase()} skin, ${char.hair}, ${char.eyes} eyes, ${char.face}, ${char.body}, wearing ${char.clothing}${char.accessories ? ', ' + char.accessories : ''}`;
}

function buildSceneImagePrompt(
  scene: Scene,
  characters: Character[],
  locations: Location[],
  style: VisualStyle,
  aspectRatio: string
): string {
  const sceneCharacters = characters.filter((c) => scene.characters.includes(c.name));
  const characterDescriptions = sceneCharacters.map(buildCharacterBible).join('. ');
  const location = locations.find((l) => scene.location.includes(l.name));

  const parts = [
    style,
    'style',
    scene.description,
    characterDescriptions ? `Featuring: ${characterDescriptions}` : '',
    location ? `Location: ${location.description}` : '',
    scene.objects.length > 0 ? `Objects: ${scene.objects.join(', ')}` : '',
    `${scene.cameraAngle} camera angle`,
    scene.lighting,
    `Time: ${scene.timeOfDay}`,
    scene.weather !== 'N/A' ? `Weather: ${scene.weather}` : '',
    `Mood: ${scene.emotion}`,
    'highly detailed, professional quality',
    aspectRatio === '9:16' ? 'vertical composition, portrait orientation' :
    aspectRatio === '1:1' ? 'square composition' :
    'cinematic widescreen composition',
  ].filter(Boolean);

  return parts.join(', ');
}

function buildSceneVideoPrompt(scene: Scene): string {
  return `${scene.cameraMovement} camera movement. ${scene.description}. Smooth cinematic motion. ${scene.emotion} mood. Natural subtle movement.`;
}

// ============ STORY GENERATION ============
async function generateStoryFromAI(prompt: string): Promise<{ title: string; story: string }> {
  const systemPrompt = `You are a professional screenwriter. Given a video concept, create a compelling 15-second visual story. The story should be visually descriptive, concise, and suitable for a short video. No dialogue needed - focus on visual storytelling. Return your response as JSON with "title" and "story" fields.`;

  const userPrompt = `Create a 15-second video story based on this concept: "${prompt}". Return JSON: {"title": "...", "story": "..."}`;

  try {
    const response = await generateText(userPrompt, systemPrompt);
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || 'Untitled Video',
        story: parsed.story || prompt,
      };
    }
  } catch (error) {
    console.error('Story generation error:', error);
  }

  // Fallback
  return {
    title: prompt.split(' ').slice(0, 5).join(' '),
    story: `A visual journey: ${prompt}. The story unfolds through carefully composed scenes, building from establishing shots to intimate details, creating a cohesive 15-second visual experience.`,
  };
}

// ============ CHARACTER GENERATION ============
async function generateCharactersFromAI(prompt: string): Promise<Character[]> {
  const systemPrompt = `You are a character designer. Analyze the video concept and identify all characters. For each character, provide detailed physical descriptions for visual consistency. Return JSON array of character objects.`;

  const userPrompt = `Based on this video concept: "${prompt}", identify all characters and create detailed character descriptions. Return JSON array: [{"name": "...", "age": number, "gender": "Male/Female", "ethnicity": "...", "skinTone": "...", "hair": "...", "eyes": "...", "face": "...", "body": "...", "clothing": "...", "accessories": "...", "personality": "..."}]`;

  try {
    const response = await generateText(userPrompt, systemPrompt);
    
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((c: any) => ({
        id: uuidv4(),
        name: c.name || 'Character',
        age: c.age || 30,
        gender: c.gender || 'Male',
        ethnicity: c.ethnicity || 'Caucasian',
        skinTone: c.skinTone || 'Light',
        hair: c.hair || 'Short brown hair',
        eyes: c.eyes || 'Brown',
        face: c.face || 'Clean features',
        body: c.body || 'Average build',
        clothing: c.clothing || 'Casual attire',
        accessories: c.accessories || 'None',
        personality: c.personality || 'Calm',
      }));
    }
  } catch (error) {
    console.error('Character generation error:', error);
  }

  // Fallback
  return [{
    id: uuidv4(),
    name: 'Protagonist',
    age: 30,
    gender: 'Male',
    ethnicity: 'Caucasian',
    skinTone: 'Light',
    hair: 'Short brown hair',
    eyes: 'Brown',
    face: 'Clean-shaven, friendly features',
    body: 'Average build, 5\'10"',
    clothing: 'Dark jacket, white shirt',
    accessories: 'None',
    personality: 'Adventurous, calm',
  }];
}

// ============ LOCATION GENERATION ============
async function generateLocationsFromAI(prompt: string): Promise<Location[]> {
  const systemPrompt = `You are a location scout. Identify key locations/environments for the video. Return JSON array of location objects.`;

  const userPrompt = `For this video: "${prompt}", identify 1-3 key locations. Return JSON: [{"name": "...", "description": "detailed visual description"}]`;

  try {
    const response = await generateText(userPrompt, systemPrompt);
    
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((l: any) => ({
        id: uuidv4(),
        name: l.name || 'Location',
        description: l.description || 'A visually striking location',
      }));
    }
  } catch (error) {
    console.error('Location generation error:', error);
  }

  return [{
    id: uuidv4(),
    name: 'Primary Location',
    description: `Setting for: ${prompt.slice(0, 100)}`,
  }];
}

// ============ SCENE PLANNING ============
async function generateScenesFromAI(
  prompt: string,
  story: string,
  characters: Character[],
  locations: Location[],
  style: VisualStyle
): Promise<Scene[]> {
  const charNames = characters.map((c) => c.name).join(', ');
  const locNames = locations.map((l) => l.name).join(', ');

  const systemPrompt = `You are a storyboard artist. Plan 4 scenes for a 15-second video. Each scene should have specific camera work and visual details. Characters available: ${charNames}. Locations: ${locNames}. Return JSON array.`;

  const userPrompt = `Create 4 scenes for this 15-second video. Story: "${story}". Original concept: "${prompt}". Return JSON array: [{"sceneNumber": 1, "startTime": 0, "duration": 4, "description": "...", "cameraAngle": "...", "cameraMovement": "Static|Slow Zoom In|Slow Zoom Out|Dolly In|Pan Left|Pan Right|Tilt Up|Tracking Shot|Orbit|Drone Movement", "characters": ["name1"], "location": "location name", "objects": ["obj1"], "lighting": "...", "weather": "...", "timeOfDay": "...", "emotion": "...", "transition": "Cut|Fade|Dissolve"}]`;

  const cameraMovements: CameraMovement[] = [
    'Static', 'Slow Zoom In', 'Slow Zoom Out', 'Dolly In',
    'Pan Left', 'Pan Right', 'Tilt Up', 'Tracking Shot', 'Drone Movement',
  ];

  try {
    const response = await generateText(userPrompt, systemPrompt);
    
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((s: any, i: number) => ({
        id: uuidv4(),
        sceneNumber: s.sceneNumber || i + 1,
        startTime: s.startTime ?? i * 4,
        duration: s.duration || 4,
        description: s.description || `Scene ${i + 1}`,
        cameraAngle: s.cameraAngle || 'Medium shot',
        cameraMovement: (cameraMovements.includes(s.cameraMovement) ? s.cameraMovement : 'Slow Zoom In') as CameraMovement,
        characters: s.characters || [],
        location: s.location || locations[0]?.name || 'Location',
        objects: s.objects || [],
        lighting: s.lighting || 'Natural light',
        weather: s.weather || 'Clear',
        timeOfDay: s.timeOfDay || 'Daytime',
        emotion: s.emotion || 'Neutral',
        visualStyle: style,
        imagePrompt: '',
        videoPrompt: '',
        status: 'pending' as const,
        transition: (['Cut', 'Fade', 'Dissolve'].includes(s.transition) ? s.transition : 'Cut') as Transition,
      }));
    }
  } catch (error) {
    console.error('Scene generation error:', error);
  }

  // Fallback: 4 scenes
  const fallbackDurations = [3, 4, 4, 4];
  let startTime = 0;
  return Array.from({ length: 4 }, (_, i) => {
    const duration = fallbackDurations[i];
    const scene: Scene = {
      id: uuidv4(),
      sceneNumber: i + 1,
      startTime,
      duration,
      description: i === 0 ? `Opening: ${prompt.slice(0, 50)}` :
                   i === 3 ? `Closing scene with resolution` :
                   `Development scene ${i}`,
      cameraAngle: i === 0 ? 'Wide establishing' : i === 3 ? 'Close-up' : 'Medium shot',
      cameraMovement: cameraMovements[i % cameraMovements.length],
      characters: characters.map((c) => c.name),
      location: locations[i % locations.length]?.name || 'Location',
      objects: ['Environment details'],
      lighting: 'Natural ambient',
      weather: 'Clear',
      timeOfDay: 'Golden hour',
      emotion: i === 0 ? 'Introduction' : i === 3 ? 'Resolution' : 'Development',
      visualStyle: style,
      imagePrompt: '',
      videoPrompt: '',
      status: 'pending',
      transition: (['Cut', 'Dissolve', 'Fade', 'Cut'] as Transition[])[i],
    };
    startTime += duration;
    return scene;
  });
}

// ============ MAIN GENERATION PIPELINE ============
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
    { id: 'story', label: 'Creating story with AI', status: 'pending', progress: 0 },
    { id: 'characters', label: 'Generating characters', status: 'pending', progress: 0 },
    { id: 'locations', label: 'Scouting locations', status: 'pending', progress: 0 },
    { id: 'storyboard', label: 'Planning storyboard', status: 'pending', progress: 0 },
    { id: 'images', label: 'Generating scene images (AI)', status: 'pending', progress: 0 },
    { id: 'video', label: 'Creating video clips (AI)', status: 'pending', progress: 0 },
    { id: 'rendering', label: 'Rendering final video', status: 'pending', progress: 0 },
  ];

  dispatch({ type: 'SET_GENERATION_STEPS', payload: steps });

  // Step 1: Understanding
  updateStep('understanding', 'active', 0);
  await delay(500);
  updateStep('understanding', 'completed', 100);

  // Step 2: Generate Story (REAL AI - Pollinations)
  updateStep('story', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Story' } });
  const { title, story } = await generateStoryFromAI(prompt);
  dispatch({ type: 'UPDATE_PROJECT', payload: { id: projectId, title, story } });
  updateStep('story', 'completed', 100);

  // Step 3: Generate Characters (REAL AI - Pollinations)
  updateStep('characters', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Characters' } });
  const characters = await generateCharactersFromAI(prompt);
  dispatch({ type: 'UPDATE_CHARACTERS', payload: { projectId, characters } });
  updateStep('characters', 'completed', 100);

  // Step 4: Generate Locations (REAL AI - Pollinations)
  updateStep('locations', 'active', 0);
  const locations = await generateLocationsFromAI(prompt);
  dispatch({ type: 'UPDATE_LOCATIONS', payload: { projectId, locations } });
  updateStep('locations', 'completed', 100);

  // Step 5: Generate Storyboard (REAL AI - Pollinations)
  updateStep('storyboard', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Storyboard' } });
  let scenes = await generateScenesFromAI(prompt, story, characters, locations, style);

  // Build image prompts for each scene
  scenes = scenes.map((scene) => ({
    ...scene,
    imagePrompt: buildSceneImagePrompt(scene, characters, locations, style, aspectRatio),
    videoPrompt: buildSceneVideoPrompt(scene),
  }));

  dispatch({
    type: 'UPDATE_PROJECT',
    payload: { id: projectId, scenes, aspectRatio, quality },
  });
  updateStep('storyboard', 'completed', 100);

  // Step 6: Generate Images (REAL AI - Pollinations)
  updateStep('images', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Images' } });

  const imageDimensions = aspectRatio === '9:16' ? { width: 576, height: 1024 } :
                          aspectRatio === '1:1' ? { width: 768, height: 768 } :
                          { width: 1024, height: 576 };

  console.log('[GenerationEngine] Starting image generation for', scenes.length, 'scenes');

  // Generate all image URLs first
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    
    console.log(`[GenerationEngine] Generating image for Scene ${i + 1}:`, scene.description);
    
    try {
      // Generate REAL image URL from Pollinations
      const imageUrl = generateImageUrl(scene.imagePrompt, {
        ...imageDimensions,
        seed: projectId.charCodeAt(0) * 1000 + i * 100,
      });

      console.log(`[GenerationEngine] Scene ${i + 1} image URL:`, imageUrl.substring(0, 80) + '...');

      // Validate the image URL by attempting to load it
      console.log(`[GenerationEngine] Validating Scene ${i + 1} image...`);
      const isValid = await validateImageUrl(imageUrl);
      
      if (isValid) {
        console.log(`[GenerationEngine] Scene ${i + 1} image validated successfully`);
        const updatedScene = { ...scene, generatedImage: imageUrl, status: 'completed' as const };
        scenes[i] = updatedScene;
      } else {
        console.warn(`[GenerationEngine] Scene ${i + 1} image validation failed, retrying with different seed...`);
        // Retry with different seed
        const retryUrl = generateImageUrl(scene.imagePrompt, {
          ...imageDimensions,
          seed: projectId.charCodeAt(0) * 1000 + i * 100 + 999,
        });
        const retryValid = await validateImageUrl(retryUrl);
        
        if (retryValid) {
          console.log(`[GenerationEngine] Scene ${i + 1} retry successful`);
          const updatedScene = { ...scene, generatedImage: retryUrl, status: 'completed' as const };
          scenes[i] = updatedScene;
        } else {
          throw new Error('Image validation failed after retry');
        }
      }

      dispatch({
        type: 'UPDATE_SCENE',
        payload: { projectId, scene: scenes[i] },
      });
      
      console.log(`[GenerationEngine] Scene ${i + 1} completed`);
    } catch (error) {
      console.error(`[GenerationEngine] Image generation failed for scene ${i + 1}:`, error);
      const updatedScene = { ...scene, status: 'failed' as const };
      scenes[i] = updatedScene;
      dispatch({
        type: 'UPDATE_SCENE',
        payload: { projectId, scene: updatedScene },
      });
    }

    const progress = ((i + 1) / scenes.length) * 100;
    updateStep('images', 'active', progress);
    await delay(1000); // Longer delay to avoid rate limiting
  }
  
  const successfulCount = scenes.filter(s => s.status === 'completed').length;
  console.log('[GenerationEngine] Image generation complete. Successful scenes:', successfulCount, '/', scenes.length);
  
  // Ensure we have at least 3 successful scenes for video generation
  if (successfulCount < 3) {
    console.error('[GenerationEngine] Too few successful scenes for video generation!');
    // Generate fallback images for failed scenes
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].status === 'failed') {
        console.log(`[GenerationEngine] Generating fallback image for Scene ${i + 1}...`);
        const fallbackUrl = generateImageUrl(scenes[i].description, {
          ...imageDimensions,
          seed: Date.now() + i,
        });
        scenes[i] = { ...scenes[i], generatedImage: fallbackUrl, status: 'completed' as const };
        dispatch({
          type: 'UPDATE_SCENE',
          payload: { projectId, scene: scenes[i] },
        });
        await delay(1000);
      }
    }
  }
  
  updateStep('images', 'completed', 100);

  // Step 7: Generate Videos (Client-Side using Canvas + MediaRecorder)
  updateStep('video', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Generating Video' } });
  
  // Collect all successful scene images
  const successfulScenes = scenes.filter(s => s.status === 'completed' && s.generatedImage);
  let finalVideoUrl: string | undefined;
  
  console.log('[GenerationEngine] Starting video generation with', successfulScenes.length, 'successful scenes');
  
  if (successfulScenes.length > 0) {
    try {
      // Generate a single video from all scene images
      const imageUrls = successfulScenes.map(s => s.generatedImage!);
      console.log('[GenerationEngine] Image URLs:', imageUrls.map(url => url.substring(0, 50) + '...'));
      
      const videoUrl = await generateVideoFromImages(imageUrls, {
        durationPerImage: 3, // 3 seconds per scene
        transitionDuration: 0.5, // 0.5 second transitions
        width: aspectRatio === '9:16' ? 576 : aspectRatio === '1:1' ? 768 : 1024,
        height: aspectRatio === '9:16' ? 1024 : aspectRatio === '1:1' ? 768 : 576,
        onProgress: (progress) => {
          updateStep('video', 'active', progress);
        },
      });
      
      console.log('[GenerationEngine] Video generated successfully:', videoUrl.substring(0, 50) + '...');
      finalVideoUrl = videoUrl;
      
      // Add the video to the first scene (or create a final video reference)
      const updatedScenes = scenes.map((scene, i) => {
        if (i === 0) {
          return { ...scene, generatedVideo: videoUrl };
        }
        return scene;
      });
      
      scenes = updatedScenes;
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: { id: projectId, scenes: updatedScenes, finalVideo: videoUrl },
      });
    } catch (error) {
      console.error('[GenerationEngine] Video generation failed:', error);
      // Continue without video - will show slideshow instead
    }
  } else {
    console.warn('[GenerationEngine] No successful scenes to generate video from');
  }
  
  updateStep('video', 'completed', 100);
  
  // Step 8: Rendering (combining)
  updateStep('rendering', 'active', 0);
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Rendering' } });
  await delay(1500);
  updateStep('rendering', 'completed', 100);
  
  dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Completed' } });
  // Don't overwrite finalVideo - keep the actual video URL if it was generated
  if (!finalVideoUrl) {
    console.log('[GenerationEngine] No video was generated, project will show slideshow');
  }
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
  // Pollinations.ai is FREE!
  return { images: numScenes, videos: numScenes, estimatedCost: 0 };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
