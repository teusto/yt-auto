# Intro/Outro Folder

## 📝 Overview

Place your intro and outro video files here to automatically add them to your videos!

---

## ✅ Quick Start

### **Option 1: Use Default Names (Easiest)**

```
intros/
  ├── intro.mp4   ← Auto-added to start of video
  └── outro.mp4   ← Auto-added to end of video
```

**That's it!** The tool will automatically detect and use them.

---

### **Option 2: Multiple Styles (Advanced)**

```
intros/
  ├── intro_minimal.mp4
  ├── intro_professional.mp4
  ├── intro_fun.mp4
  ├── outro_minimal.mp4
  └── outro_professional.mp4
```

You'll be prompted to select which one to use!

---

## 🎬 **Workflow**

```bash
# 1. Place intro/outro files in this folder
intros/
  ├── intro.mp4  (3-5 seconds recommended)
  └── outro.mp4  (3-5 seconds recommended)

# 2. Run generator
$ npm start

# 3. Prompt appears:
🎬 Intro/Outro:
  ✅ Found intro.mp4 (3.5s)
  ✅ Found outro.mp4 (4.2s)
  
  Add to video?
  1. Yes (intro + outro)
  2. Intro only
  3. Outro only
  4. No

Enter your choice (1-4): 1
✅ Intro and outro will be added

# 4. Video is created with intro → content → outro
```

---

## 📐 **Technical Requirements**

### **Format:**
```
✅ .mp4 (recommended)
✅ .mov, .avi, .webm (also work)
```

### **Resolution:**
```
Should match your video output:
- 16:9 videos → 1920x1080 intro/outro
- 9:16 videos → 1080x1920 intro/outro

Don't worry if they don't match - tool will auto-resize!
```

### **Duration:**
```
Recommended:
- Intro: 2-5 seconds
- Outro: 3-8 seconds

The tool will use them as-is, no trimming.
```

---

## 💡 **Creating Intro/Outro Videos**

### **Option 1: Online Tools (Free & Easy)**

**Canva** (Recommended)
- https://www.canva.com/
- Tons of free templates
- Easy customization
- Export as MP4

**Panzoid**
- https://panzoid.com/
- Free intro maker
- No watermarks
- Lots of templates

**InVideo**
- https://invideo.io/
- Professional templates
- Free tier available

---

### **Option 2: Simple Static Intro**

Create a simple intro with just your channel name:

**Using FFmpeg (Command line):**
```bash
# Create 3-second intro with text
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=3 \
  -vf "drawtext=text='Your Channel Name':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  -c:v libx264 -pix_fmt yuv420p intros/intro.mp4
```

---

### **Option 3: Use Template Videos**

**Free Stock Intro Videos:**
- Pexels: https://www.pexels.com/videos/
- Pixabay: https://pixabay.com/videos/
- Videezy: https://www.videezy.com/

Download, add text in Canva, export!

---

## 🎨 **Intro/Outro Ideas**

### **For Language Learning:**

**Intro (3s):**
```
"Learn Portuguese with [Your Name]"
+ Your logo
+ Upbeat music
```

**Outro (5s):**
```
"Subscribe for daily lessons!"
+ Social media handles
+ Soft music fade
```

### **For Tutorials:**

**Intro (4s):**
```
Channel logo animation
+ "Tech Tutorials"
```

**Outro (6s):**
```
"Thanks for watching!"
+ "Like & Subscribe"
+ Next video thumbnail
```

### **For Storytelling:**

**Intro (2s):**
```
Simple fade in with title
```

**Outro (8s):**
```
"More stories every week"
+ Credits
+ Social links
```

---

## 📁 **Example Structure**

### **Minimal Setup:**
```
intros/
  ├── intro.mp4   (Your simple intro)
  └── outro.mp4   (Subscribe reminder)
```

### **Multi-Style Setup:**
```
intros/
  ├── intro_minimal.mp4       (Quick, subtle)
  ├── intro_professional.mp4  (Full branding)
  ├── intro_fun.mp4           (Energetic, for shorts)
  ├── outro_cta.mp4           (Subscribe focused)
  └── outro_credits.mp4       (Full credits)
```

### **Series Setup:**
```
intros/
  ├── intro_series1.mp4   (Language lessons)
  ├── intro_series2.mp4   (Cultural videos)
  ├── outro_common.mp4    (Used for all)
  └── outro_series1.mp4   (Specific CTA)
```

---

## ⚙️ **How It Works**

### **Detection:**
1. Tool scans `intros/` folder
2. Finds any `.mp4`, `.mov`, etc. files
3. Separates into intro/outro based on filename

### **Filename Patterns:**
```
Recognized as INTRO:
- intro.mp4
- intro_*.mp4
- *_intro.mp4

Recognized as OUTRO:
- outro.mp4
- outro_*.mp4  
- *_outro.mp4

If multiple found:
- You'll be prompted to choose
```

### **Assembly:**
```
Final video = Intro + Main Content + Outro

Example:
intro.mp4 (3s) + content (45s) + outro.mp4 (5s) = 53s total
```

---

## 🎯 **Best Practices**

### **Duration:**
```
✅ Keep intros SHORT (2-5s)
   - Viewers skip long intros
   
✅ Outros can be longer (5-10s)
   - Include CTAs, credits
```

### **Consistency:**
```
✅ Use same intro/outro for series
   - Builds brand recognition
   
✅ Match style to content
   - Professional for tutorials
   - Fun for entertainment
```

### **Audio:**
```
✅ Keep intro/outro audio levels consistent
   - Match your main content volume
   
⚠️  Tool currently uses intro/outro audio as-is
   - Pre-mix audio to desired level
```

---

## 🔧 **Customization**

### **Per-Video Selection:**

During video generation, you can choose:
```
🎬 Select Intro:
  1. intro_minimal.mp4 (2s)
  2. intro_professional.mp4 (5s)
  3. None

🎬 Select Outro:
  1. outro_cta.mp4 (5s)
  2. outro_credits.mp4 (8s)
  3. None
```

### **Skip Intro/Outro:**

```
If you don't want intro/outro for a specific video:
- Select "None" when prompted
- Or remove files from intros/ folder temporarily
```

---

## 📊 **Examples**

### **Example 1: Language Learning**

```
intros/
  ├── intro.mp4
  │   Content: "Portuguese with João" + logo (3s)
  │   
  └── outro.mp4
      Content: "New lesson tomorrow! Subscribe!" (6s)

Result: Professional channel branding!
```

### **Example 2: Tutorial Series**

```
intros/
  ├── intro_python.mp4    (Python course branding)
  ├── intro_javascript.mp4 (JavaScript course branding)
  └── outro_common.mp4     (Generic subscribe)

Select intro based on tutorial topic!
```

### **Example 3: Minimal Setup**

```
intros/
  └── outro.mp4  (Just a subscribe reminder)

No intro = Jump straight to content!
```

---

## 🚨 **Troubleshooting**

### **Problem: Intro/outro not detected**

**Check:**
- File is in `intros/` folder
- Filename contains "intro" or "outro"
- File is valid video format (.mp4, .mov, etc.)

### **Problem: Video quality degraded**

**Solution:**
- Use high-quality source files (1080p)
- Match resolution to output format
- Avoid re-compressed videos

### **Problem: Audio out of sync**

**Solution:**
- Ensure intro/outro videos have proper audio sync
- Re-export with "Constant Frame Rate" (CFR)

---

## 💾 **Quick Start Template**

### **Create Simple Intro/Outro:**

```bash
# 1. Create black screen with text (intro)
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=3 \
  -vf "drawtext=text='YOUR CHANNEL':fontsize=80:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  intros/intro.mp4

# 2. Create subscribe reminder (outro)
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=5 \
  -vf "drawtext=text='Subscribe for more!':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  intros/outro.mp4

# 3. Done! Run npm start
```

---

## 🌟 **Pro Tips**

### **Tip 1: Template Reuse**
```
Create one good intro/outro set
→ Use for all videos in a series
→ Consistency = professionalism
```

### **Tip 2: Update Seasonally**
```
Keep different versions:
- intro_normal.mp4
- intro_holiday.mp4
- intro_summer.mp4

Swap as needed!
```

### **Tip 3: A/B Testing**
```
Create 2 outros:
- outro_v1.mp4 (Subscribe focus)
- outro_v2.mp4 (Like & comment focus)

Test which performs better!
```

---

## 📚 **Related**

- [README.md](../README.md) - Main documentation
- [CTA Guide](../cta/README.md) - Call-to-action overlays
- [Video Clips Guide](../VIDEO_CLIPS_GUIDE.md) - Using video clips

---

**Add professional branding to every video! 🎬✨**
