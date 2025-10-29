# Karaoke Subtitle Feature - Setup & Usage

## Overview
The karaoke subtitle feature creates word-by-word animated subtitles synchronized with your audio, similar to karaoke lyrics.

## Requirements
1. **AssemblyAI API Key** - Required for word-level timestamps
2. **No pre-existing subtitles** - Must auto-generate to get word timestamps

## Setup

### 1. Configure API Key
Edit `.env` file and add your AssemblyAI API key:
```
ASSEMBLYAI_API_KEY=your_actual_api_key_here
AUTO_SUBTITLES_ENABLED=true
AUTO_SUBTITLES_LANGUAGE=pt
```

### 2. Remove Existing Subtitles
Delete any existing subtitle files from the `input/` folder:
```bash
rm input/subtitles.srt
rm input/subtitles.ass
```

## Usage

### Run the Application
```bash
npm start
```

### Select Options
1. Choose **Interactive Mode** (option 1)
2. Select your video format (e.g., YouTube 16:9)
3. Choose animation and quality settings
4. When prompted for **Subtitle Animation**, select **2. Karaoke**

### What to Expect
You should see these messages:
- `🎙️ Auto-generating subtitles with AssemblyAI...`
- `📁 Audio file: voice.mp3`
- `✅ Subtitles saved to: input/subtitles.srt`
- `📝 Words transcribed: XXX`
- `✅ Karaoke mode: Using XXX word timestamps`
- `🎤 Generating karaoke subtitles with XXX word timestamps`

### Generated Files
- `input/subtitles.srt` - Original subtitle file
- `input/subtitles.ass` - ASS file with karaoke tags ({\k} tags for word timing)

## How It Works

1. **Upload & Transcribe**: Audio is sent to AssemblyAI with `word_details: true`
2. **Word Timestamps**: API returns timing for each individual word
3. **Karaoke Tags**: Conversion adds `{\k}` tags to ASS format
4. **Rendering**: FFmpeg renders the ASS file with word-by-word animation

## Troubleshooting

### "No word timestamps available"
- Means you're using pre-existing subtitles
- Delete `input/subtitles.srt` and regenerate

### "API key not configured"
- Check `.env` file has valid `ASSEMBLYAI_API_KEY`
- Key should be at least 10 characters

### "Failed to generate subtitles"
- Check audio file exists: `input/voice.mp3`
- Verify API key is valid
- Check internet connection
- Review error message for details

### Karaoke Not Animating
- Ensure you selected "Karaoke" animation when prompted
- Check that word timestamps were logged during generation
- Verify the generated `.ass` file contains `{\k}` tags

## Technical Details

### ASS Format Karaoke Tags
```
{\k100}Word {\k150}by {\k200}word
```
- Numbers represent duration in centiseconds (1/100 second)
- Each word appears/highlights as its timing arrives

### Supported Languages
- Portuguese (pt)
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- And more... (configure in .env)

## Feature Status
✅ AssemblyAI integration with word-level timestamps
✅ SRT to ASS conversion with karaoke tags
✅ Interactive prompts for animation selection
✅ Fallback to standard subtitles if timestamps unavailable
✅ Error handling and validation
✅ Debug logging for troubleshooting
