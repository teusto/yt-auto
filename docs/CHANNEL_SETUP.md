# 📺 Channel Setup Guide

**Organize and automate your video production with channels**

Channels let you organize different video series, each with its own settings, assets, and videos. Perfect for managing multiple content types or brands.

---

## 🎯 What is a Channel?

Think of a channel as a **template or project folder** for a series of videos.

**Examples:**
- "Daily Tech News" - news videos with consistent style
- "Product Reviews" - review videos with same branding
- "Cooking Tips" - cooking videos with similar format
- "Language Lessons" - educational content in same style

**Benefits:**
- ✅ Consistent branding across all videos
- ✅ Reuse images, music, logos automatically
- ✅ Batch process many videos at once
- ✅ Save time with preset configurations

---

## 📁 Channel Structure

Here's what a channel looks like:

```
channels/
└── my-channel/              ← Your channel folder
    ├── channel.json         ← Channel settings
    ├── image-pool/          ← Shared images (optional)
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── music-pool/          ← Shared music (optional)
    │   ├── song1.mp3
    │   └── song2.mp3
    └── videos/              ← Individual videos
        ├── video-001/
        │   ├── voice.mp3
        │   └── config.json (optional)
        ├── video-002/
        │   ├── voice.mp3
        │   └── scenes/
        └── video-003/
            └── voice.mp3
```

---

## 🚀 Quick Start: Create Your First Channel

### Step 1: Create Channel Folder

1. **Open File Explorer/Finder**

2. **Go to your YT-Machine folder**

3. **Create the channel structure:**
   
   **Windows:**
   ```
   Right-click in the "channels" folder
   → New → Folder → Name it "my-first-channel"
   ```
   
   **Mac/Linux:**
   ```bash
   cd yt-machine
   mkdir -p channels/my-first-channel/videos
   mkdir -p channels/my-first-channel/image-pool
   mkdir -p channels/my-first-channel/music-pool
   ```

---

### Step 2: Create Channel Configuration

1. **Create a text file:**
   - Go into your channel folder: `channels/my-first-channel/`
   - Create a new file called `channel.json`

2. **Add this content:**

```json
{
  "name": "My First Channel",
  "description": "My awesome video series",
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

3. **Save the file**

---

### Step 3: Add Shared Assets (Optional)

These assets will be used across all videos in the channel.

1. **Add Images:**
   - Put images in `channels/my-first-channel/image-pool/`
   - YT-Machine will randomly select from these
   - Use .jpg or .png files
   - Recommended: 5-20 images

2. **Add Music:**
   - Put music files in `channels/my-first-channel/music-pool/`
   - YT-Machine will randomly select one
   - Use .mp3 files
   - Recommended: 3-5 tracks

3. **Add Logo (Optional):**
   - Put `logo.png` in the channel folder
   - Will be used as watermark for all videos

---

### Step 4: Create Your First Video

1. **Create video folder:**
   ```
   channels/my-first-channel/videos/episode-001/
   ```

2. **Add your voiceover:**
   - Put `voice.mp3` in the episode folder
   
   ```
   channels/my-first-channel/videos/episode-001/voice.mp3
   ```

3. **That's it!** 
   - The channel will provide images and music automatically
   - Or you can add custom images for this specific video

---

### Step 5: Generate Videos

1. **Open Terminal/Command Prompt**

2. **Navigate to YT-Machine:**
   ```bash
   cd yt-machine
   ```

3. **Run the generator:**
   ```bash
   npm start
   ```

4. **Select Batch Mode:**
   ```
   Choose mode (1-4): 2
   ```

5. **Select Your Channel:**
   ```
   Select channel (1-X): 1
   ```

6. **Watch the Magic!**
   - YT-Machine will process all videos in the channel
   - Videos will be saved in each video folder
   - Progress will be shown in the terminal

---

## ⚙️ Channel Configuration Options

### Basic Configuration

```json
{
  "name": "Channel Name",
  "description": "What this channel is about",
  "defaults": {
    "aspectRatio": "9:16",
    "animation": "static",
    "qualityMode": "high"
  }
}
```

**Options:**

- **aspectRatio:** `"9:16"` (vertical), `"16:9"` (horizontal), `"1:1"` (square)
- **animation:** `"static"`, `"zoom-in"`, `"zoom-out"`
- **qualityMode:** `"draft"` (fast), `"high"` (slow but better)

---

### Subtitle Configuration

```json
{
  "defaults": {
    "subtitles": {
      "enabled": true,
      "style": "yellow",
      "position": "bottom",
      "fontSize": 52
    }
  }
}
```

**Subtitle Styles:**
- `"classic"` - White text, bottom
- `"bold"` - Large white text
- `"yellow"` - YouTube style (recommended)
- `"minimal"` - Small, clean
- `"cinematic"` - Translucent background
- `"shadow"` - Subtle shadow effect

**Positions:**
- `"bottom"` - Bottom of screen (default)
- `"center"` - Middle of screen
- `"top"` - Top of screen

---

### Random Assets Configuration

```json
{
  "defaults": {
    "randomImages": true,
    "imageCount": 5,
    "randomMusic": true
  }
}
```

**How it works:**
- YT-Machine selects random images from `image-pool/`
- YT-Machine selects random music from `music-pool/`
- Number of images determined by `imageCount` or voice duration
- Falls back to video-specific assets if pools are empty

---

### Audio Configuration

```json
{
  "defaults": {
    "audio": {
      "voiceVolume": 100,
      "musicVolume": 35,
      "normalize": true
    }
  }
}
```

**Volume levels:**
- `voiceVolume`: 100 = normal, 120 = louder
- `musicVolume`: 35 = subtle, 50 = balanced, 20 = very subtle

---

### Pro Features Configuration

```json
{
  "defaults": {
    "translations": {
      "enabled": true,
      "languages": ["es", "fr", "pt-BR"]
    },
    "timeline": {
      "useIntro": true,
      "useOutro": true
    }
  }
}
```

**Requires Pro features enabled in .env:**
```bash
PRO_TRANSLATIONS=true
PRO_TIMELINE=true
```

---

## 📂 Example Channels

### Example 1: Tech News Channel

```
channels/tech-news/
├── channel.json
├── logo.png
├── image-pool/
│   ├── tech-bg-1.jpg
│   ├── tech-bg-2.jpg
│   └── tech-bg-3.jpg
├── music-pool/
│   └── upbeat-tech.mp3
└── videos/
    ├── 2024-01-15-ai-breakthrough/
    │   └── voice.mp3
    ├── 2024-01-16-new-iphone/
    │   └── voice.mp3
    └── 2024-01-17-cybersecurity/
        └── voice.mp3
```

**channel.json:**
```json
{
  "name": "Tech News Daily",
  "description": "Daily tech news updates",
  "defaults": {
    "aspectRatio": "9:16",
    "animation": "static",
    "qualityMode": "high",
    "subtitles": {
      "style": "yellow",
      "position": "bottom"
    },
    "randomImages": true,
    "imageCount": 3,
    "randomMusic": true,
    "audio": {
      "voiceVolume": 100,
      "musicVolume": 25
    }
  }
}
```

---

### Example 2: Educational Channel with Timeline

```
channels/language-lessons/
├── channel.json
├── intro.mp4
├── outro.mp4
├── image-pool/
│   ├── lesson-bg-1.png
│   └── lesson-bg-2.png
└── videos/
    ├── lesson-01-greetings/
    │   ├── config.json
    │   ├── voice.mp3
    │   └── scenes/
    │       ├── title.png
    │       └── summary.png
    └── lesson-02-numbers/
        ├── config.json
        ├── voice.mp3
        └── scenes/
            ├── title.png
            └── summary.png
```

**channel.json:**
```json
{
  "name": "Spanish Lessons",
  "description": "Learn Spanish in 60 seconds",
  "defaults": {
    "aspectRatio": "9:16",
    "qualityMode": "high",
    "subtitles": {
      "style": "cinematic",
      "position": "bottom"
    },
    "translations": {
      "enabled": true,
      "languages": ["es", "pt-BR"]
    }
  }
}
```

**lesson-01-greetings/config.json:**
```json
{
  "timeline": {
    "segments": [
      { "type": "scene", "path": "scenes/title.png", "duration": 3 },
      { "type": "main" },
      { "type": "scene", "path": "scenes/summary.png", "duration": 5 }
    ],
    "audio": {
      "voice": { "path": "voice.mp3" }
    }
  }
}
```

---

### Example 3: Product Review Channel

```
channels/product-reviews/
├── channel.json
├── logo.png
├── intro.mp4
├── outro.mp4
├── image-pool/          ← Background images
│   └── studio-bg.jpg
├── music-pool/
│   └── upbeat-review.mp3
└── videos/
    ├── review-headphones/
    │   ├── images/      ← Product photos
    │   │   ├── product-1.jpg
    │   │   ├── product-2.jpg
    │   │   └── product-3.jpg
    │   └── voice.mp3
    └── review-laptop/
        ├── images/
        │   ├── laptop-1.jpg
        │   └── laptop-2.jpg
        └── voice.mp3
```

**channel.json:**
```json
{
  "name": "Tech Reviews",
  "description": "Honest product reviews",
  "defaults": {
    "aspectRatio": "16:9",
    "animation": "zoom-in",
    "qualityMode": "high",
    "subtitles": {
      "style": "bold",
      "position": "bottom"
    },
    "randomImages": false,
    "randomMusic": true,
    "audio": {
      "voiceVolume": 110,
      "musicVolume": 30
    }
  }
}
```

**Note:** Each video has its own `images/` folder with product-specific photos. Background from `image-pool/` is mixed in.

---

## 🎬 Video-Specific Configuration

You can override channel defaults for individual videos.

**Create `config.json` in the video folder:**

```
channels/my-channel/videos/special-video/
├── config.json          ← Video-specific settings
└── voice.mp3
```

**Example override:**
```json
{
  "aspectRatio": "1:1",
  "subtitles": {
    "style": "cinematic"
  },
  "translations": {
    "enabled": true,
    "languages": ["es", "fr", "de", "ja"]
  }
}
```

This video will:
- Use 1:1 aspect ratio (instead of channel's 9:16)
- Use cinematic subtitles (instead of channel's yellow)
- Generate 4 translations (instead of channel's defaults)
- Still use channel's music-pool and image-pool

---

## 🔄 Batch Processing Workflow

### Daily Content Workflow

1. **Record voiceovers for multiple videos**
2. **Create video folders:**
   ```
   channels/daily-news/videos/
   ├── 2024-11-01/
   │   └── voice.mp3
   ├── 2024-11-02/
   │   └── voice.mp3
   └── 2024-11-03/
       └── voice.mp3
   ```

3. **Run batch process:**
   ```bash
   npm start
   → Choose option 2 (Batch Processing)
   → Select your channel
   → Wait for all videos to generate
   ```

4. **Find your videos:**
   - Each video folder will have the output
   - Ready to upload!

---

## 📊 Output Structure

After processing, each video folder will contain:

```
channels/my-channel/videos/episode-001/
├── voice.mp3                               ← Your original
├── subtitles.srt                          ← Generated subtitles
├── video_tiktok_YYYY-MM-DD.mp4           ← Final video
└── translations/                          ← If enabled
    ├── subtitles_es.srt
    └── subtitles_fr.srt
```

---

## 💡 Best Practices

### File Organization

✅ **DO:**
- Use descriptive folder names (`2024-01-tech-news`, not `video1`)
- Keep a consistent naming pattern
- Put shared assets in pools
- Use high-quality images (1080p+)

❌ **DON'T:**
- Use special characters in folder names
- Mix different content types in one channel
- Forget to add `channel.json`
- Use very large video files (keep under 50MB)

---

### Content Strategy

**For News/Updates:**
- Create dated folders (`2024-11-01`, `2024-11-02`)
- Use same image pool for consistency
- Keep videos short (60-90 seconds)

**For Educational Series:**
- Number your episodes (`lesson-01`, `lesson-02`)
- Use custom scenes for each video
- Add translations for wider reach

**For Product Reviews:**
- Name by product (`review-iphone-15`, `review-macbook`)
- Use product-specific images
- Consider longer videos (2-3 minutes)

---

## 🐛 Troubleshooting

### "No channels found"

**Problem:** Channel folder structure incorrect

**Solution:**
```
✅ Correct:
channels/my-channel/channel.json

❌ Incorrect:
channels/channel.json (missing channel folder)
channels/my-channel.json (wrong location)
```

---

### "No valid projects found"

**Problem:** No video folders with voice files

**Solution:**
1. Make sure each video folder has `voice.mp3` or `voice-over.mp3`
2. Check the folder is inside `channels/YOUR-CHANNEL/videos/`

---

### Random images not working

**Problem:** No images in image-pool or setting disabled

**Solution:**
1. Add images to `channels/YOUR-CHANNEL/image-pool/`
2. Make sure `"randomImages": true` in channel.json
3. Check images are .jpg or .png

---

### All videos look the same

**Problem:** Not enough variety in pools

**Solution:**
- Add more images to image-pool (10-20 recommended)
- Add more music to music-pool (3-5 tracks)
- Use different images in each video folder

---

## 📈 Scaling Your Channel

### Small Channel (5-10 videos/week)
- Manual voiceover recording
- Shared image pool
- Batch process weekly

### Medium Channel (20-50 videos/week)
- Consider AI voice generation (Pro)
- Larger image pool (50+ images)
- Automated daily batches

### Large Channel (100+ videos/week)
- Full automation with AI
- Multiple channels for different topics
- Schedule batch processing

---

## 🎯 Next Steps

✅ Channel created!

**Now you can:**
- [Create Your First Video](QUICK_START.md)
- [Learn Config Options](CONFIG_GUIDE.md)
- [Understand Pro Features](PRO_FEATURES.md)

---

## 📞 Need Help?

- **Examples:** Check `docs/examples/`
- **FAQ:** [FAQ.md](FAQ.md)
- **Issues:** GitHub Issues
- **Community:** GitHub Discussions

---

**Ready to scale your content production!** 🚀
