# Channel Image Pool

Add your channel-specific images here (16:9 landscape format).

## Specifications:
- Aspect Ratio: 16:9
- Resolution: 1920x1080 or higher
- Format: JPG or PNG
- Quantity: 20-50+ images recommended

## Examples:
- nature-forest-001.jpg
- nature-ocean-002.jpg
- sunset-mountains-003.jpg

## How It Works:
When randomImages is enabled in channel.json, the system will:
1. Randomly select imageCount images from this pool
2. Use different images for each video
3. Track recent selections to avoid repetition

## Usage:
Just add images here - no configuration needed per video!
Each video in this channel will automatically use random images from this pool.
