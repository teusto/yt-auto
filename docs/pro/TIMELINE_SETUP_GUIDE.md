# 🎬 Timeline Setup Guide - Complete Example

**Step-by-step guide to create your first timeline video**

---

## 📁 Folder Structure

### Option 1: Inside Channel (Recommended for Batch Processing)

```
channels/
└── my-channel/
    ├── channel.json          # Channel config (optional timeline defaults)
    │
    └── videos/
        └── video-001/
            ├── config.json   # ✅ Timeline config HERE
            │
            ├── scenes/       # Custom scenes folder
            │   ├── opening.mp4
            │   ├── title-card.jpg
            │   └── cta.mp4
            │
            ├── intro.mp4     # Intro video (optional)
            ├── outro.mp4     # Outro video (optional)
            │
            ├── images/       # For main content
            │   ├── 001.jpg
            │   ├── 002.jpg
            │   ├── 003.jpg
            │   └── ...
            │
            ├── voice.mp3     # Voice for main content
            ├── music.mp3     # Background music for main content
            └── subtitles.srt # Subtitles for main content
```

### Option 2: Standalone Project

```
input/                        # Your project folder
├── config.json              # ✅ Timeline config HERE
│
├── scenes/                  # Custom scenes
│   ├── opening.mp4
│   ├── title.jpg
│   └── cta.mp4
│
├── intro.mp4               # Intro video
├── outro.mp4               # Outro video
│
├── images/                 # For main content
│   ├── 001.jpg
│   ├── 002.jpg
│   └── ...
│
├── voice.mp3
├── music.mp3
└── subtitles.srt
```

---

## 🚀 Quick Start Example

### Step 1: Enable Timeline Feature

Add to your `.env` file:

```env
PRO_TIMELINE=true
```

### Step 2: Create Project Folder

```bash
# Create a test project
mkdir -p input/scenes
```

### Step 3: Add Images (for main content)

```bash
# Add at least 3 images to input/ folder
cp /path/to/your/image1.jpg input/001.jpg
cp /path/to/your/image2.jpg input/002.jpg
cp /path/to/your/image3.jpg input/003.jpg
```

### Step 4: Add Audio (for main content)

```bash
# Add voice narration
cp /path/to/your/voice.mp3 input/voice.mp3

# Optional: background music
cp /path/to/your/music.mp3 input/music.mp3
```

### Step 5: Create Scene Files

**Option A: Use Video Scenes**
```bash
# Add custom video scenes
cp /path/to/opening-video.mp4 input/scenes/opening.mp4
cp /path/to/cta-video.mp4 input/scenes/cta.mp4
```

**Option B: Use Image Scenes**
```bash
# Create image scenes (will show for specified duration)
cp /path/to/title-card.jpg input/scenes/title.jpg
```

**Option C: Use Intro/Outro**
```bash
# Traditional intro/outro
cp /path/to/intro.mp4 input/intro.mp4
cp /path/to/outro.mp4 input/outro.mp4
```

### Step 6: Create Timeline Config

Create `input/config.json`:

```json
{
  "name": "My First Timeline Video",
  "aspectRatio": "16:9",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/opening.mp4",
        "name": "Opening Scene"
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
        "path": "scenes/cta.mp4",
        "name": "Call to Action"
      },
      {
        "type": "outro",
        "path": "outro.mp4"
      }
    ]
  }
}
```

### Step 7: Run

```bash
# Interactive mode
npm start
# Choose: 1 (Interactive Mode)
# It will detect config.json and use timeline

# OR batch mode
npm start
# Choose: 2 (Batch Processing - Select Channel)
# Select your channel and video
```

---

## 📝 Minimal Example (No Scene Files Required)

If you don't have custom scenes yet, start with basics:

### Folder Structure

```
input/
├── config.json
├── images/
│   ├── 001.jpg
│   ├── 002.jpg
│   └── 003.jpg
└── voice.mp3
```

### Config

```json
{
  "name": "Simple Timeline Test",
  "timeline": {
    "segments": [
      {
        "type": "main"
      }
    ]
  }
}
```

**This will work!** Main content = generated video from your images.

---

## 🎯 Working Example Templates

### Template 1: Basic (Intro → Main → Outro)

**Files needed:**
- `intro.mp4` - Your intro video
- `outro.mp4` - Your outro video  
- `images/` - Main content images
- `voice.mp3` - Narration

**Config:**
```json
{
  "timeline": {
    "segments": [
      { "type": "intro", "path": "intro.mp4" },
      { "type": "main" },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

### Template 2: With Title Card

**Files needed:**
- `scenes/title.jpg` - Title card image
- `images/` - Main content images
- `voice.mp3` - Narration
- `intro.mp4` - Intro video (optional)

**Config:**
```json
{
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 3,
        "name": "Title Card"
      },
      { "type": "intro", "path": "intro.mp4" },
      { "type": "main" }
    ]
  }
}
```

### Template 3: YouTube Style

**Files needed:**
- `scenes/hook.mp4` - Hook/teaser clip
- `intro.mp4` - Channel intro
- `images/` - Main content
- `voice.mp3` - Narration
- `scenes/subscribe.mp4` - Subscribe animation
- `outro.mp4` - Outro

**Config:**
```json
{
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/hook.mp4",
        "name": "Hook (first 3 seconds)",
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
        "name": "Subscribe Prompt"
      },
      {
        "type": "outro",
        "path": "outro.mp4"
      }
    ]
  }
}
```

---

## 🔍 Understanding File Paths

### Relative Paths (Recommended)

Timeline looks for files **relative to your project folder**:

```json
{
  "type": "scene",
  "path": "scenes/opening.mp4"
}
```

If your project is at `channels/my-channel/videos/video-001/`, it looks for:
- `channels/my-channel/videos/video-001/scenes/opening.mp4` ✅

### Absolute Paths

You can also use absolute paths:

```json
{
  "type": "scene",
  "path": "/home/user/my-videos/opening.mp4"
}
```

---

## 🎬 Main Content Explained

The `"type": "main"` segment generates video from your images/clips using the standard YT-Machine flow:

**What it includes:**
- ✅ All images in `images/` folder (or root folder)
- ✅ Voice narration (`voice.mp3`)
- ✅ Background music (`music.mp3`)
- ✅ Subtitles (`subtitles.srt` or auto-generated)
- ✅ Ken Burns animation (zoom, pan)
- ✅ All your normal settings (aspect ratio, quality, etc.)

**Example main content:**
```
images/001.jpg → 3 seconds
images/002.jpg → 3 seconds
images/003.jpg → 3 seconds
+ voice.mp3 (audio)
+ music.mp3 (background)
+ subtitles (burned in)
= Main content video
```

Then timeline places this between your custom scenes!

---

## 🧪 Test with Sample Files

### Create Test Project

```bash
# 1. Create folders
mkdir -p test-timeline/scenes
cd test-timeline

# 2. Create placeholder images (using ImageMagick)
convert -size 1920x1080 xc:blue -pointsize 100 -annotate +700+540 "Image 1" 001.jpg
convert -size 1920x1080 xc:green -pointsize 100 -annotate +700+540 "Image 2" 002.jpg
convert -size 1920x1080 xc:red -pointsize 100 -annotate +700+540 "Image 3" 003.jpg

# 3. Create title card
convert -size 1920x1080 xc:black -pointsize 120 -fill white -annotate +600+540 "My Video" scenes/title.jpg

# 4. Create silent audio (5 seconds)
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 5 -q:a 9 voice.mp3

# 5. Create config
cat > config.json << 'EOF'
{
  "name": "Timeline Test",
  "aspectRatio": "16:9",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 2,
        "name": "Title Card"
      },
      {
        "type": "main"
      }
    ]
  }
}
EOF
```

### Run Test

```bash
# From yt-machine root
PRO_TIMELINE=true npm start

# Choose Interactive Mode
# Point to test-timeline as input folder
```

---

## 📋 Complete Example Script

Save as `create-timeline-example.sh`:

```bash
#!/bin/bash

# Create timeline test project
PROJECT="input-timeline-test"

echo "🎬 Creating Timeline Test Project: $PROJECT"

# Create directories
mkdir -p "$PROJECT/scenes"
mkdir -p "$PROJECT/images"

# Create test images
echo "📸 Creating test images..."
for i in 1 2 3; do
  convert -size 1920x1080 "xc:hsl($((i*120)),100%,50%)" \
    -gravity center -pointsize 120 -fill white \
    -annotate +0+0 "Image $i" \
    "$PROJECT/images/$(printf "%03d" $i).jpg"
done

# Create title card
echo "🎨 Creating title card..."
convert -size 1920x1080 xc:black \
  -gravity center -pointsize 150 -fill white \
  -annotate +0-100 "My Video Title" \
  -pointsize 80 -annotate +0+100 "Timeline Example" \
  "$PROJECT/scenes/title.jpg"

# Create CTA card
echo "📢 Creating CTA card..."
convert -size 1920x1080 xc:blue \
  -gravity center -pointsize 100 -fill white \
  -annotate +0-50 "Subscribe!" \
  -pointsize 60 -annotate +0+50 "Like & Share" \
  "$PROJECT/scenes/cta.jpg"

# Create audio
echo "🎵 Creating audio..."
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 10 -q:a 9 "$PROJECT/voice.mp3" -y 2>/dev/null

# Create config
echo "⚙️  Creating config..."
cat > "$PROJECT/config.json" << 'EOF'
{
  "name": "Timeline Example Video",
  "aspectRatio": "16:9",
  "animation": "zoom-in",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 3,
        "name": "Title Card"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/cta.jpg",
        "duration": 3,
        "name": "Call to Action"
      }
    ]
  },
  "subtitle": {
    "style": "bold"
  }
}
EOF

echo "✅ Project created: $PROJECT"
echo ""
echo "📁 Structure:"
tree "$PROJECT" 2>/dev/null || find "$PROJECT" -type f

echo ""
echo "🚀 To test:"
echo "   1. Add PRO_TIMELINE=true to .env"
echo "   2. npm start"
echo "   3. Choose Interactive Mode"
echo "   4. Use '$PROJECT' as input folder"
```

Run it:

```bash
chmod +x create-timeline-example.sh
./create-timeline-example.sh
```

---

## ❓ FAQ

### Q: Where do timeline segments go?

**A:** In your video project folder. Same place as `voice.mp3` and images.

```
your-video/
├── config.json       ← Timeline config here
├── scenes/          ← Custom scenes here
│   └── opening.mp4
├── intro.mp4        ← Intro here (root level)
├── outro.mp4        ← Outro here (root level)
└── images/          ← Main content here
```

### Q: Can I use existing intro.mp4?

**A:** Yes! Timeline works with existing intro/outro:

```json
{
  "timeline": {
    "segments": [
      { "type": "intro", "path": "intro.mp4" },
      { "type": "main" },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

### Q: Do I need ALL segments?

**A:** No! Minimum is one `main` segment:

```json
{
  "timeline": {
    "segments": [
      { "type": "main" }
    ]
  }
}
```

### Q: What if scene file is missing?

**A:** Clear error:

```
❌ ERRORS (must fix):
   • segments[0]: Scene file not found: scenes/opening.mp4
```

### Q: Can I mix videos and images?

**A:** Yes!

```json
{
  "segments": [
    { "type": "scene", "path": "scenes/video.mp4" },
    { "type": "scene", "path": "scenes/image.jpg", "duration": 3 },
    { "type": "main" }
  ]
}
```

### Q: Does it work in batch mode?

**A:** Yes! Put timeline in channel.json or video config.json:

**Channel defaults:**
```json
{
  "name": "My Channel",
  "defaults": {
    "timeline": {
      "segments": [
        { "type": "intro", "path": "intro.mp4" },
        { "type": "main" },
        { "type": "outro", "path": "outro.mp4" }
      ]
    }
  }
}
```

**Video-specific:**
```json
{
  "timeline": {
    "segments": [
      { "type": "main" }
    ]
  }
}
```

---

## 🎓 Next Steps

1. **Start Simple**: Use main-only timeline first
2. **Add Intro/Outro**: Test with existing videos
3. **Add Scenes**: Create custom scenes folder
4. **Experiment**: Try transitions, custom audio
5. **Go Pro**: Build complex multi-segment timelines

---

## 📚 Related Docs

- **[TIMELINE.md](TIMELINE.md)** - Complete reference
- **[CONFIG_GUIDE.md](../../CONFIG_GUIDE.md)** - Config options
- **[HOW_TO_CREATE_VIDEO.md](../../HOW_TO_CREATE_VIDEO.md)** - Basic video creation

---

**Ready to create your first timeline video!** 🎬
