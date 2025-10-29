# Background Music Guide

## 🎵 Overview

Add background music to your videos for a more engaging, professional feel. The music plays underneath your voiceover at a lower volume.

---

## 🚀 Quick Start

### 1. Add Your Music File

Place a file named `background_music.mp3` in your input folder:

```
input/
  ├── image1.png
  ├── image2.png
  ├── voiceover.mp3
  └── background_music.mp3  ← Add this!
```

### 2. Run the Generator

```bash
npm start
```

That's it! The music will be automatically:
- Mixed with your voiceover
- Set to 35% volume (65% lower than voice)
- Trimmed to match video length if longer

---

## 🎛️ Technical Details

### Volume Levels

**Voiceover:** 100% (1.0)
**Background Music:** 35% (0.35)

This 65% reduction ensures:
- Voice is always clear and prominent
- Music adds atmosphere without distraction
- Professional audio balance

### Duration Handling

**Important:** Video length is ALWAYS determined by voiceover duration, never by music.

**Music longer than voiceover:**
- Automatically trimmed to voiceover length
- Example: 5-minute music, 2-minute voiceover = uses first 2 minutes of music
- No effect on video duration

**Music shorter than voiceover:**
- Music loops to fill voiceover duration
- Seamless background throughout entire video
- Video length = voiceover length (always)

**Music same length as voiceover:**
- Perfect sync throughout
- Most natural result

**Key Point:** The voiceover determines video length. Music adapts to fit.

---

## 📁 Supported Formats

**Recommended:** MP3
**Also works:** WAV, M4A, AAC

**File naming:** Must be exactly `background_music.mp3` (or .wav, .m4a, .aac)

**Important:** The file named `background_music.mp3` is automatically excluded from voiceover selection. This means:
- You need TWO audio files: one voiceover + one background music
- `background_music.mp3` will never be used as the voiceover
- Your voiceover can have any name (e.g., `voiceover.mp3`, `audio.mp3`, etc.)

---

## 🎬 What You'll See

### With Background Music

```
📂 Scanning input folder...
✅ Found 10 images
✅ Found audio: voiceover.mp3
✅ Found background music: background_music.mp3

⏱️  Analyzing audio duration...
✅ Audio duration: 47.23 seconds

🎵 Processing background music...
⠋ Mixing voiceover with background music... [0:05]
✅ Background music mixed successfully

📊 Creating video with 10 images
...
```

### Without Background Music

```
📂 Scanning input folder...
✅ Found 10 images
✅ Found audio: voiceover.mp3

⏱️  Analyzing audio duration...
✅ Audio duration: 47.23 seconds

📊 Creating video with 10 images
...
```

(Works exactly as before)

---

## 💡 Best Practices

### 1. Choose Appropriate Music

**Good for:**
- Corporate videos: Subtle, professional tracks
- Vlogs: Upbeat, energetic music
- Tutorials: Calm, non-distracting background
- Storytelling: Emotional, atmospheric music

**Avoid:**
- Music with lyrics (competes with voiceover)
- Very dynamic music (volume changes)
- Music with sudden changes (jarring)

### 2. Music Length

**Ideal:** Music length ≥ video length
- No awkward cuts
- Smooth throughout
- Professional feel

**Short music:**
- Okay for intros/outros
- Consider adding fade out at end of music
- Or use longer track

### 3. Volume Considerations

**35% is a good default for:**
- Most background music
- Standard voice recordings
- Balanced mix

**Might need adjustment if:**
- Your music is very quiet/loud
- Voice recording level varies
- Specific creative intent

---

## 🎨 Creative Uses

### 1. Build Atmosphere
```
Calm piano music → Relaxing tutorial
Electronic beats → Tech/modern vibe
Acoustic guitar → Personal/intimate feel
Orchestral → Epic/dramatic story
```

### 2. Segment Videos
```
Different music for different sections:
- Intro: Energetic
- Main content: Calm
- Outro: Upbeat

(Requires editing multiple videos - coming soon!)
```

### 3. Brand Consistency
```
Use the same music track across videos:
- Creates signature sound
- Brand recognition
- Professional consistency
```

---

## 🔧 Technical Implementation

### How It Works

```javascript
// 1. Load voiceover and music
ffmpeg -i voiceover.mp3 -i background_music.mp3

// 2. Set volume levels and loop music
[0:a]volume=1.0[voice]                    // Voice at 100%
[1:a]volume=0.35,aloop,atrim=0:47.23[music]  // Music at 35%, looped, trimmed

// 3. Mix both tracks
amix=inputs=2:duration=first              // Mix, use voice as master

// 4. Explicitly set output duration
-t 47.23                                  // Force output to voiceover length

// 5. Output mixed audio
output_mixed.mp3 (exactly voiceover duration)
```

### Filter Chain

```
Voice (100%) ──┐
               ├──→ Mix ──→ Video
Music (35%) ──┘
(trimmed)
```

---

## 📊 Example Scenarios

### Scenario 1: Tutorial Video
```
Input:
  - voiceover.mp3: 2:30 (explaining steps)
  - background_music.mp3: 3:00 (calm instrumental)

Result:
  - Music plays at 35% volume throughout
  - Music trimmed at 2:30
  - Voice clear, music subtle
  - Professional tutorial
```

### Scenario 2: Product Demo
```
Input:
  - voiceover.mp3: 1:15 (product features)
  - background_music.mp3: 4:00 (upbeat track)

Result:
  - Music plays at 35% for 1:15
  - Energetic but not overwhelming
  - Features clearly audible
  - Engaging presentation
```

### Scenario 3: Vlog
```
Input:
  - voiceover.mp3: 5:00 (story/commentary)
  - background_music.mp3: 3:00 (acoustic)

Result:
  - Music plays at 35% for 3:00
  - Then continues with voice only
  - Could work for intro section
  - Consider longer music for better result
```

---

## ❓ Troubleshooting

### Music is too loud
**Current:** Fixed at 35%
**Future:** Adjustable volume setting (coming soon!)
**Workaround:** Pre-process music file to lower volume

### Music is too quiet
**Current:** Fixed at 35%
**Solution:** Same as above - coming soon!

### Music cuts off suddenly
**Cause:** Music shorter than video
**Solution:** Use longer music track or loop in external editor

### No music in output
**Check:**
1. File is named exactly `background_music.mp3`
2. File is in `input/` folder
3. File is valid audio format
4. Check console output for errors

---

## 🎯 Future Enhancements

Potential future features:

1. **Adjustable Volume**
   - Set music volume (20-50%)
   - Per-project settings

2. **Music Looping**
   - Auto-loop if music shorter than video
   - Smooth transitions

3. **Fade Out**
   - Fade out music at end
   - Instead of hard cut

4. **Audio Ducking**
   - Lower music when voice speaks
   - Raise during pauses
   - Professional podcast style

5. **Multiple Music Tracks**
   - Different sections
   - Crossfade between tracks

---

## 📝 Tips

1. **Royalty-Free Music**
   - Use copyright-free music for public videos
   - Resources: YouTube Audio Library, Epidemic Sound, Artlist

2. **Test Before Full Production**
   - Try with short clips first
   - Check volume balance
   - Adjust music selection

3. **Consider Your Audience**
   - Platform (YouTube, TikTok, etc.)
   - Content type (educational, entertainment)
   - Viewer expectations

4. **Keep It Simple**
   - Subtle is better than overpowering
   - Music should enhance, not distract
   - Voice is the star

---

## ✅ Checklist

Before adding background music:

- [ ] Music is appropriate for content
- [ ] Music has no lyrics (or minimal)
- [ ] Music length ≥ video length (ideally)
- [ ] Music is royalty-free (if publishing)
- [ ] File named `background_music.mp3`
- [ ] File in `input/` folder
- [ ] Music quality is good

---

## 🎉 Result

**Without music:** Professional video ✓
**With music:** Professional video with atmosphere ✓✓

Background music takes your videos from good to great with minimal effort!

---

Check [README.md](README.md) for complete documentation.
