# Quick Start: pray-matheus Channel

## 🎯 **Channel Overview**

This channel supports **3 video types** for different formats:

1. **shorts** - TikTok/YouTube Shorts (9:16)
2. **long-form** - YouTube Videos (16:9)
3. **podcast** - Podcast Style (16:9, minimal visuals)

---

## ⚡ **Create Your First Video** (2 minutes)

### **Option 1: Short Video (9:16)**

```bash
cd channels/pray-matheus/videos

# Create folder
mkdir prayer-short-001

# Add your files
cp ~/your-voice-file.mp3 prayer-short-001/voice.mp3
cp ~/your-subtitles.srt prayer-short-001/subtitles.srt

# Set video type (one line!)
cat > prayer-short-001/config.json << 'EOF'
{
  "videoType": "shorts"
}
EOF
```

**Result:**
- ✅ 9:16 vertical format
- ✅ 5 random images from channel pool
- ✅ Font size 48px (mobile-optimized)
- ✅ Music volume 30%

---

### **Option 2: Long-Form Video (16:9)**

```bash
mkdir prayer-long-001
cp ~/voice.mp3 prayer-long-001/
cp ~/subtitles.srt prayer-long-001/

cat > prayer-long-001/config.json << 'EOF'
{
  "videoType": "long-form"
}
EOF
```

**Result:**
- ✅ 16:9 landscape format
- ✅ 10 random images from channel pool
- ✅ Font size 40px
- ✅ Music volume 20%

---

### **Option 3: Podcast (16:9, No Subs)**

```bash
mkdir podcast-001
cp ~/voice.mp3 podcast-001/

cat > podcast-001/config.json << 'EOF'
{
  "videoType": "podcast"
}
EOF
```

**Result:**
- ✅ 16:9 landscape format
- ✅ 1 static image
- ✅ No subtitles
- ✅ Music volume 15%

---

## 🎬 **Process Videos**

```bash
cd /home/teusto/yt-machine

# Run batch processing
npm start

# Select: 2. Batch Processing - Select Channel
# Select: pray-matheus

# Wait for processing...
# Output: output/batch/pray-matheus/
```

---

## 📋 **Batch Creation Template**

### **Create 10 Shorts at Once:**

```bash
cd channels/pray-matheus/videos

for i in {001..010}; do
  mkdir short-$i
  
  # Copy your voice files
  cp ~/shorts-voice/prayer-$i.mp3 short-$i/voice.mp3
  cp ~/shorts-subs/prayer-$i.srt short-$i/subtitles.srt
  
  # Set type
  echo '{"videoType":"shorts"}' > short-$i/config.json
done

# Run batch → 10 shorts in one go! ✅
```

---

## 🎨 **Asset Setup**

### **Add Images (One Time)**

```bash
# Add 30-50 images for variety
cp ~/prayer-images/*.jpg channels/pray-matheus/image-pool/

# These will be used randomly by all videos!
```

### **Add Music (One Time)**

```bash
# Add 10-15 background music tracks
cp ~/prayer-music/*.mp3 channels/pray-matheus/music-pool/

# Each video will get a different track automatically!
```

---

## 💡 **Pro Tips**

### **Tip 1: Mix Formats**

```bash
videos/
├── short-001/config.json → {"videoType": "shorts"}
├── short-002/config.json → {"videoType": "shorts"}
├── long-001/config.json → {"videoType": "long-form"}
├── long-002/config.json → {"videoType": "long-form"}
└── podcast-001/config.json → {"videoType": "podcast"}

# All processed in one batch!
# All share same image/music pools!
# Different formats automatically! ✅
```

---

### **Tip 2: Override Settings**

```bash
# Use shorts format but with more images
cat > special-short/config.json << 'EOF'
{
  "videoType": "shorts",
  "imageCount": 8
}
EOF
```

---

### **Tip 3: No Config Needed**

```bash
# If you don't add config.json, 
# it uses channel defaults (9:16, 8 images)

videos/
└── simple-prayer/
    ├── voice.mp3
    └── subtitles.srt
# No config.json → uses defaults ✅
```

---

## 📊 **Expected Output**

### **Console Output:**

```
📺 Available Channels:

  1. pray-matheus (3 videos)
     Praying content - Multiple video formats

Select channel (1-1): 1

✅ Selected: pray-matheus

🔍 Scanning channel videos: pray-matheus
   Found 3 video folders

✅ prayer-short-001
   Voice: voice.mp3
   Subtitles: subtitles.srt
   📹 Video Type: shorts (Short vertical prayer videos for TikTok/Shorts)
   📐 Format: 9:16, 5 images
   Media: Using channel image pool

✅ prayer-long-001
   Voice: voice.mp3
   Subtitles: subtitles.srt
   📹 Video Type: long-form (Long-form prayer videos for YouTube)
   📐 Format: 16:9, 10 images
   Media: Using channel image pool

✅ podcast-001
   Voice: voice.mp3
   📹 Video Type: podcast (Podcast-style prayer content)
   📐 Format: 16:9, 1 images
   Media: Using channel image pool

============================================================
📹 [1/3] Processing: prayer-short-001
============================================================

🎲 Random Image Selection:
   🎲 Channel image pool: 30 images available
   ✅ Selected 5 random images (requested: 5)

🎵 Selected random music: ambient-001.mp3

✅ Success: prayer-short-001 (28.5s)
```

---

## 🎯 **Workflow Summary**

### **One-Time Setup (10 min):**
1. ✅ Channel config created (channel.json)
2. ✅ Add 30-50 images to image-pool/
3. ✅ Add 10-15 music tracks to music-pool/

### **Per Video (30 seconds):**
1. Create folder: `mkdir video-name`
2. Add voice: `cp voice.mp3 video-name/`
3. Add subtitles: `cp subtitles.srt video-name/`
4. Set type: `echo '{"videoType":"shorts"}' > video-name/config.json`

### **Batch Process (automatic):**
1. Run: `npm start → Option 2 → Select channel`
2. Wait for processing
3. Get videos in: `output/batch/pray-matheus/`

---

## ✅ **Checklist**

- [ ] Channel has image-pool/ with images
- [ ] Channel has music-pool/ with music
- [ ] Video folder created (videos/your-video/)
- [ ] voice.mp3 added
- [ ] subtitles.srt added (optional)
- [ ] config.json created with videoType
- [ ] Run batch processing
- [ ] Check output folder

---

## 🎉 **You're Ready!**

Start creating prayers in multiple formats! 🙏✨

**3 formats, 1 channel, minimal config!**
