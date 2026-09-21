# 🎬 AI Video Studio — 15-Second Video Generator

> **Create stunning AI-generated 15-second videos from text ideas — 100% FREE**

A full end-to-end AI video production pipeline that transforms your text ideas into real AI-generated videos using free APIs.

![AI Video Studio](https://img.shields.io/badge/AI-Video%20Generator-violet) ![Free](https://img.shields.io/badge/Cost-100%25%20Free-green) ![Pollinations](https://img.shields.io/badge/Powered%20By-Pollinations.ai-blue)

---

## ✨ Features

### 🤖 Real AI Generation (Not Demo!)
- **Text Generation** — GPT-4o-mini creates your story, characters, and scene plans
- **Image Generation** — Flux model generates unique AI images for each scene
- **Video Generation** — WAN 2.6 / Veo animates images into video clips
- **Text-to-Speech** — Multiple AI voices for voiceover

### 🎯 Complete Pipeline
```
Your Text Idea
    ↓
AI Story Creation (GPT-4o-mini)
    ↓
Character Design (with consistency engine)
    ↓
Location Scouting
    ↓
Storyboard Planning (3-5 scenes)
    ↓
AI Image Generation (Flux)
    ↓
AI Video Generation (WAN 2.6)
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

### Usage

1. Open the app in your browser
2. Enter your video idea in the text box
3. Select your preferred options (style, aspect ratio, quality)
4. Click **"Create My Video"**
5. Watch as AI generates your video in real-time
6. Review, edit, or regenerate individual scenes
7. Play your final video!

---

## 🆓 Free API — No API Key Required!

This app uses **[Pollinations.ai](https://pollinations.ai)** — a free, open-source AI generation platform.

### What's Free:
| Feature | Model | API Key Required |
|---------|-------|-----------------|
| Text Generation | GPT-4o-mini | ❌ No |
| Image Generation | Flux | ❌ No |
| Video Generation | WAN 2.6 / Veo | ❌ No |
| Text-to-Speech | Multiple voices | ❌ No |

### API Endpoints Used:
```
Text:    POST https://gen.pollinations.ai/v1/chat/completions
Images:  GET  https://gen.pollinations.ai/image/{prompt}?model=flux
Video:   GET  https://gen.pollinations.ai/video/{prompt}?model=wan
Audio:   GET  https://gen.pollinations.ai/audio/{text}?voice=nova
```

### Optional: Higher Rate Limits
For higher rate limits, get a free API key at [enter.pollinations.ai/keys](https://enter.pollinations.ai/keys)

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **State**: React Context + useReducer
- **Routing**: React Router v6
- **Icons**: Lucide React
- **AI APIs**: Pollinations.ai (free tier)

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
│   └── pollinations.ts        # Pollinations API client
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
│         Pollinations.ai (Free)          │
├─────────────────────────────────────────┤
│  Text    → GPT-4o-mini                  │
│  Images  → Flux / Flux-Realism / Turbo  │
│  Video   → WAN 2.6 / Veo               │
│  Audio   → ElevenLabs voices            │
└─────────────────────────────────────────┘
```

---

## 🎬 How It Works

### 1. Story Generation
Your text idea is sent to GPT-4o-mini which creates:
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
- WAN 2.6 model for natural motion
- Camera movement prompts
- Scene-appropriate duration

### 6. Assembly
All clips are combined into a 15-second timeline with:
- Proper transitions
- Music (optional)
- Voiceover (optional)

---

## 🔧 Configuration

### Environment Variables (Optional)
```env
# For higher rate limits only - app works without these
POLLINATIONS_API_KEY=sk_your_key_here
```

### Settings Page
- View API health status
- Check available models
- Optional API key configuration
- Architecture overview

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
Edit `src/services/pollinations.ts` to add new models:
```typescript
export const IMAGE_MODELS = [
  { id: 'flux', name: 'Flux', quality: 'high' },
  { id: 'new-model', name: 'New Model', quality: 'high' },
];
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
| Text Generation | FREE | Pollinations.ai free tier |
| Image Generation | FREE | Flux model, no key needed |
| Video Generation | FREE | WAN 2.6, no key needed |
| Audio/TTS | FREE | Multiple voices |
| **Total per video** | **$0.00** | Unlimited generation |

---

## 🔒 Privacy & Security

- ✅ No API keys required for basic usage
- ✅ All API calls go directly to Pollinations.ai
- ✅ No backend server needed
- ✅ No data stored on external servers
- ✅ Generated media expires after 30 days
- ✅ Optional API key stored locally only

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

- **[Pollinations.ai](https://pollinations.ai)** — Free AI generation APIs
- **[Flux](https://blackforestlabs.ai)** — Image generation model
- **[WAN 2.6](https://github.com/Wan-Video/Wan2.1)** — Video generation model
- **[OpenAI](https://openai.com)** — GPT-4o-mini text model
- **[React](https://react.dev)** — UI framework
- **[Tailwind CSS](https://tailwindcss.com)** — Styling
- **[Lucide](https://lucide.dev)** — Icons

---

## 🐛 Known Limitations

1. **Video Generation Time** — AI video generation can take 30-120 seconds per clip
2. **Character Consistency** — While improved with character bibles, perfect consistency depends on the AI model
3. **Rate Limits** — Free tier has rate limits; add API key for higher limits
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

- **Documentation**: [Pollinations.ai Docs](https://gen.pollinations.ai/docs)
- **Issues**: Open a GitHub issue
- **Discord**: [Pollinations Community](https://discord.gg/pollinations-ai-885844321461485618)

---

**Made with ❤️ using free AI APIs**

*No credit card. No subscription. No limits. Just create.*
