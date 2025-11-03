#!/bin/bash

# Create a simple timeline test project
# Usage: ./create-timeline-test.sh

set -e

PROJECT="input-timeline-test"

echo "🎬 Creating Timeline Test Project"
echo "=================================="
echo ""

# Check if ImageMagick and FFmpeg are available
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Install: sudo apt-get install imagemagick"
    echo "   Will create empty placeholder files instead."
    USE_PLACEHOLDERS=true
fi

if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is required but not found"
    echo "   Install: sudo apt-get install ffmpeg"
    exit 1
fi

# Remove existing project
if [ -d "$PROJECT" ]; then
    echo "🗑️  Removing existing $PROJECT folder..."
    rm -rf "$PROJECT"
fi

# Create directories
echo "📁 Creating folders..."
mkdir -p "$PROJECT/images"
mkdir -p "$PROJECT/scenes"

# Create test images
echo "📸 Creating test images (3 images)..."
if [ "$USE_PLACEHOLDERS" = true ]; then
    # Create placeholder text files
    for i in 1 2 3; do
        echo "This is a placeholder for image $i" > "$PROJECT/images/$(printf "%03d" $i).txt"
    done
    echo "   ⚠️  Created placeholder files - replace with actual .jpg images"
else
    # Create actual images
    for i in 1 2 3; do
        HUE=$((i * 120))
        convert -size 1920x1080 "xc:hsl($HUE,80%,50%)" \
            -gravity center \
            -pointsize 120 -fill white -font Arial-Bold \
            -annotate +0-50 "Image $i" \
            -pointsize 60 -fill white \
            -annotate +0+50 "Timeline Test" \
            "$PROJECT/images/$(printf "%03d" $i).jpg" 2>/dev/null
    done
    echo "   ✅ Created 3 test images"
fi

# Create title card
echo "🎨 Creating title card scene..."
if [ "$USE_PLACEHOLDERS" = true ]; then
    echo "Title Card Placeholder" > "$PROJECT/scenes/title.txt"
    echo "   ⚠️  Created placeholder - replace with actual .jpg image"
else
    convert -size 1920x1080 xc:'#1a1a2e' \
        -gravity center \
        -pointsize 150 -fill '#eee' -font Arial-Bold \
        -annotate +0-150 "My Timeline" \
        -pointsize 80 -fill '#0f3460' \
        -annotate +0-30 "————————————————" \
        -pointsize 100 -fill '#16213e' \
        -annotate +0+100 "Video" \
        "$PROJECT/scenes/title.jpg" 2>/dev/null
    echo "   ✅ Created title card"
fi

# Create CTA card
echo "📢 Creating CTA scene..."
if [ "$USE_PLACEHOLDERS" = true ]; then
    echo "CTA Card Placeholder" > "$PROJECT/scenes/cta.txt"
    echo "   ⚠️  Created placeholder - replace with actual .jpg image"
else
    convert -size 1920x1080 xc:'#16213e' \
        -gravity center \
        -pointsize 120 -fill '#f5f5f5' -font Arial-Bold \
        -annotate +0-100 "👍 Subscribe!" \
        -pointsize 70 -fill '#a0a0a0' \
        -annotate +0+50 "Like & Share" \
        "$PROJECT/scenes/cta.jpg" 2>/dev/null
    echo "   ✅ Created CTA card"
fi

# Create audio file (10 seconds of silence)
echo "🎵 Creating audio file (10 seconds)..."
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 10 -q:a 9 -y "$PROJECT/voice.mp3" 2>/dev/null
echo "   ✅ Created voice.mp3"

# Create simple subtitles
echo "📝 Creating subtitle file..."
cat > "$PROJECT/subtitles.srt" << 'EOF'
1
00:00:00,000 --> 00:00:03,000
This is the first subtitle

2
00:00:03,000 --> 00:00:06,000
This is the second subtitle

3
00:00:06,000 --> 00:00:10,000
This is the third and final subtitle
EOF
echo "   ✅ Created subtitles.srt"

# Create config.json with timeline
echo "⚙️  Creating config.json with timeline..."
cat > "$PROJECT/config.json" << 'EOF'
{
  "name": "Timeline Test Video",
  "aspectRatio": "16:9",
  "animation": "zoom-in",
  "qualityMode": "high",
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 3,
        "name": "Title Card"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/cta.jpg",
        "duration": 3,
        "name": "Call to Action"
      }
    ]
  },
  "subtitle": {
    "style": "bold",
    "position": "bottom"
  }
}
EOF
echo "   ✅ Created config.json"

# Create README
echo "📄 Creating README..."
cat > "$PROJECT/README.md" << 'EOF'
# Timeline Test Project

This is a test project for the Timeline/Scene System.

## Structure

```
.
├── config.json          # Timeline configuration
├── images/              # Main content images
│   ├── 001.jpg
│   ├── 002.jpg
│   └── 003.jpg
├── scenes/              # Custom scenes
│   ├── title.jpg       # Title card (3 seconds)
│   └── cta.jpg         # Call to action (3 seconds)
├── voice.mp3           # Audio narration
└── subtitles.srt       # Subtitles
```

## Timeline Flow

1. **Title Card** (3s) - scenes/title.jpg
2. **Main Content** (10s) - Generated from images/
3. **CTA** (3s) - scenes/cta.jpg

**Total Duration:** ~16 seconds

## How to Run

1. Enable timeline feature:
   ```bash
   echo "PRO_TIMELINE=true" >> .env
   ```

2. Run YT-Machine:
   ```bash
   npm start
   ```

3. Choose **Interactive Mode**

4. When prompted for input folder, use: `input-timeline-test`

5. Follow prompts or accept defaults

## Timeline Config

The timeline is defined in `config.json`:

```json
{
  "timeline": {
    "segments": [
      {
        "type": "scene",
        "path": "scenes/title.jpg",
        "duration": 3,
        "name": "Title Card"
      },
      {
        "type": "main"
      },
      {
        "type": "scene",
        "path": "scenes/cta.jpg",
        "duration": 3,
        "name": "Call to Action"
      }
    ]
  }
}
```

## Expected Output

- Title card for 3 seconds
- Main video with images + voice + subtitles
- CTA card for 3 seconds
- Final video in `output/` folder

## Troubleshooting

### Timeline not working?
- Check `.env` has `PRO_TIMELINE=true`
- Restart terminal after adding env var

### Files not found?
- Check that `scenes/title.jpg` and `scenes/cta.jpg` exist
- Paths are relative to this folder

### No output?
- Check console for errors
- Try with `DEBUG=true` for detailed logs
EOF
echo "   ✅ Created README.md"

echo ""
echo "✨ Project created successfully!"
echo ""
echo "📁 Location: $PROJECT/"
echo ""
echo "📋 Contents:"
ls -lh "$PROJECT" 2>/dev/null || find "$PROJECT" -maxdepth 1 -type f -exec ls -lh {} \;
echo ""
if [ -d "$PROJECT/images" ]; then
    echo "   images/: $(ls "$PROJECT/images" | wc -l) files"
fi
if [ -d "$PROJECT/scenes" ]; then
    echo "   scenes/: $(ls "$PROJECT/scenes" | wc -l) files"
fi
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Enable timeline feature:"
echo "   echo \"PRO_TIMELINE=true\" >> .env"
echo ""
echo "2. Run YT-Machine:"
echo "   npm start"
echo ""
echo "3. Choose: 1 (Interactive Mode)"
echo ""
echo "4. Use input folder: $PROJECT"
echo ""
echo "5. Accept defaults or customize"
echo ""
echo "📖 See: $PROJECT/README.md for details"
echo ""

if [ "$USE_PLACEHOLDERS" = true ]; then
    echo "⚠️  Note: Replace placeholder .txt files with actual .jpg images"
    echo ""
fi

echo "✅ Ready to test Timeline feature!"
