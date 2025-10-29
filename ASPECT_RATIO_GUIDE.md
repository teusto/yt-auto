# Aspect Ratio Guide

## Overview

When you run `npm start`, you'll be prompted to select your video's aspect ratio. This determines the final dimensions and orientation of your video.

---

## Options Explained

### 📺 Option 1: 16:9 (Landscape)
**Resolution:** 1920x1080 pixels

**Best for:**
- YouTube videos
- Desktop/laptop viewing
- Presentations
- Webinars
- Tutorials
- Horizontal viewing platforms

**Example use case:** Educational content, vlogs, product reviews

---

### 📱 Option 2: 9:16 (Portrait)
**Resolution:** 1080x1920 pixels

**Best for:**
- TikTok
- Instagram Stories
- Instagram Reels
- YouTube Shorts
- Snapchat
- Mobile-first content

**Example use case:** Quick tips, behind-the-scenes, mobile-first social media content

---

### 🖼️ Option 3: Original Size
**Resolution:** Matches your first image dimensions

**Best for:**
- Custom aspect ratios
- Preserving exact image quality
- Non-standard formats
- When you want full control over dimensions

**Example use case:** Artwork showcases, photography portfolios, custom dimensions

---

## How Images Are Handled

### 16:9 and 9:16 Modes
- Images are **scaled down** to fit within the target resolution
- **Aspect ratio is preserved** (no stretching/distortion)
- **Black bars** are added if needed to fill the frame
- Images are **centered** in the frame

**Example:**
- Square image (1000x1000) in 16:9 mode
  - Scaled to 1080x1080 (to fit height)
  - Black bars added on left/right sides
  - Final video: 1920x1080

### Original Size Mode
- **No scaling** applied
- First image sets the video dimensions
- All other images are scaled to match the first image
- **Fastest processing** (no scaling calculations)

---

## Interactive Example

```bash
$ npm start

🚀 Starting video generation...

📐 Select video aspect ratio:

  1. 16:9 (Landscape - YouTube, Desktop) - 1920x1080
  2. 9:16 (Portrait - TikTok, Instagram Stories) - 1080x1920
  3. Original Size (Keep image dimensions)

Enter your choice (1, 2, or 3): 2
✅ Selected: 9:16 (1080x1920)

📂 Scanning input folder...
✅ Found 8 images
✅ Found audio: voiceover.mp3

⏱️  Analyzing audio duration...
✅ Audio duration: 45.00 seconds

📊 Creating video with 8 images
⏱️  Each image will display for 5.62 seconds
🎬 Generating 9:16 video (1080x1920)...
✅ Image slideshow created
🎵 Combining video with audio...
✅ Final video created

🎉 Video generation complete!
📹 Output: output/video_2024-01-15T12-30-45.mp4
```

---

## Tips & Recommendations

### For YouTube Content
✅ Use **16:9** - Standard format, maximum compatibility

### For Social Media (Mobile)
✅ Use **9:16** - Optimized for vertical viewing, better engagement

### For Mixed Platforms
- Create two versions: one in 16:9, one in 9:16
- Run the script twice with different selections

### For Custom Dimensions
✅ Use **Original Size** and prepare images in your desired resolution beforehand

---

## Common Scenarios

| Content Type | Recommended | Resolution |
|-------------|-------------|------------|
| YouTube Tutorial | 16:9 | 1920x1080 |
| TikTok Video | 9:16 | 1080x1920 |
| Instagram Story | 9:16 | 1080x1920 |
| Instagram Feed Post | Original Size | Square (1080x1080) |
| Facebook Video | 16:9 | 1920x1080 |
| LinkedIn Video | 16:9 | 1920x1080 |
| Twitter Video | 16:9 or Original | 1920x1080 |
| Presentation | 16:9 | 1920x1080 |

---

## Quality Notes

All videos are encoded with:
- **H.264 codec** (maximum compatibility)
- **30fps** (smooth playback)
- **AAC audio** @ 192kbps (high quality)
- **yuv420p pixel format** (universal support)

This ensures your videos work on all platforms and devices!

---

## Need Help?

Check the [README.md](README.md) for full documentation or [QUICKSTART.md](QUICKSTART.md) for a quick setup guide.
