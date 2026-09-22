# AI Video Generator - Minimal Working Version

A simple, working AI video generator that creates videos from text prompts using Pollinations API.

## ✅ Fixed: Images Now Load Correctly

The app now fetches images and converts them to blob URLs, which fixes the blank scenes issue. Images are loaded directly into the browser's memory, avoiding CORS issues.

## Features

- ✅ Generate 4 scene images from a text prompt
- ✅ Images load correctly using blob URLs
- ✅ Create a video slideshow with Ken Burns effect
- ✅ Fade transitions between scenes
- ✅ Download the generated video
- ✅ No API keys required
- ✅ 100% free

## How It Works

1. Enter a text prompt describing your video
2. The app generates 4 scene images using Pollinations AI
3. Images are fetched and converted to blob URLs (fixes CORS issues)
4. Creates a video slideshow with smooth transitions
5. Download the video as a WebM file

## Usage

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## Example Prompts

- "A luxury airplane flying over Dubai at sunset"
- "A woman walking through a neon-lit Tokyo street at night"
- "A child discovering a magical forest with glowing butterflies"
- "A sports car driving through a mountain pass at dawn"

## Technical Details

- **Image Generation**: Pollinations API (Flux model)
- **Image Loading**: Fetched and converted to blob URLs (fixes CORS)
- **Video Generation**: Canvas + MediaRecorder API
- **Video Format**: WebM (VP9 codec)
- **Resolution**: 1024x576
- **Duration**: ~12 seconds (3 seconds per scene)
- **Frame Rate**: 30 FPS

## Browser Compatibility

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ⚠️ Safari (limited WebM support)

## How to Use

1. Enter your video description in the text area
2. Click "Generate Video"
3. Wait for the images to be generated (2-3 minutes)
4. Watch the video preview
5. Click "Download Video" to save the WebM file

## Notes

- Video generation happens entirely in your browser
- Images are fetched and converted to blob URLs to avoid CORS issues
- No data is sent to any server except for image generation
- Generated videos are WebM format (may need conversion for some players)
- Each generation takes 2-3 minutes depending on your internet speed

## Troubleshooting

**Images not loading?**
- Check your internet connection
- Pollinations API might be temporarily down
- Try refreshing the page
- Check browser console for errors
- Images are now fetched and converted to blob URLs to fix CORS issues

**Video not playing?**
- Try a different browser (Chrome recommended)
- Check if your browser supports WebM format
- Download the video and play it in VLC or another media player

**Video download not working?**
- Right-click the video and select "Save video as..."
- Or open the video in a new tab and download from there
