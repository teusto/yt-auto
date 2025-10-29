# 🎨 Aspect Ratio-Specific Image Pools

**Organize images by format - never mix landscape and portrait images again!**

---

## 🎯 Problem Solved

**Before:**
```
channels/pray-matheus/
└── image-pool/
    ├── landscape-prayer.jpg   ← 16:9
    ├── portrait-cross.jpg     ← 9:16 (shorts)
    └── square-bible.jpg       ← 1:1
```

When generating a **9:16 short**, the system might pick a **16:9 landscape** image → **cropped badly!** 😱

**After:**
```
channels/pray-matheus/
└── image-pool/
    ├── landscape/          ← Only 16:9 images
    │   └── prayer.jpg
    ├── portrait/           ← Only 9:16 images
    │   └── cross.jpg
    └── square/             ← Only 1:1 images
        └── bible.jpg
```

System automatically picks from the **correct folder** based on video aspect ratio! ✅

---

## 📁 Folder Structure

### Channel-Level Pools (Recommended)

```
channels/[channel-name]/
└── image-pool/
    ├── landscape/      ← For 16:9 YouTube videos
    ├── portrait/       ← For 9:16 TikTok/Shorts
    ├── instagram/      ← For 4:5 Instagram posts
    ├── square/         ← For 1:1 square posts
    └── universal/      ← Works for any aspect ratio (optional)
```

### Global Pools (Alternative)

```
image-pool/
├── youtube/        ← 16:9 landscape
├── tiktok/         ← 9:16 portrait
├── instagram/      ← 4:5 Instagram
├── square/         ← 1:1 square
└── universal/      ← Any aspect ratio
```

---

## 🎬 How It Works

### Automatic Selection

**When you generate a video:**

1. System reads aspect ratio from `config.json`
2. Looks for matching folder in channel pool
3. Uses images only from that folder
4. Falls back to universal/root if needed

**Example 1: Landscape Video**

```json
// config.json
{
  "aspectRatio": "16:9"
}
```

**Image pool lookup:**
1. ✅ `channels/pray-matheus/image-pool/landscape/` ← USED!
2. ⚪ `channels/pray-matheus/image-pool/universal/` (fallback)
3. ⚪ `channels/pray-matheus/image-pool/` (root fallback)
4. ⚪ `image-pool/youtube/` (global fallback)

**Example 2: Portrait Short**

```json
// config.json
{
  "aspectRatio": "9:16"
}
```

**Image pool lookup:**
1. ✅ `channels/pray-matheus/image-pool/portrait/` ← USED!
2. ⚪ `channels/pray-matheus/image-pool/universal/` (fallback)
3. ⚪ Global portrait pool (fallback)

---

## 🚀 Setup Guide

### Option 1: Organize by Aspect Ratio (Recommended)

**1. Create aspect-specific folders:**

```bash
cd channels/pray-matheus
mkdir -p image-pool/landscape image-pool/portrait
```

**2. Move images to correct folders:**

```bash
# Move landscape images (16:9)
mv image-pool/prayer-*.jpg image-pool/landscape/

# Move portrait images (9:16)
mv image-pool/short-*.jpg image-pool/portrait/
```

**3. Generate videos:**

```bash
npm start
```

System automatically picks from correct folder! ✅

---

### Option 2: Keep Universal (Backward Compatible)

**If you want same images for all formats:**

```bash
cd channels/pray-matheus
mkdir -p image-pool/universal
mv image-pool/*.jpg image-pool/universal/
```

System will use universal folder for all aspect ratios.

---

### Option 3: Mix and Match

```
channels/pray-matheus/
└── image-pool/
    ├── landscape/      ← Specific landscape images
    ├── portrait/       ← Specific portrait images
    └── universal/      ← Generic images (used when specific not found)
```

**Behavior:**
- **16:9 video**: Uses `landscape/` + `universal/` (if landscape is empty)
- **9:16 short**: Uses `portrait/` + `universal/` (if portrait is empty)

---

## 📋 Aspect Ratio → Folder Mapping

| Aspect Ratio | Video Config | Folder Name | Used For |
|--------------|--------------|-------------|----------|
| `16:9` | Landscape | `landscape` | YouTube, Facebook landscape |
| `9:16` | Portrait | `portrait` | TikTok, YouTube Shorts, Reels |
| `4:5` | Instagram | `instagram` | Instagram feed posts |
| `1:1` | Square | `square` | Square posts (any platform) |
| Any | Universal | `universal` | Fallback for all |

---

## 🎨 Example Channel Setup

### Prayer Channel with Both Formats

```
channels/pray-matheus/
├── channel.json
├── image-pool/
│   ├── landscape/                    ← 16:9 YouTube videos
│   │   ├── church-sunset.jpg
│   │   ├── bible-open.jpg
│   │   └── prayer-hands-wide.jpg
│   │
│   └── portrait/                     ← 9:16 Shorts
│       ├── cross-tall.jpg
│       ├── bible-vertical.jpg
│       └── prayer-hands-portrait.jpg
│
└── videos/
    ├── pray-001/                     ← Landscape video
    │   └── config.json               ← aspectRatio: "16:9"
    │
    └── pray-short-001/               ← Portrait short
        └── config.json               ← aspectRatio: "9:16"
```

**When generating:**
- `pray-001` (16:9) → Uses images from `landscape/` folder
- `pray-short-001` (9:16) → Uses images from `portrait/` folder

**No mixing!** ✅

---

## 🔄 Fallback Behavior

### Priority Order (Channel Pool)

1. **Aspect-specific folder** (e.g., `image-pool/landscape/`)
2. **Universal folder** (`image-pool/universal/`)
3. **Root pool folder** (`image-pool/` - backward compatible)
4. **Global pool** (if `fallbackToGlobalPool` not disabled)

### Example Fallback Chain (16:9 video)

```
1. channels/pray-matheus/image-pool/landscape/     ← Try first
2. channels/pray-matheus/image-pool/universal/     ← If (1) empty
3. channels/pray-matheus/image-pool/               ← If (2) empty (old format)
4. image-pool/youtube/                             ← Global fallback
```

---

## 💡 Migration from Old Structure

### If you have existing `image-pool/` with mixed images:

**Step 1: Identify image aspect ratios**

```bash
cd channels/pray-matheus/image-pool

# Check image dimensions
file *.jpg | grep -o '[0-9]\+ x [0-9]\+'
```

**Step 2: Create folders**

```bash
mkdir landscape portrait
```

**Step 3: Move images based on dimensions**

```bash
# Landscape images (width > height)
for img in *.jpg; do
  width=$(identify -format "%w" "$img")
  height=$(identify -format "%h" "$img")
  
  if [ $width -gt $height ]; then
    mv "$img" landscape/
  else
    mv "$img" portrait/
  fi
done
```

**Step 4: Verify**

```bash
ls landscape/  # Should have landscape images
ls portrait/   # Should have portrait images
```

**Step 5: Test**

```bash
npm start
```

---

## 🎯 Best Practices

### 1. Name Images Descriptively

```
✅ GOOD:
landscape/
  ├── church-sunrise-wide.jpg
  ├── prayer-hands-landscape.jpg
  └── bible-open-desk.jpg

portrait/
  ├── cross-tall-sunset.jpg
  ├── prayer-hands-vertical.jpg
  └── bible-standing-portrait.jpg
```

```
❌ BAD:
image-pool/
  ├── IMG_1234.jpg   ← What aspect ratio?
  ├── IMG_5678.jpg   ← Landscape or portrait?
  └── photo.jpg      ← ???
```

### 2. Keep Separate Libraries

**Don't force landscape images into portrait format!**

- Take/find images specifically for each format
- Landscape images cropped to portrait look bad
- Portrait images cropped to landscape look bad

### 3. Use Universal for Truly Universal Content

**Good for universal:**
- Close-ups
- Centered subjects
- Square compositions

**Not good for universal:**
- Wide panoramas (bad in portrait)
- Tall vertical shots (bad in landscape)

### 4. Consistent Image Counts

Try to have similar number of images in each folder:

```
landscape/  ← 20 images
portrait/   ← 20 images
```

Not:
```
landscape/  ← 50 images
portrait/   ← 2 images  ← Will repeat often!
```

---

## 🔍 Troubleshooting

### "No images found in pool"

**Check:**
1. Folder exists: `ls channels/[channel]/image-pool/landscape/`
2. Has images: Should see `.jpg`, `.png` files
3. Correct aspect ratio in config

**Fix:**
```bash
# Add images to correct folder
cp ~/Downloads/landscape-*.jpg channels/pray-matheus/image-pool/landscape/
```

### "Using wrong aspect ratio images"

**Cause:** Images in wrong folder

**Fix:**
```bash
# Move portrait image to correct folder
mv channels/pray-matheus/image-pool/landscape/tall-image.jpg \
   channels/pray-matheus/image-pool/portrait/
```

### "Falling back to global pool"

**Cause:** Channel pool empty for this aspect ratio

**Fix:**
```bash
# Add images to channel pool
mkdir -p channels/pray-matheus/image-pool/portrait
cp image-pool/tiktok/*.jpg channels/pray-matheus/image-pool/portrait/
```

---

## 📊 Example: Multi-Format Channel

### Channel that posts:
- YouTube videos (16:9)
- YouTube Shorts (9:16)
- Instagram posts (4:5)

**Setup:**

```
channels/multi-format/
└── image-pool/
    ├── landscape/        ← 50 landscape images (16:9)
    ├── portrait/         ← 50 portrait images (9:16)
    ├── instagram/        ← 30 Instagram images (4:5)
    └── universal/        ← 20 square/universal images
```

**Videos:**

```json
// videos/yt-001/config.json (YouTube video)
{
  "aspectRatio": "16:9"
}
→ Uses landscape/ images

// videos/short-001/config.json (Short)
{
  "aspectRatio": "9:16"
}
→ Uses portrait/ images

// videos/ig-001/config.json (Instagram)
{
  "aspectRatio": "4:5"
}
→ Uses instagram/ images
```

**Result:** Each format gets perfect images! ✅

---

## 🎯 Configuration Options

### Disable Global Pool Fallback

If you want **only** channel pool (no global fallback):

```json
// channel.json
{
  "fallbackToGlobalPool": false
}
```

Now if channel pool is empty → error (prevents mixing)

### Force Global Pool

```json
// video config.json
{
  "useSharedPool": true
}
```

Uses global pool instead of channel pool.

---

## ✅ Summary

**Feature:** Aspect ratio-specific image pools  
**Benefit:** Never mix landscape/portrait images  
**Setup:** Create subfolders in `image-pool/`  
**Compatibility:** Backward compatible (old structure still works)

**Folder structure:**
```
channels/[channel]/image-pool/
├── landscape/      ← 16:9
├── portrait/       ← 9:16
├── instagram/      ← 4:5
├── square/         ← 1:1
└── universal/      ← Any (fallback)
```

**Automatic:** System picks correct folder based on aspect ratio! 🎉

---

## 🚀 Quick Start

```bash
# 1. Create folders
mkdir -p channels/pray-matheus/image-pool/{landscape,portrait}

# 2. Add images
cp ~/landscape-images/*.jpg channels/pray-matheus/image-pool/landscape/
cp ~/portrait-images/*.jpg channels/pray-matheus/image-pool/portrait/

# 3. Generate videos
npm start
```

**Done! System automatically uses correct images!** ✨
