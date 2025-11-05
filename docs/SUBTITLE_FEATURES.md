# 🎨 Subtitle Features Guide

**New subtitle customization features for YT-Machine**

This guide covers the new subtitle features added to YT-Machine, including custom fonts and the new white-on-black subtitle style.

---

## 🆕 New Subtitle Style: White on Black

A new professional subtitle style featuring white text on a black background box.

### **Style Name:** `white-on-black`

**Perfect for:**
- News and documentary style videos
- Educational content
- Professional presentations
- Maximum readability

### **Characteristics:**
- ✅ White bold text
- ✅ Black background box (80% opacity)
- ✅ No outline (clean look)
- ✅ Slight line spacing for readability
- ✅ 48px font size (default)

### **How to Use:**

**In config.json:**
```json
{
  "subtitle": {
    "style": "white-on-black",
    "position": "bottom"
  }
}
```

**In channel.json:**
```json
{
  "defaults": {
    "subtitle": {
      "style": "white-on-black",
      "position": "center",
      "fontSize": 52
    }
  }
}
```

---

## 🔤 Custom Fonts Feature

You can now use custom fonts for your subtitles! Fonts can be placed in either:
1. **Channel fonts folder** (priority) - `channels/YOUR-CHANNEL/fonts/`
2. **Global fonts folder** (fallback) - `fonts/`

### **How It Works**

1. YT-Machine first looks in your channel's `fonts/` folder
2. If not found, it checks the global `fonts/` folder
3. If still not found, it uses the default Arial font

This allows each channel to have its own unique font!

---

## 📁 Setup: Channel-Specific Fonts

### Step 1: Create Fonts Folder

```
channels/
└── my-channel/
    ├── channel.json
    ├── fonts/              ← Create this folder
    │   ├── MyFont.ttf
    │   └── AnotherFont.otf
    └── videos/
```

### Step 2: Add Your Font Files

**Supported formats:**
- `.ttf` (TrueType Font)
- `.otf` (OpenType Font)

**Where to get fonts:**
- Google Fonts (https://fonts.google.com/)
- Font Squirrel (https://www.fontsquirrel.com/)
- DaFont (https://www.dafont.com/)
- Adobe Fonts (if you have subscription)

**⚠️ Important:** Make sure fonts are licensed for your use!

### Step 3: Configure in channel.json

```json
{
  "name": "My Channel",
  "defaults": {
    "subtitle": {
      "style": "white-on-black",
      "fontName": "MyFont",
      "fontSize": 52,
      "position": "center"
    }
  }
}
```

**Note:** Use the font filename without extension for `fontName`.

---

## 📝 Examples

### Example 1: News Channel with Custom Font

**Structure:**
```
channels/news-channel/
├── channel.json
├── fonts/
│   └── RobotoCondensed-Bold.ttf
└── videos/
    └── breaking-news/
        └── voice.mp3
```

**channel.json:**
```json
{
  "name": "News Channel",
  "defaults": {
    "aspectRatio": "16:9",
    "subtitle": {
      "style": "white-on-black",
      "fontName": "RobotoCondensed-Bold",
      "fontSize": 56,
      "position": "bottom"
    }
  }
}
```

**Result:** Professional news-style subtitles with custom font!

---

### Example 2: Tech Reviews with Modern Font

**Structure:**
```
channels/tech-reviews/
├── channel.json
├── fonts/
│   └── Montserrat-Bold.ttf
└── videos/
```

**channel.json:**
```json
{
  "name": "Tech Reviews",
  "defaults": {
    "aspectRatio": "16:9",
    "subtitle": {
      "style": "shadow",
      "fontName": "Montserrat-Bold",
      "fontSize": 60,
      "position": "bottom"
    }
  }
}
```

---

### Example 3: Educational Content

**Structure:**
```
channels/lessons/
├── channel.json
├── fonts/
│   └── OpenSans-Regular.ttf
└── videos/
```

**channel.json:**
```json
{
  "name": "Educational Lessons",
  "defaults": {
    "aspectRatio": "16:9",
    "subtitle": {
      "style": "white-on-black",
      "fontName": "OpenSans-Regular",
      "fontSize": 48,
      "position": "center"
    }
  }
}
```

---

### Example 4: Per-Video Font Override

You can also set fonts per video:

**video/config.json:**
```json
{
  "subtitle": {
    "style": "white-on-black",
    "fontName": "SpecialFont",
    "fontSize": 64
  }
}
```

This overrides the channel default for this specific video.

---

## 🎨 All Available Subtitle Styles

| Style | Description | Best For |
|-------|-------------|----------|
| `classic` | White text, simple | General use |
| `bold` | Large white bold text | Emphasis |
| `yellow` | YouTube-style yellow | Popular choice |
| `minimal` | Small, clean white text | Subtle look |
| `modern` | Bold white with outline | Trendy videos |
| `cinematic` | White text on dark background | Professional |
| `shadow` | White text with drop shadow | Modern look |
| `white-on-black` | **NEW!** White text on black box | News/Education |

---

## 🔧 Font Configuration Options

### Basic Font Setup

```json
{
  "subtitle": {
    "fontName": "MyFont"
  }
}
```

### Full Customization

```json
{
  "subtitle": {
    "style": "white-on-black",
    "fontName": "CustomFont",
    "fontSize": 52,
    "position": "bottom",
    "bold": true
  }
}
```

### Available Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `style` | string | Subtitle style preset | `"white-on-black"` |
| `fontName` | string | Font file name (no extension) | `"Montserrat-Bold"` |
| `fontSize` | number | Font size in pixels | `52` |
| `position` | string | Subtitle position | `"bottom"`, `"center"`, `"top"` |
| `bold` | boolean | Bold text (overrides style) | `true` |
| `fontColor` | string | Text color | `"white"`, `"yellow"` |

---

## 🎯 Best Practices

### Font Selection

✅ **DO:**
- Use bold or semi-bold fonts for better readability
- Test fonts at your target resolution
- Choose fonts that match your brand
- Use web-safe fonts for consistency

❌ **DON'T:**
- Use overly decorative fonts (hard to read)
- Use very thin fonts (invisible on mobile)
- Mix too many different fonts
- Use copyrighted fonts without license

### Font Files

✅ **DO:**
- Keep font files under 1MB each
- Use TrueType (.ttf) or OpenType (.otf)
- Name fonts descriptively
- Store channel-specific fonts in channel folder

❌ **DON'T:**
- Use variable fonts (not all are supported)
- Have spaces in font filenames
- Use special characters in names
- Forget to check font licenses

---

## 🐛 Troubleshooting

### Font Not Loading

**Problem:** Font specified but default Arial is used

**Solutions:**
1. Check font filename matches exactly (no extension in config)
2. Verify font file is `.ttf` or `.otf`
3. Check file is in `channels/YOUR-CHANNEL/fonts/` or `fonts/`
4. Look for console message about font loading

**Example error:**
```
⚠️  Font 'MyFont' not found in channel or global fonts, using default
```

### Font Looks Wrong

**Problem:** Font displays incorrectly or looks pixelated

**Solutions:**
1. Try a different font size
2. Use bold version of font
3. Check font file is not corrupted
4. Test with a different font to isolate issue

### White-on-Black Style Issues

**Problem:** Black box too large/small or not visible

**Solutions:**
1. Adjust `fontSize` to change box size
2. Check `lineSpacing` property
3. Verify video format (some formats may not support)
4. Try `cinematic` style as alternative

---

## 📦 Font Resources

### Free Font Sources

**Google Fonts** (https://fonts.google.com/)
- Thousands of free fonts
- All open source
- Easy to download

**Font Squirrel** (https://www.fontsquirrel.com/)
- Curated free fonts
- Commercial-use filter
- High quality

**DaFont** (https://www.dafont.com/)
- Huge variety
- Check license per font
- Good for decorative fonts

### Recommended Fonts

**For News/Professional:**
- Roboto Condensed Bold
- Open Sans Bold
- Lato Bold
- Source Sans Pro Bold

**For Tech/Modern:**
- Montserrat Bold
- Raleway Bold
- Poppins Bold
- Inter Bold

**For Educational:**
- Open Sans Regular
- Noto Sans Regular
- Lato Regular
- Roboto Regular

**For Creative/Fun:**
- Bebas Neue
- Oswald Bold
- Anton Regular
- Righteous Regular

---

## 🎬 Complete Example Setup

Here's a complete example for a professional channel:

```
channels/professional-channel/
├── channel.json
├── fonts/
│   ├── Montserrat-Bold.ttf        ← Main subtitle font
│   └── OpenSans-Regular.ttf       ← Backup font
├── image-pool/
│   └── portrait/
│       ├── bg1.jpg
│       └── bg2.jpg
├── music-pool/
│   └── corporate.mp3
└── videos/
    ├── video-001/
    │   └── voice.mp3
    └── video-002/
        ├── voice.mp3
        └── config.json           ← Override for special font
```

**channel.json:**
```json
{
  "name": "Professional Channel",
  "description": "Corporate training videos",
  "defaults": {
    "aspectRatio": "16:9",
    "animation": "zoom-in",
    "qualityMode": "high",
    "subtitle": {
      "style": "white-on-black",
      "fontName": "Montserrat-Bold",
      "fontSize": 56,
      "position": "bottom"
    },
    "audio": {
      "voiceVolume": 100,
      "musicVolume": 25
    },
    "randomImages": true,
    "randomMusic": true
  }
}
```

**video-002/config.json** (special video with different font):
```json
{
  "subtitle": {
    "fontName": "OpenSans-Regular",
    "fontSize": 48
  }
}
```

---

## 📊 Feature Summary

### ✅ What's New

1. **White-on-Black Style**
   - Professional news/education look
   - Maximum readability
   - Black background box

2. **Channel-Specific Fonts**
   - Put fonts in `channels/YOUR-CHANNEL/fonts/`
   - Each channel can have unique fonts
   - Automatic fallback to global fonts

3. **Priority System**
   - Channel fonts checked first
   - Then global fonts folder
   - Finally default Arial

### 🎯 Benefits

- **Brand Consistency:** Each channel has its own font
- **Easy Management:** Fonts organized per channel
- **Flexibility:** Override per video if needed
- **Professional:** New white-on-black style
- **User-Friendly:** Simple config setup

---

## 🚀 Next Steps

1. **Try the new style:**
   - Add `"style": "white-on-black"` to your config
   - Generate a test video

2. **Add custom fonts:**
   - Download a font you like
   - Create `channels/YOUR-CHANNEL/fonts/` folder
   - Add font file
   - Update `fontName` in config

3. **Experiment:**
   - Try different combinations
   - Test various font sizes
   - Compare with other styles

---

## 💡 Pro Tips

1. **Font Size Guide:**
   - 9:16 (vertical): 40-52px
   - 16:9 (horizontal): 52-64px
   - 1:1 (square): 44-56px

2. **Style Combinations:**
   - White-on-black + bold font = News style
   - Shadow + custom font = Modern vlog
   - Cinematic + serif font = Documentary

3. **Performance:**
   - Keep font files under 500KB for faster loading
   - Use `.ttf` format for best compatibility

---

**Ready to customize your subtitles!** 🎨✨

Questions? Check the [Config Guide](CONFIG_GUIDE.md) or [FAQ](FAQ.md)!
