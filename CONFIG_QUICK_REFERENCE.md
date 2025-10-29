# Configuration Quick Reference ⚡

Fast lookup for common configuration options.

---

## 🎯 **Most Common Options**

### **Video Format**
```json
{
  "aspectRatio": "9:16",     // "9:16" | "16:9" | "1:1" | "4:5"
  "imageCount": 8,           // 1-50
  "animation": "static"      // "static" | "zoom-in" | "zoom-out" | "pan-left" | "pan-right"
}
```

### **Subtitles**
```json
{
  "subtitle": {
    "enabled": true,         // true | false
    "style": "minimal",      // "minimal" | "bold" | "elegant" | "modern"
    "position": "bottom",    // "top" | "center" | "bottom"
    "fontSize": 40,          // 24-72
    "fontName": "Arial"      // Font filename without extension
  }
}
```

### **Audio**
```json
{
  "audio": {
    "voiceVolume": 1.0,      // 0.0-1.0
    "musicVolume": 0.25,     // 0.0-1.0
    "voiceFadeIn": 3,        // seconds
    "voiceFadeOut": 5        // seconds
  }
}
```

### **Intro/Outro**
```json
{
  "intro": {
    "enabled": true          // Enable/disable intro
  },
  "outro": {
    "enabled": true          // Enable/disable outro
  }
}
```

**File Detection Priority:**
1. Video folder (e.g., `videos/my-video/intro.mp4` or `intro.jpg`)
2. Channel folder (e.g., `channels/my-channel/intro.mp4`)
3. Global intros folder (if using config)

**Image Intros:** Images will display for 4 seconds with fade out effect

---

## 📋 **All Available Options**

### **Format & Quality**
| Property | Type | Default | Options |
|----------|------|---------|---------|
| `aspectRatio` | string | `"9:16"` | `"9:16"`, `"16:9"`, `"1:1"`, `"4:5"` |
| `quality` | string | `"high"` | `"draft"`, `"standard"`, `"high"`, `"ultra"` |
| `fps` | number | `24` | 24, 30, 60 |

### **Media**
| Property | Type | Default | Options |
|----------|------|---------|---------|
| `randomImages` | boolean | `true` | `true`, `false` |
| `imageCount` | number | `8` | 1-50 |
| `animation` | string | `"static"` | See animations below |

### **Subtitles**
| Property | Type | Default | Options |
|----------|------|---------|---------|
| `subtitle.enabled` | boolean | `true` | `true`, `false` |
| `subtitle.style` | string | `"minimal"` | See styles below |
| `subtitle.position` | string | `"bottom"` | `"top"`, `"center"`, `"bottom"` |
| `subtitle.fontSize` | number | `40` | 24-72 |
| `subtitle.fontName` | string | `"Arial"` | Font name from fonts/ folder (without .ttf/.otf) |

### **Audio**
| Property | Type | Default | Range |
|----------|------|---------|-------|
| `audio.voiceVolume` | number | `1.0` | 0.0-1.0 |
| `audio.musicVolume` | number | `0.25` | 0.0-1.0 |
| `audio.voiceFadeIn` | number | `3` | 0-10 seconds |
| `audio.voiceFadeOut` | number | `5` | 0-10 seconds |
| `audio.musicFadeIn` | number | `3` | 0-10 seconds |
| `audio.musicFadeOut` | number | `5` | 0-10 seconds |

---

## 🎨 **Animation Options**

```typescript
"static"      // No animation (fastest)
"none"        // Same as static
"zoom-in"     // Slow zoom into image (Ken Burns)
"zoom-out"    // Slow zoom out from image
"pan-left"    // Pan from right to left
"pan-right"   // Pan from left to right
"pan-up"      // Pan from bottom to top
"pan-down"    // Pan from top to bottom
```

---

## 📝 **Subtitle Styles**

```typescript
"minimal"     // Clean, simple (default)
"bold"        // Thick outline, high contrast
"elegant"     // Refined, sophisticated
"modern"      // Contemporary design
"playful"     // Fun, casual
"cinematic"   // Movie-style
```

---

## 📺 **Aspect Ratios**

```typescript
"9:16"   // Vertical (TikTok/Shorts)    → 1080×1920
"16:9"   // Landscape (YouTube)         → 1920×1080
"1:1"    // Square (Instagram)          → 1080×1080
"4:5"    // Vertical (Instagram)        → 1080×1350
```

---

## ⚡ **Quality Presets**

```typescript
"draft"      // Fastest    (ultrafast, CRF 28)
"standard"   // Balanced   (medium, CRF 23)
"high"       // Quality    (slow, CRF 20)      ← Default
"ultra"      // Best       (slower, CRF 18)
```

---

## 💡 **Common Patterns**

### **Shorts/TikTok (9:16)**
```json
{
  "aspectRatio": "9:16",
  "imageCount": 5,
  "animation": "zoom-in",
  "subtitle": {
    "style": "bold",
    "fontSize": 48,
    "position": "bottom"
  },
  "audio": {
    "musicVolume": 0.30
  }
}
```

### **YouTube Long-Form (16:9)**
```json
{
  "aspectRatio": "16:9",
  "imageCount": 10,
  "animation": "static",
  "subtitle": {
    "style": "minimal",
    "fontSize": 40,
    "position": "bottom"
  },
  "audio": {
    "musicVolume": 0.20
  }
}
```

### **Podcast (16:9, No Subs)**
```json
{
  "aspectRatio": "16:9",
  "imageCount": 1,
  "animation": "static",
  "subtitle": {
    "enabled": false
  },
  "audio": {
    "musicVolume": 0.15
  }
}
```

### **Instagram Square (1:1)**
```json
{
  "aspectRatio": "1:1",
  "imageCount": 6,
  "animation": "zoom-in",
  "subtitle": {
    "style": "modern",
    "fontSize": 44,
    "position": "center"
  }
}
```

---

## 🎯 **Using Video Types**

### **Step 1: Define in channel.json**
```json
{
  "videoTypes": {
    "shorts": {
      "aspectRatio": "9:16",
      "imageCount": 5,
      "subtitle": { "fontSize": 48 }
    }
  }
}
```

### **Step 2: Reference in config.json**
```json
{
  "videoType": "shorts"
}
```

### **Step 3: Override if needed**
```json
{
  "videoType": "shorts",
  "imageCount": 10,
  "animation": "zoom-in"
}
```

---

## ✅ **Validation Rules**

### **Required:**
- ✅ Valid JSON syntax (no trailing commas)
- ✅ Proper quote usage

### **Optional but Recommended:**
- ✅ Use `videoType` for consistency
- ✅ Override only what you need
- ✅ Keep values in valid ranges

### **Common Mistakes:**
```json
// ❌ Wrong
{
  "aspectRatio": "vertical",    // Use "9:16"
  "animation": "zoom",          // Use "zoom-in" or "zoom-out"
  "subtitle": {
    "position": "middle"        // Use "center"
  }
}

// ✅ Correct
{
  "aspectRatio": "9:16",
  "animation": "zoom-in",
  "subtitle": {
    "position": "center"
  }
}
```

---

## 🔍 **Find Options**

### **Need to know valid values?**
```bash
# See full schema
cat CONFIG_SCHEMA.md

# See this quick reference
cat CONFIG_QUICK_REFERENCE.md
```

### **Check existing configs:**
```bash
# View channel config
cat channels/your-channel/channel.json

# View video config
cat channels/your-channel/videos/video-001/config.json
```

---

## 📖 **More Info**

- **Full Details:** `CONFIG_SCHEMA.md`
- **Examples:** `EXAMPLE_MULTI_FORMAT_WORKFLOW.md`
- **Channel Guide:** `CHANNEL_PROFILES_IMPLEMENTATION.md`
- **Video Types:** `VIDEO_TYPES_IMPLEMENTATION.md`

---

**Bookmark this page for quick config reference! ⚡✨**
