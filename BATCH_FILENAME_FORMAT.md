# 📝 Batch Output Filename Format

**Updated filename format for batch-processed videos**

---

## 🎯 New Format

All videos generated via batch processing (channel mode) now follow this naming convention:

```
[language_code]_[social_media]_[folder_name]_[datetime].mp4
```

---

## 📋 Format Breakdown

### 1. **Language Code**
- Extracted from video config or channel config
- Defaults to `en` if not specified
- Lowercase format

**Examples:**
- `en` - English
- `pt` - Portuguese
- `de` - German
- `es` - Spanish
- `fr` - French

**Configuration:**
```json
{
  "language": "pt"
}
```

---

### 2. **Social Media Platform**
- Automatically determined from aspect ratio
- Helps you quickly identify video format

**Mapping:**

| Aspect Ratio | Platform | Name |
|--------------|----------|------|
| 9:16 | `tiktok` | TikTok/Shorts/Reels |
| 16:9 | `youtube` | YouTube horizontal |
| 1:1 | `instagram` | Instagram square |
| 4:5 | `instagram` | Instagram portrait |

**Configuration:**
```json
{
  "aspectRatio": "9:16"
}
```

---

### 3. **Folder Name**
- The name of your video folder
- Special characters replaced with underscores
- Sanitized for safe filenames

**Examples:**
- Folder: `my-awesome-video` → `my-awesome-video`
- Folder: `Video #1 (Draft)` → `Video__1__Draft_`
- Folder: `Breaking News!` → `Breaking_News_`

---

### 4. **DateTime**
- Format: `YYYYMMDD_HHMMSS`
- Timestamp when video was generated
- Ensures unique filenames

**Example:**
- `20251105_162345` = Nov 5, 2025 at 4:23:45 PM

---

## 📌 Complete Examples

### Example 1: German TikTok Video

**Folder:** `Gottes_Gebet`  
**Config:**
```json
{
  "language": "de",
  "aspectRatio": "9:16"
}
```

**Generated filename:**
```
de_tiktok_Gottes_Gebet_20251105_162345.mp4
```

---

### Example 2: English YouTube Video

**Folder:** `Product Review - iPhone 15`  
**Config:**
```json
{
  "language": "en",
  "aspectRatio": "16:9"
}
```

**Generated filename:**
```
en_youtube_Product_Review_-_iPhone_15_20251105_143022.mp4
```

---

### Example 3: Portuguese Instagram Story

**Folder:** `motivational-quote-01`  
**Config:**
```json
{
  "language": "pt",
  "aspectRatio": "9:16"
}
```

**Generated filename:**
```
pt_tiktok_motivational-quote-01_20251105_091530.mp4
```

---

### Example 4: Spanish Instagram Post

**Folder:** `receta-facil`  
**Config:**
```json
{
  "language": "es",
  "aspectRatio": "1:1"
}
```

**Generated filename:**
```
es_instagram_receta-facil_20251105_185412.mp4
```

---

## 🗂️ Output Structure

Your batch-processed videos are saved in this structure:

```
output/
└── batch/
    └── [channel-name]/
        └── [video-folder-name]/
            └── [language]_[platform]_[folder]_[datetime].mp4
```

**Example:**
```
output/
└── batch/
    └── gebets/
        └── Gottes_Gebet/
            └── de_tiktok_Gottes_Gebet_20251105_162345.mp4
```

---

## 🔍 Filename Decoding

You can instantly tell everything about a video from its filename:

**Example:** `pt_tiktok_prayer-video_20251105_142030.mp4`

- 🌍 **Language:** Portuguese (`pt`)
- 📱 **Platform:** TikTok/Shorts/Reels (`tiktok`)
- 📁 **Video:** prayer-video
- 📅 **Date:** November 5, 2025
- ⏰ **Time:** 2:20:30 PM

---

## ⚙️ Configuration

### Channel-Level Language

Set language for all videos in channel:

**channel.json:**
```json
{
  "name": "My Channel",
  "defaults": {
    "language": "pt",
    "aspectRatio": "9:16"
  }
}
```

### Video-Level Override

Override language for specific video:

**video/config.json:**
```json
{
  "language": "en"
}
```

---

## 💡 Benefits

### 1. **Self-Documenting**
Filename tells you everything about the video

### 2. **Easy Sorting**
- Sort by language
- Sort by platform
- Sort by date/time

### 3. **Batch Management**
- Upload multiple videos by platform
- Organize content by language
- Track when videos were created

### 4. **No Conflicts**
Datetime ensures unique filenames, even with same name

### 5. **Platform Ready**
Quickly identify which videos go to which platform

---

## 📊 Real-World Workflow

### Scenario: Multi-Language Content Creator

You create the same video in 3 languages for TikTok:

```
channels/motivational-quotes/
├── videos/
│   ├── quote-001-en/
│   │   ├── voice.mp3 (English)
│   │   └── config.json (language: en)
│   ├── quote-001-pt/
│   │   ├── voice.mp3 (Portuguese)
│   │   └── config.json (language: pt)
│   └── quote-001-es/
│       ├── voice.mp3 (Spanish)
│       └── config.json (language: es)
```

**Generated files:**
```
output/batch/motivational-quotes/
├── quote-001-en/
│   └── en_tiktok_quote-001-en_20251105_140000.mp4
├── quote-001-pt/
│   └── pt_tiktok_quote-001-pt_20251105_140030.mp4
└── quote-001-es/
    └── es_tiktok_quote-001-es_20251105_140100.mp4
```

**Now you can:**
- Upload all English videos: Filter by `en_tiktok_*`
- Upload all TikTok videos: Filter by `*_tiktok_*`
- Upload by date: Sort by datetime

---

## 🎯 Quick Reference

### Format Template
```
[language]_[platform]_[name]_[datetime].mp4
```

### Language Codes
- `en` = English
- `pt` = Portuguese
- `es` = Spanish
- `de` = German
- `fr` = French
- etc. (any ISO 639-1 code)

### Platform Mapping
- 9:16 → `tiktok`
- 16:9 → `youtube`
- 1:1 → `instagram`
- 4:5 → `instagram`

### DateTime Format
- `YYYYMMDD_HHMMSS`
- Example: `20251105_162345`

---

## 🚀 Usage

Just run batch processing as normal:

```bash
npm start
# Choose: 2. Batch Processing - Select Channel
# Select your channel
# Videos will be generated with new filename format!
```

No configuration needed - it's automatic! ✨

---

## 📝 Notes

- **Folder names** with special characters are sanitized (spaces, symbols → underscores)
- **Language code** comes from `config.language` (video > channel > default: "en")
- **DateTime** is UTC time when video generation completed
- **Platform** is auto-detected from aspect ratio
- **Unique filenames** guaranteed by datetime component

---

**Your batch-processed videos now have professional, organized filenames!** 🎬✨
