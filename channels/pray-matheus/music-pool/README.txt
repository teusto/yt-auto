# Channel Music Pool

Add your channel-specific background music here.

## Specifications:
- Format: MP3, WAV, M4A
- Duration: Any (will be looped/faded automatically)
- Style: Consistent with channel theme
- Quantity: 5-20+ tracks recommended

## Examples:
- ambient-calm-001.mp3
- meditation-peaceful-002.mp3
- nature-sounds-003.mp3

## How It Works:
When randomMusic is enabled in channel.json, the system will:
1. Randomly select ONE track from this pool per video
2. Use different tracks for each video
3. Track recent selections to avoid repetition
4. Loop and fade the track automatically

## Usage:
Just add music files here - no configuration needed per video!

## Volume:
Background music volume is set in channel.json defaults (typically 0.20-0.35).

## Per-Video Override:
If a video has its own music.mp3 file, that will be used instead of the pool.
