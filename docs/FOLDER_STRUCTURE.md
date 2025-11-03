# 📂 Folder Structure Guide

**Learn how to organize your content for YT-Machine**

This guide shows you exactly how to prepare and organize your files so YT-Machine can create your videos.

---

## 🎯 Quick Overview

YT-Machine looks for files in specific locations. Put your files in the right folders, and everything works automatically!

**The three main folders:**
- `input/` - Single video mode
- `channels/` - Batch mode with organized channels
- `output/` - Where your finished videos appear

---

## 📁 Option 1: Single Video Mode

**Best for:** Creating one video at a time, testing, beginners

### Basic Structure

```
yt-machine/
├── input/                    ← PUT YOUR FILES HERE
│   ├── voice.mp3            ← Your voiceover (REQUIRED)
│   ├── music.mp3            ← Background music (optional)
│   ├── config.json          ← Settings (optional)
│   ├── logo.png             ← Watermark (optional)
│   └── images/              ← Your images or videos
│       ├── img1.jpg
│       ├── img2.jpg
│       └── img3.mp4
└── output/                   ← YOUR FINISHED VIDEOS
    └── video_tiktok_2024-11-03.mp4
```

---

### Step-by-Step Setup

#### Step 1: Add Your Voiceover (REQUIRED)

The only file you MUST have is a voiceover.

1. **Record your voiceover** or use text-to-speech
2. **Save as MP3 format**
3. **Name it exactly:** `voice.mp3` or `voice-over.mp3`
4. **Put it in:** `input/voice.mp3`

**Example:**
```
input/voice.mp3  ✅ Correct
input/Voice.mp3  ❌ Wrong (capital V)
input/audio.mp3  ❌ Wrong (must be 'voice')
```

---

#### Step 2: Add Images or Videos (Optional)

YT-Machine will create visuals from your images/videos.

1. **Create images folder:** `input/images/`
2. **Add your content:**
   - Images: `.jpg`, `.jpeg`, `.png`
   - Videos: `.mp4`, `.mov`
   - Recommended: 3-10 files

**Example:**
```
input/images/
├── photo1.jpg
├── photo2.jpg
├── screenshot.png
└── clip.mp4
```

**No images?** 
- YT-Machine will create a simple background
- Or use images from channel pool (if using channels)

---

#### Step 3: Add Background Music (Optional)

1. **Get music file** (royalty-free!)
2. **Save as MP3**
3. **Name it:** `music.mp3`
4. **Put it in:** `input/music.mp3`

**Example:**
```
input/music.mp3  ✅ Correct
```

YT-Machine will automatically:
- Mix it with your voice
- Set proper volume levels
- Fade in/out

---

#### Step 4: Add Logo (Optional)

Add a watermark to your video.

1. **Create logo** (PNG with transparency recommended)
2. **Name it:** `logo.png`
3. **Put it in:** `input/logo.png`

**Recommended size:** 200x200 pixels

---

#### Step 5: Add Config File (Optional)

Customize your video settings.

1. **Create text file:** `input/config.json`
2. **Add settings:**

```json
{
  "name": "My First Video",
  "aspectRatio": "9:16",
  "subtitles": {
    "style": "yellow"
  }
}
```

See [Config Guide](CONFIG_GUIDE.md) for all options.

---

### Complete Example - Single Video

```
input/
├── voice.mp3                 ✅ Your narration (30 seconds)
├── music.mp3                 ✅ Background music
├── logo.png                  ✅ Your brand logo
├── config.json               ✅ Video settings
└── images/                   ✅ Visual content
    ├── intro-slide.png
    ├── main-photo1.jpg
    ├── main-photo2.jpg
    ├── diagram.png
    └── outro-slide.png
```

**What you'll get:**
```
output/
└── video_tiktok_2024-11-03_15-30-45.mp4
```

A complete video with:
- Your voiceover
- Auto-generated subtitles
- Images displayed in sequence
- Background music
- Your logo watermark

---

## 📁 Option 2: Timeline Mode (Advanced)

**Best for:** Videos with custom structure (intro, main, outro)

### With Timeline Structure

```
input/
├── voice.mp3
├── music.mp3
├── config.json              ← Timeline configuration
├── scenes/                  ← Custom scenes
│   ├── intro.png           ← Title card (3-5 seconds)
│   ├── hook.png            ← Hook scene (5-10 seconds)
│   └── cta.png             ← Call-to-action (5 seconds)
├── images/                  ← Main content images
│   ├── img1.jpg
│   └── img2.jpg
├── intro.mp4                ← Video intro (optional)
└── outro.mp4                ← Video outro (optional)
```

### Timeline Config Example

```json
{
  "name": "Structured Video",
  "aspectRatio": "9:16",
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
        "type": "scene",
        "path": "scenes/cta.png",
        "duration": 5,
        "name": "cta"
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

**Result:** 
```
0-5s:     Intro scene (title card)
5-35s:    Main content (auto-generated from images)
35-40s:   CTA scene (call-to-action)
40-52s:   Outro video
```

**See:** [Timeline Guide](TIMELINE_GUIDE.md) for details

---

## 📁 Option 3: Channel Mode (Batch Processing)

**Best for:** Multiple videos, organized series, automation

### Channel Structure

```
channels/
└── my-channel/                    ← Your channel folder
    ├── channel.json               ← Channel settings
    ├── logo.png                   ← Shared logo
    ├── intro.mp4                  ← Shared intro (optional)
    ├── outro.mp4                  ← Shared outro (optional)
    ├── image-pool/                ← Shared images
    │   ├── bg1.jpg
    │   ├── bg2.jpg
    │   └── bg3.jpg
    ├── music-pool/                ← Shared music
    │   ├── track1.mp3
    │   └── track2.mp3
    └── videos/                    ← Individual videos
        ├── video-001/
        │   ├── voice.mp3          ← Unique voiceover
        │   └── images/            ← Unique images (optional)
        │       └── custom.jpg
        ├── video-002/
        │   └── voice.mp3
        └── video-003/
            ├── voice.mp3
            └── config.json        ← Override channel settings
```

### Channel Config Example

```json
{
  "name": "Daily Tech Tips",
  "description": "Quick tech tips for everyone",
  "defaults": {
    "aspectRatio": "9:16",
    "animation": "static",
    "qualityMode": "high",
    "subtitles": {
      "style": "yellow",
      "position": "bottom"
    },
    "randomImages": true,
    "imageCount": 4,
    "randomMusic": true
  }
}
```

**How it works:**
1. Each video gets its unique voiceover
2. Images randomly selected from `image-pool/`
3. Music randomly selected from `music-pool/`
4. Same branding (logo, intro, outro)
5. Consistent style across all videos

**See:** [Channel Setup Guide](CHANNEL_SETUP.md) for details

---

## 🎬 Real-World Examples

### Example 1: Motivational Quote Video

**Goal:** Simple quote video with background

```
input/
├── voice.mp3                 ← "Today's quote is..."
├── music.mp3                 ← Calm background music
└── images/
    └── sunset.jpg            ← Beautiful background
```

**Run:**
```bash
npm start
```

**Output:** 30-second motivational video

---

### Example 2: Product Review

**Goal:** Review video with product photos

```
input/
├── voice.mp3                 ← Your review narration (2 minutes)
├── music.mp3                 ← Upbeat music
├── logo.png                  ← Your channel logo
├── config.json               ← Settings
└── images/
    ├── product-box.jpg       ← Unboxing
    ├── product-front.jpg     ← Front view
    ├── product-back.jpg      ← Back view
    ├── product-features.png  ← Features diagram
    └── product-using.mp4     ← Usage clip
```

**config.json:**
```json
{
  "name": "iPhone 15 Review",
  "aspectRatio": "16:9",
  "animation": "zoom-in",
  "subtitles": {
    "style": "shadow"
  }
}
```

---

### Example 3: Educational Lesson

**Goal:** Structured lesson with intro, content, summary

```
input/
├── voice.mp3                 ← Full lesson narration
├── music.mp3                 ← Subtle background
├── config.json               ← Timeline config
├── scenes/
│   ├── lesson-title.png     ← Lesson 1: Variables
│   ├── example1.png         ← Code example 1
│   ├── example2.png         ← Code example 2
│   └── summary.png          ← Key points
├── outro.mp4                 ← Subscribe reminder
└── images/
    ├── diagram1.png
    └── diagram2.png
```

**config.json:**
```json
{
  "name": "Python Lesson 1",
  "aspectRatio": "16:9",
  "timeline": {
    "segments": [
      { "type": "scene", "path": "scenes/lesson-title.png", "duration": 5 },
      { "type": "scene", "path": "scenes/example1.png", "duration": 15 },
      { "type": "main" },
      { "type": "scene", "path": "scenes/example2.png", "duration": 15 },
      { "type": "scene", "path": "scenes/summary.png", "duration": 10 },
      { "type": "outro", "path": "outro.mp4" }
    ],
    "audio": {
      "voice": { "path": "voice.mp3" },
      "music": { "path": "music.mp3", "volume": 0.2 }
    }
  },
  "translations": {
    "enabled": true,
    "languages": ["es", "fr"]
  }
}
```

---

### Example 4: News Update Channel

**Goal:** Daily news series with consistent style

```
channels/daily-news/
├── channel.json              ← Channel settings
├── logo.png                  ← News logo
├── intro.mp4                 ← 3-second news intro
├── outro.mp4                 ← Subscribe outro
├── image-pool/               ← News backgrounds
│   ├── news-bg-1.jpg
│   ├── news-bg-2.jpg
│   └── news-bg-3.jpg
├── music-pool/
│   └── news-theme.mp3
└── videos/
    ├── 2024-11-01-tech/
    │   ├── voice.mp3
    │   └── images/
    │       └── breaking-news.jpg
    ├── 2024-11-02-politics/
    │   └── voice.mp3
    └── 2024-11-03-sports/
        └── voice.mp3
```

**Batch process all videos:**
```bash
npm start
→ Choose option 2 (Batch Processing)
→ Select "daily-news"
→ All videos generated!
```

---

## 📋 File Requirements

### Required Files

**At minimum you need:**
- `voice.mp3` - Your voiceover

**That's it!** Everything else is optional.

---

### Recommended Files

**For best results:**
- `voice.mp3` - Voiceover ✅
- `music.mp3` - Background music ✅
- `images/` - 3-10 images ✅
- `config.json` - Custom settings ✅

---

### Optional Files

**For advanced features:**
- `logo.png` - Watermark
- `intro.mp4` - Video intro
- `outro.mp4` - Video outro
- `scenes/` - Custom scenes
- `subtitles.srt` - Pre-made subtitles

---

## 📏 File Specifications

### Voice/Audio Files

**Format:** MP3 (recommended)
- Also supports: WAV, M4A

**Quality:**
- Bitrate: 128kbps minimum, 192kbps recommended
- Sample rate: 44.1kHz or 48kHz

**Length:**
- Minimum: 10 seconds
- Maximum: No limit (but shorter is better for social media)
- Recommended: 30-90 seconds

---

### Image Files

**Format:** 
- JPG/JPEG ✅ (best for photos)
- PNG ✅ (best for graphics, logos)
- GIF ✅ (animations supported)

**Size:**
- Minimum: 720p (1280x720)
- Recommended: 1080p (1920x1080)
- Maximum: 4K (3840x2160)

**Aspect Ratio:**
- Any aspect ratio works
- Will be cropped/padded to match video aspect ratio

---

### Video Files

**Format:**
- MP4 ✅ (recommended)
- MOV ✅
- AVI ✅

**Quality:**
- 720p minimum
- 1080p recommended

**Length:**
- Any length (will be trimmed if needed)

---

### Logo Files

**Format:** PNG with transparency
**Size:** 200x200 to 500x500 pixels
**Position:** Auto-placed (usually bottom-right)

---

## 🗂️ Naming Conventions

### ✅ Good Names

```
voice.mp3               ← Exact name required
music.mp3               ← Exact name required
config.json             ← Exact name required
logo.png                ← Exact name required

images/product-1.jpg    ← Descriptive
images/scene-intro.png  ← Clear purpose
scenes/title-card.png   ← Well organized
```

### ❌ Bad Names

```
Voice.MP3               ← Wrong case
my-voice.mp3            ← Wrong name
config.txt              ← Wrong extension
logo.jpg                ← Should be PNG for transparency

images/img1.jpg         ← Not descriptive
images/photo 2.jpg      ← Spaces cause issues
scenes/SCENE1.PNG       ← Inconsistent case
```

---

## 🔄 Workflow Examples

### Workflow 1: Quick Daily Post

**Time:** 5 minutes

1. Record voiceover on phone
2. Export as `voice.mp3`
3. Drop into `input/` folder
4. Run `npm start`
5. Upload to TikTok!

**Files needed:** Just `voice.mp3`

---

### Workflow 2: Professional Video

**Time:** 30 minutes

1. Write script
2. Record voiceover
3. Find/create 5-10 images
4. Find background music
5. Create config.json
6. Organize in `input/` folder
7. Test with draft quality
8. Generate final with high quality
9. Upload!

---

### Workflow 3: Batch Content

**Time:** 2 hours setup, then 5 minutes per video

**Setup (once):**
1. Create channel structure
2. Add logo, intro, outro
3. Fill image-pool and music-pool
4. Create channel.json

**Per Video:**
1. Record voiceover
2. Save in new video folder
3. Continue recording more
4. Batch process all at once!

---

## 🐛 Troubleshooting

### "No voice file found"

**Problem:** Voice file missing or named wrong

**Solution:**
- Check file is named exactly `voice.mp3` or `voice-over.mp3`
- Check it's in the right folder
- Check file extension (not `voice.mp3.txt`)

---

### "No images or videos found"

**Problem:** Images folder empty or missing

**Solution:**
- Create `input/images/` folder
- Add at least one image or video
- Or use channel image-pool
- Or let YT-Machine create simple background

---

### "Config file invalid"

**Problem:** JSON syntax error

**Solution:**
- Validate JSON at https://jsonlint.com/
- Check all quotes are double `"`
- Check commas between items
- See [Config Guide](CONFIG_GUIDE.md)

---

### "Permission denied"

**Problem:** File locked or permissions wrong

**Solution:**
- Close file in other programs
- Check file is not read-only
- On Mac/Linux: `chmod 644 voice.mp3`

---

## 📖 Folder Templates

### Template 1: Minimal

```
input/
└── voice.mp3
```

**Usage:** Quick tests, simple videos

---

### Template 2: Standard

```
input/
├── voice.mp3
├── music.mp3
├── config.json
└── images/
    ├── img1.jpg
    ├── img2.jpg
    └── img3.jpg
```

**Usage:** Most common setup

---

### Template 3: Professional

```
input/
├── voice.mp3
├── music.mp3
├── logo.png
├── config.json
├── scenes/
│   ├── intro.png
│   └── outro.png
└── images/
    ├── main1.jpg
    ├── main2.jpg
    └── main3.jpg
```

**Usage:** Polished, branded content

---

### Template 4: Advanced Timeline

```
input/
├── voice.mp3
├── music.mp3
├── logo.png
├── intro.mp4
├── outro.mp4
├── config.json
├── scenes/
│   ├── title.png
│   ├── hook.png
│   ├── point1.png
│   ├── point2.png
│   └── cta.png
└── images/
    ├── example1.jpg
    └── example2.jpg
```

**Usage:** Complex, professional videos

---

## 🎯 Next Steps

Now you know how to organize your content!

**Ready to create?**
1. **Prepare your files** using this guide
2. **Create config.json** using [Config Guide](CONFIG_GUIDE.md)
3. **Run YT-Machine** with `npm start`
4. **Check output/** for your video!

**Need help?**
- [Config Guide](CONFIG_GUIDE.md) - Customize settings
- [Channel Setup Guide](CHANNEL_SETUP.md) - Batch processing
- [FAQ](FAQ.md) - Common questions

---

**Happy video creating!** 🎬✨
