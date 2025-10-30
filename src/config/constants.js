/**
 * YT-Machine Constants
 * All hardcoded values centralized for easy maintenance
 * 
 * Usage:
 *   import { VIDEO_DIMENSIONS, AUDIO_DEFAULTS } from './config/constants.js';
 */

// ============================================
// FILE FORMATS
// ============================================

export const FILE_FORMATS = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  VIDEO: ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'],
  AUDIO: ['.mp3', '.wav', '.m4a', '.aac'],
  FONT: ['.ttf', '.otf', '.woff', '.woff2'],
  SUBTITLE: ['.srt', '.ass']
};

// ============================================
// VIDEO DIMENSIONS & ASPECT RATIOS
// ============================================

export const ASPECT_RATIOS = {
  YOUTUBE: '16:9',
  TIKTOK: '9:16',
  INSTAGRAM_PORTRAIT: '4:5',
  INSTAGRAM_SQUARE: '1:1'
};

export const VIDEO_DIMENSIONS = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '4:5': { width: 1080, height: 1350 },
  '1:1': { width: 1080, height: 1080 }
};

export const DEFAULT_VIDEO = {
  WIDTH: 1920,
  HEIGHT: 1080,
  ASPECT_RATIO: '16:9'
};

// ============================================
// FRAME RATES
// ============================================

export const FRAME_RATES = {
  STANDARD: 30,
  ANIMATION: 24,
  HIGH: 60
};

// ============================================
// AUDIO DEFAULTS
// ============================================

export const AUDIO_DEFAULTS = {
  VOICE_VOLUME: 1.0,
  MUSIC_VOLUME: 0.35,
  MUSIC_FADE_IN: 2,
  MUSIC_FADE_OUT: 3,
  VOICE_FADE_IN: 1,
  VOICE_FADE_OUT: 1,
  VOICE_VOLUME_MIN: 0.5,
  VOICE_VOLUME_MAX: 2.0,
  MUSIC_VOLUME_MIN: 0.1,
  MUSIC_VOLUME_MAX: 1.0,
  SAMPLE_RATE: 44100,
  BITRATE: '192k'
};

export const AUDIO_PRESETS = {
  DEFAULT: { voice: 1.0, music: 0.35 },
  MUSIC_LOUDER: { voice: 1.0, music: 0.5 },
  MUSIC_SUBTLE: { voice: 1.0, music: 0.2 },
  VOICE_BOOST: { voice: 1.2, music: 0.3 }
};

// ============================================
// SUBTITLE DEFAULTS
// ============================================

export const SUBTITLE_DEFAULTS = {
  FONT_FAMILY: 'Arial',
  FONT_SIZE: 48,
  FONT_COLOR: 'white',
  OUTLINE_COLOR: 'black',
  OUTLINE_WIDTH: 2,
  SHADOW_DEPTH: 0,
  SHADOW_COLOR: 'black@0.6',
  BACKGROUND_COLOR: 'transparent',
  MARGIN_V: 50,
  POSITION: 'bottom'
};

export const SUBTITLE_ALIGNMENT = {
  LEFT: 1,
  CENTER: 2,
  RIGHT: 3,
  MIDDLE_CENTER: 5,
  TOP_CENTER: 8
};

export const SUBTITLE_STYLES = {
  CLASSIC: { fontSize: 48, bold: false, fontColor: 'white', backgroundColor: 'transparent', lineSpacing: 0 },
  BOLD: { fontSize: 56, bold: true, fontColor: 'white', outlineWidth: 3, backgroundColor: 'transparent', lineSpacing: 0 },
  YELLOW: { fontSize: 52, bold: false, fontColor: 'yellow', backgroundColor: 'transparent', lineSpacing: 0 },
  MINIMAL: { fontSize: 40, bold: false, fontColor: 'white', outlineWidth: 1, backgroundColor: 'transparent', lineSpacing: 0 },
  MODERN: { fontSize: 52, bold: true, fontColor: 'white', outlineWidth: 3, backgroundColor: 'transparent', lineSpacing: 0 },
  CINEMATIC: { fontSize: 38, bold: false, fontColor: 'white', outlineWidth: 1, outlineColor: 'black', backgroundColor: 'black@0.7', lineSpacing: 5 },
  SHADOW: { fontSize: 48, bold: false, fontColor: 'white', outlineWidth: 2, outlineColor: 'black', shadowDepth: 3, shadowColor: 'black@0.6', backgroundColor: 'transparent', lineSpacing: 0 }
};

export const SUBTITLE_ASPECT_SCALE = {
  '9:16': 0.5,
  '4:5': 0.7,
  '16:9': 1.0,
  '1:1': 0.85
};

export const SUBTITLE_MARGIN_SCALE = {
  '9:16': 1.2,
  '4:5': 1.0,
  '16:9': 1.0,
  '1:1': 1.0
};

// ============================================
// LANGUAGE LEARNING (DUAL SUBTITLES)
// ============================================

export const LANGUAGE_LEARNING = {
  TARGET_SIZE: 28,
  NATIVE_SIZE: 20,
  TARGET_COLOR: 'white',
  NATIVE_COLOR: '#CCCCCC',
  SPACING: 10
};

// ============================================
// CTA (CALL-TO-ACTION) DEFAULTS
// ============================================

export const CTA_DEFAULTS = {
  START_TIME: 5,
  DURATION: 5,
  OPACITY: 0.9,
  SCALE: 0.15,
  POSITION: 'right-bottom'
};

export const CTA_POSITIONS = {
  LEFT_TOP: 'left-top',
  MIDDLE_TOP: 'middle-top',
  RIGHT_TOP: 'right-top',
  LEFT_BOTTOM: 'left-bottom',
  MIDDLE_BOTTOM: 'middle-bottom',
  RIGHT_BOTTOM: 'right-bottom'
};

// ============================================
// ENCODING PRESETS
// ============================================

export const ENCODING_PRESETS = {
  DRAFT: {
    preset: 'ultrafast',
    crf: '28',
    description: 'Draft (fast, lower quality)'
  },
  HIGH: {
    preset: 'slow',
    crf: '18',
    description: 'High Quality (slower, best quality)'
  }
};

// ============================================
// AZURE TTS CONSTANTS
// ============================================

export const AZURE_TTS = {
  BATCH_API_THRESHOLD: 10000,
  DEFAULT_VOICE: 'pt-BR-FranciscaNeural',
  DEFAULT_LANGUAGE: 'pt-BR',
  DEFAULT_SPEAKING_RATE: '1.0',
  DEFAULT_PITCH: '0',
  BATCH_MAX_WAIT_TIME: 600000,
  BATCH_POLL_INTERVAL: 5000,
  API_VERSION: '2024-04-01',
  OUTPUT_FORMAT: 'audio-24khz-48kbitrate-mono-mp3',
  AUDIO_DURATION_CONVERSION: 10000000
};

// ============================================
// FFMPEG CONSTANTS
// ============================================

export const FFMPEG = {
  VIDEO_CODEC: 'libx264',
  AUDIO_CODEC: 'aac',
  PIXEL_FORMAT: 'yuv420p',
  WAV_CODEC: 'pcm_s16le',
  WAV_SAMPLE_RATE: 16000,
  WAV_CHANNELS: 1
};

// ============================================
// FILE NAMES
// ============================================

export const FILE_NAMES = {
  VOICE: 'voice.mp3',
  MUSIC: 'music.mp3',
  BACKGROUND_MUSIC: 'background_music.mp3',
  SUBTITLES: 'subtitles.srt',
  SUBTITLES_ASS: 'subtitles.ass',
  SUBTITLES_TARGET: 'subtitles_target.srt',
  SUBTITLES_TARGET_ASS: 'subtitles_target.ass',
  SUBTITLES_NATIVE: 'subtitles_native.srt',
  SUBTITLES_NATIVE_ASS: 'subtitles_native.ass',
  CONFIG: 'config.json',
  CHANNEL_CONFIG: 'channel.json',
  SCRIPTS_CSV: 'scripts.csv'
};

// ============================================
// FOLDER NAMES
// ============================================

export const FOLDER_NAMES = {
  INPUT: 'input',
  OUTPUT: 'output',
  FONTS: 'fonts',
  INTROS: 'intros',
  CTA: 'cta',
  CHANNELS: 'channels',
  VIDEOS: 'videos',
  IMAGES: 'images',
  IMAGE_POOL: 'image-pool',
  MUSIC_POOL: 'music-pool',
  BATCH_VIDEOS: 'batch-videos'
};

// ============================================
// ANIMATION EFFECTS
// ============================================

export const ANIMATION_EFFECTS = {
  STATIC: 'static',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
  PAN_LEFT: 'pan-left',
  PAN_RIGHT: 'pan-right'
};

// ============================================
// PLATFORMS
// ============================================

export const PLATFORMS = {
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  INSTAGRAM: 'instagram',
  ORIGINAL: 'original'
};

export const PLATFORM_FORMAT_MAP = {
  '16:9': 'youtube',
  '9:16': 'tiktok',
  '1:1': 'instagram',
  '4:5': 'instagram',
  'original': 'original'
};

// ============================================
// UI CONSTANTS
// ============================================

export const UI = {
  SPINNER_FRAMES: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  SPINNER_INTERVAL: 80,
  TIME_PADDING: 2
};

// ============================================
// LIMITS & THRESHOLDS
// ============================================

export const LIMITS = {
  MAX_FILENAME_LENGTH: 80,
  SCRIPT_PREVIEW_LENGTH: 50,
  MAX_MUSIC_POOL_HISTORY: 10,
  MAX_IMAGE_POOL_HISTORY: 20,
  INTRO_IMAGE_DURATION: 4,
  MAX_FADE_DURATION: 5,
  MIN_FADE_DURATION: 0,
  CTA_FRAME_COUNT_MULTIPLIER: 30
};

// ============================================
// VIRAL CAPTION STYLES
// ============================================

export const VIRAL_STYLES = {
  NONE: 'none',
  BOLD_POP: 'bold-pop',
  HIGHLIGHT: 'highlight',
  SHADOW_BURST: 'shadow-burst'
};

export const VIRAL_STYLE_SETTINGS = {
  'bold-pop': {
    fontSizeMultiplier: 1.3,
    outlineWidth: 4,
    bold: true
  },
  'highlight': {
    highlightColor: 'yellow',
    outlineWidth: 3,
    bold: true
  },
  'shadow-burst': {
    fontSizeMultiplier: 1.2,
    outlineWidth: 5,
    shadowStrength: 5,
    bold: true
  }
};

// Additional multipliers for viral rendering
export const VIRAL_RENDERING = {
  BOLD_POP_SIZE_BOOST: 1.15,
  HIGHLIGHT_OUTLINE: 4,
  SHADOW_BURST_OUTLINE: 6,
  SHADOW_BURST_SIZE_BOOST: 1.1
};

// ============================================
// OUTPUT NAMING DEFAULTS
// ============================================

export const OUTPUT_NAMING = {
  DEFAULT_PATTERN: '{platform}-{title}-{date}',
  DATE_FORMAT: 'YYYY-MM-DD',
  MAX_LENGTH: 80,
  SLUGIFY: true,
  INCLUDE_VIDEO_ID: true
};

// ============================================
// CSV HEADERS
// ============================================

export const CSV_HEADERS = {
  SCRIPTS: [
    'video_id',
    'script',
    'status',
    'voice',
    'language',
    'speaking_rate',
    'pitch',
    'audio_duration',
    'generated_at',
    'notes'
  ]
};

// ============================================
// STATUS VALUES
// ============================================

export const VIDEO_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  GENERATED: 'generated',
  ERROR: 'error',
  REGENERATE: 'regenerate'
};

// ============================================
// QUALITY MODES
// ============================================

export const QUALITY_MODES = {
  DRAFT: 'draft',
  HIGH: 'high'
};

// ============================================
// INTRO/OUTRO MODES
// ============================================

export const INTRO_OUTRO_MODES = {
  BOTH: 'both',
  INTRO: 'intro',
  OUTRO: 'outro',
  NONE: 'none'
};

// ============================================
// CLIP TRANSITIONS
// ============================================

export const TRANSITIONS = {
  NONE: 'none',
  FADE: 'fade',
  FADE_BLACK: 'fade-black',
  CROSSFADE: 'crossfade'
};

export const TRANSITION_DEFAULTS = {
  TYPE: 'none',
  DURATION: 0.5,  // seconds
  BLACK_DURATION: 0.3  // seconds for fade-black
};

// ============================================
// MOTION EFFECTS
// ============================================

export const MOTION_EFFECTS = {
  STATIC: 'static',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
  PAN_LEFT: 'pan-left',
  PAN_RIGHT: 'pan-right',
  PAN_UP: 'pan-up',
  PAN_DOWN: 'pan-down',
  RANDOM: 'random'
};

export const MOTION_EFFECT_INTENSITY = {
  SUBTLE: 1.05,   // 5% zoom
  MODERATE: 1.10, // 10% zoom
  STRONG: 1.15    // 15% zoom
};

// ============================================
// CLIP PAIRING
// ============================================

export const CLIP_MODES = {
  SINGLE_AUDIO: 'single-audio',      // One audio for all images
  PAIRED: 'paired',                   // Match audio1-image1, audio2-image2, etc.
  AUTO_DETECT: 'auto'                 // Detect based on file count
};