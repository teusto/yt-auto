# 🎯 Getting Started with YT Machine

**Your complete roadmap to creating videos.**

---

## 📚 Documentation Index

### 🚀 Start Here
1. **[HOW_TO_CREATE_VIDEO.md](HOW_TO_CREATE_VIDEO.md)** ⭐ **START HERE**
   - Step-by-step guide to create your first video
   - Folder structure, required files, config options
   - Complete examples and troubleshooting

2. **[QUICK_START_CARD.md](QUICK_START_CARD.md)** ⚡
   - 2-minute quick reference
   - Essential commands and config templates

---

### 🎨 Customization Guides

3. **[CONFIG_GUIDE.md](CONFIG_GUIDE.md)** ⚙️ **NEW!**
   - Enhanced config validation with helpful errors
   - Quick-start presets (YouTube Shorts, TikTok, etc.)
   - Simplified configuration options
   - Complete field reference

4. **[SUBTITLE_PROPERTIES_GUIDE.md](SUBTITLE_PROPERTIES_GUIDE.md)** 📝
   - All subtitle properties (colors, fonts, positions)
   - Config examples and best practices
   - Color combinations for different styles

5. **[PER_VIDEO_LANGUAGE_GUIDE.md](PER_VIDEO_LANGUAGE_GUIDE.md)** 🌍
   - Configure different languages per video
   - Multi-language channel setup
   - Language priority system

6. **[AUTO_SUBTITLES.md](AUTO_SUBTITLES.md)** 🎙️
   - Setup automatic subtitle generation
   - AssemblyAI configuration
   - Pricing and usage guide

---

### 🔧 Advanced Features

7. **[ADVANCED_FEATURES_GUIDE.md](ADVANCED_FEATURES_GUIDE.md)** 🚀
   - Intro/Outro videos
   - CTA overlays (subscribe buttons)
   - Multi-format export (YouTube, TikTok, Instagram)

8. **[VIDEO_CLIPS_GUIDE.md](VIDEO_CLIPS_GUIDE.md)** 🎥
   - Mix images and video clips
   - Video trimming and looping

9. **[ANIMATION_GUIDE.md](ANIMATION_GUIDE.md)** ✨
   - Ken Burns effects (zoom, pan)
   - Animation settings

10. **[AUDIO_CONFIGURATION_GUIDE.md](AUDIO_CONFIGURATION_GUIDE.md)** 🔊
   - Volume control (voice/music)
   - Fade effects
   - Audio presets

---

### 🐛 Fixes & Updates

11. **[CONFIG_FIX_APPLIED.md](CONFIG_FIX_APPLIED.md)** ✅
    - Video config bug fixes
    - All properties now working

12. **[FIXES_SUMMARY.md](FIXES_SUMMARY.md)** 🔧
    - API caching fixes
    - Subtitle color configuration

13. **[FIX_APPLIED.md](FIX_APPLIED.md)** 🌍
    - Language detection improvements
    - Portuguese support

---

## 🎬 Quick Workflows

### Create Your First Video

```bash
# 1. Create folder and add files
mkdir channels/pray-matheus/videos/test-001
cp audio.mp3 channels/pray-matheus/videos/test-001/voice.mp3
mkdir channels/pray-matheus/videos/test-001/images
cp *.jpg channels/pray-matheus/videos/test-001/images/

# 2. Generate
npm start
# Choose: 2 (Channel Batch)
# Select: pray-matheus → test-001

# 3. Check output
ls output/
```

### Create Video with Custom Subtitles

```bash
# 1. Create folder
mkdir channels/pray-matheus/videos/custom-001

# 2. Add files
cp audio.mp3 channels/pray-matheus/videos/custom-001/voice.mp3
cp -r images/ channels/pray-matheus/videos/custom-001/images/

# 3. Create config
cat > channels/pray-matheus/videos/custom-001/config.json << 'EOF'
{
  "videoType": "shorts",
  "language": "pt",
  "subtitle": {
    "fontSize": 48,
    "fontColor": "#FFD700",
    "outlineColor": "black",
    "outlineWidth": 3,
    "position": "center",
    "bold": true
  }
}
EOF

# 4. Generate
npm start
```

### Create English Video

```bash
# In video config.json
{
  "language": "en",
  "subtitle": {
    "fontSize": 48,
    "fontColor": "white",
    "position": "center"
  }
}
```

---

## 📋 Essential Files

### Required
- **`voice.mp3`** - Your audio (MUST have)
- **`images/`** - Images folder OR enable channel pool

### Optional
- **`config.json`** - Custom video settings
- **`music.mp3`** - Background music
- **`subtitles.srt`** - Manual subtitles

---

## ⚙️ Essential Config

### Minimal Config
```json
{
  "videoType": "shorts"
}
```

### Recommended Config
```json
{
  "videoType": "shorts",
  "language": "pt",
  "subtitle": {
    "enabled": true,
    "fontSize": 48,
    "fontColor": "#FFD700",
    "outlineColor": "black",
    "outlineWidth": 3,
    "position": "center",
    "bold": true
  }
}
```

---

## 🎨 Subtitle Color Presets

### Gold (Spiritual)
```json
"fontColor": "#FFD700",
"outlineColor": "#2F4F4F"
```

### Classic White
```json
"fontColor": "white",
"outlineColor": "black"
```

### YouTube Yellow
```json
"fontColor": "#FFFF00",
"outlineColor": "black"
```

### Modern Red
```json
"fontColor": "red",
"outlineColor": "black"
```

---

## 🌍 Language Codes

| Code | Language |
|------|----------|
| `pt` | Portuguese |
| `en` | English |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `it` | Italian |

**Full list:** https://www.assemblyai.com/docs/concepts/supported-languages

---

## 🚀 Common Commands

```bash
# Start video generator
npm start

# Option 1: Interactive mode (single video)
# Option 2: Channel batch (multiple videos)

# Check output
ls output/

# View video
vlc output/video_name.mp4
```

---

## 💡 Tips

1. **Start simple** - Just add `voice.mp3` and images first
2. **Use channel defaults** - Set common settings in `channel.json`
3. **Test with one video** - Before batch processing
4. **Check console output** - Shows which settings are applied
5. **Use pools** - Channel image/music pools save time

---

## 🐛 Common Issues

### "No voice file found"
→ Make sure file is named `voice.mp3` (lowercase)

### "No images found"
→ Add images to `images/` folder OR enable `useChannelPool: true`

### "Subtitle color not working"
→ Make sure using latest code (fixed Oct 17, 2025)

### "Wrong language detected"
→ Add `"language": "pt"` to video `config.json`

### "API called multiple times"
→ Fixed with caching (Oct 17, 2025)

---

## 🎓 Learning Path

### Week 1: Basics
1. Read [HOW_TO_CREATE_VIDEO.md](HOW_TO_CREATE_VIDEO.md)
2. Create first video with default settings
3. Experiment with subtitle colors

### Week 2: Customization
1. Learn config options in [SUBTITLE_PROPERTIES_GUIDE.md](SUBTITLE_PROPERTIES_GUIDE.md)
2. Try different styles
3. Setup auto-subtitles ([AUTO_SUBTITLES.md](AUTO_SUBTITLES.md))

### Week 3: Advanced
1. Setup channel defaults
2. Try multi-language videos
3. Explore intro/outro, CTA overlays

---

## 📞 Need Help?

**Check these in order:**

1. **[HOW_TO_CREATE_VIDEO.md](HOW_TO_CREATE_VIDEO.md)** - Complete guide
2. **[QUICK_START_CARD.md](QUICK_START_CARD.md)** - Quick reference
3. **Specific guides** - See documentation index above
4. **Console output** - Shows what's happening
5. **Troubleshooting** - Each guide has troubleshooting section

---

## ✅ Next Steps

**You're ready! Choose your path:**

### → **New User**: [HOW_TO_CREATE_VIDEO.md](HOW_TO_CREATE_VIDEO.md)
Create your first video in 5 minutes

### → **Quick Reference**: [QUICK_START_CARD.md](QUICK_START_CARD.md)
2-minute command reference

### → **Customize**: [SUBTITLE_PROPERTIES_GUIDE.md](SUBTITLE_PROPERTIES_GUIDE.md)
Make videos look exactly how you want

### → **Multi-language**: [PER_VIDEO_LANGUAGE_GUIDE.md](PER_VIDEO_LANGUAGE_GUIDE.md)
Create videos in different languages

---

**Happy creating! 🎬✨**
