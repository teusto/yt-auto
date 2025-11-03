# 🎬 Timeline Config Examples - Copy & Paste Ready

Quick reference configs you can copy directly into your `config.json`.

---

## 📁 Folder Structure Reference

All examples assume this structure:

```
your-project-folder/
├── config.json          ← Put timeline config here
├── images/              ← Main content images
│   ├── 001.jpg
│   ├── 002.jpg
│   └── 003.jpg
├── voice.mp3           ← Main content voice
├── music.mp3           ← Main content music (optional)
├── subtitles.srt       ← Main content subtitles (optional)
├── intro.mp4           ← Intro video (optional)
├── outro.mp4           ← Outro video (optional)
└── scenes/             ← Custom scenes folder (optional)
    ├── opening.mp4
    ├── title.jpg
    └── cta.mp4
```

---

## 🚀 Example 1: Minimal (Main Only)

**Use when:** Just testing timeline, no custom scenes

**Files needed:**
- `images/` with at least 1 image
- `voice.mp3`

**config.json:**
```json
{
  "name": "My Video",
  "timeline": {
    "segments": [
      { "type": "main" }
    ]
  }
}
```

---

## 🎯 Example 2: Basic (Intro + Main + Outro)

**Use when:** You have intro/outro videos

**Files needed:**
- `intro.mp4`
- `outro.mp4`
- `images/` folder
- `voice.mp3`

**config.json:**
```json
{
  "name": "My Video",
  "aspectRatio": "16:9",
  "timeline": {
    "segments": [
      { "type": "intro", "path": "intro.mp4" },
      { "type": "main" },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

---

## 🎨 Example 3: With Title Card

**Use when:** You want a title screen before content

**Files needed:**
- `scenes/title.jpg` (1920x1080 image with your title)
- `images/` folder
- `voice.mp3`

**config.json:**
```json
{
  "name": "My Video",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 3,
        "name": "Title Card"
      },
      { "type": "main" }
    ]
  }
}
```

---

## 📺 Example 4: YouTube Style

**Use when:** Creating YouTube videos with full structure

**Files needed:**
- `scenes/hook.mp4` - 3-5 second teaser
- `intro.mp4` - Channel intro
- `images/` - Main content
- `voice.mp3` - Narration
- `scenes/subscribe.mp4` - Subscribe animation
- `outro.mp4` - Channel outro

**config.json:**
```json
{
  "name": "My YouTube Video",
  "aspectRatio": "16:9",
  "animation": "zoom-in",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/hook.mp4",
        "name": "Hook",
        "transition": "fade-black",
        "transitionDuration": 0.5
      },
      {
        "type": "intro",
        "path": "intro.mp4"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/subscribe.mp4",
        "name": "Subscribe"
      },
      {
        "type": "outro",
        "path": "outro.mp4"
      }
    ]
  },
  "subtitle": {
    "style": "bold"
  }
}
```

---

## 📱 Example 5: TikTok/Shorts Style

**Use when:** Creating vertical short-form content

**Files needed:**
- `scenes/title.jpg` - Eye-catching title
- `images/` - Content images
- `voice.mp3` - Quick narration
- `scenes/cta.jpg` - Call to action screen

**config.json:**
```json
{
  "name": "My Short Video",
  "aspectRatio": "9:16",
  "animation": "zoom-out",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 2,
        "name": "Hook Title",
        "audio": "music.mp3"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/cta.jpg",
        "duration": 3,
        "name": "Follow Me"
      }
    ]
  },
  "subtitle": {
    "style": "bold",
    "position": "center",
    "fontSize": 58
  }
}
```

---

## 🎓 Example 6: Educational/Tutorial

**Use when:** Creating lesson-based content

**Files needed:**
- `scenes/lesson-intro.jpg` - Lesson title
- `images/` - Slides/diagrams
- `voice.mp3` - Explanation
- `scenes/recap.jpg` - Summary screen

**config.json:**
```json
{
  "name": "My Lesson",
  "aspectRatio": "16:9",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/lesson-intro.jpg",
        "duration": 3,
        "name": "Lesson Title"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/recap.jpg",
        "duration": 5,
        "name": "Recap"
      }
    ]
  }
}
```

---

## 🎬 Example 7: Documentary Style (Multi-Part)

**Use when:** Breaking content into chapters

**Files needed:**
- `intro.mp4`
- `scenes/chapter1.jpg`, `chapter2.jpg`, `chapter3.jpg`
- `images/` folder (all images for all chapters)
- `voice.mp3` (complete narration)
- `outro.mp4`

**config.json:**
```json
{
  "name": "My Documentary",
  "aspectRatio": "16:9",
  "timeline": {
    "segments": [
      { "type": "intro", "path": "intro.mp4" },
      {
        "type": "scene",
        "path": "scenes/chapter1.jpg",
        "duration": 2,
        "name": "Chapter 1",
        "transition": "fade",
        "transitionDuration": 0.5
      },
      { "type": "main" },
      {
        "type": "scene",
        "path": "scenes/chapter2.jpg",
        "duration": 2,
        "name": "Chapter 2",
        "transition": "fade",
        "transitionDuration": 0.5
      },
      { "type": "main" },
      {
        "type": "scene",
        "path": "scenes/chapter3.jpg",
        "duration": 2,
        "name": "Chapter 3",
        "transition": "fade",
        "transitionDuration": 0.5
      },
      { "type": "main" },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

---

## 🛍️ Example 8: Product Video

**Use when:** Showcasing a product

**Files needed:**
- `scenes/logo.mp4` - Brand logo animation
- `scenes/product-hero.jpg` - Product hero shot
- `images/` - Feature images
- `voice.mp3` - Product description
- `scenes/cta.mp4` - Buy now/learn more

**config.json:**
```json
{
  "name": "Product Video",
  "aspectRatio": "1:1",
  "animation": "static",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/logo.mp4",
        "name": "Brand Logo"
      },
      {
        "type": "scene",
        "path": "scenes/product-hero.jpg",
        "duration": 3,
        "name": "Product Hero"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/cta.mp4",
        "name": "Call to Action"
      }
    ]
  }
}
```

---

## 🎵 Example 9: Music Video Style

**Use when:** Creating visual content with music

**Files needed:**
- `scenes/artist-intro.mp4` - Artist intro
- `images/` - Lyric slides or visuals
- `music.mp3` - Full song as voice
- `scenes/outro-social.jpg` - Social media info

**config.json:**
```json
{
  "name": "Music Video",
  "aspectRatio": "9:16",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/artist-intro.mp4",
        "name": "Artist Intro",
        "mute": false
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/outro-social.jpg",
        "duration": 5,
        "name": "Follow Me",
        "audio": "music.mp3"
      }
    ]
  }
}
```

---

## 🔄 Example 10: With Custom Audio Per Scene

**Use when:** Each scene needs different audio

**Files needed:**
- `scenes/intro-visual.mp4` - Silent intro visual
- `audio/intro-music.mp3` - Intro audio
- `images/` - Main content
- `voice.mp3` - Main narration
- `scenes/outro-visual.jpg` - Outro visual
- `audio/outro-music.mp3` - Outro audio

**config.json:**
```json
{
  "name": "Custom Audio Video",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/intro-visual.mp4",
        "name": "Intro",
        "mute": true,
        "audio": "audio/intro-music.mp3"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/outro-visual.jpg",
        "duration": 5,
        "name": "Outro",
        "audio": "audio/outro-music.mp3"
      }
    ]
  }
}
```

---

## 💡 Tips

### Scene Durations
- **Title cards:** 2-3 seconds
- **CTA screens:** 3-5 seconds
- **Credits:** 5-7 seconds

### Transitions
- Use `"fade-black"` between major sections
- Use `"fade"` for subtle transitions
- Use `"none"` (default) for quick cuts

### File Organization
```
your-project/
├── config.json
├── scenes/          ← All custom scenes here
│   ├── 01-title.jpg
│   ├── 02-hook.mp4
│   └── 99-cta.jpg
├── audio/           ← Scene audio here
│   ├── intro.mp3
│   └── outro.mp3
└── images/          ← Main content here
```

### Debugging
Enable debug mode to see timeline processing:
```bash
PRO_TIMELINE=true DEBUG=true npm start
```

---

## 🚀 Quick Test Command

```bash
# 1. Enable timeline
echo "PRO_TIMELINE=true" >> .env

# 2. Create test folder
mkdir -p test-timeline/images test-timeline/scenes

# 3. Add 3 images to test-timeline/images/

# 4. Create config
cat > test-timeline/config.json << 'EOF'
{
  "timeline": {
    "segments": [
      { "type": "main" }
    ]
  }
}
EOF

# 5. Run
npm start
```

---

## ❓ Need Help?

- **Validation errors?** Check file paths exist
- **Not seeing timeline?** Verify `PRO_TIMELINE=true` in `.env`
- **Main content issues?** Make sure images/ and voice.mp3 exist
- **Scene not found?** Use relative path from project root

**See:** [TIMELINE_SETUP_GUIDE.md](TIMELINE_SETUP_GUIDE.md) for detailed setup instructions.
