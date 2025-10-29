# Image Pool - Shared Image Library

This folder contains shared images that can be used across multiple video projects. Images are organized by video format for optimal aspect ratio matching.

## Folder Structure

```
image-pool/
├── youtube/       # 16:9 landscape images (1920x1080, 1280x720, etc.)
├── tiktok/        # 9:16 vertical/portrait images (1080x1920, 720x1280, etc.)
├── instagram/     # 4:5 portrait images (1080x1350, etc.)
├── square/        # 1:1 square images (1080x1080, etc.)
└── universal/     # Images that work for any format (will be cropped/fitted)
```

## How It Works

### 1. Enable Random Selection

In your project's `config.json`:
```json
{
  "randomImages": true,
  "imageCount": 5,
  "useSharedPool": true
}
```

### 2. Automatic Pool Selection

The system automatically picks the right pool based on aspect ratio:
- `16:9` → Uses `image-pool/youtube/`
- `9:16` → Uses `image-pool/tiktok/`
- `4:5` → Uses `image-pool/instagram/`
- `1:1` → Uses `image-pool/square/`

### 3. Random Selection

- System picks N random images from the pool
- Tracks recent selections to avoid repetition
- Each video gets a different set of images

## Usage Examples

### Example 1: Use Shared Pool Only

```
batch-videos/meditation-001/
├── config.json       # {"randomImages": true, "imageCount": 8, "useSharedPool": true}
├── voice.mp3
└── music.mp3

# NO images/ folder needed!
# System uses image-pool/youtube/ automatically
```

### Example 2: Mix Pool + Project Images

```
batch-videos/special-video/
├── config.json       # {"randomImages": true, "imageCount": 5, "useSharedPool": "prefer"}
├── images/           # 3 special images
│   ├── special1.jpg
│   ├── special2.jpg
│   └── special3.jpg
├── voice.mp3
└── music.mp3

# System combines:
# - 3 special images (always included)
# - 2 random from pool
# = 5 total images
```

### Example 3: Project Images Only

```
batch-videos/custom-video/
├── config.json       # {"randomImages": false} or omit config
├── images/           # Use these specific images
│   ├── img1.jpg
│   └── img2.jpg
└── voice.mp3

# System uses project images only (no pool)
```

## Configuration Options

### `randomImages` (boolean)
- `true`: Enable random selection
- `false`: Use all images in order (default)

### `imageCount` (number)
- How many images to select
- Example: `5` = pick 5 random images
- If not specified: uses all available images

### `useSharedPool` (string or boolean)
- `true`: Only use shared pool (ignore project images)
- `false`: Only use project images (ignore pool)
- `"prefer"`: Use project images first, fill from pool
- `"mix"`: Randomly mix both pool and project images
- Default: `true` if no project images exist

## Image Naming

For best results, use descriptive names:
```
image-pool/youtube/
├── nature-forest-001.jpg
├── nature-ocean-001.jpg
├── nature-mountains-001.jpg
├── sunset-beach-001.jpg
├── sunset-city-001.jpg
└── ...
```

## Tips

### 1. Organize by Theme

```
image-pool/youtube/
├── nature/
│   ├── forest-001.jpg
│   └── ocean-001.jpg
├── urban/
│   ├── city-001.jpg
│   └── street-001.jpg
└── abstract/
    └── patterns-001.jpg
```

### 2. Proper Aspect Ratios

- **YouTube (16:9):** 1920x1080, 1280x720
- **TikTok (9:16):** 1080x1920, 720x1280
- **Instagram (4:5):** 1080x1350
- **Square (1:1):** 1080x1080

### 3. High Quality Images

- Minimum: 1920x1080 for YouTube, 1080x1920 for TikTok
- Format: JPG or PNG
- Size: Under 10MB per image

## Repetition Tracking

The system tracks which images were used in recent videos to avoid repetition:

```
.image-pool-history.json  # Automatically created
{
  "youtube": ["nature-001.jpg", "sunset-005.jpg", ...],
  "tiktok": ["portrait-003.jpg", ...],
  "lastCleanup": "2025-10-17"
}
```

- Last 20 images per format are tracked
- Avoids using same images in consecutive videos
- History auto-cleans after 100 entries

## Example Workflow

### Setting Up Pool

```bash
cd /home/teusto/yt-machine

# Create pools
mkdir -p image-pool/{youtube,tiktok,instagram,square,universal}

# Add your images (example)
# For YouTube videos:
cp ~/my-images/landscape-*.jpg image-pool/youtube/

# For TikTok videos:
cp ~/my-images/portrait-*.jpg image-pool/tiktok/
```

### Creating Batch Videos

```bash
# Create 10 similar meditation videos
for i in {001..010}; do
  mkdir -p batch-videos/meditation-$i
  cp meditation-voice-$i.mp3 batch-videos/meditation-$i/voice.mp3
  cp meditation-music.mp3 batch-videos/meditation-$i/music.mp3
  
  # Add config to use random pool images
  cat > batch-videos/meditation-$i/config.json << EOF
{
  "aspectRatio": "16:9",
  "randomImages": true,
  "imageCount": 8,
  "useSharedPool": true,
  "animation": "none",
  "subtitle": {
    "style": "minimal",
    "position": "bottom"
  }
}
EOF
done

# Run batch processing
npm start
# Select: 2. Batch Processing Mode

# Result: 10 unique videos, each with 8 different random images!
```

## Benefits

✅ **Efficiency:** Maintain one image library for all videos
✅ **Variety:** Each video gets different random images
✅ **Scalability:** Add images once, use across 100+ videos
✅ **Organization:** Images organized by format
✅ **Flexibility:** Mix pool + project-specific images
✅ **No Repetition:** Smart tracking avoids reusing recent images

---

**Start by adding 20-50 images to each pool folder, then scale up as needed!**
