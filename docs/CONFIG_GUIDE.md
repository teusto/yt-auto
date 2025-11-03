# ⚙️ Configuration File Guide

**Complete guide to customizing your videos with config.json**

Learn how to control every aspect of your video generation through configuration files.

---

## 📋 What is config.json?

`config.json` is a text file that tells YT-Machine how to create your video. Think of it as your video's recipe.

**Location:**
- Single video: `input/config.json`
- Channel: `channels/YOUR-CHANNEL/channel.json`
- Specific video: `channels/YOUR-CHANNEL/videos/VIDEO-NAME/config.json`

---

## 🚀 Quick Start: Basic Config

### Simplest Config (Minimal)

```json
{
  "name": "My Video"
}
```

That's it! YT-Machine will use default settings for everything.

---

### Simple Config (Common Options)

```json
{
  "name": "My First Video",
  "aspectRatio": "9:16",
  "animation": "static",
  "qualityMode": "high"
}
```

**This creates:**
- Vertical video (9:16 for TikTok/Shorts)
- Static images (no animation)
- High quality output

---

## 📐 Aspect Ratio

Control the shape of your video.

```json
{
  "aspectRatio": "9:16"
}
```

**Options:**

| Value | Description | Best For |
|-------|-------------|----------|
| `"9:16"` | Vertical (1080x1920) | TikTok, YouTube Shorts, Instagram Reels |
| `"16:9"` | Horizontal (1920x1080) | YouTube, Facebook |
| `"1:1"` | Square (1080x1080) | Instagram Feed |
| `"4:5"` | Vertical (1080x1350) | Instagram Stories |

**Example:**
```json
{
  "name": "TikTok Video",
  "aspectRatio": "9:16"
}
```

---

## 🎨 Animation

Add movement to your images.

```json
{
  "animation": "zoom-in"
}
```

**Options:**

| Value | Description | Effect |
|-------|-------------|--------|
| `"static"` | No animation | Images stay still |
| `"zoom-in"` | Ken Burns zoom in | Slowly zooms into image |
| `"zoom-out"` | Ken Burns zoom out | Starts zoomed, slowly zooms out |

**Example:**
```json
{
  "name": "Dynamic Video",
  "animation": "zoom-in"
}
```

---

## 🎯 Quality Mode

Balance between speed and quality.

```json
{
  "qualityMode": "high"
}
```

**Options:**

| Value | Speed | Quality | Best For |
|-------|-------|---------|----------|
| `"draft"` | Fast (3x faster) | Good | Testing, previews |
| `"high"` | Slow | Excellent | Final videos, publishing |

**Example for testing:**
```json
{
  "qualityMode": "draft"
}
```

**Example for publishing:**
```json
{
  "qualityMode": "high"
}
```

---

## 📝 Subtitles

Customize subtitle appearance.

```json
{
  "subtitles": {
    "enabled": true,
    "style": "yellow",
    "position": "bottom",
    "fontSize": 52
  }
}
```

### Subtitle Styles

**Options:**

| Style | Description | Look |
|-------|-------------|------|
| `"classic"` | White, bottom | Traditional style |
| `"bold"` | Large white | Attention-grabbing |
| `"yellow"` | YouTube style | Popular, readable |
| `"minimal"` | Small, clean | Subtle |
| `"cinematic"` | Translucent background | Professional |
| `"shadow"` | Subtle shadow | Modern |

**Example:**
```json
{
  "subtitles": {
    "style": "yellow"
  }
}
```

### Subtitle Position

**Options:**
- `"bottom"` - Bottom of screen (default)
- `"center"` - Middle of screen
- `"top"` - Top of screen

**Example:**
```json
{
  "subtitles": {
    "position": "center"
  }
}
```

### Disable Subtitles

```json
{
  "subtitles": {
    "enabled": false
  }
}
```

---

## 🎵 Audio Settings

Control voice and music levels.

```json
{
  "audio": {
    "voiceVolume": 100,
    "musicVolume": 35
  }
}
```

**Voice Volume:**
- `80` = Quieter
- `100` = Normal (default)
- `120` = Louder

**Music Volume:**
- `20` = Very subtle background
- `35` = Balanced (default)
- `50` = Prominent

**Example (voice louder, music quieter):**
```json
{
  "audio": {
    "voiceVolume": 110,
    "musicVolume": 25
  }
}
```

---

## 🌍 Translations (Pro Feature)

Automatically translate subtitles to multiple languages.

```json
{
  "translations": {
    "enabled": true,
    "languages": ["es", "fr", "pt-BR"]
  }
}
```

**Popular Languages:**
- `"es"` - Spanish
- `"fr"` - French
- `"pt-BR"` - Portuguese (Brazilian)
- `"de"` - German
- `"it"` - Italian
- `"ja"` - Japanese
- `"zh"` - Chinese
- `"ko"` - Korean
- `"ar"` - Arabic
- `"ru"` - Russian

**Full list:** See [Translation Guide](TRANSLATIONS.md)

**Example (global audience):**
```json
{
  "translations": {
    "enabled": true,
    "sourceLang": "EN",
    "languages": ["es", "fr", "de", "ja", "zh", "ar"],
    "outputFolder": "output/translations"
  }
}
```

**Requires in .env:**
```bash
PRO_TRANSLATIONS=true
DEEPL_API_KEY=your-key-here
```

---

## 🎬 Timeline System (Pro Feature)

Advanced video structure with custom segments.

### Basic Timeline

```json
{
  "timeline": {
    "segments": [
      { "type": "scene", "path": "scenes/intro.png", "duration": 5 },
      { "type": "main" },
      { "type": "scene", "path": "scenes/outro.png", "duration": 5 }
    ],
    "audio": {
      "voice": { "path": "voice.mp3" }
    }
  }
}
```

### Timeline with Music

```json
{
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/intro.png",
        "duration": 5,
        "name": "intro"
      },
      {
        "type": "main"
      },
      {
        "type": "outro",
        "path": "outro.mp4"
      }
    ],
    "audio": {
      "voice": {
        "path": "voice.mp3",
        "startAt": "intro"
      },
      "music": {
        "path": "music.mp3",
        "startAt": "intro",
        "volume": 0.25
      }
    }
  }
}
```

**Segment Types:**
- `"scene"` - Image or video segment with fixed duration
- `"main"` - Auto-generated main content
- `"intro"` - Introduction video
- `"outro"` - Ending video

**Full guide:** See [Timeline Guide](TIMELINE_GUIDE.md)

**Requires in .env:**
```bash
PRO_TIMELINE=true
```

---

## 📦 Complete Config Examples

### Example 1: Simple TikTok Video

```json
{
  "name": "Daily Motivation",
  "aspectRatio": "9:16",
  "animation": "static",
  "qualityMode": "high",
  "subtitles": {
    "style": "yellow",
    "position": "bottom"
  },
  "audio": {
    "voiceVolume": 100,
    "musicVolume": 30
  }
}
```

**Files needed:**
```
input/
├── config.json
├── voice.mp3
├── music.mp3
└── images/
    ├── img1.jpg
    └── img2.jpg
```

---

### Example 2: YouTube Short with Timeline

```json
{
  "name": "Tech Tip",
  "aspectRatio": "9:16",
  "animation": "zoom-in",
  "qualityMode": "high",
  "subtitles": {
    "style": "bold",
    "position": "bottom"
  },
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.png",
        "duration": 3,
        "name": "title"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/cta.png",
        "duration": 5,
        "name": "cta"
      }
    ],
    "audio": {
      "voice": {
        "path": "voice.mp3",
        "startAt": "title"
      },
      "music": {
        "path": "music.mp3",
        "startAt": "title",
        "volume": 0.2
      }
    }
  }
}
```

**Files needed:**
```
input/
├── config.json
├── voice.mp3
├── music.mp3
├── scenes/
│   ├── title.png
│   └── cta.png
└── images/
    ├── demo1.jpg
    └── demo2.jpg
```

---

### Example 3: Multi-Language Educational Video

```json
{
  "name": "Spanish Lesson 01",
  "aspectRatio": "9:16",
  "animation": "static",
  "qualityMode": "high",
  "subtitles": {
    "style": "cinematic",
    "position": "bottom",
    "fontSize": 48
  },
  "audio": {
    "voiceVolume": 100,
    "musicVolume": 20
  },
  "translations": {
    "enabled": true,
    "sourceLang": "EN",
    "languages": ["es", "pt-BR", "fr"]
  },
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/lesson-title.png",
        "duration": 5,
        "name": "title"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/summary.png",
        "duration": 8,
        "name": "summary"
      }
    ],
    "audio": {
      "voice": {
        "path": "voice.mp3",
        "startAt": "title"
      }
    }
  }
}
```

**Files needed:**
```
input/
├── config.json
├── voice.mp3
├── scenes/
│   ├── lesson-title.png
│   └── summary.png
└── images/
    ├── example1.png
    └── example2.png
```

**Output:**
```
output/
├── video_tiktok_2024-11-03.mp4
└── translations/
    ├── subtitles_es.srt
    ├── subtitles_pt-BR.srt
    └── subtitles_fr.srt
```

---

### Example 4: Horizontal YouTube Video

```json
{
  "name": "Product Review",
  "aspectRatio": "16:9",
  "animation": "zoom-out",
  "qualityMode": "high",
  "subtitles": {
    "style": "shadow",
    "position": "bottom",
    "fontSize": 60
  },
  "audio": {
    "voiceVolume": 110,
    "musicVolume": 35
  }
}
```

**Best for:** Long-form YouTube content, landscape videos

---

### Example 5: Instagram Story

```json
{
  "name": "Story Update",
  "aspectRatio": "4:5",
  "animation": "static",
  "qualityMode": "draft",
  "subtitles": {
    "style": "minimal",
    "position": "center"
  },
  "audio": {
    "voiceVolume": 100,
    "musicVolume": 40
  }
}
```

**Best for:** Instagram Stories, quick updates

---

## 🔧 Advanced Options

### Custom Output Name

```json
{
  "name": "My Custom Video Name"
}
```

This sets the internal name, but output filename is auto-generated as:
`video_tiktok_YYYY-MM-DD-HH-MM-SS.mp4`

---

### Language Override

```json
{
  "language": "es"
}
```

Generates subtitles in Spanish instead of English.

---

### Random Assets (Channel Mode)

```json
{
  "randomImages": true,
  "imageCount": 5,
  "randomMusic": true
}
```

Uses random selection from channel pools.

---

## 📝 Config File Tips

### ✅ DO:

- Use double quotes `"` for all text
- Keep proper JSON formatting
- Add comments in separate file (JSON doesn't support comments)
- Test with `"qualityMode": "draft"` first
- Save as UTF-8 encoding

### ❌ DON'T:

- Use single quotes `'`
- Forget commas between items
- Add trailing comma after last item
- Use comments inside JSON file
- Mix tabs and spaces

---

### Valid JSON:

```json
{
  "name": "My Video",
  "aspectRatio": "9:16",
  "qualityMode": "high"
}
```

### Invalid JSON:

```json
{
  "name": 'My Video',        ❌ Single quotes
  "aspectRatio": "9:16"      ❌ Missing comma
  "qualityMode": "high",     ❌ Trailing comma
  // This is a comment        ❌ Comments not allowed
}
```

---

## 🧪 Testing Your Config

### Option 1: Online Validator

1. Go to https://jsonlint.com/
2. Paste your config
3. Click "Validate JSON"
4. Fix any errors

### Option 2: VS Code

1. Open config.json in VS Code
2. Errors will be highlighted automatically
3. Hover over errors for explanations

### Option 3: Test Run

```bash
npm start
```

If config has errors, you'll see clear error messages.

---

## 🎯 Config Hierarchy

Configs can override each other:

1. **Default Settings** (lowest priority)
   - Built into YT-Machine
   
2. **Channel Config** (medium priority)
   - `channels/YOUR-CHANNEL/channel.json`
   - Applies to all videos in channel
   
3. **Video Config** (highest priority)
   - `input/config.json` or
   - `channels/YOUR-CHANNEL/videos/VIDEO/config.json`
   - Overrides everything

**Example:**

```
Channel says: "aspectRatio": "9:16"
Video says: "aspectRatio": "16:9"
Result: Video uses 16:9 ✅
```

---

## 📚 Config Templates

### Template 1: Quick Social Media Post

```json
{
  "aspectRatio": "9:16",
  "animation": "static",
  "qualityMode": "draft",
  "subtitles": {
    "style": "yellow"
  }
}
```

**Use for:** Quick posts, testing

---

### Template 2: Professional Content

```json
{
  "aspectRatio": "9:16",
  "animation": "zoom-in",
  "qualityMode": "high",
  "subtitles": {
    "style": "cinematic",
    "position": "bottom"
  },
  "audio": {
    "voiceVolume": 100,
    "musicVolume": 25
  }
}
```

**Use for:** Final videos, publishing

---

### Template 3: Educational Series

```json
{
  "aspectRatio": "16:9",
  "animation": "static",
  "qualityMode": "high",
  "subtitles": {
    "style": "shadow",
    "position": "bottom",
    "fontSize": 60
  },
  "translations": {
    "enabled": true,
    "languages": ["es", "fr", "de"]
  }
}
```

**Use for:** Tutorials, lessons, courses

---

## 🐛 Troubleshooting

### "Invalid JSON syntax"

**Problem:** JSON formatting error

**Solution:**
1. Check all quotes are double `"`
2. Check all commas are present
3. Remove trailing comma after last item
4. Use https://jsonlint.com/ to validate

---

### Config ignored

**Problem:** Config file not found or named wrong

**Solution:**
- Make sure file is named exactly `config.json`
- Make sure it's in the right location
- Check file extension (not `config.json.txt`)

---

### Settings not applying

**Problem:** Setting name wrong or value invalid

**Solution:**
- Check spelling of setting names
- Check values are valid (e.g., `"9:16"` not `"9/16"`)
- Check this guide for correct options

---

## 📖 Full Reference

### All Config Options

```json
{
  "name": "string",
  "aspectRatio": "9:16" | "16:9" | "1:1" | "4:5",
  "animation": "static" | "zoom-in" | "zoom-out",
  "qualityMode": "draft" | "high",
  "language": "en" | "es" | "fr" | "de" | etc.,
  
  "subtitles": {
    "enabled": true | false,
    "style": "classic" | "bold" | "yellow" | "minimal" | "cinematic" | "shadow",
    "position": "bottom" | "center" | "top",
    "fontSize": 26-100
  },
  
  "audio": {
    "voiceVolume": 0-150,
    "musicVolume": 0-100
  },
  
  "translations": {
    "enabled": true | false,
    "sourceLang": "EN" | "ES" | etc.,
    "languages": ["es", "fr", "de"],
    "outputFolder": "path/to/folder",
    "nameTemplate": "subtitles_{lang}.srt"
  },
  
  "timeline": {
    "segments": [...],
    "audio": {...}
  },
  
  "randomImages": true | false,
  "imageCount": 1-100,
  "randomMusic": true | false
}
```

---

## 🎯 Next Steps

Now you know how to configure videos!

**Continue to:**
- [Folder Structure Guide](FOLDER_STRUCTURE.md) - Organize your files
- [Timeline Guide](TIMELINE_GUIDE.md) - Advanced video structure
- [Translation Guide](TRANSLATIONS.md) - Multi-language setup

---

**Questions?** Check [FAQ.md](FAQ.md) or GitHub Discussions!
