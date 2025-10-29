# 🎙️ Auto-Subtitle Generation with AssemblyAI

Automatically generate subtitles from your voice audio files using AssemblyAI's speech-to-text API.

---

## 🚀 Quick Setup

### 1. Get Your API Key

1. Go to [AssemblyAI](https://www.assemblyai.com/dashboard/signup)
2. Sign up for a free account
3. Copy your API key from the dashboard

**Free Tier:** 5 hours of transcription per month (plenty for most workflows!)

---

### 2. Configure Your Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```bash
ASSEMBLYAI_API_KEY=your_actual_api_key_here
AUTO_SUBTITLES_ENABLED=true
AUTO_SUBTITLES_LANGUAGE=en
```

**Supported Languages:**
- `en` - English
- `es` - Spanish
- `pt` - Portuguese
- `fr` - French
- `de` - German
- [See full list](https://www.assemblyai.com/docs/concepts/supported-languages)

---

## 📖 How It Works

### Automatic Behavior

The system **automatically generates subtitles** when:
1. ✅ API key is configured in `.env`
2. ✅ No `subtitles.srt` or `subtitles.ass` file exists
3. ✅ A `voice.mp3` file is present

### What Happens

```
📁 input/
  └── voice.mp3          ← Your audio file

     ↓ Auto-generates ↓

📁 input/
  ├── voice.mp3
  └── subtitles.srt     ← Generated automatically! 🎉
```

### Console Output

```bash
🎙️  Auto-generating subtitles with AssemblyAI...
⠋ Uploading and transcribing audio...
   ✅ Subtitles generated: subtitles.srt
   📝 Words transcribed: 247
   ⏱️  Confidence: 94.2%
```

---

## 🎯 Usage Examples

### Single Video Mode

```bash
# 1. Place your files
input/
  ├── voice.mp3         ← Your audio
  ├── image_001.jpg
  └── image_002.jpg

# 2. Run (no subtitles.srt needed!)
npm start

# 3. Subtitles auto-generated
input/
  ├── voice.mp3
  ├── subtitles.srt     ← Auto-created! ✨
  ├── image_001.jpg
  └── image_002.jpg
```

---

### Channel Batch Mode

```bash
channels/my-channel/videos/video-001/
  ├── voice.mp3         ← Your audio
  ├── images/
  └── config.json

# Run batch
npm start
# Choose: Option 2 (Channel Batch)

# Subtitles auto-generated for ALL videos without subtitles!
channels/my-channel/videos/video-001/
  ├── voice.mp3
  ├── subtitles.srt     ← Auto-created! ✨
  ├── images/
  └── config.json
```

---

## ⚙️ Configuration Options

### `.env` File

```bash
# Enable/disable feature
AUTO_SUBTITLES_ENABLED=true

# Language code (default: en)
AUTO_SUBTITLES_LANGUAGE=en

# Your API key
ASSEMBLYAI_API_KEY=your_key_here
```

### Disable Auto-Subtitles

**Option 1:** Set in `.env`
```bash
AUTO_SUBTITLES_ENABLED=false
```

**Option 2:** Remove API key from `.env`
```bash
# ASSEMBLYAI_API_KEY=your_key_here
```

**Option 3:** Provide manual subtitles
- Just add `subtitles.srt` yourself
- Auto-generation is skipped

---

## 💰 Cost & Limits

### Free Tier
- **5 hours/month** of transcription
- Perfect for small channels
- ~300 videos @ 1 minute each

### Paid Plans
- Starting at **$0.00025/second** ($0.015/minute)
- 10-minute video = ~$0.15
- 100 videos @ 10min = ~$15

### Check Usage
Visit your [AssemblyAI Dashboard](https://www.assemblyai.com/dashboard) to monitor usage.

---

## 🔧 Troubleshooting

### No Subtitles Generated

**Check console output:**

```bash
⚠️  AssemblyAI API key not configured
💡 Set ASSEMBLYAI_API_KEY in .env file for auto-subtitles
```

**Solution:** Add your API key to `.env`

---

### API Error

```bash
❌ Failed to generate subtitles: Invalid API key
💡 Continuing without auto-generated subtitles
```

**Solution:** Verify your API key is correct

---

### Rate Limit Exceeded

```bash
❌ Transcription failed: Rate limit exceeded
```

**Solution:** 
- Wait a few minutes
- Upgrade your AssemblyAI plan
- Process fewer videos at once

---

## ✨ Advanced Features

### Word-Level Timestamps

AssemblyAI provides precise word-level timestamps in the SRT file:

```srt
1
00:00:00,000 --> 00:00:02,340
Welcome to this amazing video

2
00:00:02,340 --> 00:00:05,120
Today we'll learn about AI
```

### High Accuracy

- **94%+** average accuracy
- Handles multiple speakers
- Punctuation and capitalization
- Industry-leading quality

---

## 🎬 Workflow Integration

### Before (Manual)
1. Record voice.mp3
2. **Manually transcribe** (30 min per video) 😴
3. Create subtitles.srt
4. Generate video

### After (Automated)
1. Record voice.mp3
2. **Auto-generate subtitles** (2 min per video) 🚀
3. Generate video

**Time saved: ~28 minutes per video!**

---

## 🚫 When Auto-Generation is Skipped

1. ✅ `subtitles.srt` already exists
2. ✅ `subtitles.ass` already exists
3. ✅ Dual language mode (target/native subtitles exist)
4. ❌ No API key configured
5. ❌ Feature disabled in `.env`

---

## 📝 Example Output Quality

**Input Audio:**
> "Welcome to today's prayer. Let us find peace in this moment of reflection."

**Generated SRT:**
```srt
1
00:00:00,000 --> 00:00:02,500
Welcome to today's prayer.

2
00:00:02,500 --> 00:00:06,800
Let us find peace in this moment of reflection.
```

**Perfect for:**
- ✅ YouTube videos
- ✅ TikTok/Shorts
- ✅ Instagram Reels
- ✅ Accessibility (hard of hearing viewers)

---

## 🎯 Best Practices

### For Best Results

1. **Clear audio** - Reduce background noise
2. **Good microphone** - Better input = better output
3. **Clear speech** - Speak clearly and at moderate pace
4. **Correct language** - Set `AUTO_SUBTITLES_LANGUAGE` correctly

### Quality Tips

- Record in quiet environment
- Use pop filter
- Speak directly into microphone
- Avoid background music in voice track

---

## 🔗 Resources

- [AssemblyAI Docs](https://www.assemblyai.com/docs)
- [Supported Languages](https://www.assemblyai.com/docs/concepts/supported-languages)
- [API Dashboard](https://www.assemblyai.com/dashboard)
- [Pricing](https://www.assemblyai.com/pricing)

---

## ❓ FAQ

**Q: Does this work offline?**
A: No, requires internet connection to AssemblyAI API.

**Q: Can I edit the generated subtitles?**
A: Yes! Edit `subtitles.srt` manually after generation.

**Q: What if the transcription is wrong?**
A: Edit the generated SRT file or provide your own subtitles.srt

**Q: Does this slow down video generation?**
A: First time: ~1-2 minutes. Subsequent runs use cached subtitles.

**Q: Can I use other languages?**
A: Yes! Set `AUTO_SUBTITLES_LANGUAGE` to any supported language code.

---

## 🎉 Ready to Go!

1. Add API key to `.env`
2. Run your workflow as normal
3. Subtitles auto-generate when missing
4. Enjoy automatic transcription! 🚀

**No workflow changes needed - it just works!** ✨
