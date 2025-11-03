# 🚀 Quick Start Guide

**Create your first video in 10 minutes!**

This guide will walk you through creating your very first video with YT-Machine, step by step.

---

## ✅ Prerequisites

Before starting, make sure you have:
- ✅ Installed YT-Machine ([Installation Guide](INSTALLATION.md))
- ✅ Set up your API keys in `.env` file
- ✅ A voiceover file (MP3 format)

**Don't have these?** Go to [Installation Guide](INSTALLATION.md) first.

---

## 🎬 Create Your First Video (Simple Method)

### Step 1: Prepare Your Voiceover

You need at least one file: **your voiceover**

**Option A: Record on your phone**
1. Open Voice Memos (iPhone) or Voice Recorder (Android)
2. Record your narration (30-60 seconds)
3. Export/share as MP3
4. Transfer to your computer

**Option B: Use text-to-speech**
1. Go to https://ttsmaker.com/ (free)
2. Type your script
3. Click "Convert to Speech"
4. Download as MP3

**Option C: Record on computer**
1. Use Audacity (free) or any recording software
2. Record your voiceover
3. Export as MP3

---

### Step 2: Set Up Your Files

1. **Open your YT-Machine folder**

2. **Go to the `input` folder**

3. **Add your voiceover:**
   - Rename your file to exactly: `voice.mp3`
   - Put it in the `input` folder
   
   ```
   yt-machine/
   └── input/
       └── voice.mp3  ← Your file here
   ```

4. **Add images (optional but recommended):**
   - Create a folder called `images` inside `input`
   - Add 3-5 images (JPG or PNG)
   
   ```
   yt-machine/
   └── input/
       ├── voice.mp3
       └── images/
           ├── image1.jpg
           ├── image2.jpg
           └── image3.jpg
   ```

---

### Step 3: Run YT-Machine

1. **Open Terminal/Command Prompt**
   
   **Windows:**
   - Press `Windows Key + R`
   - Type `cmd`
   - Press Enter

   **Mac:**
   - Press `Command + Space`
   - Type `terminal`
   - Press Enter

2. **Navigate to YT-Machine folder:**
   
   ```bash
   cd Documents/yt-machine
   ```
   
   💡 **Tip:** Drag the folder into terminal instead of typing!

3. **Start YT-Machine:**
   
   ```bash
   npm start
   ```

---

### Step 4: Follow the Prompts

YT-Machine will ask you some questions. Here's what to choose:

#### **Mode Selection:**
```
Choose mode (1-4, Enter = 1):
```
Press **1** (Interactive Mode) and Enter

#### **Aspect Ratio:**
```
Select aspect ratio:
  1. 9:16 (Vertical - TikTok/Shorts)
  2. 16:9 (Horizontal - YouTube)
  3. 1:1 (Square - Instagram)
```
Choose **1** for TikTok/YouTube Shorts

#### **Animation:**
```
Choose effect:
  1. None (static)
  2. Zoom in (Ken Burns)
  3. Zoom out
```
Choose **1** for static (recommended for first video)

#### **Quality:**
```
Choose quality:
  1. Draft (fast, lower quality)
  2. High Quality (slower, best quality)
```
Choose **1** for draft (faster, good for testing)

#### **Subtitle Style:**
```
Choose style:
  1. Classic
  2. Bold
  3. Yellow (YouTube style)
  4. Minimal
  5. Cinematic
  6. Shadow
```
Choose **3** for YouTube-style subtitles

#### **Other prompts:**
- Position: Choose **1** (bottom)
- Animation: Choose **1** (none)
- CTA: Choose **n** (no)
- Formats: Choose **1** (single format)

---

### Step 5: Wait for Processing

You'll see progress updates like:

```
🚀 Starting video generation...
📊 Found 3 images
✅ Found voiceover: voice.mp3
✅ Audio duration: 45.5 seconds
🎬 Processing media clips...
✅ Image 1/3 complete
✅ Image 2/3 complete
✅ Image 3/3 complete
📝 Generating subtitles...
🎵 Processing background music...
📝 Adding subtitles...
✅ Video created successfully
```

**Time:** About 1-2 minutes for a 45-second video (draft mode)

---

### Step 6: Find Your Video

Your video is ready!

**Location:**
```
yt-machine/
└── output/
    └── video_tiktok_2024-11-03_15-30-45.mp4
```

**Open the folder:**
- Navigate to `yt-machine/output/`
- Double-click the MP4 file to watch!

---

## 🎉 Congratulations!

You've created your first video! 🎬

**What you got:**
- ✅ Video with your voiceover
- ✅ Auto-generated subtitles
- ✅ Images displayed in sequence
- ✅ Perfect for TikTok/YouTube Shorts

---

## 🎨 Next Steps: Make It Better

Now that you've created a basic video, let's improve it!

### Add Background Music

1. **Get royalty-free music:**
   - YouTube Audio Library (free)
   - Epidemic Sound
   - Artlist
   - Or record your own!

2. **Add to input folder:**
   ```
   input/
   ├── voice.mp3
   ├── music.mp3  ← Add this
   └── images/
   ```

3. **Run again:**
   ```bash
   npm start
   ```

YT-Machine will automatically mix the music with your voice!

---

### Add Your Logo

1. **Create or get your logo:**
   - PNG format with transparency
   - Size: 200x200 to 500x500 pixels

2. **Add to input folder:**
   ```
   input/
   ├── voice.mp3
   ├── music.mp3
   ├── logo.png  ← Add this
   └── images/
   ```

3. **Run again** - logo will appear on your video!

---

### Customize Settings

Create a `config.json` file to control everything:

1. **Create file:** `input/config.json`

2. **Add settings:**
   ```json
   {
     "name": "My Awesome Video",
     "aspectRatio": "9:16",
     "animation": "zoom-in",
     "qualityMode": "high",
     "subtitles": {
       "style": "yellow",
       "position": "bottom"
     }
   }
   ```

3. **Run again** - no prompts needed, uses your config!

**Learn more:** [Config Guide](CONFIG_GUIDE.md)

---

## 📱 Create Different Video Types

### TikTok/YouTube Shorts (Vertical)

```json
{
  "aspectRatio": "9:16",
  "subtitles": {
    "style": "yellow",
    "position": "bottom"
  }
}
```

### YouTube Video (Horizontal)

```json
{
  "aspectRatio": "16:9",
  "animation": "zoom-in",
  "subtitles": {
    "style": "shadow",
    "fontSize": 60
  }
}
```

### Instagram Post (Square)

```json
{
  "aspectRatio": "1:1",
  "subtitles": {
    "style": "minimal",
    "position": "center"
  }
}
```

---

## 🎯 Common First-Timer Questions

### Q: Can I make videos without images?

**A:** Yes! YT-Machine will create a simple background. But videos with images look much better!

### Q: How long can my video be?

**A:** Any length! But for social media, 30-90 seconds is ideal.

### Q: Do I need background music?

**A:** No, it's optional. But it makes videos more engaging!

### Q: Can I edit the video after?

**A:** Yes! Use any video editor (CapCut, iMovie, etc.) to make final tweaks.

### Q: How do I change subtitle style?

**A:** Either choose different style during prompts, or set it in `config.json`

### Q: Can I make the voice louder/quieter?

**A:** Yes! Use config:
```json
{
  "audio": {
    "voiceVolume": 120,
    "musicVolume": 25
  }
}
```

---

## 🐛 First-Time Troubleshooting

### "Voice file not found"

**Problem:** Voiceover file missing or wrong name

**Fix:**
- Make sure file is named exactly: `voice.mp3`
- Check it's in `input/` folder (not `input/images/`)
- Check file extension (not `voice.mp3.txt`)

### "No images or videos found"

**Problem:** No visual content

**Fix:**
- Add images to `input/images/` folder
- Or let YT-Machine create simple background (just continue)

### "Error generating subtitles"

**Problem:** API key not configured

**Fix:**
- Check `.env` file has `ASSEMBLYAI_API_KEY=your-key`
- Make sure key is valid
- See [Installation Guide](INSTALLATION.md)

### Video looks wrong

**Problem:** Wrong aspect ratio or settings

**Fix:**
- Delete output video
- Choose different aspect ratio
- Or create `config.json` with correct settings

---

## 📚 Complete Beginner Example

Let me show you a complete example from start to finish:

### Scenario: Motivational Quote Video

**Goal:** Create a 30-second motivational video for TikTok

**Step 1: Record voiceover**
```
Script: "Today's quote is from Steve Jobs. 
'Stay hungry, stay foolish.' This means 
always keep learning and don't be afraid 
to take risks. Remember, the greatest 
innovations come from those who dare to 
think differently."
```

**Step 2: Prepare files**
```
input/
├── voice.mp3              ← Your recording
├── music.mp3              ← Inspirational background music
└── images/
    └── steve-jobs.jpg     ← Portrait or quote image
```

**Step 3: Create config**
```json
{
  "name": "Steve Jobs Quote",
  "aspectRatio": "9:16",
  "animation": "static",
  "subtitles": {
    "style": "cinematic",
    "position": "bottom"
  },
  "audio": {
    "voiceVolume": 100,
    "musicVolume": 30
  }
}
```

**Step 4: Generate**
```bash
npm start
```

**Step 5: Result**
- 30-second vertical video ✅
- Inspirational music in background ✅
- Professional subtitles ✅
- Ready to upload to TikTok! ✅

---

## 🎓 Learning Path

**You are here:** ✅ Created first video

**Next steps:**

1. **Week 1: Master the Basics**
   - Create 5-10 test videos
   - Try different aspect ratios
   - Experiment with subtitle styles
   - Add background music and logos

2. **Week 2: Organize with Channels**
   - Read [Channel Setup Guide](CHANNEL_SETUP.md)
   - Create your first channel
   - Batch process multiple videos
   - Set up image and music pools

3. **Week 3: Advanced Features**
   - Read [Config Guide](CONFIG_GUIDE.md)
   - Learn timeline system
   - Try multi-language translations
   - Create complex video structures

4. **Week 4: Automation**
   - Set up automated workflows
   - Create templates for different video types
   - Scale to daily content production

---

## 🎬 Video Ideas to Practice

Start with these easy video types:

### 1. Daily Quote
- ✅ Simple voiceover
- ✅ 1 background image
- ✅ 30 seconds
- ✅ Perfect for learning!

### 2. Quick Tip
- ✅ Share a helpful tip
- ✅ 3-5 images showing steps
- ✅ 60 seconds
- ✅ Great for engagement!

### 3. Fun Fact
- ✅ Interesting fact narration
- ✅ Related images
- ✅ 45 seconds
- ✅ Easy and fun!

### 4. Before/After
- ✅ Show transformation
- ✅ 2 images (before, after)
- ✅ 30 seconds
- ✅ High impact!

### 5. Product Recommendation
- ✅ Review something you like
- ✅ Product photos
- ✅ 90 seconds
- ✅ Valuable content!

---

## 💡 Pro Tips for Beginners

### 1. Start Simple
Don't try to make perfect videos at first. Just make videos!

### 2. Use Draft Mode
Test with `"qualityMode": "draft"` - it's 3x faster and good enough to preview.

### 3. Short Scripts Work Best
Start with 30-45 second videos. They're easier and perform better on social media.

### 4. Good Audio = Good Video
Your voiceover is more important than images. Record in a quiet place!

### 5. Batch Your Work
Record 5-10 voiceovers at once, then generate all videos together.

### 6. Study What Works
Watch popular videos in your niche. Notice: length, style, pacing, music.

### 7. Be Consistent
Create 1 video per day for 30 days. You'll improve dramatically!

---

## ✅ Checklist: First Video

Before you start:
- [ ] YT-Machine installed
- [ ] API keys configured in `.env`
- [ ] Voiceover recorded as `voice.mp3`
- [ ] Images added (optional)
- [ ] Terminal/Command Prompt open

After generation:
- [ ] Video plays correctly
- [ ] Subtitles are readable
- [ ] Audio sounds good
- [ ] Length is correct
- [ ] Aspect ratio is correct

Ready to publish:
- [ ] Watched full video
- [ ] Checked for errors
- [ ] Satisfied with quality
- [ ] Added to TikTok/YouTube

---

## 🚀 You're Ready!

You now know how to:
- ✅ Prepare your files
- ✅ Run YT-Machine
- ✅ Create videos
- ✅ Find your output
- ✅ Customize settings

**Start creating!** The best way to learn is by making videos.

---

## 📖 Continue Learning

- **[Folder Structure Guide](FOLDER_STRUCTURE.md)** - Organize your content better
- **[Config Guide](CONFIG_GUIDE.md)** - Master all settings
- **[Channel Setup](CHANNEL_SETUP.md)** - Scale to multiple videos
- **[FAQ](FAQ.md)** - Common questions answered

---

## 💬 Need Help?

- **Stuck?** Check the [Troubleshooting](#first-time-troubleshooting) section above
- **Questions?** Read the [FAQ](FAQ.md)
- **Bugs?** Report on GitHub Issues
- **Ideas?** Share in GitHub Discussions

---

**Happy creating!** 🎬✨

**Your first video is just the beginning!**
