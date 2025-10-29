# 🚀 Quick Start - unwanted-visitors

## 📋 15-Line Cheat Sheet

### 1️⃣ Add Voice Scripts (Option A: Azure TTS)
```bash
# Add scripts to scripts.csv
npm run tts:generate -- unwanted-visitors
```

### 1️⃣ Add Voice Scripts (Option B: Manual)
```bash
# Add MP3 files to videos/
mkdir videos/my-video
cp ~/voice.mp3 videos/my-video/voice.mp3
```

### 2️⃣ Add Images (16:9 format recommended)
```bash
cp ~/images/*.jpg image-pool/
```

### 3️⃣ Add Background Music (Optional)
```bash
cp ~/music/*.mp3 music-pool/
```

### 4️⃣ Generate Videos
```bash
npm start
# Select: Batch Processing > unwanted-visitors
```

---

## 📁 Folder Structure

```
unwanted-visitors/
├── channel.json          # Channel settings
├── scripts.csv          # TTS scripts (if using Azure TTS)
├── image-pool/          # Add 16:9 images here
├── music-pool/          # Add background music here
└── videos/              # Video projects
    ├── video-001/
    │   ├── voice.mp3    # Required
    │   └── subtitles.srt # Optional
    └── video-002/
```

---

## 🎯 Platform: youtube

### YouTube Optimization
- Use 16:9 for regular videos
- Use 9:16 for Shorts
- Keep Shorts under 60 seconds
- Add chapters for long videos (10+ min)
- Enable subtitles for better SEO

---

## ⚙️ Configuration

Edit `channel.json` to customize:
- Aspect ratio, animation, quality
- Subtitle style, position, font size
- Music volume, fade effects
- CTA overlays, export formats

---

## 🔧 Common Tasks

### Generate subtitles automatically
```bash
npm run subtitles
```

### Test TTS voices
```bash
npm run tts:voices
```

### Regenerate specific video
```bash
# Delete output, then run batch processing
rm videos/my-video/output.mp4
npm start
```

---

**Need help?** Check the main README.md or channel configuration guides!
