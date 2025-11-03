# 🔧 Timeline Troubleshooting Guide

**Common issues and solutions**

---

## ❌ Video Has No Audio

### Problem
Timeline video generates but has no voice or music.

### Cause
Scene segments have silent audio by design. The timeline needs audio to be in:
- **Main segment** (generated from voice.mp3 + music.mp3)
- **Video scenes/intro/outro** (if they have audio in the original files)

### Solution
✅ **Make sure you have voice.mp3 and/or music.mp3 in your input folder**
✅ **The main segment will include this audio automatically**
✅ **Video scenes keep their original audio (unless muted)**

**Example:**
```
input/
  voice.mp3         ← Your narration
  music.mp3         ← Background music
  config.json
  scenes/
    image_001.png
    image_002.png
```

---

## ❌ Scenes Don't Respect Duration

### Problem
Video or image scenes don't match the configured duration.

### Cause
- Images always respect duration (they're static)
- **Videos** need explicit duration to be trimmed

### Solution
Add `duration` property to video scenes:

**Before (Wrong):**
```json
{
  "type": "scene",
  "path": "scenes/hook.mp4"
}
```

**After (Correct):**
```json
{
  "type": "scene",
  "path": "scenes/hook.mp4",
  "duration": 5  ← Trims to 5 seconds
}
```

**Now Fixed:** Duration trimming is applied automatically to all video segments.

---

## ❌ Video Pauses or Breaks Before Main Segment

### Problem
Video plays scenes correctly, then freezes/pauses at a specific timestamp before the main content starts.

### Causes

### 1. **Main Segment Duration Mismatch**

**Problem:** Main segment has `duration` set but voice/music is longer.

**Example:**
```json
{
  "type": "main",
  "duration": 15  ← Only 15 seconds
}
```

But your `voice.mp3` is 71 seconds → Video cuts off at 15s!

**Solution: Remove duration from main segment**
```json
{
  "type": "main"  ← Uses full audio duration
}
```

The `duration` property on `main` should **ONLY** be used if:
- You want to limit the length of generated content
- You're using `path` instead of generation

**Best Practice:**
- ❌ Don't set `duration` on `main` when using callback generation
- ✅ Let it use the full voice/music duration
- ✅ Control length by trimming voice.mp3 before generation

---

### 2. **Total Scene Duration Exceeds Audio**

**Problem:** Scene durations add up to more than your audio length.

**Example:**
```json
{
  "segments": [
    { "type": "scene", "duration": 10 },  // 10s
    { "type": "scene", "duration": 20 },  // +20s = 30s total
    { "type": "main" },                   // Voice is only 25s!
    { "type": "outro", "path": "outro.mp4" }
  ]
}
```

Scenes take 30 seconds, but voice is 25 seconds → Main segment has no duration!

**Solution:**
- Keep scene durations short (3-5 seconds for intro scenes)
- Or extend your voice.mp3 to cover all content

---

### 3. **Audio Stream Issues**

**Problem:** Different segments have incompatible audio settings causing concat to break.

**Now Fixed:**
- All segments use consistent audio: AAC, 44.1kHz, stereo
- Image scenes: Silent audio track
- Video scenes: Original or silent (if muted)
- Main: Voice + music (already mixed)

---

## 💡 Duration Guidelines

### Image Scenes
```json
{
  "type": "scene",
  "path": "title.jpg",
  "duration": 3  ← Required! Sets how long image shows
}
```

### Video Scenes
```json
{
  "type": "scene",
  "path": "hook.mp4",
  "duration": 5  ← Optional: Trims to 5s. Omit to use full video
}
```

### Main Segment

**Option 1: Auto-duration (Recommended)**
```json
{
  "type": "main"  ← Uses full audio duration
}
```

**Option 2: With specific path**
```json
{
  "type": "main",
  "path": "videos/main-content.mp4",
  "duration": 30  ← Optional: Trim to 30s
}
```

**Option 3: Limit generated content**
```json
{
  "type": "main",
  "duration": 60  ← Generate only 60s of content
}
```

### Intro/Outro
```json
{
  "type": "intro",
  "path": "intro.mp4"  ← Uses full video duration
}
```

---

## 🎵 Audio Flow

### How Audio Works in Timeline

```
Scene 1 (image) → Silent audio
Scene 2 (image) → Silent audio  
Scene 3 (video) → Original audio or silent (if muted)

Main Segment → VOICE + MUSIC (from input/voice.mp3 + input/music.mp3)

Scene 4 (image) → Silent audio
Outro (video) → Original audio
```

**Result:** Only main segment and non-muted videos have sound.

---

## 🔍 Debugging Steps

### 1. Check Audio Files
```bash
ls -lh input/
# Should show: voice.mp3, music.mp3
```

### 2. Check Scene Durations
Add up all scene durations:
```
Scene 1: 10s
Scene 2: 20s  
Scene 3: 5s
Total scenes: 35s

Voice duration: 71s
Main content: 71s - 35s = 36s ✅ Good!
```

If scenes total > voice duration, you'll have problems.

### 3. Check Main Segment Config
```json
{
  "type": "main"
  // ✅ No duration = uses full audio
}
```

or

```json
{
  "type": "main",
  "duration": 60  
  // ⚠️ Only if you want to limit it
}
```

### 4. Check Video Files
```bash
ffprobe -i input/scenes/hook.mp4
# Check duration and audio streams
```

---

## 📋 Common Config Mistakes

### ❌ Wrong: Main with duration limit
```json
{
  "timeline": {
    "segments": [
      { "type": "scene", "path": "title.jpg", "duration": 3 },
      { "type": "main", "duration": 15 }  ← TOO SHORT!
    ]
  }
}
```

Voice is 71s, but main is limited to 15s → Video cuts off!

### ✅ Correct: Main without duration
```json
{
  "timeline": {
    "segments": [
      { "type": "scene", "path": "title.jpg", "duration": 3 },
      { "type": "main" }  ← Uses full voice duration
    ]
  }
}
```

---

### ❌ Wrong: Missing image durations
```json
{
  "type": "scene",
  "path": "title.jpg"  ← Missing duration!
}
```

### ✅ Correct: Image with duration
```json
{
  "type": "scene",
  "path": "title.jpg",
  "duration": 3  ← Required for images
}
```

---

### ❌ Wrong: Scenes too long
```json
{
  "segments": [
    { "type": "scene", "duration": 30 },  // Way too long!
    { "type": "main" }
  ]
}
```

Voice is 45s, scene takes 30s → Main only gets 15s!

### ✅ Correct: Short scenes
```json
{
  "segments": [
    { "type": "scene", "duration": 3 },  // Quick intro
    { "type": "main" }                   // Gets most of the time
  ]
}
```

---

## 🎯 Best Practices

### 1. **Keep Intro Scenes Short**
- Title cards: 2-3 seconds
- Hook videos: 5-8 seconds
- Total intro: < 15 seconds

### 2. **Let Main Use Full Duration**
```json
{ "type": "main" }  ← Don't add duration!
```

### 3. **Check Audio Duration First**
```bash
ffprobe -i input/voice.mp3 -show_entries format=duration
```

Then design your timeline to fit.

### 4. **Test Without Duration Limits**
Start with no duration on main, then add limits if needed:

**Step 1: Test**
```json
{ "type": "main" }
```

**Step 2: Limit if needed**
```json
{ "type": "main", "duration": 60 }
```

---

## 🆘 Still Having Issues?

### Enable Debug Mode
Set in your code or check temp files:
```
output/
  timeline_scene_0.mp4
  timeline_scene_1.mp4
  timeline_main_2.mp4
  timeline_outro_3.mp4
```

Check each file:
```bash
ffprobe -i output/timeline_main_2.mp4
# Verify audio streams exist
```

### Check FFmpeg Logs
Look for errors in the console output during:
- Segment processing
- Concatenation

### Verify Input Files
```bash
# Check voice
ffprobe input/voice.mp3

# Check music  
ffprobe input/music.mp3

# Check scenes
ffprobe input/scenes/image_001.png
ffprobe input/scenes/hook.mp4
ffprobe input/outro.mp4
```

---

**Updated:** Oct 31, 2025  
**Status:** Common issues documented  
**See Also:** [TIMELINE.md](TIMELINE.md), [TIMELINE_AUDIO_SYSTEM.md](TIMELINE_AUDIO_SYSTEM.md)
