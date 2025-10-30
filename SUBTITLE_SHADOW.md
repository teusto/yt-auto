# Shadow Subtitle Style

New subtitle style with subtle shadow effect for improved readability on any background.

## Features

- **Subtle shadow effect** - Adds depth to subtitles without being distracting
- **Improved readability** - Works better on light/variable backgrounds
- **Customizable** - Shadow depth and color can be configured

## Usage

### Interactive Mode

When prompted for subtitle style, select option **6**:

```
📝 Subtitle Style:

  1. Classic (white, bottom)
  2. Bold (large, white)
  3. Yellow (YouTube style)
  4. Minimal (small, clean)
  5. Cinematic (translucent background)
  6. Shadow (subtle shadow effect)   ← NEW!

Choose style (1-6, Enter = 1): 6
```

### Channel/Project Config

In your `channel.json` or project `config.json`:

```json
{
  "defaults": {
    "subtitle": {
      "style": "shadow"
    }
  }
}
```

### Custom Shadow Configuration

You can customize the shadow effect:

```json
{
  "defaults": {
    "subtitle": {
      "style": "shadow",
      "shadowDepth": 3,          // Depth in pixels (default: 3)
      "shadowColor": "black@0.6" // Color with alpha (default: black@0.6)
    }
  }
}
```

## Technical Details

### Default Shadow Settings

```javascript
{
  fontSize: 48,
  bold: false,
  fontColor: 'white',
  outlineWidth: 2,
  outlineColor: 'black',
  shadowDepth: 3,              // 3px shadow offset
  shadowColor: 'black@0.6',    // 60% opacity black
  backgroundColor: 'transparent',
  lineSpacing: 0
}
```

### How Shadow Works

The shadow is implemented using the ASS subtitle format's `Shadow` parameter:
- **Shadow depth**: Offset in pixels (how far the shadow extends)
- **Shadow color**: BackColour in ASS format (supports transparency)

The shadow appears offset down and to the right of the text, creating a subtle depth effect.

## Comparison

| Style | Best For | Features |
|-------|----------|----------|
| **Classic** | General use | Clean white text, black outline |
| **Bold** | Emphasis | Large, bold, thick outline |
| **Yellow** | YouTube style | Yellow text, attention-grabbing |
| **Minimal** | Subtle content | Small, thin outline |
| **Cinematic** | Movie-style | Translucent background box |
| **Shadow** | Variable backgrounds | Subtle shadow for depth |

## Use Cases

### When to Use Shadow Style:

✅ **Light backgrounds** - Shadow provides contrast
✅ **Variable lighting** - Works across different scenes
✅ **Outdoor scenes** - Helps text pop against sky/nature
✅ **Professional look** - Subtle, modern appearance
✅ **Mixed content** - When background changes frequently

### When NOT to Use:

❌ **Very dark backgrounds** - Shadow not visible (use Classic or Bold)
❌ **High contrast needed** - Use Bold or Cinematic instead
❌ **YouTube shorts** - Yellow or Bold more attention-grabbing

## Examples

### Basic Usage (Interactive)

```bash
npm start
# Choose Interactive Mode
# Select Shadow style when prompted
```

### Batch Processing

```bash
npm start
# Choose Batch Processing
# Shadow style applied if configured in channel.json
```

### With Debug Mode

```bash
npm start -- --debug
# See shadow settings in debug output
```

## Configuration Reference

### All Shadow Properties

```json
{
  "subtitle": {
    "style": "shadow",           // Preset style
    "fontSize": 48,              // Text size
    "fontColor": "white",        // Text color
    "outlineWidth": 2,           // Outline thickness
    "outlineColor": "black",     // Outline color
    "shadowDepth": 3,            // Shadow offset (px)
    "shadowColor": "black@0.6",  // Shadow color + alpha
    "position": "bottom",        // Position on screen
    "alignment": 2               // Center alignment
  }
}
```

### Color Format

Colors support transparency using `@` notation:
- `black@0.6` = 60% opacity black
- `white@0.8` = 80% opacity white
- `black` = fully opaque black

## Implementation Details

### Files Modified

1. **`/src/config/constants.js`**
   - Added `SHADOW` to `SUBTITLE_STYLES`
   - Added shadow defaults to `SUBTITLE_DEFAULTS`

2. **`/src/ui/prompts/subtitles.js`**
   - Added option 6 for Shadow style
   - Updated prompt text and handling

3. **`/src/index.js`**
   - Added shadow properties to CONFIG
   - Added 'shadow' to style mapping
   - Updated ASS generation for language learning

4. **`/src/subtitles/convert.js`**
   - Added shadow support to ASS conversion
   - Updated style format string

### Breaking Changes

**None!** This is a completely additive feature:
- Existing styles unchanged
- Default behavior unchanged
- Backward compatible with all configs

## Testing

Test the shadow style:

```bash
# Interactive mode
npm start
# Select: 1 (Interactive)
# Choose: 6 (Shadow) for subtitle style

# Batch mode with test channel
npm start
# Select: 2 (Batch - Channel)
# Select test_e2e with shadow configured
```

Verify shadow in output:
1. Open generated video
2. Check subtitles have visible shadow effect
3. Shadow should be subtle, not overwhelming

---

**Implemented:** Oct 30, 2025
**Version:** 1.0.0
**Status:** ✅ Complete
