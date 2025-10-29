# 🎙️ Azure TTS - Auto Voice Generation Guide

**Automatically generate voice audio from text scripts using Azure Text-to-Speech.**

---

## 🎯 What This Feature Does

**Before:** Manual recording → Edit audio → Export → Place in video folder  
**After:** Write text in CSV → Run command → Voice.mp3 auto-generated ✨

**Time saved:** ~10 minutes per video!

---

## 🚀 Quick Start

### Step 1: Setup Azure TTS

```bash
npm run tts:setup
```

**You'll need:**
- Azure Speech Service API key
- Azure region (e.g., `brazilsouth`)
- Get them from: https://portal.azure.com

### Step 2: Create Scripts File

```bash
npm run tts:init pray-matheus
```

Creates `channels/pray-matheus/scripts.csv`

### Step 3: Add Your Scripts

Edit `scripts.csv`:

```csv
video_id,script,status
pray-001,"Pai celestial, nós viemos diante de Ti hoje...",pending
pray-002,"Senhor, abençoe esta manhã com paz...",pending
```

### Step 4: Generate Voices

```bash
npm run tts:generate
```

**Result:** `voice.mp3` files created in each video folder! ✅

---

## 📋 CSV File Structure

### Required Columns

| Column | Description | Example |
|--------|-------------|---------|
| `video_id` | Video folder name | `pray-001` |
| `script` | Voice text | `"Heavenly Father..."` |
| `status` | Auto-updated | `pending` |

### Optional Columns

| Column | Description | Default | Example |
|--------|-------------|---------|---------|
| `voice` | Azure voice name | Channel default | `pt-BR-FranciscaNeural` |
| `language` | Language code | `pt-BR` | `en-US` |
| `speaking_rate` | Speed | `1.0` | `0.9` (slower), `1.2` (faster) |
| `pitch` | Pitch adjust | `0` | `+5` (higher), `-5` (lower) |
| `notes` | Your notes | - | `"Redo with male voice"` |

**Auto-filled columns:**
- `audio_duration` - Filled after generation
- `generated_at` - Timestamp

---

## 📝 Example CSV Files

### Basic Example

```csv
video_id,script,status
pray-001,"Pai celestial, nós viemos diante de Ti hoje com corações gratos. Pedimos Sua bênção sobre este dia.",pending
pray-002,"Senhor, abençoe esta manhã com Sua paz. Guie nossos passos e ilumine nosso caminho.",pending
pray-003,"Deus de amor e misericórdia, agradecemos por este novo dia.",pending
```

### Advanced Example (Multiple Voices)

```csv
video_id,script,status,voice,language,speaking_rate
pray-001,"Heavenly Father, we come before you...",pending,en-US-JennyNeural,en-US,1.0
pray-002,"Padre celestial, venimos ante ti...",pending,es-ES-ElviraNeural,es-ES,0.9
pray-003,"Pai celestial, viemos diante de Ti...",pending,pt-BR-FranciscaNeural,pt-BR,1.0
```

---

## 🎨 Available Voices

### Portuguese (Brazilian)

**Female Voices:**
- `pt-BR-FranciscaNeural` - Warm, clear (recommended for prayers)
- `pt-BR-LeilaNeural` - Mature, calm
- `pt-BR-BrendaNeural` - Young, energetic
- `pt-BR-ElzaNeural` - Mature, authoritative

**Male Voices:**
- `pt-BR-AntonioNeural` - Professional, clear
- `pt-BR-DonatoNeural` - Authoritative, mature (recommended for prayers)
- `pt-BR-FabioNeural` - Young, friendly
- `pt-BR-HumbertoNeural` - Mature, calm

### List All Available Voices

```bash
# Portuguese
npm run tts:voices pt-BR

# English
npm run tts:voices en-US

# Spanish
npm run tts:voices es-ES
```

---

## 🎛️ Commands Reference

### Setup & Configuration

```bash
# Initial setup (one-time)
npm run tts:setup

# Create scripts.csv template
npm run tts:init [channel-name]

# List available voices
npm run tts:voices [language-code]

# Test a voice
npm run tts:test "Test text" --voice pt-BR-FranciscaNeural
```

### Voice Generation

```bash
# Interactive menu (recommended)
npm run tts:generate

# Generate for specific channel
npm run tts:generate pray-matheus

# Generate all pending
npm run tts:generate pray-matheus --all-pending

# Force regenerate all
npm run tts:generate pray-matheus --force
```

---

## 📂 What Gets Created

### After Generation

```
channels/pray-matheus/
├── scripts.csv                    # Your scripts
└── videos/
    ├── pray-001/
    │   ├── voice.mp3              # ✨ AUTO-GENERATED
    │   └── images/                # ✨ AUTO-CREATED
    └── pray-002/
        ├── voice.mp3              # ✨ AUTO-GENERATED
        └── images/                # ✨ AUTO-CREATED
```

**Note:** Video folders and images subfolders are created automatically!

---

## 🔄 Complete Workflow

### Daily Content Creation

```bash
# 1. Write scripts (morning - 5 minutes)
code channels/pray-matheus/scripts.csv
# Add 5 new prayers

# 2. Generate voices (automatic - 2 minutes)
npm run tts:generate pray-matheus --all-pending
# ✅ 5 voice files created

# 3. Add images (5 minutes)
cp images/cross*.jpg channels/pray-matheus/videos/pray-007/images/
cp images/sunrise*.jpg channels/pray-matheus/videos/pray-008/images/
# ... etc

# 4. Generate videos (existing command - 5 minutes)
npm start
# ✅ 5 videos created

# Total time: ~17 minutes for 5 videos!
# Without TTS: ~67 minutes (50 min saved!)
```

---

## ⚙️ Status Tracking

CSV status values are auto-updated:

| Status | Meaning |
|--------|---------|
| `pending` | Not generated yet |
| `generated` | Audio created ✅ |
| `error` | Generation failed ❌ |
| `skip` | Intentionally skipped |
| `regenerate` | Needs regeneration |

**Auto-update example:**

**Before generation:**
```csv
video_id,script,status,audio_duration,generated_at
pray-001,"Heavenly Father...",pending,0,
```

**After generation:**
```csv
video_id,script,status,audio_duration,generated_at
pray-001,"Heavenly Father...",generated,45,2024-10-20T09:30:15Z
```

---

## 🎨 Voice Customization

### Change Speaking Rate

```csv
video_id,script,speaking_rate
prayer-calm,"Take a moment to breathe...",0.8
prayer-energetic,"Let us celebrate!",1.2
```

**Values:** 0.5 (very slow) to 2.0 (very fast)

### Adjust Pitch

```csv
video_id,script,pitch
prayer-deep,"God speaks to us...",0
prayer-child,"Children's prayer time!",-5
```

**Values:** -10Hz (lower) to +10Hz (higher)

### Mix Voices in One Channel

```csv
video_id,script,voice
intro,"Welcome to daily prayers",pt-BR-AntonioNeural
prayer-001,"Heavenly Father...",pt-BR-FranciscaNeural
outro,"Thank you for joining",pt-BR-AntonioNeural
```

---

## 💰 Pricing

### Azure TTS Costs

**Neural Voices:** $16 per 1 million characters

### Free Tier
- **500,000 characters/month** FREE
- ~1,000 prayers @ 500 chars each
- Perfect for starting!

### Cost Calculator

**1 prayer ≈ 500 characters**

| Videos/Month | Characters | Cost |
|--------------|------------|------|
| 30 prayers | 15,000 | FREE |
| 100 prayers | 50,000 | FREE |
| 500 prayers | 250,000 | FREE |
| 1,000 prayers | 500,000 | FREE |
| 2,000 prayers | 1,000,000 | $16 |

**Recommendation:** Start with free tier - plenty for most channels!

---

## 🔧 Troubleshooting

### "Azure TTS not configured"

**Solution:**
```bash
npm run tts:setup
```

Add your API key and region.

### "Scripts file not found"

**Solution:**
```bash
npm run tts:init [channel-name]
```

### "Voice test failed"

**Causes:**
1. Wrong API key
2. Wrong region
3. Voice name typo

**Solution:**
```bash
# Test voice
npm run tts:test "Hello" --voice pt-BR-FranciscaNeural

# List available voices
npm run tts:voices pt-BR
```

### "Generation failed"

**Check:**
1. Script text not empty
2. Voice name is correct
3. API quota not exceeded
4. Internet connection working

**Retry:**
```bash
npm run tts:generate
# Choose option 3: Retry failed scripts
```

### Script Too Long

**Azure limit:** 10 minutes per request

**Solution:** Split long scripts into multiple videos:

```csv
video_id,script
pray-001-part1,"First part of long prayer...",
pray-001-part2,"Second part of long prayer...",
```

---

## 💡 Tips & Best Practices

### 1. Write Natural Scripts

**Good:**
```
Pai celestial, nós viemos diante de Ti hoje.
Pedimos Sua bênção.
```

**Avoid:**
```
Pai celestial nós viemos diante de Ti hoje pedimos Sua bênção
```

Use punctuation for natural pauses!

### 2. Test Voices First

```bash
npm run tts:test "Pai celestial, abençoe este dia" --voice pt-BR-FranciscaNeural
```

### 3. Use Batch Generation

Don't generate one by one - write all scripts first, then generate all:

```bash
# Write 10 scripts
code channels/pray-matheus/scripts.csv

# Generate all at once
npm run tts:generate pray-matheus --all-pending
```

### 4. Keep Backups

Scripts.csv is auto-backed up when overwriting:
```
scripts.csv.backup.1729417015123
```

### 5. Consistent Voice Per Channel

Set default voice once, use for all videos:

**.env:**
```bash
AZURE_TTS_DEFAULT_VOICE=pt-BR-FranciscaNeural
```

Then just fill `video_id` and `script` in CSV.

---

## 🎯 Advanced Features

### SSML Support (Advanced Voice Control)

✅ **Full SSML support is built-in!**

You can write SSML directly in your scripts for advanced control:

```csv
video_id,script
pray-001,"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='pt-BR'><voice name='pt-BR-FranciscaNeural'>Pai celestial,<break time='500ms'/> nós oramos por <emphasis level='strong'>paz</emphasis>.</voice></speak>"
```

**SSML features:**
- `<break time='500ms'/>` - Pauses
- `<prosody rate='slow'>` - Speed changes
- `<emphasis level='strong'>` - Emphasis
- `<prosody pitch='+5Hz'>` - Pitch control
- `<prosody volume='loud'>` - Volume control
- And much more!

**📖 See [SSML_GUIDE.md](SSML_GUIDE.md) for complete examples and reference!**

### Multi-Language Content

```csv
video_id,script,language,voice
pray-pt,"Pai celestial...",pt-BR,pt-BR-FranciscaNeural
pray-en,"Heavenly Father...",en-US,en-US-JennyNeural
pray-es,"Padre celestial...",es-ES,es-ES-ElviraNeural
```

---

## 📚 Related Documentation

- **HOW_TO_CREATE_VIDEO.md** - Complete video creation guide
- **AUTO_SUBTITLES.md** - Auto-subtitle generation
- **SUBTITLE_PROPERTIES_GUIDE.md** - Subtitle customization

---

## ✅ Summary

**Setup:**
1. `npm run tts:setup` - Configure Azure
2. `npm run tts:init` - Create scripts.csv
3. Edit CSV with your scripts
4. `npm run tts:generate` - Generate voices

**Result:** Automated voice generation for all your videos! 🎉

**Time saved:** ~10 minutes per video in recording/editing ⏱️

---

**Ready to automate your voice creation! 🎙️✨**
