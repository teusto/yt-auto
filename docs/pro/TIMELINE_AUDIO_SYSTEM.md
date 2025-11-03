# 🎵 Timeline Audio System

**Global audio tracks for timeline videos**

---

## 🎯 Overview

The Timeline Audio System allows you to add **voice** and **music** tracks that span across your entire timeline, with precise control over when they start and stop based on scene names.

### Key Features

✅ **Single voice track** - Narration that starts at a specific scene  
✅ **Single music track** - Background music with start/stop markers  
✅ **Scene-based timing** - Use scene names to control audio timing  
✅ **Volume control** - Independent volume for voice and music  
✅ **Fade in/out** - Smooth audio transitions for music  
✅ **Simplified** - No per-segment audio complexity

---

## 📝 Configuration

### Timeline Audio Schema

```json
{
  "timeline": {
    "segments": [ ... ],
    
    "audio": {
      "voice": {
        "path": "voice.mp3",
        "startAt": "scene-name",
        "volume": 1.0
      },
      "music": {
        "path": "music.mp3",
        "startAt": "scene-name",
        "stopAt": "scene-name",
        "volume": 0.3,
        "fadeIn": 2.0,
        "fadeOut": 2.0
      }
    }
  }
}
```

### Voice Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `path` | string | required | Path to voice/narration audio file |
| `startAt` | string | start | Scene name where voice starts |
| `volume` | number | 1.0 | Voice volume (0.0 to 1.0) |

### Music Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `path` | string | required | Path to background music file |
| `startAt` | string | start | Scene name where music starts |
| `stopAt` | string | end | Scene name where music stops |
| `volume` | number | 0.3 | Music volume (0.0 to 1.0) |
| `fadeIn` | number | 2.0 | Fade in duration (seconds) |
| `fadeOut` | number | 2.0 | Fade out duration (seconds) |

---

## 🎬 Main Segment Options

The `main` segment type now supports multiple modes:

### 1. **Specific Video File**

Use a pre-made video as main content:

```json
{
  "type": "main",
  "path": "videos/main-content.mp4",
  "name": "content"
}
```

### 2. **Specific Image**

Use a single image with duration:

```json
{
  "type": "main",
  "path": "images/featured.jpg",
  "duration": 10,
  "name": "content"
}
```

### 3. **Random Generation** (Default)

Generate from random images in input folder:

```json
{
  "type": "main",
  "name": "content"
}
```

Uses voice duration to determine length.

### 4. **Random with Duration Limit**

Generate from random images but limit duration:

```json
{
  "type": "main",
  "duration": 60,
  "name": "content"
}
```

---

## 📋 Complete Examples

### Example 1: Voice Starting at Hook

```json
{
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 3,
        "name": "title"
      },
      {
        "type": "scene",
        "path": "scenes/hook.mp4",
        "name": "hook",
        "mute": true
      },
      {
        "type": "main",
        "name": "content"
      },
      {
        "type": "outro",
        "path": "outro.mp4"
      }
    ],
    
    "audio": {
      "voice": {
        "path": "voice.mp3",
        "startAt": "hook"
      }
    }
  }
}
```

**Result:**
- `title` scene: Silent (3s)
- `hook` scene: Voice starts here (muted video audio)
- `content`: Voice continues
- `outro`: Voice continues

---

### Example 2: Music with Start/Stop Markers

```json
{
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/intro.jpg",
        "duration": 2,
        "name": "intro"
      },
      {
        "type": "main",
        "name": "content"
      },
      {
        "type": "scene",
        "path": "scenes/cta.jpg",
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
        "startAt": "content"
      },
      "music": {
        "path": "music.mp3",
        "startAt": "intro",
        "stopAt": "cta",
        "volume": 0.25,
        "fadeIn": 2.0,
        "fadeOut": 3.0
      }
    }
  }
}
```

**Result:**
- `intro`: Music starts (fades in over 2s)
- `content`: Music + Voice
- `cta`: Music fades out (over 3s), voice continues
- `outro`: Only voice

---

### Example 3: Complete Video Production

```json
{
  "name": "Complete YouTube Video",
  "aspectRatio": "16:9",
  
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 3,
        "name": "title"
      },
      {
        "type": "scene",
        "path": "scenes/hook.mp4",
        "name": "hook",
        "mute": true,
        "transition": "fade",
        "transitionDuration": 0.5
      },
      {
        "type": "intro",
        "path": "intro.mp4"
      },
      {
        "type": "main",
        "name": "content"
      },
      {
        "type": "scene",
        "path": "scenes/subscribe.jpg",
        "duration": 4,
        "name": "subscribe",
        "transition": "fade-black",
        "transitionDuration": 0.5
      },
      {
        "type": "outro",
        "path": "outro.mp4"
      }
    ],
    
    "audio": {
      "voice": {
        "path": "voice.mp3",
        "startAt": "hook",
        "volume": 1.0
      },
      "music": {
        "path": "music.mp3",
        "startAt": "title",
        "stopAt": "subscribe",
        "volume": 0.2,
        "fadeIn": 2.0,
        "fadeOut": 3.0
      }
    }
  }
}
```

---

## 🎛️ How It Works

### 1. **Segment Processing**

All segments are processed first:
- Images → Videos with silent audio
- Videos → Keep or mute original audio
- Main → Generate or use provided file

### 2. **Video Concatenation**

All segments are concatenated with:
- Normalized resolution
- Transitions applied
- Silent audio tracks

### 3. **Audio Mixing** (Coming Soon)

After concatenation, global audio is applied:
- Calculate segment timings
- Find start/stop points by scene name
- Apply voice track from start point
- Apply music track with fade in/out
- Mix voice + music with video

---

## 🔧 Scene Naming

**Why scene names?**

Scene names act as **markers** for audio timing. This makes it easy to say:
- "Start voice at the hook scene"
- "Stop music before the CTA"

### Rules

1. **Name your key scenes:**
   ```json
   {
     "type": "scene",
     "path": "scenes/hook.mp4",
     "name": "hook"  ← Important marker
   }
   ```

2. **Use descriptive names:**
   - `title`, `hook`, `intro`, `content`, `cta`, `subscribe`

3. **Names are optional:**
   - Only name scenes you'll reference in audio config

4. **Case-sensitive:**
   - `"Hook"` ≠ `"hook"`

---

## 🚫 What Changed (Simplified)

### ❌ Removed: Per-Segment Audio

**Before (Too Complex):**
```json
{
  "type": "scene",
  "path": "scene1.jpg",
  "audio": "scene1-audio.mp3"  ← Each scene had its own audio
}
```

**After (Simplified):**
```json
{
  "timeline": {
    "segments": [
      { "type": "scene", "path": "scene1.jpg" },
      { "type": "scene", "path": "scene2.jpg" },
      { "type": "main" }
    ],
    "audio": {
      "voice": { "path": "voice.mp3" },  ← One voice track
      "music": { "path": "music.mp3" }   ← One music track
    }
  }
}
```

---

## 📊 Volume Guidelines

### Voice
- **1.0** (default) - Full volume, clear narration
- **0.8-0.9** - Slightly reduced
- **0.5-0.7** - Background commentary

### Music
- **0.1-0.2** - Very subtle background
- **0.25-0.3** (default) - Noticeable but not distracting
- **0.4-0.5** - Prominent music
- **0.6+** - Music-focused content

### Example Mix
```json
"audio": {
  "voice": {
    "path": "voice.mp3",
    "volume": 1.0     ← Voice at full volume
  },
  "music": {
    "path": "music.mp3",
    "volume": 0.2     ← Music subtle in background
  }
}
```

Result: Voice is clear, music is subtle backing.

---

## ⏱️ Fade Timing

### Fade In
- **0.5-1.0s** - Quick, energetic start
- **2.0s** (default) - Smooth, natural
- **3.0-5.0s** - Slow, dramatic build

### Fade Out
- **1.0-2.0s** - Quick ending
- **2.0-3.0s** (default) - Smooth transition
- **5.0s+** - Very gradual fade

---

## 🎯 Best Practices

### 1. **Name Key Scenes**

Only name scenes you'll use as markers:

```json
{
  "segments": [
    { "type": "scene", "path": "title.jpg", "duration": 2 },
    { "type": "scene", "path": "hook.mp4", "name": "hook" },  ← Named
    { "type": "main", "name": "content" },                    ← Named
    { "type": "scene", "path": "transition.jpg", "duration": 1 },
    { "type": "scene", "path": "cta.jpg", "name": "cta" },    ← Named
    { "type": "outro", "path": "outro.mp4" }
  ]
}
```

### 2. **Balance Voice & Music**

Voice should always be audible over music:

```json
"voice": { "volume": 1.0 },    ← Full volume
"music": { "volume": 0.2 }     ← 5x quieter
```

### 3. **Use Fades for Music**

Always fade music in/out for smooth transitions:

```json
"music": {
  "path": "music.mp3",
  "fadeIn": 2.0,
  "fadeOut": 3.0
}
```

### 4. **Test Different Volumes**

Music volume depends on the type:
- **Ambient/Instrumental**: 0.2-0.3
- **Vocal/Lyrical**: 0.15-0.25
- **Dramatic/Intense**: 0.25-0.4

---

## 🐛 Troubleshooting

### Voice Not Starting at Right Time

**Check:**
1. Scene name matches exactly: `"startAt": "hook"`
2. Scene has `name` property: `"name": "hook"`
3. Case-sensitive: `"Hook"` ≠ `"hook"`

### Music Too Loud/Quiet

**Adjust volume:**
```json
"music": {
  "volume": 0.2   ← Try values between 0.1-0.5
}
```

### No Audio in Output

**Check:**
1. Audio files exist at specified paths
2. `timeline.audio` is configured
3. Voice/music paths are correct

---

## 📚 Related Docs

- **[TIMELINE.md](TIMELINE.md)** - Complete timeline reference
- **[TIMELINE_SETUP_GUIDE.md](TIMELINE_SETUP_GUIDE.md)** - Setup guide
- **[TIMELINE_FIXES.md](TIMELINE_FIXES.md)** - Recent bug fixes

---

## 🔜 Coming Soon

The audio mixing implementation is in progress. Currently:

✅ Schema defined  
✅ Examples created  
✅ Main segment options working  
✅ Segments support scene names  
⏳ Audio mixing implementation (in development)

Check back soon for the complete audio mixing feature!

---

**Updated:** Oct 31, 2025  
**Status:** Schema & Structure Ready, Audio Mixing Coming Soon  
**Breaking Changes:** Removed per-segment audio (simplified)
