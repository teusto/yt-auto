# 📚 YT-Machine Documentation

**Complete guides for creating professional videos**

Welcome to the YT-Machine documentation! Whether you're a complete beginner or an advanced user, these guides will help you master video creation.

---

## 🎯 Start Here

### Complete Beginners

**Never used command line? No programming experience? Start here:**

1. **[Installation Guide](INSTALLATION.md)** - Install YT-Machine step by step
   - Install Node.js and FFmpeg
   - Download YT-Machine
   - Set up API keys
   - Verify installation
   - **Time:** 30 minutes

2. **[Quick Start Guide](QUICK_START.md)** - Create your first video
   - Prepare your voiceover
   - Set up files
   - Generate your video
   - **Time:** 10 minutes

3. **[Folder Structure Guide](FOLDER_STRUCTURE.md)** - Learn how to organize files
   - Where to put your content
   - File naming conventions
   - Required vs optional files
   - **Time:** 15 minutes

---

### Intermediate Users

**Know the basics? Want to customize and scale:**

4. **[Config Guide](CONFIG_GUIDE.md)** - Master configuration files
   - All config options explained
   - Complete examples
   - Templates for different video types
   - **Time:** 20 minutes

5. **[Channel Setup Guide](CHANNEL_SETUP.md)** - Organize and automate
   - Create channel structure
   - Batch process videos
   - Share assets across videos
   - **Time:** 30 minutes

---

### Advanced Users

**Ready for pro features:**

6. **[Timeline Guide](TIMELINE_GUIDE.md)** - Advanced video structure *(Pro)*
   - Custom segment ordering
   - Intro, main, outro control
   - Audio synchronization
   - **Time:** 30 minutes

7. **[Translation Guide](TRANSLATIONS.md)** - Multi-language subtitles *(Pro)*
   - Translate to 31+ languages
   - DeepL API setup
   - Batch translation
   - **Time:** 20 minutes

---

## 📖 Documentation Overview

### Getting Started

| Guide | For | Time | Difficulty |
|-------|-----|------|------------|
| [Installation](INSTALLATION.md) | Everyone | 30 min | Easy |
| [Quick Start](QUICK_START.md) | Beginners | 10 min | Very Easy |
| [Folder Structure](FOLDER_STRUCTURE.md) | Beginners | 15 min | Easy |

### Customization

| Guide | For | Time | Difficulty |
|-------|-----|------|------------|
| [Config Guide](CONFIG_GUIDE.md) | Intermediate | 20 min | Medium |
| [Channel Setup](CHANNEL_SETUP.md) | Intermediate | 30 min | Medium |

### Pro Features

| Guide | For | Time | Difficulty |
|-------|-----|------|------------|
| [Timeline System](TIMELINE_GUIDE.md) | Advanced | 30 min | Hard |
| [Translations](TRANSLATIONS.md) | Advanced | 20 min | Medium |

### Reference

| Guide | For | Time | Difficulty |
|-------|-----|------|------------|
| [FAQ](FAQ.md) | Everyone | Browse | Easy |
| [Troubleshooting](TROUBLESHOOTING.md) | Everyone | Browse | Easy |
| [API Reference](API_REFERENCE.md) | Developers | 1 hour | Hard |

---

## 🎓 Learning Paths

### Path 1: Content Creator

**Goal:** Create engaging social media videos quickly

**Week 1:**
1. Complete [Installation](INSTALLATION.md)
2. Create 5 videos with [Quick Start](QUICK_START.md)
3. Experiment with different styles

**Week 2:**
1. Master [Config Guide](CONFIG_GUIDE.md)
2. Customize subtitle styles
3. Add logos and branding

**Week 3:**
1. Set up [Channels](CHANNEL_SETUP.md)
2. Batch process 10+ videos
3. Create daily content workflow

**Result:** Consistently create 5-10 videos/week

---

### Path 2: Educational Content

**Goal:** Create lessons with structure and translations

**Week 1:**
1. Complete [Installation](INSTALLATION.md)
2. Learn [Folder Structure](FOLDER_STRUCTURE.md)
3. Create first lesson video

**Week 2:**
1. Master [Timeline System](TIMELINE_GUIDE.md)
2. Add intro and outro
3. Structure lessons in segments

**Week 3:**
1. Enable [Translations](TRANSLATIONS.md)
2. Generate multi-language subtitles
3. Scale to full course

**Result:** Professional multi-language course content

---

### Path 3: Business/Agency

**Goal:** Scale video production for clients

**Week 1:**
1. Complete [Installation](INSTALLATION.md)
2. Set up [Channels](CHANNEL_SETUP.md)
3. Create templates per client

**Week 2:**
1. Master [Config Guide](CONFIG_GUIDE.md)
2. Build reusable configurations
3. Automate workflows

**Week 3:**
1. Enable all [Pro Features](PRO_FEATURES.md)
2. Multi-language content
3. Advanced timeline structures

**Result:** Produce 50-100 videos/week across clients

---

## 🎯 Quick Reference

### Essential Files

```
input/
├── voice.mp3          ← REQUIRED
├── music.mp3          ← Optional
├── config.json        ← Optional
├── logo.png           ← Optional
└── images/            ← Optional
```

### Essential Commands

```bash
# Start YT-Machine
npm start

# Update YT-Machine
git pull && npm install

# Check version
npm --version
```

### Essential Config

```json
{
  "aspectRatio": "9:16",
  "animation": "static",
  "qualityMode": "high",
  "subtitles": {
    "style": "yellow"
  }
}
```

---

## 🆘 Getting Help

### Common Issues

**Problem** | **Solution** | **Guide**
--- | --- | ---
Can't install | Check Node.js version | [Installation](INSTALLATION.md)
Voice not found | Check filename is `voice.mp3` | [Folder Structure](FOLDER_STRUCTURE.md)
Config invalid | Validate JSON syntax | [Config Guide](CONFIG_GUIDE.md)
Subtitles fail | Check API key | [Installation](INSTALLATION.md)
Wrong aspect ratio | Update config | [Config Guide](CONFIG_GUIDE.md)

### Support Resources

1. **Check [FAQ](FAQ.md)** - Most common questions answered
2. **Search [GitHub Issues](https://github.com/yourusername/yt-machine/issues)** - Someone may have solved it
3. **Read relevant guide** - Detailed explanations for each feature
4. **Ask community** - GitHub Discussions
5. **Report bug** - Create new GitHub Issue

---

## 📱 Video Type Guides

### TikTok/YouTube Shorts

**Recommended settings:**
```json
{
  "aspectRatio": "9:16",
  "subtitles": {
    "style": "yellow",
    "position": "bottom"
  }
}
```

**Best practices:**
- Length: 30-60 seconds
- Hook in first 3 seconds
- Clear, large subtitles
- Upbeat background music

**Guide:** [Config Guide](CONFIG_GUIDE.md)

---

### YouTube Videos

**Recommended settings:**
```json
{
  "aspectRatio": "16:9",
  "animation": "zoom-in",
  "subtitles": {
    "style": "shadow",
    "fontSize": 60
  }
}
```

**Best practices:**
- Length: 2-10 minutes
- Professional intro/outro
- Clear structure
- Engaging thumbnails

**Guide:** [Timeline Guide](TIMELINE_GUIDE.md)

---

### Instagram Reels/Stories

**Recommended settings:**
```json
{
  "aspectRatio": "9:16",
  "animation": "zoom-out",
  "subtitles": {
    "style": "minimal",
    "position": "top"
  }
}
```

**Best practices:**
- Length: 15-30 seconds
- Eye-catching visuals
- Trending audio
- Clear CTA

**Guide:** [Quick Start](QUICK_START.md)

---

### Educational Content

**Recommended settings:**
```json
{
  "aspectRatio": "16:9",
  "timeline": { ... },
  "translations": {
    "enabled": true,
    "languages": ["es", "fr", "de"]
  }
}
```

**Best practices:**
- Clear structure (intro, lesson, summary)
- Visual examples
- Multi-language subtitles
- Consistent branding

**Guides:** [Timeline](TIMELINE_GUIDE.md) + [Translations](TRANSLATIONS.md)

---

## 🔧 Feature Matrix

### Free Features

Feature | Available | Guide
--- | --- | ---
Video Generation | ✅ | [Quick Start](QUICK_START.md)
Auto Subtitles | ✅ | [Config Guide](CONFIG_GUIDE.md)
Multiple Aspect Ratios | ✅ | [Config Guide](CONFIG_GUIDE.md)
Background Music | ✅ | [Folder Structure](FOLDER_STRUCTURE.md)
Batch Processing | ✅ | [Channel Setup](CHANNEL_SETUP.md)
Custom Branding | ✅ | [Folder Structure](FOLDER_STRUCTURE.md)
Image Animation | ✅ | [Config Guide](CONFIG_GUIDE.md)

### Pro Features

Feature | Required | Guide
--- | --- | ---
Timeline System | PRO_TIMELINE=true | [Timeline Guide](TIMELINE_GUIDE.md)
Multi-Language Subtitles | PRO_TRANSLATIONS=true | [Translation Guide](TRANSLATIONS.md)
Advanced Transitions | Coming Soon | -
AI Voice Generation | Coming Soon | -
AI Script Writing | Coming Soon | -

---

## 📊 Comparison Guide

### Single Video vs Channel

Feature | Single Video | Channel
--- | --- | ---
Setup Time | 2 minutes | 30 minutes
Files Per Video | All unique | Shared + unique
Best For | One-off videos | Series/batches
Reusability | Low | High
Consistency | Manual | Automatic

**Guide:** [Channel Setup](CHANNEL_SETUP.md)

---

### Draft vs High Quality

Feature | Draft | High Quality
--- | --- | ---
Speed | 3x faster | Slower
Quality | Good | Excellent
Best For | Testing | Publishing
File Size | Smaller | Larger

**Guide:** [Config Guide](CONFIG_GUIDE.md)

---

## 🎬 Example Projects

### Project 1: Daily Motivation

**Structure:**
```
channels/daily-motivation/
├── channel.json
├── logo.png
├── image-pool/
└── videos/
    ├── 2024-11-01/
    ├── 2024-11-02/
    └── 2024-11-03/
```

**Config:** Standard 9:16, yellow subtitles

**Guide:** [Channel Setup](CHANNEL_SETUP.md)

---

### Project 2: Product Reviews

**Structure:**
```
input/
├── voice.mp3
├── config.json
└── images/
    ├── product1.jpg
    ├── product2.jpg
    └── product3.jpg
```

**Config:** 16:9, zoom-in, shadow subtitles

**Guide:** [Quick Start](QUICK_START.md)

---

### Project 3: Language Lessons

**Structure:**
```
input/
├── voice.mp3
├── config.json
├── scenes/
│   ├── title.png
│   └── summary.png
└── images/
```

**Config:** Timeline + translations

**Guides:** [Timeline](TIMELINE_GUIDE.md) + [Translations](TRANSLATIONS.md)

---

## 📈 Scaling Guide

### Phase 1: Learning (1-10 videos)

**Focus:** Understanding the basics

**Use:**
- Single video mode
- Manual configuration
- Draft quality for testing

**Guide:** [Quick Start](QUICK_START.md)

---

### Phase 2: Optimization (10-50 videos)

**Focus:** Improving efficiency

**Use:**
- Config files
- Templates
- High quality output

**Guide:** [Config Guide](CONFIG_GUIDE.md)

---

### Phase 3: Automation (50-500 videos)

**Focus:** Scaling production

**Use:**
- Channel system
- Batch processing
- Asset pools

**Guide:** [Channel Setup](CHANNEL_SETUP.md)

---

### Phase 4: Enterprise (500+ videos)

**Focus:** Full automation

**Use:**
- Multiple channels
- Pro features
- Automated workflows

**Guides:** [Timeline](TIMELINE_GUIDE.md) + [Translations](TRANSLATIONS.md)

---

## 🔄 Regular Updates

This documentation is regularly updated with:
- New features
- User feedback
- Best practices
- Example projects

**Last updated:** November 2024

**Next update:** Monthly

---

## 🤝 Contributing to Docs

Found an error? Have a suggestion?

1. **Report issues** - GitHub Issues
2. **Suggest improvements** - GitHub Discussions
3. **Submit edits** - Pull Requests welcome!

---

## 📖 Next Steps

**Choose your path:**

- **New user?** → Start with [Installation Guide](INSTALLATION.md)
- **Ready to create?** → Jump to [Quick Start](QUICK_START.md)
- **Want to customize?** → Read [Config Guide](CONFIG_GUIDE.md)
- **Need to scale?** → Check [Channel Setup](CHANNEL_SETUP.md)
- **Going pro?** → Explore [Timeline](TIMELINE_GUIDE.md) and [Translations](TRANSLATIONS.md)

---

**Happy creating!** 🎬✨

**Questions?** Check the [FAQ](FAQ.md) or ask in GitHub Discussions!
