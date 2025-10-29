# CTA (Call-to-Action) Folder

## 📝 Overview

Place call-to-action overlay images **or videos** here to remind viewers to subscribe, like, comment, etc.

✅ **Static CTAs:** PNG, JPG images
✅ **Animated CTAs:** MP4, MOV, WebM, GIF videos
✨ **Smooth Fade Effects:** 0.5s fade in/out for professional transitions
⏱️ **Extended Duration:** 5 seconds display time for better readability

---

## ✅ Quick Start

### **Option 1: Simple PNG Overlay (Static)**

```
cta/
  └── subscribe.png   ← Transparent PNG with "Subscribe" button
```

**That's it!** The tool will detect and prompt you to add it.

### **Option 2: Animated CTA (Video)**

```
cta/
  └── subscribe_animated.mp4   ← Animated subscribe button
```

**That's it!** Automatically detected as animated CTA!

---

### **Option 2: Multiple CTAs**

```
cta/
  ├── subscribe.png
  ├── like.png
  ├── comment.png
  └── follow.png
```

Choose which one(s) to use during generation!

---

## 🎬 **Workflow**

```bash
# 1. Add CTA image to folder
cta/
  └── subscribe.png

# 2. Run generator
$ npm start

# 3. Prompt appears:
📢 Call-to-Action:
  ✅ Found subscribe.png
  
  Add CTA overlay?
  1. Yes - Show at 5 seconds (bottom-right)
  2. Yes - Show at end of video
  3. Custom timing
  4. No

Enter your choice (1-4): 1
✅ CTA will appear at 5s for 5s with fade (bottom-right) 🖼️

# 4. Video includes subscribe reminder with smooth fade effects!
```

---

## 📐 **Media Requirements**

### **Format:**

**Static CTAs (Images):**
```
✅ PNG with transparency (BEST)
✅ PNG without transparency (OK)
✅ JPEG (works but no transparency)
```

**Animated CTAs (Videos):**
```
✅ MP4 (BEST - widely supported)
✅ MOV (Apple format)
✅ WebM (web optimized)
✅ GIF (simple animations)

Recommended:
- Duration: 2-5 seconds (will loop if needed)
- Transparent background (use alpha channel)
- Small file size (< 5MB)
```

### **Size:**
```
Recommended: 300x100 to 500x150 pixels

For 1920x1080 video:
- Small: 250x80
- Medium: 400x120
- Large: 600x180

Tool will auto-scale to fit!
```

### **Design:**
```
✅ High contrast (visible on any background)
✅ Clear text
✅ Simple design
✅ Transparent background (PNG)

Example:
┌─────────────────┐
│  👍 SUBSCRIBE  │  ← White text on semi-transparent background
└─────────────────┘
```

---

## 🎨 **Creating CTAs**

### **Static CTA (Image)**

**Option 1: Canva (Easiest)**

1. Go to https://www.canva.com/
2. Create custom size (400x120)
3. Design your CTA
4. Download as PNG (transparent background)
5. Save to `cta/` folder

**Option 2: Free CTA Graphics**

Free Resources:
- Flaticon: https://www.flaticon.com/ (icons)
- Freepik: https://www.freepik.com/ (graphics)
- Pngtree: https://pngtree.com/ (PNG with transparency)

Search: "subscribe button", "youtube cta", "like button"

**Option 3: Simple Text with FFmpeg**

```bash
# Create simple subscribe button
ffmpeg -f lavfi -i color=c=red@0.8:s=400x120:d=1 \
  -vf "drawtext=text='⭐ SUBSCRIBE':fontsize=40:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  -frames:v 1 cta/subscribe.png
```

---

### **Animated CTA (Video)** 🎬

**Option 1: Canva (Easiest for beginners)**

1. Go to https://www.canva.com/
2. Create "Video" project (400x120 or custom)
3. Add animations (bounce, fade, pulse)
4. Download as MP4
5. Save to `cta/` folder

**Option 2: After Effects / Premiere**

1. Create composition (400x120)
2. Design animated button
3. Export as MP4 with alpha channel
4. Keep duration 2-5 seconds
5. Save to `cta/` folder

**Option 3: Online Tools**

Free tools:
- Lottie Files: https://lottiefiles.com/ (export as GIF/MP4)
- Renderforest: https://www.renderforest.com/
- Kapwing: https://www.kapwing.com/

**Option 4: Simple FFmpeg Animation**

```bash
# Pulsing subscribe button (2 seconds)
ffmpeg -f lavfi -i color=c=red@0.8:s=400x120:d=2 \
  -vf "drawtext=text='👍 SUBSCRIBE':fontsize=40:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2,\
       scale='iw*abs(sin(2*PI*t))':'ih':eval=frame" \
  -t 2 cta/subscribe_animated.mp4
```

**Pro Tips for Animated CTAs:**

```
✅ Keep it short (2-5 seconds)
✅ Loop smoothly (end frame = start frame)
✅ Not too distracting (subtle animation)
✅ High contrast for visibility
✅ Test on different backgrounds

Popular animations:
- Bounce in/out
- Pulse (scale up/down)
- Fade in/out
- Slide from side
- Glow effect
```

---

## ✨ **Fade Effects**

All CTAs now include **smooth fade in/out transitions** for a professional look!

### **How It Works**

```
Timeline (5 second display):
0s      0.5s              4.5s   5.0s
|       |                  |      |
[FADE IN] [==== FULL ====] [FADE OUT]

Fade In:  0.5 seconds (smooth entrance)
Display:  4.0 seconds (full visibility)  
Fade Out: 0.5 seconds (smooth exit)
```

### **Benefits**

```
✅ Professional appearance
✅ Non-jarring transitions
✅ Better user experience
✅ Doesn't distract from content
✅ Elegant entrance and exit
```

### **Configuration**

Default settings (automatic):
- Fade duration: 0.5 seconds
- Total display: 5 seconds
- Fully visible: 4 seconds

---

## 🎯 **CTA Types**

### **1. Subscribe**
```
Common messages:
- "Subscribe for more!"
- "👍 Subscribe"
- "Don't forget to subscribe!"
- "New videos every week - Subscribe!"
```

### **2. Like & Comment**
```
Common messages:
- "👍 Like this video!"
- "💬 Comment below!"
- "Like if you enjoyed!"
```

### **3. Follow Social Media**
```
Common messages:
- "Follow @yourhandle"
- "📱 Follow on Instagram"
- "Join our community!"
```

### **4. Custom Action**
```
Examples:
- "Download the PDF"
- "Take the quiz"
- "Visit our website"
```

---

## ⚙️ **CTA Positioning**

### **Default Positions:**

```
┌─────────────────────────────┐
│ top-left    top-right       │  ← Less intrusive
│                             │
│         (content)           │
│                             │
│ bottom-left  bottom-right  │  ← Most common
└─────────────────────────────┘
```

**Recommendation:** `bottom-right` (YouTube standard)

---

## ⏱️ **CTA Timing**

### **Strategy 1: Early (5-10 seconds)**
```
✅ Catches attention early
✅ Builds habit
⚠️  Might be intrusive

Best for: Short videos (< 1 min)
```

### **Strategy 2: Mid-Video (50% point)**
```
✅ Viewer is engaged
✅ Natural break point
✅ Good retention

Best for: Medium videos (1-3 min)
```

### **Strategy 3: End of Video**
```
✅ Non-intrusive
✅ Natural CTA moment
⚠️  Lower visibility

Best for: Long videos (3+ min)
```

### **Strategy 4: Multiple Times**
```
Show CTA at:
- 5s (quick reminder)
- 50% (mid-point)
- End (final CTA)

Best for: Long-form content
```

---

## 📁 **Example Setups**

### **Minimal (Recommended):**
```
cta/
  └── subscribe.png
```

### **Complete:**
```
cta/
  ├── subscribe.png
  ├── like.png
  ├── comment.png
  └── follow_instagram.png
```

### **Branded:**
```
cta/
  ├── subscribe_channel_logo.png
  ├── like_branded.png
  └── visit_website.png
```

---

## 🎬 **How It Works**

### **Detection:**
```
1. Tool scans cta/ folder
2. Finds PNG/JPEG images
3. Prompts for selection
4. Asks for timing and position
5. Overlays on video
```

### **Configuration Options:**
```
📢 CTA Settings:
  
  Which CTA:    subscribe.png
  Position:     bottom-right
  Show at:      5 seconds
  Duration:     3 seconds
  Opacity:      90%
  Size:         Medium
```

---

## 💡 **Best Practices**

### **1. Timing**
```
✅ Don't show CTA in first 3 seconds
   - Let viewers settle in

✅ Duration: 3-5 seconds
   - Long enough to read, short enough not to annoy

❌ Avoid:
   - Showing during crucial content
   - Blocking important visuals
```

### **2. Design**
```
✅ High contrast
✅ Clear, readable text
✅ Simple design
✅ Consistent with brand

❌ Avoid:
   - Busy backgrounds
   - Tiny text
   - Clashing colors
```

### **3. Frequency**
```
Short videos (< 1 min):
- 1 CTA max

Medium videos (1-3 min):
- 1-2 CTAs

Long videos (3+ min):
- 2-3 CTAs
```

---

## 🎨 **CTA Design Templates**

### **YouTube Style (Red):**
```
Background: Red (#FF0000)
Text: White, Bold
Icon: ▶️ or 🔔
Size: 400x120px
```

### **Minimal (Transparent):**
```
Background: Semi-transparent black (rgba 0,0,0,0.7)
Text: White
Border: Thin white border
Size: 350x100px
```

### **Animated (Advanced):**
```
Use short video instead of image:
cta/
  └── subscribe_animated.mp4 (2-3s loop)
```

---

## 🔧 **Advanced: Multiple CTAs**

### **Scenario: Educational Video**

```
Timing plan:
0:05 - Show "Subscribe" (3s)
1:30 - Show "Download PDF" (4s)
2:45 - Show "Like & Comment" (3s)

Files needed:
cta/
  ├── subscribe.png
  ├── download.png
  └── engage.png
```

### **Scenario: Product Demo**

```
0:10 - "Subscribe for reviews" (3s)
2:00 - "Visit website" (5s)
End  - "Subscribe & Follow" (4s)

cta/
  ├── subscribe.png
  ├── website.png
  └── follow.png
```

---

## 📊 **Examples by Niche**

### **Language Learning:**
```
cta/
  └── subscribe_new_lessons.png
  
Message: "New lesson every day! Subscribe 📚"
Position: bottom-right
Timing: 5s for 3s
```

### **Tech Tutorials:**
```
cta/
  ├── subscribe.png
  └── download_code.png

Message 1: "Subscribe for more tutorials! 💻"
Message 2: "Download code in description 📥"
```

### **Storytelling:**
```
cta/
  └── subscribe_subtle.png

Message: "More stories weekly ✨"
Position: bottom-left (less intrusive)
Timing: End of video
```

---

## 🚨 **Troubleshooting**

### **Problem: CTA not visible**

**Check:**
- Image has enough contrast
- Position not blocked by subtitles
- Opacity is high enough (90%+)

### **Problem: CTA too intrusive**

**Solution:**
- Reduce size
- Lower opacity (70-80%)
- Shorten duration (2s)
- Move to corner position

### **Problem: CTA blocks content**

**Solution:**
- Change position (try different corner)
- Adjust timing (show during less important parts)
- Make semi-transparent

---

## 🎯 **Quick Start Template**

### **Create Basic Subscribe CTA:**

**Using Canva:**
1. Create 400x120px canvas
2. Add red rectangle background
3. Add white text: "👍 SUBSCRIBE"
4. Download as PNG
5. Save to `cta/subscribe.png`

**Using Online Tool:**
1. Search "free subscribe button png"
2. Download transparent PNG
3. Save to `cta/` folder
4. Done!

---

## 📈 **CTA Effectiveness Tips**

### **What Works:**
```
✅ Action-oriented language ("Subscribe now!")
✅ Visual indicators (arrows, icons)
✅ Urgency ("Don't miss out!")
✅ Value proposition ("New videos daily!")
✅ Positioned bottom-right (YouTube standard)
```

### **What Doesn't Work:**
```
❌ Vague CTAs ("Click something")
❌ Too many CTAs (overwhelming)
❌ Blocking main content
❌ Showing too early (first 2s)
❌ Too long duration (10s+)
```

---

## 🌟 **Pro Tips**

### **Tip 1: Match Your Brand**
```
Use your brand colors in CTA
Builds recognition and trust
```

### **Tip 2: Test Different CTAs**
```
Create multiple versions:
- cta_subscribe_v1.png
- cta_subscribe_v2.png
- cta_subscribe_v3.png

Test which gets better results!
```

### **Tip 3: Seasonal CTAs**
```
cta_holiday.png
cta_back_to_school.png
cta_new_year.png

Keep it fresh and relevant!
```

---

## 📚 **Related**

- [Intro/Outro Guide](../intros/README.md) - Professional branding
- [README.md](../README.md) - Main documentation

---

**Boost engagement with strategic CTAs! 📢✨**
