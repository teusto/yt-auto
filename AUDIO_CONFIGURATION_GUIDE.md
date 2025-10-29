# Audio Configuration Guide

## 🎵 Overview

Full control over audio levels and fading in your videos. Configure voice volume, music volume, and fade effects to create the perfect audio mix for your content.

---

## 🚀 Quick Start

When you run `npm start`, you'll be prompted for audio configuration:

```
🎵 Audio Configuration:

  Choose a preset or customize:

  1. Default (Voice 100%, Music 35%)
  2. Music Louder (Voice 100%, Music 50%)
  3. Music Subtle (Voice 100%, Music 20%)
  4. Voice Boost (Voice 120%, Music 30%)
  5. Custom (Set your own levels)

Enter your choice (1-5):
```

---

## 🎛️ Presets Explained

### 1. Default (Recommended)
- **Voice:** 100% (1.0)
- **Music:** 35% (0.35)
- **Best for:** Most use cases, standard mix

**When to use:**
- Tutorials and educational content
- Standard voiceover videos
- Podcast-style content

### 2. Music Louder
- **Voice:** 100% (1.0)
- **Music:** 50% (0.5)
- **Best for:** Music-heavy content

**When to use:**
- Music showcases
- Montages with light narration
- Atmospheric content

### 3. Music Subtle
- **Voice:** 100% (1.0)
- **Music:** 20% (0.2)
- **Best for:** Voice-first content

**When to use:**
- Important announcements
- Serious/professional content
- When voice clarity is critical

### 4. Voice Boost
- **Voice:** 120% (1.2)
- **Music:** 30% (0.3)
- **Best for:** Quiet voiceover recordings

**When to use:**
- Voiceover recorded too quietly
- Need extra voice emphasis
- Competing with loud music

### 5. Custom
- **Voice:** 0.5 to 2.0 (50% to 200%)
- **Music:** 0.1 to 1.0 (10% to 100%)
- **Fade In:** 0-5 seconds
- **Fade Out:** 0-5 seconds

**When to use:**
- Specific creative requirements
- Fine-tuning for perfection
- Experimental mixes

---

## 🎨 Custom Configuration

### Voice Volume
```
Voice volume (0.5-2.0, default 1.0):
```

**Ranges:**
- **0.5 (50%):** Quieter voice, more ambient
- **1.0 (100%):** Normal voice level (recommended)
- **1.5 (150%):** Louder voice, more prominent
- **2.0 (200%):** Maximum voice boost

**Tips:**
- Start with 1.0 and adjust if needed
- Use 1.2-1.5 for quiet recordings
- Avoid going above 1.5 (may cause distortion)

### Music Volume
```
Music volume (0.1-1.0, default 0.35):
```

**Ranges:**
- **0.1-0.2 (10-20%):** Very subtle background
- **0.3-0.4 (30-40%):** Standard background (recommended)
- **0.5-0.7 (50-70%):** Prominent music
- **0.8-1.0 (80-100%):** Music-forward (voice still audible)

**Tips:**
- 0.35 is the sweet spot for most content
- Lower for important voice content
- Higher for music showcases

### Music Fade In
```
Music fade in duration (0-5 seconds, default 2):
```

**Durations:**
- **0 seconds:** No fade, music starts immediately
- **1-2 seconds:** Quick, natural fade (recommended)
- **3-4 seconds:** Slow, cinematic fade
- **5 seconds:** Very slow, dramatic fade

**When to use:**
- 0s: Music videos, immediate impact
- 2s: Most content, professional feel
- 5s: Cinematic, emotional content

### Music Fade Out
```
Music fade out duration (0-5 seconds, default 3):
```

**Durations:**
- **0 seconds:** Abrupt end (not recommended)
- **1-2 seconds:** Quick fade out
- **3 seconds:** Standard, professional (recommended)
- **4-5 seconds:** Long, gradual fade

**When to use:**
- 3s: Standard for most videos
- 5s: Emotional endings, slow fade
- 1s: Quick cuts, time-sensitive

---

## 💡 Use Cases & Examples

### Tutorial Video
```
Voice: 1.0 (100%)
Music: 0.25 (25%)
Fade In: 1s
Fade Out: 2s

Why: Voice clarity is paramount, music is subtle background
```

### Product Demo
```
Voice: 1.0 (100%)
Music: 0.40 (40%)
Fade In: 2s
Fade Out: 3s

Why: Balanced mix, engaging but professional
```

### Vlog / Story
```
Voice: 1.0 (100%)
Music: 0.45 (45%)
Fade In: 3s
Fade Out: 4s

Why: Music adds emotion, longer fades for cinematic feel
```

### Podcast
```
Voice: 1.1 (110%)
Music: 0.20 (20%)
Fade In: 2s
Fade Out: 3s

Why: Voice forward, minimal music for intro/outro
```

### Music Showcase with Narration
```
Voice: 0.9 (90%)
Music: 0.60 (60%)
Fade In: 4s
Fade Out: 5s

Why: Music is the star, voice provides context
```

### ASMR / Quiet Content
```
Voice: 0.8 (80%)
Music: 0.15 (15%)
Fade In: 5s
Fade Out: 5s

Why: Everything subtle, long slow fades for calmness
```

---

## 🔧 Technical Details

### How It Works

**Voice Volume:**
```javascript
[0:a]volume=${voiceVol}[voice]
```
- Applied to voiceover audio
- Multiplies original volume
- 1.0 = no change, 2.0 = double volume

**Music Volume with Fades:**
```javascript
[1:a]volume=${musicVol},
     aloop=loop=-1:size=2e+09,
     atrim=0:${duration},
     afade=t=in:st=0:d=${fadeIn},
     afade=t=out:st=${fadeOutStart}:d=${fadeOut}[music]
```
- Applies volume
- Loops music if shorter than video
- Trims to video length
- Fades in at start
- Fades out at end

**Mixing:**
```javascript
[voice][music]amix=inputs=2:duration=first[mixed]
```
- Combines voice and music
- Uses voice duration as master
- No clipping (proper mixing)

### Video Fade Effects

Voice fade settings also control video fades:
- **Fade In:** Uses `CONFIG.audio.voiceFadeIn`
- **Fade Out:** Uses `CONFIG.audio.voiceFadeOut`
- Applied to both video and audio for sync

---

## 🎯 Best Practices

### 1. Start with Presets
- Use presets first
- Only go custom if you need to
- Presets cover 90% of use cases

### 2. Test and Iterate
- Generate a test video with short clip
- Check audio balance
- Adjust if needed
- Then do full production

### 3. Consider Your Platform
- **YouTube:** Default or Music Louder
- **TikTok/Instagram:** Music Louder (engagement)
- **Educational:** Music Subtle
- **Podcast:** Voice Boost

### 4. Voice Quality Matters
- Good recording = 1.0 volume works great
- Poor recording = Use Voice Boost preset
- Don't boost above 1.5 (distortion risk)

### 5. Music Selection
- Instrumental works best
- Avoid music with lyrics (competes with voice)
- Choose appropriate energy level
- Match music to content mood

### 6. Fade Guidelines
- **Short fades (1-2s):** Modern, fast-paced
- **Medium fades (2-3s):** Professional standard
- **Long fades (4-5s):** Cinematic, emotional

---

## ⚙️ Configuration File

All settings are in `src/index.js`:

```javascript
CONFIG.audio = {
  voiceVolume: 1.0,      // 0.0 to 2.0
  musicVolume: 0.35,     // 0.0 to 1.0
  musicFadeIn: 2,        // seconds
  musicFadeOut: 3,       // seconds
  voiceFadeIn: 1,        // seconds (also controls video fade)
  voiceFadeOut: 1        // seconds (also controls video fade)
}
```

Advanced users can edit these directly to set defaults.

---

## 🎵 Examples by Genre

### Corporate / Professional
```
Preset: Default or Music Subtle
Voice: 1.0, Music: 0.25-0.35
Fade: 2s in, 3s out
Music: Calm, professional instrumental
```

### Vlog / Personal
```
Preset: Default or Music Louder
Voice: 1.0, Music: 0.35-0.45
Fade: 3s in, 4s out
Music: Upbeat, energetic
```

### Tutorial / Educational
```
Preset: Music Subtle
Voice: 1.0, Music: 0.20-0.25
Fade: 1s in, 2s out
Music: Calm, non-distracting
```

### Cinematic / Story
```
Preset: Custom
Voice: 1.0, Music: 0.40-0.50
Fade: 4s in, 5s out
Music: Emotional, orchestral
```

### Gaming / Tech
```
Preset: Music Louder
Voice: 1.0, Music: 0.45-0.55
Fade: 2s in, 3s out
Music: Electronic, energetic
```

---

## ❓ FAQ

**Q: Can I have different volumes for different sections?**
A: Not yet - current version applies settings to entire video. Coming in future update!

**Q: My voice is too quiet even at 200%?**
A: Pre-process your voiceover file to increase volume in audio editor before using.

**Q: Music fades sound abrupt?**
A: Try longer fade durations (4-5 seconds) for smoother transitions.

**Q: Can I have music without voiceover?**
A: Not currently - the tool is designed for voiceover + optional music. Use just music file without background_music.mp3 for music-only.

**Q: Does this work without background music?**
A: Yes! If no background music, only voice volume matters. Fades still apply to voice.

---

## 🎉 Tips for Perfect Audio

1. **Record quality voiceover** - Good input = great output
2. **Choose appropriate music** - Match genre and energy
3. **Start with presets** - They're tested and work well
4. **Test with short clip** - Don't process full video until happy
5. **Listen on multiple devices** - Phone, headphones, speakers
6. **Match platform expectations** - TikTok vs YouTube need different mixes

---

**Ready to create perfect audio?** Run `npm start` and experiment with the presets! 🎵✨

Check [README.md](README.md) for complete documentation.
