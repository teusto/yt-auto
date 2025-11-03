# 🎬 YT-Machine - AI Video Generator

**Transform your content into professional YouTube Shorts, TikToks, and Instagram Reels automatically!**

YT-Machine is an AI-powered video creation tool that generates engaging short-form videos from your images, videos, voiceovers, and scripts. Perfect for content creators, educators, marketers, and businesses.

---

## ✨ Features

### 🎥 Core Features (FREE)
- **Automatic Video Generation** - Creates videos from images and voiceovers
- **Smart Subtitles** - Auto-generated captions with multiple styles
- **Background Music** - Automatic mixing with voiceover
- **Multi-Platform Support** - Export for YouTube Shorts, TikTok, Instagram
- **Batch Processing** - Generate multiple videos at once
- **Custom Branding** - Add logos, intros, and outros
- **Flexible Aspect Ratios** - 9:16 (vertical), 16:9 (horizontal), 1:1 (square)

### ⭐ Pro Features
- **Timeline/Scene System** - Advanced video structure with custom segments
- **Multi-Language Translations** - Translate subtitles to 31+ languages automatically
- **Advanced Effects** - Transitions, animations, and filters (coming soon)
- **AI Voice Generation** - Text-to-speech with voice cloning (coming soon)
- **AI Script Writing** - Auto-generate video scripts (coming soon)

---

## 🚀 Quick Start

### 1. Install
```bash
git clone https://github.com/yourusername/yt-machine.git
cd yt-machine
npm install
```

### 2. Set Up API Keys
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

### 3. Prepare Your Content
```bash
# Put your files in the input folder:
input/
├── voice.mp3          # Your voiceover
├── music.mp3          # Background music (optional)
├── images/            # Your images or videos
└── logo.png           # Your logo (optional)
```

### 4. Run
```bash
npm start
```

That's it! Your video will be in the `output/` folder.

---

## 📖 Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Complete setup instructions
- **[Channel Setup Guide](docs/CHANNEL_SETUP.md)** - Create and manage content channels
- **[Config File Guide](docs/CONFIG_GUIDE.md)** - Customize your video settings
- **[Folder Structure Guide](docs/FOLDER_STRUCTURE.md)** - How to organize your content
- **[Pro Features Guide](docs/PRO_FEATURES.md)** - Timeline system and translations

---

## 🎯 Use Cases

### 📱 Content Creators
"Create 10 YouTube Shorts per week from my podcast episodes automatically"

### 🎓 Educators
"Turn my lecture slides into engaging educational videos with voiceover"

### 💼 Businesses
"Generate product demo videos in multiple languages for global audiences"

### 📰 News & Media
"Quickly create news summary videos from scripts and stock footage"

### 🎮 Gaming
"Compile gaming highlights into TikTok-ready videos with commentary"

---

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime
- **FFmpeg** - Video processing
- **AssemblyAI** - Subtitle generation
- **DeepL API** - Multi-language translation (Pro)
- **OpenAI** - AI features (Pro, coming soon)

---

## 💰 Pricing

### Free Version
- Unlimited local video generation
- All core features included
- No watermarks
- Open source

### Pro Version
- Advanced timeline system
- Multi-language translations (31+ languages)
- Priority support
- Future AI features

**Pro activation:** Set `PRO_TIMELINE=true` and `PRO_TRANSLATIONS=true` in `.env`

---

## 📊 System Requirements

- **OS:** Windows 10+, macOS 10.15+, or Linux
- **Node.js:** v18.0.0 or higher
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 2GB free space minimum
- **FFmpeg:** Required (installation instructions in [Installation Guide](docs/INSTALLATION.md))

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- FFmpeg - Video processing
- AssemblyAI - Subtitle generation
- DeepL - Translation services
- OpenAI - AI capabilities
- All open source contributors

---

## 📞 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/yourusername/yt-machine/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/yt-machine/discussions)

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Core video generation
- [x] Subtitle system
- [x] Batch processing
- [x] Timeline/Scene system
- [x] Multi-language translations

### 🔄 In Progress
- [ ] Advanced transitions and effects
- [ ] AI voice generation
- [ ] Template marketplace

### 🔮 Future
- [ ] AI script generation
- [ ] Real-time preview
- [ ] Collaborative workflows
- [ ] Mobile app

---

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

---

**Made with ❤️ by content creators, for content creators**

[Get Started Now](docs/INSTALLATION.md) | [Join Our Community](#) | [View Examples](#)
