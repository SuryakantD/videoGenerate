# 🎬 AI Video Studio — 15-Second Video Generator

> **Create stunning AI-generated 15-second videos from text ideas — 100% FREE**

A full end-to-end AI video production pipeline that transforms your text ideas into real AI-generated videos using Agnes AI's free API.

![AI Video Studio](https://img.shields.io/badge/AI-Video%20Generator-violet) ![Free](https://img.shields.io/badge/Cost-100%25%20Free-green) ![Agnes AI](https://img.shields.io/badge/Powered%20By-Agnes%20AI-blue)

---

## ✨ Features

### 🤖 Real AI Generation (Not Demo!)
- **Text Generation** — Agnes 3.0 Flash creates your story, characters, and scene plans
- **Image Generation** — Agnes Image 2.5 Flash generates unique AI images for each scene
- **Video Generation** — Agnes Video 2.5 Flash animates images into video clips
- **Real-Time Progress** — Watch your video being created step by step

### 🎯 Complete Pipeline
```
Your Text Idea
    ↓
AI Story Creation (Agnes 3.0 Flash)
    ↓
Character Design (with consistency engine)
    ↓
Location Scouting
    ↓
Storyboard Planning (3-5 scenes)
    ↓
AI Image Generation (Agnes Image 2.5 Flash)
    ↓
AI Video Generation (Agnes Video 2.5 Flash)
    ↓
Timeline Assembly
    ↓
Final 15-Second Video
```

### 🎨 Visual Consistency
- **Character Bible System** — Maintains consistent character appearance across all scenes
- **Scene Consistency Engine** — Preserves lighting, mood, and style
- **Structured Prompts** — Professional prompt engineering for best results

### 🎛️ User Controls
- Multiple visual styles (Cinematic, Anime, 3D, Pixar, etc.)
- Aspect ratio options (16:9, 9:16, 1:1)
- Per-scene regeneration
- Editable prompts
- Timeline editor
- Music and voiceover options

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A modern web browser
- **FREE Agnes AI API key** from [platform.agnes-ai.com](https://platform.agnes-ai.com)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-video-studio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Setup

1. **Get your FREE API key** at [platform.agnes-ai.com](https://platform.agnes-ai.com)
2. Open the app in your browser
3. Go to **Settings** and paste your API key
4. Click **Save & Test** to verify connection
5. Go to **Create** and start making videos!

---

## 🆓 Free API — No Credit Card Required!

This app uses **[Agnes AI](https://platform.agnes-ai.com)** — a completely free AI generation platform.

### What's Free:
| Feature | Model | Cost |
|---------|-------|------|
| Text Generation | Agnes 3.0 Flash | FREE |
| Image Generation | Agnes Image 2.5 Flash | FREE |
| Video Generation | Agnes Video 2.5 Flash | FREE |
| **Total per video** | **Full pipeline** | **$0.00** |

### API Endpoints Used:
```
Base:    https://apihub.agnes-ai.com
Text:    POST /v1/chat/completions (OpenAI-compatible)
Images:  POST /images/generations
Video:   POST /videos (async with polling)
Poll:    GET /agnesapi?video_id={id}
```

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **State**: React Context + useReducer
- **Routing**: React Router v6
- **Icons**: Lucide React
- **AI APIs**: Agnes AI (free tier)

### Project Structure
```
src/
├── App.tsx                    # Main app with routing
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── components/
│   └── Sidebar.tsx            # Navigation sidebar
├── pages/
│   ├── CreatePage.tsx         # Main creation interface
│   ├── ProjectDetailPage.tsx  # Project view with tabs
│   ├── ProjectsPage.tsx       # Project library
│   ├── CharactersPage.tsx     # Character gallery
│   ├── AssetsPage.tsx         # Generated assets
│   └── SettingsPage.tsx       # API configuration
├── services/
│   └── agnes.ts               # Agnes AI API client
├── store/
│   └── AppContext.tsx          # Global state management
├── types/
│   └── index.ts               # TypeScript interfaces
└── utils/
    └── generationEngine.ts    # AI generation pipeline
```

### AI Provider Architecture
```
┌─────────────────────────────────────────┐
│         Agnes AI (Free)                 │
├─────────────────────────────────────────┤
│  Text    → Agnes 3.0 Flash              │
│  Images  → Agnes Image 2.5 Flash        │
│  Video   → Agnes Video 2.5 Flash        │
└─────────────────────────────────────────┘
```

---

## 🎬 How It Works

### 1. Story Generation
Your text idea is sent to Agnes 3.0 Flash which creates:
- A compelling 15-second story
- A project title
- Visual narrative structure

### 2. Character Creation
AI analyzes your concept and creates detailed character profiles:
- Physical appearance (for visual consistency)
- Clothing and accessories
- Personality traits
- Character bible for reuse across scenes

### 3. Scene Planning
AI divides the story into 3-5 scenes with:
- Camera angles and movements
- Lighting and time of day
- Character placements
- Emotional beats
- Transitions

### 4. Image Generation
Each scene gets a unique AI-generated image using:
- Character bible injection (consistency)
- Location descriptions
- Camera and lighting details
- Style-appropriate prompts

### 5. Video Generation
Each scene image is animated into a video clip using:
- Agnes Video 2.5 Flash model
- Reference image mode for consistency
- Camera movement prompts
- Scene-appropriate duration (4-5 seconds)

### 6. Assembly
All clips are combined into a 15-second timeline with:
- Proper transitions
- Music (optional)
- Voiceover (optional)

---

## ⚡ Performance & Timing

| Step | Duration | Notes |
|------|----------|-------|
| Story Generation | 5-10s | Text API call |
| Character Creation | 5-10s | Text API call |
| Scene Planning | 5-10s | Text API call |
| Image Generation | 10-20s per image | Agnes Image API |
| Video Generation | 2-5 min per clip | Agnes Video API |
| **Total** | **10-20 minutes** | For 4-scene video |

**Note:** Video generation is the slowest step. Each 4-5 second clip takes 2-5 minutes to generate.

---

## 🔧 Configuration

### API Key
Your API key is stored locally in your browser's localStorage:
```javascript
localStorage.setItem('agnes_api_key', 'your-key-here');
```

### Environment Variables (Optional)
```env
# Not required - key is stored in browser
# But you can set defaults if needed
VITE_AGNES_API_KEY=your_key_here
```

---

## 📱 Responsive Design

Works on:
- 🖥️ Desktop (primary experience)
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile

---

## 🎯 Use Cases

- **Social Media Content** — Quick 15-second videos for TikTok, Reels, Shorts
- **Product Demos** — AI-generated product showcase videos
- **Storytelling** — Visual narratives from text concepts
- **Marketing** — Quick ad concept visualization
- **Education** — Animated explanations
- **Creative Exploration** — Rapid prototyping of video ideas

---

## 🛠️ Development

### Available Scripts
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run typecheck # TypeScript type checking
```

### Adding New AI Models
Edit `src/services/agnes.ts` to add new models:
```typescript
export const AGNES_MODELS = {
  text: ['agnes-3.0-flash', 'agnes-2.5-flash'],
  image: ['agnes-image-2.5-flash', 'agnes-image-2.1-flash'],
  video: ['agnes-video-2.5-flash', 'agnes-video-v2.0'],
};
```

### Customizing the Pipeline
Edit `src/utils/generationEngine.ts` to modify:
- Prompt engineering
- Scene planning logic
- Character consistency rules
- Generation order

---

## 📊 Cost Analysis

| Component | Cost | Notes |
|-----------|------|-------|
| Text Generation | FREE | Agnes AI free tier |
| Image Generation | FREE | Agnes Image API |
| Video Generation | FREE | Agnes Video API |
| **Total per video** | **$0.00** | Unlimited generation |

---

## 🔒 Privacy & Security

- ✅ API key stored locally in browser only
- ✅ All API calls go directly to Agnes AI
- ✅ No backend server needed
- ✅ No data stored on external servers
- ✅ No credit card required

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional AI model support
- Better video combination (FFmpeg in browser)
- More visual styles
- Template system
- Batch generation
- Export options

---

## 📝 License

MIT License — free for personal and commercial use.

---

## 🙏 Credits

- **[Agnes AI](https://platform.agnes-ai.com)** — Free AI generation APIs
- **[Agnes Video Generator](https://github.com/lcy362/agnes-video-generator)** — Reference implementation
- **[React](https://react.dev)** — UI framework
- **[Tailwind CSS](https://tailwindcss.com)** — Styling
- **[Lucide](https://lucide.dev)** — Icons

---

## 🐛 Known Limitations

1. **Video Generation Time** — Each video clip takes 2-5 minutes to generate
2. **Character Consistency** — While improved with character bibles, perfect consistency depends on the AI model
3. **Rate Limits** — Agnes AI has generous but not unlimited rate limits
4. **Video Combination** — Current version shows scenes sequentially; full video merging requires server-side FFmpeg

---

## 🚀 Roadmap

- [ ] Server-side FFmpeg for true video merging
- [ ] Background music generation
- [ ] Sound effects
- [ ] Multiple language support
- [ ] Template library
- [ ] Batch generation
- [ ] Brand kit integration
- [ ] Export to social media formats
- [ ] Collaborative editing
- [ ] Version history

---

## 💬 Support

- **Agnes AI Platform**: [platform.agnes-ai.com](https://platform.agnes-ai.com)
- **Reference Project**: [agnes-video-generator](https://github.com/lcy362/agnes-video-generator)
- **Issues**: Open a GitHub issue

---

**Made with ❤️ using Agnes AI's free APIs**

*No credit card. No subscription. No limits. Just create.*
