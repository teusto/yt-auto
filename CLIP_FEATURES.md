# Advanced Clip Features

This document describes the new clip-based features for creating videos with paired audio-image combinations, transitions, and motion effects.

## Features Overview

### 1. Audio-Image Pairing
Match audio files to their corresponding images:
- `audio1.mp3` → `image1.jpg`
- `audio2.mp3` → `image2.jpg`
- etc.

Each clip will use its paired audio and display for the duration of that audio file.

### 2. Fade-to-Black Transitions ✅ IMPLEMENTED
Add smooth transitions between clips:
- **none**: Direct cut between clips (default)
- **fade-black**: ✅ Fade to black between clips (IMPLEMENTED)
- **fade**: Simple fade transition (coming soon)
- **crossfade**: Crossfade between clips (coming soon)

### 3. Random/Configurable Motion Effects
Apply motion effects to each clip:
- **static**: No motion
- **zoom-in**: Ken Burns zoom in effect
- **zoom-out**: Ken Burns zoom out effect
- **pan-left/right/up/down**: Pan across the image
- **random**: Randomly select an effect for each clip

### 4. Auto-Generated Subtitles
- Automatically generate subtitles using AssemblyAI
- Supports karaoke-style word-by-word animation
- Multi-language support

### 5. Background Music
- Add background music to the entire video
- Configurable volume levels and fade in/out

## Configuration

### Channel Config (`channels/your-channel/channel.json`)

```json
{
  "name": "My Channel",
  "defaults": {
    "aspectRatio": "16:9",
    "animation": "zoom-in",
    "clips": {
      "mode": "paired",
      "transition": "fade-black",
      "transitionDuration": 0.5,
      "fadeBlackDuration": 0.3,
      "motionEffect": "random",
      "motionIntensity": "moderate"
    },
    "subtitle": {
      "style": "minimal",
      "animationStyle": "karaoke"
    },
    "audio": {
      "voiceVolume": 1.0,
      "musicVolume": 0.35
    }
  }
}
```

### Video Config (`channels/your-channel/videos/video-001/config.json`)

```json
{
  "title": "My Video",
  "clips": {
    "mode": "paired",
    "transition": "fade-black",
    "motionEffect": "random"
  }
}
```

## Clip Modes

### 1. Single Audio Mode (`"mode": "single-audio"`)
**Traditional mode** - One audio file for all images
- File structure:
  ```
  input/
    voice.mp3         (main audio)
    image1.jpg
    image2.jpg
    image3.jpg
  ```
- All images share the same audio duration
- Images display evenly across the audio duration

### 2. Paired Mode (`"mode": "paired"`)
**New feature** - Match audio to images by number
- File structure:
  ```
  input/
    audio1.mp3
    audio2.mp3
    audio3.mp3
    image1.jpg
    image2.jpg
    image3.jpg
  ```
- Each clip has its own duration based on its audio
- Perfect for storytelling with distinct scenes

### 3. Auto Detect (`"mode": "auto"`)
- Automatically detects if you have multiple audio files
- Falls back to single-audio if only `voice.mp3` exists

## Transition Options

### None (`"transition": "none"`)
Direct cut between clips - fastest rendering

### Fade Black (`"transition": "fade-black"`)
- Fade out to black
- Brief black screen
- Fade in from black
- Duration controlled by `fadeBlackDuration` (default: 0.3s)

### Fade (`"transition": "fade"`)
- Simple fade out/in
- Duration controlled by `transitionDuration` (default: 0.5s)

### Crossfade (`"transition": "crossfade"`)
- Blend from one clip to the next
- Duration controlled by `transitionDuration` (default: 0.5s)

## Motion Effects

### Static (`"motionEffect": "static"`)
No motion - image stays still

### Zoom Effects
- **zoom-in**: Slow zoom into the image
- **zoom-out**: Slow zoom out from the image

### Pan Effects
- **pan-left**: Pan from right to left
- **pan-right**: Pan from left to right
- **pan-up**: Pan from bottom to top
- **pan-down**: Pan from top to bottom

### Random (`"motionEffect": "random"`)
Randomly selects an effect for each clip

### Motion Intensity
Control how strong the effect is:
- **subtle**: 5% change (1.05x)
- **moderate**: 10% change (1.10x)
- **strong**: 15% change (1.15x)

## File Naming Convention

### For Paired Mode
Audio and images must have matching numbers:
- `audio1.mp3`, `audio2.mp3`, `audio3.mp3`
- `image1.jpg`, `image2.jpg`, `image3.jpg`

Supported formats:
- Audio: `.mp3`, `.wav`, `.m4a`, `.aac`
- Images: `.jpg`, `.jpeg`, `.png`, `.webp`

### For Single Audio Mode
- One audio: `voice.mp3`
- Multiple images: `image1.jpg`, `image2.jpg`, etc.
- OR: Any image names (alphabetically sorted)

## Background Music

Add `music.mp3` to the input folder for background music:
```
input/
  audio1.mp3
  audio2.mp3
  image1.jpg
  image2.jpg
  music.mp3        ← Background music
```

Configuration:
```json
{
  "audio": {
    "voiceVolume": 1.0,
    "musicVolume": 0.35,
    "musicFadeIn": 2,
    "musicFadeOut": 3
  }
}
```

## Examples

### Example 1: Story with Multiple Scenes
```
input/
  audio1.mp3   (5 seconds - "Once upon a time...")
  audio2.mp3   (8 seconds - "There was a princess...")
  audio3.mp3   (6 seconds - "And she lived happily ever after.")
  image1.jpg   (castle scene)
  image2.jpg   (princess scene)
  image3.jpg   (happy ending scene)
  music.mp3    (background music)

Config:
{
  "clips": {
    "mode": "paired",
    "transition": "fade-black",
    "motionEffect": "zoom-in"
  }
}
```

Result: 3 clips, each with its own audio and image, fade-to-black transitions, zoom-in effect on each

### Example 2: Random Effects with Crossfade
```json
{
  "clips": {
    "mode": "paired",
    "transition": "crossfade",
    "transitionDuration": 0.8,
    "motionEffect": "random",
    "motionIntensity": "strong"
  }
}
```

Result: Each clip gets a random motion effect with strong intensity, smooth crossfade transitions

## Batch Processing

Run batch processing with these features:
```bash
npm start
# Select: 2. Batch Processing - Select Channel
# Choose your channel
# Videos will be processed with the configured clip features
```

## Interactive Mode

The features also work in interactive mode:
```bash
npm start
# Select: 1. Interactive Mode
# Follow the prompts
# (Interactive prompts for transitions and effects coming soon)
```

## Tips

1. **Performance**: Transitions and motion effects increase rendering time
2. **File Size**: More effects = larger file size
3. **Naming**: Use leading zeros for proper sorting (audio01.mp3, audio02.mp3, etc.)
4. **Testing**: Use "draft" quality mode for fast testing
5. **Subtitles**: For karaoke mode, delete existing `subtitles.srt` to regenerate with word timestamps

## Coming Soon

- Interactive prompts for transitions and motion effects
- More transition types (wipe, slide, etc.)
- Per-clip effect configuration
- Video clip support in paired mode
- Audio crossfading between clips
