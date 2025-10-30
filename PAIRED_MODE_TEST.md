# Testing Audio-Image Pairing Feature

## Quick Test Setup

### 1. Prepare Test Files

Create numbered audio and image files in your `input/` folder:

```
input/
  audio1.mp3     (e.g., 5 seconds - "Hello, this is clip 1")
  audio2.mp3     (e.g., 7 seconds - "This is clip 2")  
  audio3.mp3     (e.g., 6 seconds - "And this is clip 3")
  image1.jpg     (corresponding image for clip 1)
  image2.jpg     (corresponding image for clip 2)
  image3.jpg     (corresponding image for clip 3)
  music.mp3      (optional - background music)
```

**Important**: Files must have matching numbers (audio1 + image1, audio2 + image2, etc.)

### 2. Configure Channel (Optional)

Edit `channels/your-channel/channel.json`:

**Without Transitions (default):**
```json
{
  "name": "Test Channel",
  "defaults": {
    "aspectRatio": "16:9",
    "animation": "zoom-in",
    "clips": {
      "mode": "paired",
      "transition": "none"
    }
  }
}
```

**With Fade-to-Black Transitions (new feature):**
```json
{
  "name": "Test Channel",
  "defaults": {
    "aspectRatio": "16:9",
    "animation": "zoom-in",
    "clips": {
      "mode": "paired",
      "transition": "fade-black",
      "fadeBlackDuration": 0.3
    }
  }
}
```

Or let it auto-detect (default behavior).

### 3. Run Test

```bash
npm start
```

Select:
- **Batch Processing - Select Channel** (if using channel config)
- OR **Interactive Mode** (will auto-detect paired files)

## Expected Behavior

### Auto-Detection
The system will automatically detect paired mode if:
- You have 2+ numbered audio files (audio1, audio2, etc.)
- You have matching numbered images (image1, image2, etc.)
- Files share common numbers

### Output Messages
You should see:
```
🎬 Paired Mode: Found 3 matched clips
   Clip 1: audio1.mp3 (5.00s) + image1.jpg
   Clip 2: audio2.mp3 (7.00s) + image2.jpg
   Clip 3: audio3.mp3 (6.00s) + image3.jpg
   📊 Total duration: 18.00 seconds

🎬 Stage 1/2: Processing paired clips
✅ Clip 1/3 complete (5.00s)
✅ Clip 2/3 complete (7.00s)
✅ Clip 3/3 complete (6.00s)

🎬 Stage 2/2: Combining clips
✅ Video created successfully
```

### Result
- Video with 3 clips
- Each clip displays for its audio duration
- Each clip has its own audio
- Background music (if provided) plays throughout

## Testing Modes

### Test 1: Auto-Detect Mode (Default)
Just add numbered files - system will auto-detect

### Test 2: Explicit Paired Mode
Add to channel config:
```json
"clips": {
  "mode": "paired"
}
```

### Test 3: Force Single-Audio Mode
Even with numbered files, use traditional mode:
```json
"clips": {
  "mode": "single-audio"
}
```

## Troubleshooting

### "No matching audio-image pairs found"
- Check file naming: must have numbers (audio1, audio2, image1, image2)
- Check numbers match: audio1 needs image1, audio2 needs image2
- Use leading zeros if you have 10+ files: audio01, audio02, etc.

### "No voiceover audio file found"
In paired mode, you need at least 2 numbered audio files (audio1.mp3, audio2.mp3)

### Clips in Wrong Order
- Files are sorted by number
- Use leading zeros: audio01, audio02, audio03 (not audio1, audio2, audio10)

### Background Music Not Playing
- Add `music.mp3` to input folder
- Check volume settings in config

## File Naming Examples

### ✅ Good
```
audio1.mp3, audio2.mp3, audio3.mp3
image1.jpg, image2.jpg, image3.jpg

audio01.mp3, audio02.mp3, ..., audio10.mp3
image01.jpg, image02.jpg, ..., image10.jpg

audio_01.mp3, audio_02.mp3
image_01.png, image_02.png
```

### ❌ Bad
```
audio.mp3, audio_two.mp3         (no numbers)
audio1.mp3, image2.jpg           (numbers don't match)
clip1.mp3, sound1.mp3            (multiple audio1)
```

## Fade-to-Black Transitions

### How It Works
Fades are **baked directly into each clip** during creation, then clips are concatenated:
1. **First clip**: Fades to black at the end (0.15s default)
2. **Middle clips**: Fade in from black at start + fade to black at end (0.15s each)
3. **Last clip**: Fades in from black at the start (0.15s default)
4. **Result**: Smooth black transitions between all clips

### Technical Details
- Fades are rendered into each individual clip BEFORE concatenation
- Each clip has the fade effect as part of its video stream
- Concatenation simply joins the already-faded clips together
- This ensures transitions work reliably across all clips

### Configuration Options
```json
"clips": {
  "transition": "fade-black",      // Enable fade-to-black
  "fadeBlackDuration": 0.3         // Total transition duration in seconds
}
```

### Visual Effect
```
Clip 1 (5s) → [Fade to Black 0.3s] → Clip 2 (7s) → [Fade to Black 0.3s] → Clip 3 (6s)
```

Total duration = 5 + 0.3 + 7 + 0.3 + 6 = 18.6 seconds

### Transition Options
- `"none"` - Direct cuts (default, fastest)
- `"fade-black"` - Smooth fade through black (cinematic)

## Next Features (Coming Soon)
- ✅ ~~Fade-to-black transitions between clips~~ **IMPLEMENTED!**
- Random/configurable motion effects per clip
- Per-clip subtitle support
- Video clip support in paired mode
- More transition types (crossfade, wipe, slide)

## Current Limitations
- Intro/outro not yet supported in paired mode
- All clips use same animation effect (if enabled)
- Subtitles apply to entire video (not per-clip yet)

## Success Indicators

After running, check:
1. ✅ Each clip displays for correct duration
2. ✅ Audio changes between clips
3. ✅ Images display in correct order (by number)
4. ✅ Background music plays throughout (if added)
5. ✅ Total video duration = sum of all audio durations

## Example Output

For 3 clips of 5s, 7s, and 6s:
- Total duration: 18 seconds
- Clip 1: 0-5s (audio1 + image1)
- Clip 2: 5-12s (audio2 + image2)
- Clip 3: 12-18s (audio3 + image3)
