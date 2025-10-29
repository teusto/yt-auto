# Batch Videos Folder

This folder is used for batch video generation. Each subfolder represents one video project.

## Folder Structure

```
batch-videos/
├── project-001/
│   ├── config.json (optional)    # Project-specific settings
│   ├── images/                   # Image pool for the video
│   │   ├── img1.jpg
│   │   ├── img2.jpg
│   │   └── img3.jpg
│   ├── videos/ (optional)        # Video clips pool
│   ├── voice.mp3                 # Voice-over audio
│   ├── music.mp3 (optional)      # Background music
│   └── subtitles.srt/.ass (optional)  # Subtitles file (.ass or .srt)
├── project-002/
│   └── ...
└── project-003/
    └── ...
```

## Required Files

Each project folder MUST contain:
- **images/** folder with at least 1 image, OR **videos/** folder with at least 1 video
- **voice.mp3** (or voice.wav) - Voice-over audio

## Optional Files

- **config.json** - Override default settings for this project
- **music.mp3** - Background music (uses default if not provided)
- **subtitles.srt or subtitles.ass** - Subtitle file
  - `.srt` files are converted to ASS for center positioning
  - `.ass` files are used directly (preferred for advanced styling)
  - SRT can include pause markers like `[PAUSE:5s]` (future feature)
- **subtitles_target.srt/.ass** + **subtitles_native.srt/.ass** - For dual language mode

## config.json Example

```json
{
  "channel": "meditation-channel",
  "template": "contemplative",
  "aspectRatio": "16:9",
  "animation": "none",
  "qualityMode": "high",
  "randomImages": true,
  "imageCount": 5,
  "subtitle": {
    "style": "minimal",
    "position": "center"
  },
  "cta": {
    "enabled": true,
    "imagePath": "./cta-custom.png",
    "position": "bottom-right"
  }
}
```

## Usage

Run batch processing:
```bash
npm run batch
```

Or with interactive mode:
```bash
npm start
# Select: Batch Processing Mode
```

## Tips

- Use descriptive folder names: `meditation-001`, `quote-video-001`, etc.
- Keep image/video pools organized per project
- Use config.json to override defaults without changing main settings
- For pause markers in subtitles, use: `[PAUSE:10s]` on its own subtitle line
