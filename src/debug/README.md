# Debug System

Clean, modular debug logging system with temp file preservation and JSON receipt generation.

## Usage

### Enable Debug Mode

```bash
# Using flag
npm start -- --debug

# Or short form
npm start -- -d

# Or environment variable
DEBUG=true npm start
```

### What It Does

When debug mode is enabled:

1. **🔍 Debug Logging**: Detailed logs at every step
2. **📝 Temp File Preservation**: All temp files kept for inspection
3. **📋 JSON Receipt**: Complete execution record saved

## Features

### 1. Debug Logging

Categorized debug messages throughout execution:

```javascript
debug.log('CATEGORY', 'Message', { optional: 'data' });
```

**Categories:**
- `CONFIG` - Configuration settings
- `FILTER` - FFmpeg filter chains  
- `STEP` - Execution milestones
- `TEMP` - Temp file tracking
- `ERROR` - Error tracking

### 2. Temp File Preservation

Without debug: Temp files deleted immediately
With debug: All temp files preserved with descriptions

**Preserved files:**
- `temp_paired_clip_0.mp4`, `temp_paired_clip_1.mp4` - Individual clips
- `paired_concat_list.txt` - Concatenation list
- Other intermediate files

### 3. JSON Receipt

Complete execution record saved to:
```
output/debug_receipt_2025-10-30T10-15-30.json
```

**Receipt contents:**
```json
{
  "timestamp": "2025-10-30T10:15:30.000Z",
  "mode": "batch-channel",
  "config": {
    "aspectRatio": "16:9",
    "animation": "none",
    "clips": {
      "transition": "fade-black",
      "fadeBlackDuration": 0.3
    }
  },
  "execution": {
    "startTime": "2025-10-30T10:15:30.000Z",
    "endTime": "2025-10-30T10:16:25.000Z",
    "duration": "55.0s",
    "steps": [
      {
        "timestamp": "2025-10-30T10:15:30.123Z",
        "name": "Start video generation",
        "details": { "skipPrompts": true }
      }
    ]
  },
  "files": {
    "input": [...],
    "output": [...],
    "temp": [...]
  },
  "errors": []
}
```

## Module API

### Initialization
```javascript
import * as debug from './debug/logger.js';

debug.init();  // Call early in execution
```

### Methods

```javascript
// Check if enabled
if (debug.isEnabled()) { ... }

// Log message
debug.log('CATEGORY', 'message', { data });

// Record execution step
debug.step('step name', { details });

// Set execution mode
debug.setMode('interactive' | 'batch-channel' | 'batch-legacy');

// Record configuration
debug.setConfig(CONFIG);

// Track files
debug.addInputFile(path, { metadata });
debug.addOutputFile(path, { metadata });
debug.addTempFile(path, 'description');

// Record errors
debug.addError(error, 'context');

// Control temp file cleanup
if (debug.shouldPreserveTempFiles()) {
  // Preserve files
} else {
  // Delete files
}

// Save receipt and print summary
debug.saveReceipt(outputFolder);
debug.printSummary();
```

## Examples

### Basic Usage in Code

```javascript
// Start of function
debug.step('Processing clips', { clipCount: 5 });

// Log important data
debug.log('CONFIG', 'Transition settings', {
  transition: 'fade-black',
  duration: 0.3
});

// Conditional temp file cleanup
if (debug.shouldPreserveTempFiles()) {
  debug.addTempFile(clipPath, 'Processed clip with effects');
} else {
  fs.unlinkSync(clipPath);
}

// Error handling
try {
  // ... code
} catch (error) {
  debug.addError(error, 'Clip processing');
  throw error;
}
```

### Debug Output Example

```
🔍 DEBUG MODE ENABLED
   Temp files will be preserved
   Receipt will be generated

[10:15:30] 🔍 STEP: Start video generation
   {
     "skipPrompts": true,
     "hasVideoFolder": true
   }

[10:15:45] 🔍 CONFIG: Paired mode transition settings
   {
     "transition": "fade-black",
     "duration": 0.3,
     "clipCount": 2
   }

[10:16:20] 🔍 TEMP: Preserved: Paired clip 1 with transitions
   {
     "path": "/home/user/output/temp_paired_clip_0.mp4"
   }

📋 Debug Receipt saved: output/debug_receipt_2025-10-30T10-16-25.json

============================================================
🔍 DEBUG SUMMARY
============================================================
Mode: batch-channel
Steps: 12
Input files: 4
Output files: 1
Temp files preserved: 5
Errors: 0
Duration: 55.0s
============================================================
```

## Design Principles

1. **Zero Performance Impact**: When disabled, no overhead
2. **Separation of Concerns**: Isolated in `/src/debug/` module
3. **No Breaking Changes**: Existing code works unchanged
4. **Easy Integration**: Simple API, drop-in usage
5. **Self-Contained**: No external dependencies

## File Structure

```
src/debug/
  ├── logger.js          # Main debug module
  └── README.md          # This file
```

## Troubleshooting

**Debug mode not activating?**
- Check you're using `--` before `--debug`: `npm start -- --debug`
- Try environment variable: `DEBUG=true npm start`

**Receipt not generated?**
- Ensure OUTPUT folder exists and is writable
- Check for errors in console

**Temp files still being deleted?**
- Verify debug mode is actually enabled (look for banner)
- Check `debug.shouldPreserveTempFiles()` is being called

---

**Implemented:** Oct 30, 2025
**Version:** 1.0.0
