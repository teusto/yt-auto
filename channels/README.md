# Channels Folder - Channel-Centric Video Production

This is the main workspace for all your video channels. Each channel has its own configuration, image pool, music pool, and video projects.

## 📁 Folder Structure

```
channels/
├── meditation-channel/
│   ├── channel.json              # Channel settings (aspect ratio, style, defaults)
│   ├── image-pool/               # Channel-specific images
│   │   ├── nature-001.jpg
│   │   └── ... (50+ images)
│   ├── music-pool/               # Channel-specific background music
│   │   ├── ambient-001.mp3
│   │   └── ... (10+ tracks)
│   └── videos/                   # Video projects for this channel
│       ├── meditation-001/
│       │   ├── voice.mp3         # Required
│       │   ├── subtitles.srt     # Optional
│       │   └── config.json       # Optional (overrides channel defaults)
│       └── meditation-002/
│           └── voice.mp3
│
├── shorts-channel/
│   ├── channel.json              # 9:16 settings
│   ├── image-pool/               # Vertical images
│   ├── music-pool/               # Upbeat music
│   └── videos/
│
└── podcast-channel/
    ├── channel.json
    └── videos/
```

---

## 🎯 **How It Works**

### **1. Create a Channel**

```bash
cd /home/teusto/yt-machine/channels

# Create channel folder
mkdir -p meditation-channel/{image-pool,music-pool,videos}

# Create channel config
cat > meditation-channel/channel.json << 'EOF'
{
  "name": "meditation-channel",
  "description": "Guided meditation content",
  "defaults": {
    "aspectRatio": "16:9",
    "animation": "none",
    "randomImages": true,
    "imageCount": 8,
    "useChannelPool": true,
    "subtitle": {
      "style": "minimal",
      "position": "bottom"
    }
  }
}
EOF

# Add images
cp ~/my-nature-images/*.jpg meditation-channel/image-pool/

# Add background music
cp ~/my-ambient-music/*.mp3 meditation-channel/music-pool/
```

---

### **2. Create Video Projects**

```bash
cd meditation-channel/videos

# Create multiple projects
for i in {001..010}; do
  mkdir meditation-$i
  cp ~/voice-files/meditation-$i.mp3 meditation-$i/voice.mp3
  cp ~/subtitles/meditation-$i.srt meditation-$i/subtitles.srt
done

# No need for images or music - uses channel pools! ✅
```

---

### **3. Run Batch Processing**

```bash
npm start

# Menu:
🎬 YT-Machine - Video Generator

  1. Interactive Mode (single video)
  2. Batch Processing - Select Channel  ← NEW!
  3. Exit

# Select 2 → Shows list of channels:

📺 Available Channels:
  1. meditation-channel (10 videos ready)
  2. shorts-channel (5 videos ready)
  3. podcast-channel (3 videos ready)

# Select channel → Processes all videos in that channel
```

---

## 📋 **Channel Configuration (channel.json)**

### **Required Fields**

```json
{
  "name": "channel-name",
  "defaults": {
    "aspectRatio": "16:9"
  }
}
```

### **Full Configuration Example**

```json
{
  "name": "meditation-channel",
  "description": "Guided meditation and contemplative content",
  "platform": "youtube",
  
  "defaults": {
    // Video Format
    "aspectRatio": "16:9",
    "animation": "none",
    "qualityMode": "high",
    
    // Images
    "randomImages": true,
    "imageCount": 8,
    "useChannelPool": true,
    "fallbackToGlobalPool": false,
    
    // Music
    "randomMusic": true,
    "useChannelMusicPool": true,
    
    // Subtitles
    "subtitle": {
      "style": "minimal",
      "position": "bottom",
      "fontSize": 40
    },
    
    // Audio
    "audio": {
      "musicVolume": 0.25,
      "musicFadeIn": 3,
      "musicFadeOut": 5
    },
    
    // CTA
    "cta": {
      "enabled": false
    },
    
    // Export
    "exportFormats": {
      "enabled": false
    }
  }
}
```

---

## 🎨 **Per-Video Overrides**

### **Video-Level config.json**

Any video can override channel defaults:

```json
// channels/meditation-channel/videos/special-video/config.json
{
  "imageCount": 12,           // Override channel default (8)
  "animation": "zoom-in",     // Override channel default (none)
  "useChannelPool": false     // Use only this video's images/
}
```

**Priority Order:**
1. Video-level `config.json` (highest priority)
2. Channel-level `channel.json` defaults
3. System defaults (lowest priority)

---

## 🎵 **Music Pool**

### **Random Music Selection**

```json
// channel.json
{
  "defaults": {
    "randomMusic": true,
    "useChannelMusicPool": true
  }
}
```

**How it works:**
- System randomly picks one track from `music-pool/`
- Different track for each video (repetition tracking)
- No need to specify `music.mp3` per video

### **Specific Music Per Video**

```
videos/meditation-001/
├── voice.mp3
├── music.mp3           ← Specific track for this video
└── subtitles.srt

# If music.mp3 exists, uses it
# Otherwise, uses random from channel pool
```

---

## 📊 **Channel Types Examples**

### **Type 1: Meditation/Contemplative**

```json
{
  "name": "meditation-channel",
  "defaults": {
    "aspectRatio": "16:9",
    "animation": "none",
    "randomImages": true,
    "imageCount": 8,
    "subtitle": {
      "style": "minimal",
      "position": "bottom"
    },
    "audio": {
      "musicVolume": 0.20
    }
  }
}
```

**Content:** Long-form, calm, minimal

---

### **Type 2: Short-Form Viral**

```json
{
  "name": "shorts-channel",
  "defaults": {
    "aspectRatio": "9:16",
    "animation": "zoom-in",
    "randomImages": true,
    "imageCount": 5,
    "subtitle": {
      "style": "bold",
      "position": "center"
    },
    "audio": {
      "musicVolume": 0.45
    },
    "cta": {
      "enabled": true
    }
  }
}
```

**Content:** Quick, dynamic, attention-grabbing

---

### **Type 3: Podcast/Interview**

```json
{
  "name": "podcast-channel",
  "defaults": {
    "aspectRatio": "16:9",
    "animation": "static",
    "randomImages": false,
    "subtitle": {
      "enabled": false
    },
    "audio": {
      "musicVolume": 0.15
    }
  }
}
```

**Content:** Mostly audio, minimal visuals

---

## 🔄 **Migration from Old Structure**

### **Old Structure (batch-videos/)**

```
batch-videos/
├── video-001/
├── video-002/
└── video-003/
```

### **New Structure (channels/)**

```bash
# Move to channel
mkdir -p channels/my-channel/videos
mv batch-videos/video-* channels/my-channel/videos/

# Create channel config
cat > channels/my-channel/channel.json << EOF
{
  "name": "my-channel",
  "defaults": {
    "aspectRatio": "16:9",
    "randomImages": true,
    "useChannelPool": true
  }
}
EOF
```

---

## 🎯 **Benefits**

### **Organization**
- ✅ All channel content in one place
- ✅ Easy to manage multiple channels
- ✅ Clear separation of concerns

### **Automation**
- ✅ Channel settings applied automatically
- ✅ Random pool selection (images + music)
- ✅ Consistent styling per channel

### **Scalability**
- ✅ Add new channels easily
- ✅ Independent pools per channel
- ✅ No cross-contamination

### **Efficiency**
- ✅ One image pool for all channel videos
- ✅ One music pool for all channel videos
- ✅ Minimal per-video configuration

---

## 🚀 **Quick Start**

### **Step 1: Create Channel**

```bash
mkdir -p channels/test-channel/{image-pool,music-pool,videos}
```

### **Step 2: Add Channel Config**

```bash
cat > channels/test-channel/channel.json << 'EOF'
{
  "name": "test-channel",
  "defaults": {
    "aspectRatio": "16:9",
    "randomImages": true,
    "imageCount": 5,
    "useChannelPool": true
  }
}
EOF
```

### **Step 3: Add Assets**

```bash
# Add images
cp ~/images/*.jpg channels/test-channel/image-pool/

# Add music (optional)
cp ~/music/*.mp3 channels/test-channel/music-pool/
```

### **Step 4: Create Videos**

```bash
mkdir channels/test-channel/videos/video-001
cp voice.mp3 channels/test-channel/videos/video-001/
```

### **Step 5: Run Batch**

```bash
npm start
# Select: 2. Batch Processing - Select Channel
# Select: test-channel
```

---

## 📝 **Notes**

- Channel names should be lowercase with hyphens
- Each channel must have `channel.json`
- Videos folder is required (even if empty)
- Image/music pools are optional but recommended
- System still supports old `batch-videos/` for backward compatibility

---

**Start organizing your content by channel for maximum efficiency! 📺✨**
