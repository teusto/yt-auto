# ⚡ Azure TTS Quick Start Card

**Generate voice audio from text scripts in 4 steps.**

---

## 1️⃣ Setup (One-Time)

```bash
npm run tts:setup
```

**You'll need:**
- Azure API key (get from portal.azure.com)
- Region (e.g., `brazilsouth`)

---

## 2️⃣ Create Scripts File

```bash
npm run tts:init pray-matheus
```

**Edit:** `channels/pray-matheus/scripts.csv`

```csv
video_id,script,status
pray-001,"Pai celestial, nós viemos diante de Ti...",pending
pray-002,"Senhor, abençoe esta manhã...",pending
pray-003,"Deus de amor, agradecemos...",pending
```

---

## 3️⃣ Generate Voices

```bash
npm run tts:generate
```

**Interactive menu** → Select channel → Generate all

---

## 4️⃣ Create Videos

```bash
# Add images to generated folders
cp images/*.jpg channels/pray-matheus/videos/pray-001/images/

# Generate videos (normal workflow)
npm start
```

---

## ✅ Result

```
channels/pray-matheus/videos/
├── pray-001/
│   ├── voice.mp3    ✨ AUTO-GENERATED
│   └── images/      ✨ AUTO-CREATED
├── pray-002/
│   ├── voice.mp3    ✨ AUTO-GENERATED
│   └── images/      ✨ AUTO-CREATED
└── pray-003/
    ├── voice.mp3    ✨ AUTO-GENERATED
    └── images/      ✨ AUTO-CREATED
```

---

## 📋 CSV Columns

**Required:**
- `video_id` - Video folder name
- `script` - Voice text
- `status` - Auto-updated (pending/generated)

**Optional:**
- `voice` - Voice name (default: pt-BR-FranciscaNeural)
- `language` - Language code (default: pt-BR)
- `speaking_rate` - Speed (default: 1.0)

---

## 🎙️ Commands

```bash
# Setup
npm run tts:setup              # Configure Azure

# Scripts
npm run tts:init [channel]     # Create CSV template

# Generation
npm run tts:generate           # Interactive menu
npm run tts:generate pray-matheus --all-pending  # Batch

# Utilities
npm run tts:voices pt-BR       # List voices
npm run tts:test "Sample"      # Test voice
```

---

## 💡 Tips

1. **Write all scripts first** → Generate all at once
2. **Test voice** before generating 100 scripts
3. **Free tier** = 500,000 chars/month (~1,000 prayers)
4. **CSV auto-updates** after generation

---

## 🌍 Common Voices

**Portuguese (Brazilian):**
- `pt-BR-FranciscaNeural` (Female, warm)
- `pt-BR-AntonioNeural` (Male, professional)

**English:**
- `en-US-JennyNeural` (Female)
- `en-US-GuyNeural` (Male)

**List all:** `npm run tts:voices pt-BR`

---

## ⏱️ Time Saved

**Manual recording:** 10 min/video  
**With TTS:** 30 sec/video  
**5 videos:** **50 min → 3 min** (47 min saved!)

---

**Full guide:** [AZURE_TTS_GUIDE.md](AZURE_TTS_GUIDE.md)
