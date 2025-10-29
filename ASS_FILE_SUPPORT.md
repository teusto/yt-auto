# ASS File Support Added ✅

## 🎯 **Feature Overview**

The system now supports **direct use of ASS subtitle files** without requiring SRT conversion.

---

## 📝 **What Changed**

### **Before:**
- ❌ Only accepted `.srt` files
- ❌ Always converted SRT to ASS for center positioning
- ❌ If you had a pre-made ASS file, it was ignored

### **After:**
- ✅ Accepts both `.srt` and `.ass` files
- ✅ Uses `.ass` files directly (no conversion needed)
- ✅ Prefers `.ass` over `.srt` if both exist
- ✅ Still converts SRT to ASS for center positioning (backward compatible)

---

## 🚀 **Usage**

### **Option 1: Use Pre-Made ASS File**

```bash
# Your project folder:
your-project/
├── images/
├── voice.mp3
└── subtitles.ass  ← Already has perfect styling! ✅
```

**Result:**
```bash
📝 Adding subtitles...
   ✅ Using provided ASS file directly
```

**Benefits:**
- ✅ No conversion needed
- ✅ Uses your exact styling
- ✅ Full control over fonts, colors, positioning
- ✅ Supports advanced ASS features (animations, karaoke, etc.)

---

### **Option 2: Use SRT (Auto-Convert)**

```bash
# Your project folder:
your-project/
├── images/
├── voice.mp3
└── subtitles.srt  ← Simple text format
```

**Result:**
```bash
📝 Adding subtitles...
   🎯 Converting SRT to ASS for center positioning...
   ✅ Converted SRT to ASS: subtitles.ass
```

**Benefits:**
- ✅ Simple format, easy to create
- ✅ Auto-converts to ASS for better positioning
- ✅ Style applied from your settings

---

### **File Priority**

If both files exist, ASS is preferred:

```bash
your-project/
├── subtitles.ass  ← USED (priority)
└── subtitles.srt  ← Ignored
```

---

## 📊 **Supported Files**

| File | Format | Usage |
|------|--------|-------|
| `subtitles.ass` | ASS | ✅ **Used directly** |
| `subtitles.srt` | SRT | ✅ Converted to ASS |
| `subtitles_target.ass` | ASS | ✅ **Dual language mode** |
| `subtitles_target.srt` | SRT | ✅ Converted to ASS |
| `subtitles_native.ass` | ASS | ✅ **Dual language mode** |
| `subtitles_native.srt` | SRT | ✅ Converted to ASS |

---

## 🎨 **When to Use ASS Files**

### **Use ASS When:**
1. ✅ You need **advanced styling** (multiple colors, effects)
2. ✅ You want **pixel-perfect positioning**
3. ✅ You need **animations** (fade, move, karaoke)
4. ✅ You have **multiple font styles** in one video
5. ✅ You're using **subtitle editing software** (Aegisub, Subtitle Edit)

### **Use SRT When:**
1. ✅ You want **simple, quick subtitles**
2. ✅ You're using **auto-generated** subtitles
3. ✅ You want the system to **apply styling** automatically
4. ✅ You don't need advanced features

---

## 🧪 **Examples**

### **Example 1: Pre-Made ASS File**

**Your ASS file** (`subtitles.ass`):
```ass
[Script Info]
Title: My Custom Subtitles
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, ...
Style: Default,Arial,48,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,5,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Hello World
```

**Processing:**
```bash
npm start
# Or batch mode

Console output:
📝 Adding subtitles...
   ✅ Using provided ASS file directly

Result:
✅ Your exact ASS file is used as-is
✅ No conversion, no modification
✅ Perfect for advanced users!
```

---

### **Example 2: Simple SRT File**

**Your SRT file** (`subtitles.srt`):
```srt
1
00:00:01,000 --> 00:00:03,000
Hello World

2
00:00:03,500 --> 00:00:05,000
Welcome to my video
```

**Processing (center position):**
```bash
npm start
# Select subtitle position: Center

Console output:
📝 Adding subtitles...
   🎯 Converting SRT to ASS for center positioning...
   📄 Reading SRT file: subtitles.srt
   📊 Found 2 subtitle blocks
   ✅ Parsed 2 valid subtitles
   💾 Writing 2 subtitles to ASS file...
   ✅ Converted SRT to ASS: input/subtitles.ass
   📐 Resolution: 1920x1080, Alignment: 5
   🔤 Font: Arial, Size: 48px, Outline: 2px

Result:
✅ SRT converted to ASS automatically
✅ Center positioning applied
✅ Your style settings applied
```

---

### **Example 3: Batch Mode with ASS Files**

**Folder structure:**
```
batch-videos/
├── video-001/
│   ├── images/
│   ├── voice.mp3
│   └── subtitles.ass  ← Custom styled
├── video-002/
│   ├── images/
│   ├── voice.mp3
│   └── subtitles.srt  ← Simple text
└── video-003/
    ├── images/
    ├── voice.mp3
    └── subtitles.ass  ← Custom styled
```

**Processing:**
```bash
npm start
# Select: 2. Batch Processing Mode

Console output:
🔍 Scanning batch folder...

✅ video-001
   Voice: voice.mp3
   Subtitles: subtitles.ass  ← ASS detected!
   Media: 5 images

✅ video-002
   Voice: voice.mp3
   Subtitles: subtitles.srt  ← SRT detected!
   Media: 8 images

✅ video-003
   Voice: voice.mp3
   Subtitles: subtitles.ass  ← ASS detected!
   Media: 3 images

...

[1/3] video-001:
📝 Adding subtitles...
   ✅ Using provided ASS file directly  ← Direct use!

[2/3] video-002:
📝 Adding subtitles...
   🎯 Converting SRT to ASS...  ← Auto-convert!

[3/3] video-003:
📝 Adding subtitles...
   ✅ Using provided ASS file directly  ← Direct use!
```

---

## 💡 **Pro Tips**

### **1. Creating ASS Files**

**Recommended Tools:**
- **Aegisub** - Full-featured subtitle editor
- **Subtitle Edit** - Simple and powerful
- **Online converters** - Quick SRT to ASS conversion

### **2. Testing ASS Files**

```bash
# View your ASS file:
cat subtitles.ass

# Check format:
head -20 subtitles.ass

# Should see:
# [Script Info]
# [V4+ Styles]
# [Events]
```

### **3. Migrating from SRT to ASS**

```bash
# Let the system convert once:
npm start
# (Select center position)

# Then copy the generated ASS file:
cp input/subtitles.ass batch-videos/my-project/subtitles.ass

# Edit it in Aegisub for custom styling

# Next time it will use your ASS directly!
```

---

## 🔧 **Technical Details**

### **Detection Order:**

```javascript
// 1. Check for ASS file first
const subtitlePathASS = 'input/subtitles.ass';
const subtitlePathSRT = 'input/subtitles.srt';

// 2. Prefer ASS if exists
const subtitlePath = fs.existsSync(subtitlePathASS) 
  ? subtitlePathASS 
  : subtitlePathSRT;

// 3. Use it
if (path.extname(subtitlePath) === '.ass') {
  // Direct use
  videoFilters.push(`ass=${subtitlePath}`);
} else {
  // Convert SRT to ASS if needed
  const assPath = convertSRTtoASS(subtitlePath, style);
  videoFilters.push(`ass=${assPath}`);
}
```

### **File Processing:**

```javascript
// Batch mode detection:
const subtitleFile = 
  findFileByPattern(projectPath, /^subtitles\.ass$/i) ||  // Try ASS first
  findFileByPattern(projectPath, /^subtitles\.srt$/i);    // Fallback to SRT

// Copy with original extension:
if (project.subtitles) {
  const ext = path.extname(project.subtitles);  // .ass or .srt
  fs.copyFileSync(project.subtitles, `input/subtitles${ext}`);
}
```

---

## 📊 **Comparison**

| Feature | SRT (Auto-Convert) | **ASS (Direct)** |
|---------|-------------------|------------------|
| **Ease of Use** | ✅ Very easy | ⚠️ Requires knowledge |
| **Style Control** | ⚠️ Limited | ✅ **Complete** |
| **Positioning** | ⚠️ Basic | ✅ **Pixel-perfect** |
| **Animations** | ❌ None | ✅ **Advanced** |
| **Multiple Fonts** | ❌ Single font | ✅ **Per-line fonts** |
| **Colors** | ⚠️ Single color | ✅ **Per-word colors** |
| **Processing Speed** | ⚠️ Needs conversion | ✅ **Direct use** |
| **File Size** | ✅ Smaller | ⚠️ Larger |

---

## ✅ **Summary**

### **What You Get:**

1. ✅ **Flexibility** - Use SRT or ASS, whatever you prefer
2. ✅ **Performance** - ASS files used directly (no conversion)
3. ✅ **Advanced Features** - Full ASS support for power users
4. ✅ **Simplicity** - SRT still works perfectly for basic use
5. ✅ **Batch Support** - Both formats work in batch mode
6. ✅ **Dual Language** - Both SRT and ASS for target/native

### **Use Cases:**

**For Quick Videos:**
- ✅ Use SRT, let system handle styling

**For Professional Videos:**
- ✅ Use ASS with custom styling

**For Batch Production:**
- ✅ Mix both: ASS where needed, SRT elsewhere

---

**ASS file support is now live! Create advanced subtitles with full control! 🎨✨**
