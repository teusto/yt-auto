# Animation Effects Guide

## 🎨 Overview

YT Machine offers 5 animation effects to bring your images to life. Choose between static images or dynamic effects like Ken Burns zoom and pan movements.

---

## 🎬 Available Effects

### 1. Static (No Animation)
**What it does:** Traditional slideshow - images remain still

**Best for:**
- Simple, clean presentations
- Text-heavy images that need to be read
- Maximum clarity and focus
- Fast processing time

**Example:**
```
┌─────────────────┐
│                 │
│     IMAGE       │ → Stays still for entire duration
│                 │
└─────────────────┘
```

---

### 2. Ken Burns - Zoom In
**What it does:** Slowly zooms into the image (1.0x → 1.2x)

**Best for:**
- Drawing attention to details
- Creating depth and engagement
- Product showcases
- Dramatic effect

**Movement:**
```
Start:  ┌───────────────┐
        │               │
        │    IMAGE      │  1.0x (full view)
        │               │
        └───────────────┘

End:    ┌─────────────────┐
        │   ┌─────────┐   │
        │   │ IMAGE   │   │  1.2x (zoomed)
        │   └─────────┘   │
        └─────────────────┘
```

**Effect:** Creates intimacy, focuses viewer attention

---

### 3. Ken Burns - Zoom Out
**What it does:** Slowly zooms out from the image (1.2x → 1.0x)

**Best for:**
- Revealing the bigger picture
- Creating a sense of discovery
- Landscape/scenery shots
- Transitions from detail to context

**Movement:**
```
Start:  ┌─────────────────┐
        │   ┌─────────┐   │
        │   │ IMAGE   │   │  1.2x (zoomed)
        │   └─────────┘   │
        └─────────────────┘

End:    ┌───────────────┐
        │               │
        │    IMAGE      │  1.0x (full view)
        │               │
        └───────────────┘
```

**Effect:** Creates openness, reveals context

---

### 4. Pan Left to Right
**What it does:** Horizontally moves across the image from left to right

**Best for:**
- Wide panoramic images
- Landscape shots
- Timeline/sequence visuals
- Creating motion and flow

**Movement:**
```
Start: View left side
┌────┐
│ IM │AGE
└────┘

Middle: View center
┌────┐
 │IMAG│E
 └────┘

End: View right side
        ┌────┐
    IMA│GE  │
        └────┘
```

**Effect:** Dynamic movement, reveals width, creates journey

---

### 5. Pan Right to Left
**What it does:** Horizontally moves across the image from right to left

**Best for:**
- Wide panoramic images
- Alternative pan direction
- Reading direction consideration (RTL languages)
- Variety in multi-image sequences

**Movement:**
```
Start: View right side
        ┌────┐
    IMA│GE  │
        └────┘

Middle: View center
 ┌────┐
 │IMAG│E
 └────┘

End: View left side
┌────┐
│ IM │AGE
└────┘
```

**Effect:** Dynamic movement, opposite flow from pan left

---

## 🎯 Choosing the Right Effect

### Decision Matrix

| Goal | Recommended Effect |
|------|-------------------|
| Maximum clarity | Static |
| Draw attention to detail | Zoom In |
| Show full context | Zoom Out |
| Wide images | Pan Left or Pan Right |
| Professional presentation | Static or Zoom In |
| Documentary style | Zoom Out |
| Dynamic social media | Zoom In or Pan |

### By Content Type

**Product Photos:**
- ✅ Zoom In (highlight details)
- ✅ Static (clear view)

**Landscapes/Scenery:**
- ✅ Zoom Out (reveal grandeur)
- ✅ Pan Left/Right (show width)

**Text/Infographics:**
- ✅ Static (ensure readability)
- ⚠️ Avoid zoom/pan (may blur text)

**Portraits:**
- ✅ Zoom In (create intimacy)
- ✅ Static (classic look)

**Timeline/Sequence:**
- ✅ Pan Left (follow flow)

---

## ⚙️ Technical Details

### Animation Parameters

**Zoom Effects:**
- Zoom range: 1.0x to 1.2x (20% zoom)
- Speed: Linear progression based on frame count
- Formula: Zoom In uses `min(1+frame/totalFrames*0.2,1.2)`
- Formula: Zoom Out uses `max(1.2-frame/totalFrames*0.2,1.0)`
- Center point: Image center
- Smooth linear zoom

**Pan Effects:**
- Zoom level: Fixed at 1.3x (to allow panning room)
- Pan speed: 2 pixels per frame
- Vertical: Centered
- Horizontal: Accumulative movement across frames

### Duration
All animations last for the full image display time:
- Example: 60-second audio ÷ 10 images = 6 seconds per image
- Animation smoothly progresses over all 6 seconds

### Processing Method
- **Static mode**: Fast concat method (30 fps)
- **Animated modes**: Each image processed sequentially with zoompan filter
  - Process one image at a time (more reliable than complex filter)
  - Create individual animated clips
  - Concatenate all clips with fast copy (no re-encoding)
- **Benefits**: Consistent performance, progress tracking per image, no hanging
- **Optimized for speed**: 24 fps, ultrafast preset for clips, multi-threaded

### Quality & Performance
- **Frame Rate**: 24 fps for animations (still smooth, faster processing)
- **Frame Rate**: 30 fps for static videos
- **Encoding**: "faster" preset for speed (still high quality)
- **Multi-threading**: Uses all CPU cores for parallel processing
- **CRF 23**: Balanced quality/speed (excellent for online platforms)
- Result: ~40-50% faster than before, still professional quality

---

## 💡 Pro Tips

### 1. Match Animation to Content
- **Still subjects** → Zoom In
- **Wide landscapes** → Pan
- **Text/diagrams** → Static

### 2. Consider Aspect Ratio
- **16:9 (Landscape)** → All effects work well
- **9:16 (Portrait)** → Zoom effects work better than pan
- Pan effects work best with wider images

### 3. Mix Effects
Don't use the same effect for all videos:
- Zoom In for intro
- Pan for middle section
- Zoom Out for conclusion

(Note: Currently one effect per video, but you can generate multiple videos)

### 4. Image Quality
- Use high-resolution images (min 1920x1080)
- Ken Burns effects zoom in, so extra resolution helps
- Pan effects need wide images (2000px+ width recommended)

### 5. Test Before Full Production
- Generate a short test video first
- Check how your images look with the effect
- Adjust if needed

### 6. Performance Note
- Animations are optimized: 24 fps, faster encoding, multi-threading
- Still produces smooth, professional results
- 24 fps is the cinema standard - perfect for online content
- Quality difference from 30 fps is negligible for most viewers

---

## 📊 Comparison Table

| Effect | Movement | Zoom Level | Best For | FPS | Processing |
|--------|----------|-----------|----------|-----|-----------|
| Static | None | 1.0x | Clarity | 30 | Fastest |
| Zoom In | Gradual | 1.0→1.2x | Details | 24 | Optimized |
| Zoom Out | Gradual | 1.2→1.0x | Context | 24 | Optimized |
| Pan Left | Horizontal → | 1.3x | Wide images | 24 | Optimized |
| Pan Right | Horizontal ← | 1.3x | Wide images | 24 | Optimized |

---

## 🎬 Real-World Examples

### YouTube Tutorial (16:9, Static)
```
Goal: Clear instruction
Images: 10 screenshots
Duration: 5 seconds each
Effect: Static
Why: Text needs to be readable, no distraction
```

### TikTok Travel Video (9:16, Zoom In)
```
Goal: Engaging travel content
Images: 15 photos
Duration: 2 seconds each
Effect: Zoom In
Why: Creates dynamic feel, maintains viewer attention
```

### Real Estate Showcase (16:9, Pan Right)
```
Goal: Show property width
Images: 8 wide-angle interior shots
Duration: 7.5 seconds each
Effect: Pan Right
Why: Reveals full room width, feels like a tour
```

### Instagram Story (9:16, Zoom Out)
```
Goal: Product reveal
Images: 6 product photos
Duration: 5 seconds each
Effect: Zoom Out
Why: Creates discovery moment, reveals full product
```

---

## 🚀 Quick Selection Guide

**Choose Static if:**
- ✅ Images contain text
- ✅ You want maximum clarity
- ✅ Processing speed is important

**Choose Zoom In if:**
- ✅ You want to highlight details
- ✅ Creating emotional impact
- ✅ Product/portrait photos

**Choose Zoom Out if:**
- ✅ You want to reveal context
- ✅ Landscape/scenery shots
- ✅ Creating sense of discovery

**Choose Pan if:**
- ✅ You have wide images
- ✅ Want horizontal movement
- ✅ Showing breadth/width

---

## ❓ FAQ

**Q: Can I use different effects for different images?**
A: Currently, one effect applies to all images in a video. Generate multiple videos to use different effects.

**Q: Will animation blur my images?**
A: No quality loss occurs. Use high-resolution images for best results.

**Q: Which effect is best for beginners?**
A: Start with **Static** to understand the basics, then try **Zoom In** for added polish.

**Q: Do animations work with subtitles?**
A: Yes! Animations and subtitles work perfectly together.

**Q: Which effect is most professional?**
A: All can be professional depending on context:
- Corporate: Static or subtle Zoom In
- Creative: Any effect
- Documentary: Zoom Out or Pan

**Q: Does animation affect rendering time?**
A: Yes, but optimized! Animated effects now use 24 fps (vs 30 fps for static), faster encoding, and multi-threading. Expect about 1.5-2x longer than static mode - much faster than before while maintaining excellent quality!

**Q: Can I adjust zoom/pan speed?**
A: Advanced users can edit the zoompan parameters in `src/index.js`. Look for the `getAnimationFilter` function.

**Q: Do animations work with "Original Size" aspect ratio?**
A: Yes, but animations require fixed output dimensions. If you select "Original Size" with an animation effect, the video will be rendered at 1920x1080 (16:9) to ensure proper animation processing. For true original size, use Static mode.

---

## 🔧 Advanced Customization

Want to tweak the effects? Edit `src/index.js`:

```javascript
function getAnimationFilter(imageDuration) {
  // Modify these values:
  // - Zoom speed: 0.0015 (increase for faster zoom)
  // - Max zoom: 1.2 (increase for more zoom)
  // - Pan speed: on*2 (increase multiplier for faster pan)
}
```

---

**Ready to animate?** Run `npm start` and select your effect! 🎬✨

Check out [README.md](README.md) for complete documentation.
