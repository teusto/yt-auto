# Font Selection Guide 🔤

## 📝 Overview

Choose from custom fonts for your subtitle styling! Place font files in the `fonts/` folder and select them during video generation.

---

## ✅ Quick Start

### **1. Add Fonts**

```bash
# Download fonts (e.g., from Google Fonts)
# Copy .ttf files to fonts folder

cp ~/Downloads/Roboto*.ttf fonts/
```

### **2. Run Generator**

```bash
$ npm start

🔤 Select Font:
  1. Montserrat Regular
  2. Open Sans Bold
  3. Roboto Bold
  4. Roboto Regular
  5. Default (Arial - system font)

Enter your choice (1-5): 3
✅ Font selected: Roboto Bold
```

### **3. Font Applied**

Your subtitles will use the selected font!

---

## 📦 Supported Font Formats

```
✅ .ttf  - TrueType Font (BEST - use this)
✅ .otf  - OpenType Font
⚠️  .woff - Web Font (may need conversion)
⚠️  .woff2 - Web Font 2 (may need conversion)
```

**Recommendation:** Use `.ttf` files for best compatibility.

---

## 🎨 Where to Get Fonts

### **Google Fonts** (Recommended)
```
Website: https://fonts.google.com/
License: Free for commercial use
Quality: Excellent
Selection: 1000+ fonts
```

**How to Download:**
1. Visit https://fonts.google.com/
2. Search for font (e.g., "Roboto")
3. Click font name
4. Click "Download family" (top right)
5. Extract .zip file
6. Copy .ttf files to `fonts/` folder

### **Other Free Sources:**

**Font Squirrel**
- https://www.fontsquirrel.com/
- All fonts licensed for commercial use
- High quality selection

**DaFont**
- https://www.dafont.com/
- Huge selection
- ⚠️ Check individual licenses!

**Adobe Fonts** (Creative Cloud)
- https://fonts.adobe.com/
- Requires Adobe CC subscription
- Professional quality

---

## 🎯 Recommended Fonts for Subtitles

### **Most Readable (Language Learning)**

**1. Roboto** ⭐⭐⭐⭐⭐
```
Style: Modern, geometric
Readability: Excellent
Languages: Wide support
Use: General purpose, perfect for subtitles
Download: https://fonts.google.com/specimen/Roboto
```

**2. Open Sans** ⭐⭐⭐⭐⭐
```
Style: Neutral, humanist
Readability: Excellent
Languages: Wide support
Use: Clean, professional look
Download: https://fonts.google.com/specimen/Open+Sans
```

**3. Noto Sans** ⭐⭐⭐⭐⭐
```
Style: Universal
Readability: Excellent
Languages: 800+ languages!
Use: Multilingual content (Portuguese, Spanish, etc.)
Download: https://fonts.google.com/noto/specimen/Noto+Sans
```

### **Friendly & Engaging**

**4. Montserrat** ⭐⭐⭐⭐
```
Style: Geometric, urban
Readability: Very good
Use: Modern, friendly educational content
Download: https://fonts.google.com/specimen/Montserrat
```

**5. Nunito** ⭐⭐⭐⭐
```
Style: Rounded, warm
Readability: Very good
Use: Casual learning, children's content
Download: https://fonts.google.com/specimen/Nunito
```

### **Professional**

**6. Source Sans Pro** ⭐⭐⭐⭐⭐
```
Style: Clean, technical
Readability: Excellent
Use: Professional educational content
Download: https://fonts.google.com/specimen/Source+Sans+Pro
```

**7. Lato** ⭐⭐⭐⭐
```
Style: Elegant, modern
Readability: Very good
Use: Business, professional videos
Download: https://fonts.google.com/specimen/Lato
```

---

## 🌍 Fonts for Language Learning

### **Best for Portuguese:**

**Noto Sans** - Supports all Portuguese characters:
- ã, á, â, à
- é, ê
- í
- ó, ô, õ
- ú
- ç

**Roboto** - Excellent Portuguese support
**Open Sans** - Great for Portuguese text

### **Best for Spanish:**

**Roboto** - Full Spanish support:
- ñ, á, é, í, ó, ú, ü

**Montserrat** - Great for Spanish
**Nunito** - Friendly Spanish look

### **Best for Multilingual:**

**Noto Sans** - 800+ languages:
- European languages
- Asian scripts
- Arabic, Hebrew
- Cyrillic
- And more!

---

## 📁 Font Organization

### **Simple Setup (Recommended):**

```
fonts/
  ├── Roboto-Regular.ttf
  ├── Roboto-Bold.ttf
  └── OpenSans-Regular.ttf
```

### **Organized by Family:**

```
fonts/
  ├── Roboto-Regular.ttf
  ├── Roboto-Bold.ttf
  ├── Roboto-Italic.ttf
  ├── Montserrat-Regular.ttf
  ├── Montserrat-Bold.ttf
  ├── OpenSans-Regular.ttf
  └── OpenSans-Bold.ttf
```

### **Professional Library:**

```
fonts/
  ├── Roboto-Regular.ttf
  ├── Roboto-Bold.ttf
  ├── Roboto-Italic.ttf
  ├── Montserrat-Regular.ttf
  ├── Montserrat-SemiBold.ttf
  ├── Montserrat-Bold.ttf
  ├── OpenSans-Regular.ttf
  ├── OpenSans-Bold.ttf
  ├── Nunito-Regular.ttf
  ├── Lato-Regular.ttf
  └── SourceSansPro-Regular.ttf
```

---

## 🔤 Font Display Names

The tool automatically formats font filenames for display:

```
File Name                → Display Name
────────────────────────────────────────────
Roboto-Regular.ttf       → Roboto Regular
Roboto-Bold.ttf          → Roboto Bold
OpenSans-SemiBold.ttf    → Open Sans Semi Bold
Montserrat-ExtraBold.ttf → Montserrat Extra Bold
MyCustomFont.ttf         → My Custom Font
```

**Naming Tips:**
- Use hyphens or underscores between words
- Include weight (Regular, Bold, etc.) in filename
- Avoid spaces in filenames

---

## 🎬 Font Selection Workflow

### **Complete Workflow:**

```bash
$ npm start

# 1. Scans fonts folder
📂 Scanning input folder...
✅ Found 3 images + 2 videos

# 2. Font selection (if subtitles exist)
🔤 Select Font:
  1. Montserrat Bold
  2. Roboto Regular
  3. Roboto Bold
  4. Default (Arial - system font)

Enter your choice (1-4): 3
✅ Font selected: Roboto Bold

# 3. Subtitle style selection
📝 Subtitle Style:
  Choose a preset:
  1. Classic (White text, black outline, bottom)
  2. Bold (Large white text, thick outline, bottom)
  ...

Enter your choice (1-6): 2
✅ Bold style selected

# 4. Video generated with custom font!
```

### **No Custom Fonts:**

```bash
$ npm start

ℹ️  No custom fonts found in fonts/ folder
   Using default font: Arial

📝 Subtitle Style:
  ...
```

---

## 💡 Font Selection Tips

### **For Readability:**

```
✅ Choose sans-serif fonts (cleaner on video)
✅ Use Regular or Medium weight
✅ Test at subtitle size (20-32px)
❌ Avoid decorative fonts
❌ Avoid thin fonts (hard to read)
```

### **For Emphasis:**

```
✅ Use Bold weight for important text
✅ Combine Regular + Bold from same family
```

### **For Dual Subtitles:**

```
Target Language (top): Roboto Bold (28px)
Native Language (bottom): Roboto Regular (20px)

Same family = cohesive look!
```

---

## 🎨 Use Cases

### **Use Case 1: Professional Learning**

**Font:** Source Sans Pro Regular
**Style:** Classic
**Perfect for:** Business Portuguese, formal lessons

```
fonts/
  └── SourceSansPro-Regular.ttf
```

### **Use Case 2: Casual Stories**

**Font:** Nunito Regular
**Style:** Bold
**Perfect for:** Children's stories, casual narratives

```
fonts/
  └── Nunito-Regular.ttf
```

### **Use Case 3: Modern Educational**

**Font:** Montserrat Bold
**Style:** Bold
**Perfect for:** YouTube tutorials, modern content

```
fonts/
  └── Montserrat-Bold.ttf
```

### **Use Case 4: Dual Language Emphasis**

**Fonts:** Roboto Regular + Bold
**Style:** Custom (dual mode)
**Perfect for:** Language learning with emphasis

```
fonts/
  ├── Roboto-Regular.ttf  (for native language)
  └── Roboto-Bold.ttf     (for target language)
```

---

## 🔧 Technical Details

### **How It Works:**

1. **Scan:** Tool scans `fonts/` folder for `.ttf/.otf` files
2. **List:** Displays available fonts with formatted names
3. **Select:** User chooses font or default
4. **Apply:** FFmpeg uses selected font via `fontsdir` parameter

### **FFmpeg Implementation:**

```bash
# Without custom font
ffmpeg ... -vf "subtitles=subs.srt:force_style='FontName=Arial,...'"

# With custom font
ffmpeg ... -vf "subtitles=subs.srt:force_style='FontName=Roboto Bold,...':fontsdir='/path/to/fonts'"
```

The `fontsdir` parameter tells FFmpeg where to find font files!

---

## ⚠️ Important Notes

### **Font Licensing:**

```
✅ Google Fonts - Free for commercial use
✅ Font Squirrel - Pre-filtered for commercial use
⚠️  DaFont - Check individual licenses
⚠️  Downloaded fonts - Always verify license
```

**Check licenses before commercial use!**

### **Font Installation:**

```
✅ NO installation needed!
✅ Just copy to fonts/ folder
✅ Tool handles everything
```

### **Performance:**

```
✅ No performance impact
✅ Font files are small (50-500 KB)
✅ No processing overhead
```

### **Compatibility:**

```
✅ Works with all subtitle modes:
   - Standard subtitles
   - Dual language
   - Custom styles
```

---

## 🐛 Troubleshooting

### **Problem: Font not appearing**

**Check:**
1. Font file in `fonts/` folder?
2. File extension is `.ttf` or `.otf`?
3. Font selected during prompt?

**Solution:**
```bash
# List fonts folder
ls -la fonts/

# Should see .ttf files
```

### **Problem: Special characters not showing**

**Cause:** Font doesn't support your language

**Solution:**
- Use Noto Sans (800+ languages)
- Use Roboto (wide support)
- Check font supports your characters

### **Problem: Font looks wrong**

**Cause:** Wrong font file selected or corrupted

**Solution:**
- Re-download font from source
- Try different font
- Use default Arial

### **Problem: No fonts listed**

**Cause:** `fonts/` folder empty or doesn't exist

**Solution:**
```bash
# Create folder
mkdir -p fonts

# Add fonts
cp ~/Downloads/*.ttf fonts/

# Verify
ls fonts/
```

---

## 📚 Font Starter Pack

### **Download These 3 Fonts (Free):**

**1. Roboto** (Most versatile)
- Download: https://fonts.google.com/specimen/Roboto
- Get: Regular + Bold
- Use: Everything

**2. Montserrat** (Modern look)
- Download: https://fonts.google.com/specimen/Montserrat
- Get: Regular + Bold
- Use: YouTube, social media

**3. Noto Sans** (Multilingual)
- Download: https://fonts.google.com/noto/specimen/Noto+Sans
- Get: Regular
- Use: International content

**Total download size:** ~1-2 MB
**Setup time:** 2 minutes
**Coverage:** 99% of use cases!

---

## 🎯 Quick Reference

### **Installation:**

```bash
# 1. Create fonts folder (done automatically)
# 2. Download font from Google Fonts
# 3. Extract .zip file
# 4. Copy .ttf files
cp ~/Downloads/Roboto/*.ttf fonts/

# 5. Run generator
npm start

# 6. Select font when prompted
```

### **Best Practices:**

```
✅ Use .ttf format
✅ Keep 3-5 fonts maximum
✅ Name files clearly (Roboto-Bold.ttf)
✅ Test with your language
✅ Choose readable fonts
```

### **Font Selection Priority:**

```
1. Readability first
2. Language support second
3. Style third
```

---

## 🌟 Example Projects

### **Example 1: Portuguese Stories**

```
fonts/
  ├── Roboto-Bold.ttf     (target language)
  └── Roboto-Regular.ttf  (native language)

Selection: Roboto Bold
Style: Bold
Subtitles: Dual (Portuguese + English)

Result: Clean, professional language learning video!
```

### **Example 2: YouTube Tutorial**

```
fonts/
  └── Montserrat-Bold.ttf

Selection: Montserrat Bold
Style: Yellow (YouTube style)
Subtitles: Standard

Result: Modern, engaging tutorial!
```

### **Example 3: Children's Content**

```
fonts/
  └── Nunito-Regular.ttf

Selection: Nunito Regular
Style: Bold
Subtitles: Large, colorful

Result: Friendly, approachable content!
```

---

## 🔗 Related Guides

- [Subtitle Styling Guide](SUBTITLE_STYLING_GUIDE.md) - Style presets
- [Language Learning Guide](LANGUAGE_LEARNING_GUIDE.md) - Dual subtitles
- [README](README.md) - Main documentation

---

## 🚀 Get Started

```bash
# 1. Download Roboto from Google Fonts
# 2. Copy to fonts folder
# 3. Run npm start
# 4. Select Roboto when prompted
# 5. Enjoy beautiful subtitles! 🔤✨
```

**That's it! Custom fonts in 5 minutes!**
