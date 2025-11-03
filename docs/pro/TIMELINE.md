# 🎬 Timeline/Scene System (PRO)

**Custom video segment ordering with unlimited creative control.**

---

## 🌟 Overview

The Timeline System allows you to create complex videos with multiple segments in any order:
- **Intro videos** - Brand intro, channel intro
- **Scene segments** - Custom videos or images
- **Main content** - Generated from your images/clips
- **Outro videos** - Call-to-action, credits, subscribe prompts
- **Custom ordering** - Full control over video structure

---

## 🚀 Quick Start

### Enable Timeline Feature

Add to your `.env` file:

```env
PRO_TIMELINE=true
```

### Basic Timeline Config

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

---

## 📋 Segment Types

### 1. **Main** - Generated Content

The core video generated from your images/clips.

```json
{
  "type": "main"
}
```

- **Required**: At least one main segment
- **Generated**: From images/clips in your project folder
- **Subtitles**: Applied if configured
- **Music**: Applied if configured

### 2. **Intro** - Intro Video

Brand or channel intro video.

```json
{
  "type": "intro",
  "path": "intro.mp4"
}
```

- **Path**: Relative to project folder or absolute
- **Audio**: Preserved from video
- **Duration**: Original video duration

### 3. **Outro** - Outro Video

Ending video (CTA, credits, subscribe prompt).

```json
{
  "type": "outro",
  "path": "outro.mp4"
}
```

### 4. **Scene** - Custom Video/Image

Custom video clip or image with full control.

```json
{
  "type": "scene",
  "path": "scenes/opening.mp4",
  "name": "Opening Scene",
  "mute": false,
  "audio": "custom-audio.mp3",
  "transition": "fade-black",
  "transitionDuration": 1.0
}
```

**Properties:**
- `path` (required) - Video or image file path
- `name` (optional) - Descriptive name
- `duration` (optional) - Duration in seconds (for images only)
- `mute` (optional) - Mute original video audio
- `audio` (optional) - Custom audio track
- `transition` (optional) - Transition to next segment: `none`, `fade`, `fade-black`
- `transitionDuration` (optional) - Transition duration (0.1-3.0 seconds)

### 5. **Placeholder** - Reserved Space

Empty placeholder for future content.

```json
{
  "type": "placeholder",
  "duration": 3
}
```

---

## 🎯 Complete Examples

### Example 1: Basic Structure

```json
{
  "name": "My Video",
  "timeline": {
    "segments": [
      { "type": "intro", "path": "intro.mp4" },
      { "type": "main" },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

### Example 2: With Scene Cards

```json
{
  "name": "My Video",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title-card.jpg",
        "name": "Title Card",
        "duration": 3,
        "audio": "intro-music.mp3"
      },
      { "type": "intro", "path": "intro.mp4" },
      { "type": "main" },
      {
        "type": "scene",
        "path": "scenes/subscribe.mp4",
        "name": "Subscribe Prompt"
      },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

### Example 3: Multi-Part Content

```json
{
  "name": "Documentary Style",
  "timeline": {
    "segments": [
      { "type": "intro", "path": "intro.mp4" },
      {
        "type": "scene",
        "path": "scenes/chapter1.jpg",
        "duration": 2,
        "name": "Chapter 1"
      },
      { "type": "main" },
      {
        "type": "scene",
        "path": "scenes/chapter2.jpg",
        "duration": 2,
        "name": "Chapter 2"
      },
      { "type": "main" },
      {
        "type": "scene",
        "path": "scenes/conclusion.mp4",
        "name": "Conclusion"
      },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

### Example 4: With Transitions

```json
{
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/opening.mp4",
        "transition": "fade-black",
        "transitionDuration": 1.0
      },
      {
        "type": "intro",
        "path": "intro.mp4",
        "transition": "fade",
        "transitionDuration": 0.5
      },
      {
        "type": "main",
        "transition": "fade-black",
        "transitionDuration": 1.0
      },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

---

## 📁 Project Structure

### With Timeline

```
my-video/
├── config.json              # Timeline config here
├── intro.mp4               # Intro video
├── outro.mp4               # Outro video
├── scenes/                 # Custom scenes
│   ├── opening.mp4
│   ├── title.jpg
│   └── cta.mp4
├── images/                 # For main content
│   ├── 001.jpg
│   ├── 002.jpg
│   └── ...
├── voice.mp3               # Voice for main content
├── music.mp3               # Music for main content
└── subtitles.srt           # Subtitles for main content
```

---

## 🎮 Interactive Mode

When Timeline is enabled, you'll see a new prompt:

```
🎬 Timeline/Scene System (PRO)

Create custom video sequences with multiple segments.

  1. Use Timeline (custom segment ordering)
  2. Skip (use standard video generation)

Choose option (1-2, Enter = 2):
```

### Timeline Templates

```
📋 Timeline Segment Options:

  Example templates:
    1. Basic: intro → main → outro
    2. With Scenes: scene → intro → main → scene → outro
    3. Custom: Build your own

Choose template (1-3, Enter = 1):
```

---

## ⚙️ Configuration Reference

### Timeline Object

```json
{
  "timeline": {
    "segments": [
      // Array of segment objects
    ]
  }
}
```

### Segment Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | ✅ Yes | Segment type: `scene`, `intro`, `main`, `outro`, `placeholder` |
| `path` | string | For scenes | Path to video/image file |
| `name` | string | No | Descriptive name |
| `duration` | number | No | Duration in seconds (images only) |
| `mute` | boolean | No | Mute video audio (default: false) |
| `audio` | string | No | Custom audio track path |
| `transition` | string | No | Transition effect: `none`, `fade`, `fade-black` |
| `transitionDuration` | number | No | Transition duration (0.1-3.0s, default: 0.5s) |

---

## 🔧 Advanced Features

### Custom Audio Per Scene

Replace or add audio to any scene:

```json
{
  "type": "scene",
  "path": "scenes/visual.mp4",
  "mute": true,                    // Mute original audio
  "audio": "custom-narration.mp3"  // Add new audio
}
```

### Image Scenes with Duration

Display images as video segments:

```json
{
  "type": "scene",
  "path": "scenes/title-card.jpg",
  "duration": 5,                   // Show for 5 seconds
  "audio": "background-music.mp3"
}
```

### Multiple Main Segments

Split main content across timeline:

```json
{
  "segments": [
    { "type": "intro", "path": "intro.mp4" },
    {
      "type": "scene",
      "path": "scenes/part1-title.jpg",
      "duration": 2
    },
    { "type": "main" },             // First main content
    {
      "type": "scene",
      "path": "scenes/part2-title.jpg",
      "duration": 2
    },
    { "type": "main" },             // Second main content
    { "type": "outro", "path": "outro.mp4" }
  ]
}
```

---

## 🎨 Use Cases

### 1. **YouTube Channels**

```json
{
  "segments": [
    { "type": "intro", "path": "channel-intro.mp4" },
    { "type": "main" },
    {
      "type": "scene",
      "path": "scenes/subscribe-prompt.mp4"
    },
    { "type": "outro", "path": "channel-outro.mp4" }
  ]
}
```

### 2. **Educational Content**

```json
{
  "segments": [
    {
      "type": "scene",
      "path": "scenes/lesson-intro.jpg",
      "duration": 3
    },
    { "type": "main" },
    {
      "type": "scene",
      "path": "scenes/quiz.mp4"
    },
    {
      "type": "scene",
      "path": "scenes/conclusion.jpg",
      "duration": 4
    }
  ]
}
```

### 3. **Documentary Style**

```json
{
  "segments": [
    { "type": "intro", "path": "opening-credits.mp4" },
    { "type": "scene", "path": "scenes/act1-title.jpg", "duration": 2 },
    { "type": "main" },
    { "type": "scene", "path": "scenes/act2-title.jpg", "duration": 2 },
    { "type": "main" },
    { "type": "scene", "path": "scenes/act3-title.jpg", "duration": 2 },
    { "type": "main" },
    { "type": "outro", "path": "end-credits.mp4" }
  ]
}
```

### 4. **Product Videos**

```json
{
  "segments": [
    { "type": "scene", "path": "scenes/logo-reveal.mp4" },
    { "type": "scene", "path": "scenes/product-shot.jpg", "duration": 3 },
    { "type": "main" },
    {
      "type": "scene",
      "path": "scenes/cta.mp4",
      "name": "Call to Action"
    }
  ]
}
```

---

## ⚠️ Important Notes

### File Paths

- Paths can be **relative** to project folder or **absolute**
- Use forward slashes `/` even on Windows
- Supported video: `.mp4`, `.mov`, `.avi`, `.mkv`
- Supported images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### Performance

- Each segment is processed independently
- Video scenes are re-encoded for consistency
- Image scenes are converted to video format
- Final concatenation is lossless (codec copy)

### Validation

Timeline configs are validated:
- ✅ At least one main segment required
- ✅ File paths must exist
- ✅ Valid segment types only
- ⚠️ Missing files will cause errors

---

## 🐛 Troubleshooting

### "Timeline validation failed"

**Cause:** Invalid timeline configuration

**Fix:** Check for:
- Missing `segments` array
- Invalid segment types
- Missing `path` for scene segments
- Non-existent files

### "Scene file not found"

**Cause:** File path doesn't exist

**Fix:**
- Verify file exists at specified path
- Check for typos in filename
- Use correct relative/absolute path

### "Main content generation failed"

**Cause:** Error in main content generation

**Fix:**
- Ensure images/clips exist in project folder
- Check voice.mp3 and other required files
- Review standard video generation logs

---

## 💡 Best Practices

### 1. **Organize Scene Files**

Create a `scenes/` folder for all custom segments:

```
project/
├── scenes/
│   ├── intro-card.jpg
│   ├── chapter-1.jpg
│   ├── chapter-2.jpg
│   └── cta.mp4
├── intro.mp4
├── outro.mp4
└── config.json
```

### 2. **Consistent Aspect Ratios**

Ensure all segments match your target aspect ratio:
- Intro, outro, scenes should all be same ratio
- 9:16 for vertical (Shorts, TikTok, Reels)
- 16:9 for horizontal (YouTube)

### 3. **Test Incrementally**

Build timeline gradually:
1. Start with intro + main + outro
2. Add scenes one by one
3. Test after each addition

### 4. **Use Transitions Sparingly**

Too many transitions can be jarring:
- Use fade-black between major sections
- Use fade for subtle transitions
- Leave most transitions as `none`

### 5. **Name Your Segments**

Add descriptive names for clarity:

```json
{
  "type": "scene",
  "path": "scenes/cta.mp4",
  "name": "Subscribe Call-to-Action"  // Helps debugging
}
```

---

## 📊 Channel-Level Timeline

Set default timeline for all videos in a channel:

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

Override in specific video:

```json
{
  "name": "Special Video",
  "timeline": {
    "segments": [
      { "type": "scene", "path": "custom-intro.mp4" },
      { "type": "main" },
      { "type": "outro", "path": "outro.mp4" }
    ]
  }
}
```

---

## 🚀 Future Enhancements

Planned features (not yet implemented):
- **Overlay support** - Text, logos on segments
- **Advanced transitions** - Wipe, slide, zoom
- **Dynamic segments** - Conditional segment inclusion
- **Segment templates** - Reusable segment definitions
- **Timeline presets** - Common timeline structures

---

## 📚 Related Docs

- [CONFIG_GUIDE.md](../../CONFIG_GUIDE.md) - Complete config reference
- [HOW_TO_CREATE_VIDEO.md](../../HOW_TO_CREATE_VIDEO.md) - Video creation basics
- [ADVANCED_FEATURES_GUIDE.md](../../ADVANCED_FEATURES_GUIDE.md) - Other advanced features

---

**Version:** 1.0.0  
**Status:** ✅ Stable  
**Feature Type:** PRO  
**License:** Premium

