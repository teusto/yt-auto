import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { AssemblyAI } from 'assemblyai';
import dotenv from 'dotenv';
import { Spinner as ImportedSpinner } from './core/spinner.js';
import { colorToASS as colorToASSUtil } from './utils/color-utils.js';
import { getAudioDuration as getAudioDurationUtil, delayVoiceover as delayVoiceoverUtil, mixAudioWithBackgroundMusic as mixAudioWithBackgroundMusicUtil } from './media/audio/index.js';
import { FILE_FORMATS, VIDEO_DIMENSIONS, FRAME_RATES, SUBTITLE_DEFAULTS, SUBTITLE_ALIGNMENT, SUBTITLE_STYLES, LANGUAGE_LEARNING as LL_CONST, CTA_DEFAULTS, PLATFORM_FORMAT_MAP, FILE_NAMES, ENCODING_PRESETS, QUALITY_MODES, VIRAL_STYLE_SETTINGS } from './config/constants.js';
import { promptAspectRatio as promptAspectRatioExternal } from './ui/prompts/aspect-ratio.js';
import { promptAnimationEffect as promptAnimationEffectExternal } from './ui/prompts/animation.js';
import { promptQualityMode as promptQualityModeExternal } from './ui/prompts/quality.js';
import { promptAudioConfig as promptAudioConfigExternal } from './ui/prompts/audio-config.js';
import { promptSubtitleStyle as promptSubtitleStyleExternal } from './ui/prompts/subtitles.js';
import { promptLanguageLearningMode as promptLanguageLearningModeExternal } from './ui/prompts/language-learning.js';
import { promptFontSelection as promptFontSelectionExternal } from './ui/prompts/fonts.js';
import { detectIntroOutro as detectIntroOutroExternal, promptIntroOutro as promptIntroOutroExternal } from './ui/prompts/intro-outro.js';
import { detectCTA as detectCTAExternal, promptCTA as promptCTAExternal } from './ui/prompts/cta.js';
import { promptExportFormats as promptExportFormatsExternal } from './ui/prompts/export-formats.js';
import { validateChannelConfig, validateProjectConfig, validateAppConfig } from './config/validators.js';
import { convertSRTtoASS as convertSRTtoASSExternal } from './subtitles/convert.js';
import { buildForceStyle } from './subtitles/styler.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Spinner for progress indication
class Spinner extends ImportedSpinner {}

// Configuration
const CONFIG = {
  inputFolder: path.join(__dirname, '../input'),
  outputFolder: path.join(__dirname, '../output'),
  fontsFolder: path.join(__dirname, '../fonts'),
  introsFolder: path.join(__dirname, '../intros'),
  ctaFolder: path.join(__dirname, '../cta'),
  videoWidth: VIDEO_DIMENSIONS['16:9'].width,
  videoHeight: VIDEO_DIMENSIONS['16:9'].height,
  fps: FRAME_RATES.STANDARD,
  animationFps: FRAME_RATES.ANIMATION, // Lower FPS for animations = faster processing
  imageFormats: FILE_FORMATS.IMAGE,
  videoFormats: FILE_FORMATS.VIDEO,
  audioFormats: FILE_FORMATS.AUDIO,
  fontFormats: FILE_FORMATS.FONT,
  subtitleFile: FILE_NAMES.SUBTITLES, // Expected subtitle file name in input folder
  aspectRatio: '16:9', // Will be set by user prompt
  useOriginalSize: false, // Will be set by user prompt
  animationEffect: 'static', // Will be set by user prompt
  qualityMode: 'high', // 'draft' or 'high' - Will be set by user prompt
  
  // Aspect ratio dimensions map
  aspectRatios: VIDEO_DIMENSIONS,
  
  // Audio Configuration
  audio: {
    voiceVolume: 1.0,      // 0.0 to 2.0 (1.0 = 100%)
    musicVolume: 0.35,     // 0.0 to 1.0 (0.35 = 35%)
    musicFadeIn: 2,        // seconds
    musicFadeOut: 3,       // seconds
    voiceFadeIn: 1,        // seconds
    voiceFadeOut: 1        // seconds
  },
  
  // Subtitle Styling Configuration
  subtitleStyle: {
    fontFamily: SUBTITLE_DEFAULTS.FONT_FAMILY,
    fontPath: null,        // Path to custom font file (null = use system font)
    fontSize: SUBTITLE_DEFAULTS.FONT_SIZE,
    fontColor: SUBTITLE_DEFAULTS.FONT_COLOR,
    outlineColor: SUBTITLE_DEFAULTS.OUTLINE_COLOR,
    outlineWidth: SUBTITLE_DEFAULTS.OUTLINE_WIDTH,
    backgroundColor: SUBTITLE_DEFAULTS.BACKGROUND_COLOR,
    position: SUBTITLE_DEFAULTS.POSITION,    // 'top', 'bottom'
    marginV: SUBTITLE_DEFAULTS.MARGIN_V,
    alignment: 2,          // 1=left, 2=center, 3=right
    bold: false,
    italic: false
  },
  
  // Auto-Subtitle Language (for AssemblyAI)
  subtitleLanguage: null,  // Will be set by channel config or .env
  
  // Language Learning - Dual Subtitles
  languageLearning: {
    enabled: false,        // Will be set by user prompt
    dualSubtitles: false,  // Show two languages simultaneously
    targetFile: 'subtitles_target.srt',   // Target language (learning)
    nativeFile: 'subtitles_native.srt',   // Native language (translation)
    targetSize: LL_CONST.TARGET_SIZE,        // Larger for target language
    nativeSize: LL_CONST.NATIVE_SIZE,        // Smaller for native language
    targetColor: LL_CONST.TARGET_COLOR,
    nativeColor: LL_CONST.NATIVE_COLOR, // Slightly dimmer
    spacing: LL_CONST.SPACING            // Pixels between subtitle lines
  },
  
  // Intro/Outro Configuration
  introOutro: {
    enabled: false,        // Will be set by detection/prompt
    introPath: null,       // Path to intro video
    outroPath: null,       // Path to outro video
    mode: 'both'           // 'both', 'intro', 'outro', 'none'
  },
  
  // CTA (Call-to-Action) Configuration
  cta: {
    enabled: false,        // Will be set by detection/prompt
    imagePath: null,       // Path to CTA image or video
    isVideo: false,        // Is the CTA a video file (true) or image (false)
    position: CTA_DEFAULTS.POSITION, // 'left-top', 'middle-top', 'right-top', 'left-bottom', 'middle-bottom', 'right-bottom'
    startTime: CTA_DEFAULTS.START_TIME,          // Seconds into video
    duration: CTA_DEFAULTS.DURATION,           // How long to show (seconds)
    opacity: CTA_DEFAULTS.OPACITY,          // 0.0 to 1.0
    scale: CTA_DEFAULTS.SCALE            // Scale relative to video width (0.15 = 15%)
  },
  
  // Export Formats Configuration
  exportFormats: {
    formats: ['16:9'],     // Will be set by user prompt: ['16:9', '9:16', '1:1', 'original']
    outputNames: PLATFORM_FORMAT_MAP
  }
};

/**
 * Prompt user for aspect ratio selection
 */
function promptAspectRatio() {
  // Delegate to extracted prompt module
  return promptAspectRatioExternal(CONFIG);
}

/**
 * Prompt user for animation effect selection
 */
function promptAnimationEffect() {
  // Delegate to extracted prompt module
  return promptAnimationEffectExternal(CONFIG);
}

/**
 * Prompt user for quality mode selection
 */
function promptQualityMode() {
  // Delegate to extracted prompt module
  return promptQualityModeExternal(CONFIG);
}

/**
 * Prompt user for audio configuration
 */
function promptAudioConfig(hasBackgroundMusic) {
  // Delegate to extracted prompt module
  return promptAudioConfigExternal(CONFIG, hasBackgroundMusic);
}

/**
 * Get available fonts from fonts folder
 */
function getAvailableFonts() {
  if (!fs.existsSync(CONFIG.fontsFolder)) {
    return [];
  }

  const files = fs.readdirSync(CONFIG.fontsFolder);
  return files
    .filter(file => {
      // Skip directories and non-files
      const fullPath = path.join(CONFIG.fontsFolder, file);
      if (!fs.statSync(fullPath).isFile()) {
        return false;
      }
      // Only include font file extensions
      const ext = path.extname(file).toLowerCase();
      return CONFIG.fontFormats.includes(ext);
    })
    .map(file => ({
      filename: file,
      displayName: formatFontName(file),
      path: path.join(CONFIG.fontsFolder, file)
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

/**
 * Format font filename for display
 * Example: "Roboto-Bold.ttf" -> "Roboto Bold"
 */
function formatFontName(filename) {
  // Remove extension
  let name = filename.replace(/\.(ttf|otf|woff|woff2)$/i, '');
  
  // Replace hyphens and underscores with spaces
  name = name.replace(/[-_]/g, ' ');
  
  // Add space before capital letters (camelCase)
  name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return name;
}

/**
 * Prompt user to select a font
 */
function promptFontSelection() {
  const fonts = getAvailableFonts();
  return promptFontSelectionExternal(CONFIG, fonts);
}

/**
 * Prompt user for subtitle style
 */
function promptSubtitleStyle() {
  // Delegate to extracted prompt module
  return promptSubtitleStyleExternal(CONFIG);
}

/**
 * Prompt user for language learning mode
 */
function promptLanguageLearningMode() {
  // Delegate to extracted prompt module
  return promptLanguageLearningModeExternal(CONFIG);
}

/**
 * Detect intro/outro videos in intros folder
 */
function detectIntroOutro() {
  return detectIntroOutroExternal(CONFIG);
}

/**
 * Prompt user for intro/outro selection
 */
function promptIntroOutro() {
  return promptIntroOutroExternal(CONFIG);
}

/**
 * Detect CTA media (images or videos) in cta folder
 */
function detectCTA() { return detectCTAExternal(CONFIG); }

/**
 * Prompt user for CTA overlay selection
 */
function promptCTA() { return promptCTAExternal(CONFIG); }

/**
 * Prompt user for export format selection
 */
function promptExportFormats() { return promptExportFormatsExternal(CONFIG); }

/**
 * Get encoding settings based on quality mode
 */
function getEncodingSettings() {
  if (CONFIG.qualityMode === QUALITY_MODES.DRAFT) {
    return ENCODING_PRESETS.DRAFT;
  }
  return ENCODING_PRESETS.HIGH;
}

/**
 * Get all files in a directory with specific extensions
 */
function getFilesByExtension(dir, extensions) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory not found: ${dir}`);
  }

  const files = fs.readdirSync(dir);
  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return extensions.includes(ext);
    })
    .map(file => path.join(dir, file))
    .sort();
}

/**
 * Check if file is a video
 */
function isVideoFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return CONFIG.videoFormats.includes(ext);
}

/**
 * Check if file is an image
 */
function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return CONFIG.imageFormats.includes(ext);
}

/**
 * Convert color names to ASS color format
 */
function colorToASS(color) {
  // Delegate to extracted utility to ensure single source of truth
  return colorToASSUtil(color);
}

/**
 * Detect available channels
 */
function detectChannels() {
  const channelsFolder = path.join(path.dirname(__dirname), 'channels');
  
  if (!fs.existsSync(channelsFolder)) {
    console.log('📁 Channels folder not found, creating...');
    fs.mkdirSync(channelsFolder, { recursive: true });
    return [];
  }
  
  const folders = fs.readdirSync(channelsFolder).filter(item => {
    const itemPath = path.join(channelsFolder, item);
    // Must be directory and have channel.json
    if (!fs.statSync(itemPath).isDirectory()) return false;
    if (item.startsWith('example-') || item.startsWith('.')) return false;
    
    const channelConfigPath = path.join(itemPath, 'channel.json');
    return fs.existsSync(channelConfigPath);
  });
  
  const channels = folders.map(folder => {
    const channelPath = path.join(channelsFolder, folder);
    const configPath = path.join(channelPath, 'channel.json');
    
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const videosPath = path.join(channelPath, 'videos');
      const videoCount = fs.existsSync(videosPath) ? 
        fs.readdirSync(videosPath).filter(f => fs.statSync(path.join(videosPath, f)).isDirectory()).length : 0;
      
      return {
        name: folder,
        path: channelPath,
        config: config,
        videoCount: videoCount
      };
    } catch (error) {
      console.log(`⚠️  Could not load channel: ${folder}`);
      return null;
    }
  }).filter(c => c !== null);
  
  return channels;
}

/**
 * Load channel configuration and apply defaults to CONFIG
 */
function loadChannelConfig(channelPath) {
  const configPath = path.join(channelPath, 'channel.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Channel config not found: ${configPath}`);
  }
  
  try {
    const channelConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const defaults = channelConfig.defaults || {};
    
    // Apply channel defaults to CONFIG
    if (defaults.aspectRatio) {
      CONFIG.aspectRatio = defaults.aspectRatio;
      const dimensions = CONFIG.aspectRatios[defaults.aspectRatio];
      if (dimensions) {
        CONFIG.videoWidth = dimensions.width;
        CONFIG.videoHeight = dimensions.height;
      }
    }
    
    if (defaults.animation) {
      CONFIG.animationEffect = defaults.animation;
    }
    
    if (defaults.qualityMode) {
      CONFIG.qualityMode = defaults.qualityMode;
    }
    
    if (defaults.subtitle) {
      CONFIG.subtitleStyle = { ...CONFIG.subtitleStyle, ...defaults.subtitle };
    }
    
    if (defaults.audio) {
      CONFIG.audio = { ...CONFIG.audio, ...defaults.audio };
    }
    
    if (defaults.cta) {
      CONFIG.cta = { ...CONFIG.cta, ...defaults.cta };
    }
    
    if (defaults.language) {
      CONFIG.subtitleLanguage = defaults.language;
    }
    
    const { warnings, errors } = validateChannelConfig(channelConfig);
    errors.forEach(e => console.log(`   ❌ Channel config error: ${e}`));
    warnings.forEach(w => console.log(`   ⚠️  Channel config: ${w}`));
    return channelConfig;
  } catch (error) {
    throw new Error(`Failed to parse channel config: ${error.message}`);
  }
}

/**
 * Merge configuration with video type support
 * Priority: channel defaults < video type config < video config
 */
function mergeConfigWithVideoType(channelConfig, videoConfig) {
  let mergedConfig = { ...channelConfig.defaults };
  
  // If video specifies a type, apply that type's config
  if (videoConfig.videoType && channelConfig.videoTypes && channelConfig.videoTypes[videoConfig.videoType]) {
    const videoTypeConfig = channelConfig.videoTypes[videoConfig.videoType];
    
    // Deep merge video type config
    mergedConfig = deepMerge(mergedConfig, videoTypeConfig);
  }
  
  // Apply video-specific overrides last
  mergedConfig = deepMerge(mergedConfig, videoConfig);
  
  return mergedConfig;
}

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * Select random music from channel pool
 */
function selectRandomMusicFromPool(channelPath) {
  const musicPoolPath = path.join(channelPath, 'music-pool');
  
  if (!fs.existsSync(musicPoolPath)) {
    return null;
  }
  
  const musicFiles = getMediaFiles(musicPoolPath, CONFIG.audioFormats);
  
  if (musicFiles.length === 0) {
    return null;
  }
  
  // Load history
  const historyPath = path.join(path.dirname(__dirname), '.music-pool-history.json');
  let history = { channels: {} };
  
  try {
    if (fs.existsSync(historyPath)) {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
    }
  } catch (error) {
    // Ignore errors, start fresh
  }
  
  const channelName = path.basename(channelPath);
  const recentlyUsed = history.channels[channelName] || [];
  
  // Filter out recently used tracks
  const freshTracks = musicFiles.filter(track => {
    const basename = path.basename(track);
    return !recentlyUsed.includes(basename);
  });
  
  // Use fresh tracks if available, otherwise use all
  const availableTracks = freshTracks.length > 0 ? freshTracks : musicFiles;
  
  // Pick random
  const selected = availableTracks[Math.floor(Math.random() * availableTracks.length)];
  
  // Update history
  if (!history.channels[channelName]) {
    history.channels[channelName] = [];
  }
  history.channels[channelName].push(path.basename(selected));
  
  // Keep only last 10
  if (history.channels[channelName].length > 10) {
    history.channels[channelName] = history.channels[channelName].slice(-10);
  }
  
  history.lastUpdate = new Date().toISOString();
  
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  } catch (error) {
    // Ignore write errors
  }
  
  return selected;
}

/**
 * Detect video projects in a channel
 */
function detectChannelProjects(channelPath, channelConfig) {
  const videosFolder = path.join(channelPath, 'videos');
  const projects = [];
  
  if (!fs.existsSync(videosFolder)) {
    console.log(`⚠️  No videos folder found in channel`);
    return projects;
  }
  
  const videoFolders = fs.readdirSync(videosFolder).filter(item => {
    const itemPath = path.join(videosFolder, item);
    return fs.statSync(itemPath).isDirectory();
  });
  
  console.log(`\n🔍 Scanning channel videos: ${channelConfig.name || path.basename(channelPath)}`);
  console.log(`   Found ${videoFolders.length} video folders\n`);
  
  for (const folder of videoFolders) {
    const projectPath = path.join(videosFolder, folder);
    
    // Look for required files
    const voiceFile = findFileByPattern(projectPath, /^voice\.(mp3|wav)$/i);
    
    // Check for music file (project-specific)
    let musicFile = findFileByPattern(projectPath, /^music\.(mp3|wav)$/i);
    
    // If no project music and channel has random music enabled, use pool
    if (!musicFile && channelConfig.defaults && channelConfig.defaults.randomMusic && channelConfig.defaults.useChannelMusicPool) {
      musicFile = selectRandomMusicFromPool(channelPath);
      if (musicFile) {
        console.log(`   🎵 Selected random music for ${folder}: ${path.basename(musicFile)}`);
      }
    }
    
    // Check for subtitle files
    const subtitleFile = findFileByPattern(projectPath, /^subtitles\.ass$/i) || 
                         findFileByPattern(projectPath, /^subtitles\.srt$/i);
    const targetSubFile = findFileByPattern(projectPath, /^subtitles_target\.ass$/i) ||
                          findFileByPattern(projectPath, /^subtitles_target\.srt$/i);
    const nativeSubFile = findFileByPattern(projectPath, /^subtitles_native\.ass$/i) ||
                          findFileByPattern(projectPath, /^subtitles_native\.srt$/i);
    
    const imagesFolder = path.join(projectPath, 'images');
    const videosSubFolder = path.join(projectPath, 'videos');
    const configFile = path.join(projectPath, 'config.json');
    
    // Load project config with video type support
    let videoConfigOverrides = {};
    let videoType = null;
    
    if (fs.existsSync(configFile)) {
      try {
        videoConfigOverrides = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
        videoType = videoConfigOverrides.videoType || null;
      } catch (error) {
        console.log(`   ⚠️  Could not parse config.json for ${folder}`);
      }
    }
    
    // Merge: channel defaults → video type config → video overrides
    const projectConfig = mergeConfigWithVideoType(channelConfig, videoConfigOverrides);
    const vRes = validateProjectConfig(projectConfig);
    vRes.warnings.forEach(w => console.log(`   ⚠️  Project config: ${w}`));
    
    // Check if project will use channel image pool
    const useChannelPool = projectConfig.randomImages && projectConfig.useChannelPool !== false;
    
    // Check if project has local media
    const hasImages = fs.existsSync(imagesFolder) && fs.readdirSync(imagesFolder).length > 0;
    const hasVideos = fs.existsSync(videosSubFolder) && fs.readdirSync(videosSubFolder).length > 0;
    
    // Project is valid if has voice and either local media or uses pool
    if (voiceFile && (hasImages || hasVideos || useChannelPool)) {
      const project = {
        name: folder,
        path: projectPath,
        voice: voiceFile,
        music: musicFile || null,
        subtitles: subtitleFile || null,
        subtitlesTarget: targetSubFile || null,
        subtitlesNative: nativeSubFile || null,
        images: hasImages ? getMediaFiles(imagesFolder, CONFIG.imageFormats) : [],
        videos: hasVideos ? getMediaFiles(videosSubFolder, CONFIG.videoFormats) : [],
        config: projectConfig,
        channelPath: channelPath  // Store channel path for pool access
      };
      
      projects.push(project);
      
      // Show project summary
      console.log(`✅ ${folder}`);
      console.log(`   Voice: ${path.basename(voiceFile)}`);
      if (musicFile) console.log(`   Music: ${path.basename(musicFile)}`);
      if (subtitleFile) console.log(`   Subtitles: ${path.basename(subtitleFile)}`);
      
      // Show video type if specified
      if (videoType) {
        const typeDesc = channelConfig.videoTypes?.[videoType]?.description || videoType;
        console.log(`   📹 Video Type: ${videoType} (${typeDesc})`);
        console.log(`   📐 Format: ${projectConfig.aspectRatio || '16:9'}, ${projectConfig.imageCount || 'auto'} images`);
      } else {
        console.log(`   📐 Format: ${projectConfig.aspectRatio || '16:9'}, ${projectConfig.imageCount || 'auto'} images`);
      }
      
      // Show media source
      if (useChannelPool && !hasImages && !hasVideos) {
        console.log(`   Media: Using channel image pool`);
      } else if (useChannelPool && (hasImages || hasVideos)) {
        console.log(`   Media: ${project.images.length} images, ${project.videos.length} videos + channel pool`);
      } else {
        console.log(`   Media: ${project.images.length} images, ${project.videos.length} videos`);
      }
      
      if (fs.existsSync(configFile)) {
        console.log(`   Config: Custom overrides loaded`);
      }
      console.log('');
    } else {
      console.log(`⚠️  ${folder} - Missing required files`);
      if (!voiceFile) console.log(`   ❌ No ${FILE_NAMES.VOICE} found`);
      if (!hasImages && !hasVideos && !useChannelPool) {
        console.log(`   ❌ No images/ or videos/ folder with content`);
        console.log(`   💡 Tip: Enable channel pool in channel.json or add images/`);
      }
      console.log('');
    }
  }
  
  return projects;
}

/**
 * Detect and parse batch video projects (LEGACY - backward compatibility)
 */
function detectBatchProjects(batchFolder) {
  const projects = [];
  
  if (!fs.existsSync(batchFolder)) {
    console.log(`📁 Batch folder not found: ${batchFolder}`);
    console.log(`   Creating: ${batchFolder}`);
    fs.mkdirSync(batchFolder, { recursive: true });
    return projects;
  }
  
  // Exclude system/working folders
  const excludeFolders = ['input', 'output', 'example-random-pool', 'example-project', '.git'];
  
  const folders = fs.readdirSync(batchFolder).filter(item => {
    const itemPath = path.join(batchFolder, item);
    // Must be directory and not in exclude list
    return fs.statSync(itemPath).isDirectory() && !excludeFolders.includes(item);
  });
  
  console.log(`\n🔍 Scanning batch folder: ${batchFolder}`);
  console.log(`   Found ${folders.length} project folders\n`);
  
  for (const folder of folders) {
    const projectPath = path.join(batchFolder, folder);
    
    // Look for required files
    const voiceFile = findFileByPattern(projectPath, /^voice\.(mp3|wav)$/i);
    const musicFile = findFileByPattern(projectPath, /^music\.(mp3|wav)$/i);
    
    // Check for subtitle files (.ass or .srt, prefer .ass)
    const subtitleFile = findFileByPattern(projectPath, /^subtitles\.ass$/i) || 
                         findFileByPattern(projectPath, /^subtitles\.srt$/i);
    const targetSubFile = findFileByPattern(projectPath, /^subtitles_target\.ass$/i) ||
                          findFileByPattern(projectPath, /^subtitles_target\.srt$/i);
    const nativeSubFile = findFileByPattern(projectPath, /^subtitles_native\.ass$/i) ||
                          findFileByPattern(projectPath, /^subtitles_native\.srt$/i);
    const imagesFolder = path.join(projectPath, 'images');
    const videosFolder = path.join(projectPath, 'videos');
    const configFile = path.join(projectPath, 'config.json');
    
    // Load config first to check if using shared pool
    let config = {};
    if (fs.existsSync(configFile)) {
      try {
        const configContent = fs.readFileSync(configFile, 'utf-8');
        config = JSON.parse(configContent);
        const { warnings } = validateProjectConfig(config);
        warnings.forEach(w => console.log(`   ⚠️  Project config: ${w}`));
      } catch (error) {
        console.log(`   ⚠️  Could not parse config.json for ${folder}`);
      }
    }
    
    // Check if project will use shared image pool
    const willUseSharedPool = config.randomImages && config.useSharedPool !== false;
    
    // Check if project has required assets
    const hasImages = fs.existsSync(imagesFolder) && fs.readdirSync(imagesFolder).length > 0;
    const hasVideos = fs.existsSync(videosFolder) && fs.readdirSync(videosFolder).length > 0;
    
    // Project is valid if:
    // 1. Has voice file AND
    // 2. Either has local media (images/videos) OR will use shared pool
    if (voiceFile && (hasImages || hasVideos || willUseSharedPool)) {
      const project = {
        name: folder,
        path: projectPath,
        voice: voiceFile,
        music: musicFile || null,
        subtitles: subtitleFile || null,
        subtitlesTarget: targetSubFile || null,
        subtitlesNative: nativeSubFile || null,
        images: hasImages ? getMediaFiles(imagesFolder, CONFIG.imageFormats) : [],
        videos: hasVideos ? getMediaFiles(videosFolder, CONFIG.videoFormats) : [],
        config: config
      };
      
      projects.push(project);
      
      // Show project summary
      console.log(`✅ ${folder}`);
      console.log(`   Voice: ${path.basename(voiceFile)}`);
      if (musicFile) console.log(`   Music: ${path.basename(musicFile)}`);
      if (subtitleFile) console.log(`   Subtitles: ${path.basename(subtitleFile)}`);
      if (targetSubFile && nativeSubFile) console.log(`   Subtitles: Dual language mode`);
      
      // Show media source
      if (willUseSharedPool && !hasImages && !hasVideos) {
        console.log(`   Media: Using shared image pool (${config.imageCount || 'all'} images)`);
      } else if (willUseSharedPool && (hasImages || hasVideos)) {
        console.log(`   Media: ${project.images.length} images, ${project.videos.length} videos + shared pool`);
      } else {
        console.log(`   Media: ${project.images.length} images, ${project.videos.length} videos`);
      }
      
      if (Object.keys(config).length > 0) {
        console.log(`   Config: Custom settings loaded`);
      }
      console.log('');
    } else {
      console.log(`⚠️  ${folder} - Missing required files`);
      if (!voiceFile) console.log(`   ❌ No voice.mp3 found`);
      if (!hasImages && !hasVideos && !willUseSharedPool) {
        console.log(`   ❌ No images/ or videos/ folder with content`);
        console.log(`   💡 Tip: Or enable shared pool in config.json: {"randomImages": true, "useSharedPool": true}`);
      }
      console.log('');
    }
  }
  
  return projects;
}

/**
 * Find file by pattern in directory
 */
function findFileByPattern(dir, pattern) {
  try {
    const files = fs.readdirSync(dir);
    const match = files.find(file => pattern.test(file));
    return match ? path.join(dir, match) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Get all media files from a folder
 */
function getMediaFiles(folder, extensions) {
  try {
    return fs.readdirSync(folder)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return extensions.includes(ext);
      })
      .map(file => path.join(folder, file))
      .sort();
  } catch (error) {
    return [];
  }
}

/**
 * Apply project config to global CONFIG
 */
function applyProjectConfig(projectConfig) {
  // Store original config to restore later
  const originalConfig = JSON.parse(JSON.stringify({
    aspectRatio: CONFIG.aspectRatio,
    animationEffect: CONFIG.animationEffect,
    qualityMode: CONFIG.qualityMode,
    subtitleStyle: CONFIG.subtitleStyle,
    cta: CONFIG.cta
  }));
  
  // Apply project-specific settings
  if (projectConfig.aspectRatio) {
    CONFIG.aspectRatio = projectConfig.aspectRatio;
    const dimensions = CONFIG.aspectRatios[projectConfig.aspectRatio];
    if (dimensions) {
      CONFIG.videoWidth = dimensions.width;
      CONFIG.videoHeight = dimensions.height;
    }
  }
  
  if (projectConfig.animation) {
    CONFIG.animationEffect = projectConfig.animation;
  }
  
  if (projectConfig.qualityMode) {
    CONFIG.qualityMode = projectConfig.qualityMode;
  }
  
  if (projectConfig.subtitle) {
    if (projectConfig.subtitle.style) {
      // Map style names to centralized constants
      const styleMap = {
        'classic': SUBTITLE_STYLES.CLASSIC,
        'bold': SUBTITLE_STYLES.BOLD,
        'yellow': SUBTITLE_STYLES.YELLOW,
        'minimal': SUBTITLE_STYLES.MINIMAL,
        'modern': SUBTITLE_STYLES.MODERN
      };
      const style = styleMap[projectConfig.subtitle.style];
      if (style) {
        Object.assign(CONFIG.subtitleStyle, style);
      }
    }
    
    // Apply all individual subtitle properties (these override style presets)
    if (projectConfig.subtitle.fontSize !== undefined) {
      CONFIG.subtitleStyle.fontSize = projectConfig.subtitle.fontSize;
    }
    
    if (projectConfig.subtitle.fontColor !== undefined) {
      CONFIG.subtitleStyle.fontColor = projectConfig.subtitle.fontColor;
    }
    
    if (projectConfig.subtitle.outlineColor !== undefined) {
      CONFIG.subtitleStyle.outlineColor = projectConfig.subtitle.outlineColor;
    }
    
    if (projectConfig.subtitle.outlineWidth !== undefined) {
      CONFIG.subtitleStyle.outlineWidth = projectConfig.subtitle.outlineWidth;
    }
    
    if (projectConfig.subtitle.bold !== undefined) {
      CONFIG.subtitleStyle.bold = projectConfig.subtitle.bold;
    }
    
    if (projectConfig.subtitle.italic !== undefined) {
      CONFIG.subtitleStyle.italic = projectConfig.subtitle.italic;
    }
    
    if (projectConfig.subtitle.fontFamily !== undefined) {
      CONFIG.subtitleStyle.fontFamily = projectConfig.subtitle.fontFamily;
    }
    
    if (projectConfig.subtitle.alignment !== undefined) {
      CONFIG.subtitleStyle.alignment = projectConfig.subtitle.alignment;
    }
    
    if (projectConfig.subtitle.marginV !== undefined) {
      CONFIG.subtitleStyle.marginV = projectConfig.subtitle.marginV;
    }
    
    if (projectConfig.subtitle.fontName) {
      // Look for font file in fonts/ folder
      const fontPath = path.join(CONFIG.fontsFolder, projectConfig.subtitle.fontName + '.ttf');
      const fontPathOtf = path.join(CONFIG.fontsFolder, projectConfig.subtitle.fontName + '.otf');
      
      if (fs.existsSync(fontPath)) {
        CONFIG.subtitleStyle.fontFamily = projectConfig.subtitle.fontName;
        CONFIG.subtitleStyle.fontPath = fontPath;
        console.log(`✅ Using font: ${projectConfig.subtitle.fontName}`);
      } else if (fs.existsSync(fontPathOtf)) {
        CONFIG.subtitleStyle.fontFamily = projectConfig.subtitle.fontName;
        CONFIG.subtitleStyle.fontPath = fontPathOtf;
        console.log(`✅ Using font: ${projectConfig.subtitle.fontName}`);
      } else {
        console.log(`⚠️  Font '${projectConfig.subtitle.fontName}' not found, using default`);
        CONFIG.subtitleStyle.fontFamily = 'Arial';
        CONFIG.subtitleStyle.fontPath = null;
      }
    }
    
    if (projectConfig.subtitle.position) {
      CONFIG.subtitleStyle.position = projectConfig.subtitle.position;
      // Map position to alignment (but allow manual override)
      const positionMap = {
        'bottom': { alignment: SUBTITLE_ALIGNMENT.CENTER, marginV: SUBTITLE_DEFAULTS.MARGIN_V },
        'center': { alignment: SUBTITLE_ALIGNMENT.MIDDLE_CENTER, marginV: 0 },
        'top': { alignment: SUBTITLE_ALIGNMENT.TOP_CENTER, marginV: SUBTITLE_DEFAULTS.MARGIN_V }
      };
      const pos = positionMap[projectConfig.subtitle.position];
      if (pos && projectConfig.subtitle.alignment === undefined) {
        CONFIG.subtitleStyle.alignment = pos.alignment;
      }
      if (pos && projectConfig.subtitle.marginV === undefined) {
        CONFIG.subtitleStyle.marginV = pos.marginV;
      }
    }
  }
  
  if (projectConfig.cta) {
    CONFIG.cta.enabled = projectConfig.cta.enabled !== false;
    if (projectConfig.cta.position) {
      CONFIG.cta.position = projectConfig.cta.position;
    }
    if (projectConfig.cta.imagePath) {
      // Resolve relative to project folder
      CONFIG.cta.imagePath = projectConfig.cta.imagePath;
    }
  }
  
  // Handle intro/outro config
  if (projectConfig.intro) {
    if (projectConfig.intro.enabled !== undefined) {
      CONFIG.introOutro.enabled = projectConfig.intro.enabled;
    }
    if (projectConfig.intro.videoFile) {
      CONFIG.introOutro.introFile = projectConfig.intro.videoFile;
    }
  }
  
  if (projectConfig.outro) {
    if (projectConfig.outro.enabled !== undefined) {
      CONFIG.introOutro.enabled = projectConfig.outro.enabled;
    }
    if (projectConfig.outro.videoFile) {
      CONFIG.introOutro.outroFile = projectConfig.outro.videoFile;
    }
  }
  
  return originalConfig;
}

/**
 * Restore original config
 */
function restoreConfig(originalConfig) {
  CONFIG.aspectRatio = originalConfig.aspectRatio;
  CONFIG.animationEffect = originalConfig.animationEffect;
  CONFIG.qualityMode = originalConfig.qualityMode;
  CONFIG.subtitleStyle = originalConfig.subtitleStyle;
  CONFIG.cta = originalConfig.cta;
}

/**
 * Process batch projects
 */
async function processBatchProjects() {
  const batchFolder = path.join(path.dirname(__dirname), 'batch-videos');
  const projects = detectBatchProjects(batchFolder);
  
  if (projects.length === 0) {
    console.log('\n📭 No valid projects found in batch-videos/');
    console.log(`   Create project folders with ${FILE_NAMES.VOICE} and images/\n`);
    return;
  }
  
  console.log(`\n🎬 Starting batch processing: ${projects.length} projects\n`);
  
  const results = {
    total: projects.length,
    successful: 0,
    failed: 0,
    details: []
  };
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const projectNum = i + 1;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📹 [${projectNum}/${projects.length}] Processing: ${project.name}`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
      // Apply project config
      const originalConfig = applyProjectConfig(project.config);
      
      // Copy files to input folder (temporary approach)
      await prepareProjectInput(project);
      
      // Generate video (skip prompts - config already set)
      const startTime = Date.now();
      await generateVideo(true);
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Move output to project-specific folder
      const outputFile = await moveOutputToProject(project);
      
      // Restore original config
      restoreConfig(originalConfig);
      
      results.successful++;
      results.details.push({
        project: project.name,
        status: 'success',
        duration: duration,
        output: outputFile
      });
      
      console.log(`\n✅ Success: ${project.name} (${duration}s)\n`);
      
    } catch (error) {
      results.failed++;
      results.details.push({
        project: project.name,
        status: 'failed',
        error: error.message
      });
      
      console.error(`\n❌ Failed: ${project.name}`);
      console.error(`   Error: ${error.message}\n`);
    }
  }
  
  // Print summary
  logger.section('📊 Batch Processing Complete');
  console.log(`Total Projects: ${results.total}`);
  console.log(`✅ Successful: ${results.successful}`);
  console.log(`❌ Failed: ${results.failed}\n`);
  
  if (results.successful > 0) {
    console.log(`📁 Output files:`);
    results.details
      .filter(r => r.status === 'success')
      .forEach(r => {
        console.log(`   ✅ ${r.project} → ${path.basename(r.output)} (${r.duration}s)`);
      });
    console.log('');
  }
  
  if (results.failed > 0) {
    console.log(`⚠️  Failed projects:`);
    results.details
      .filter(r => r.status === 'failed')
      .forEach(r => {
        console.log(`   ❌ ${r.project}: ${r.error}`);
      });
    console.log('');
  }
}

/**
 * Get image pool path based on aspect ratio
 */
function getImagePoolPath(aspectRatio) {
  const poolBasePath = path.join(path.dirname(__dirname), 'image-pool');
  
  const poolMap = {
    '16:9': 'youtube',
    '9:16': 'tiktok',
    '4:5': 'instagram',
    '1:1': 'square'
  };
  
  const poolFolder = poolMap[aspectRatio] || 'universal';
  const poolPath = path.join(poolBasePath, poolFolder);
  
  // Return path if exists, otherwise try universal
  if (fs.existsSync(poolPath)) {
    return poolPath;
  }
  
  const universalPath = path.join(poolBasePath, 'universal');
  if (fs.existsSync(universalPath)) {
    return universalPath;
  }
  
  return null;
}

/**
 * Load repetition history
 */
function loadRepetitionHistory() {
  const historyPath = path.join(path.dirname(__dirname), '.image-pool-history.json');
  
  try {
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('   ⚠️  Could not load repetition history, starting fresh');
  }
  
  return {
    youtube: [],
    tiktok: [],
    instagram: [],
    square: [],
    universal: []
  };
}

/**
 * Save repetition history
 */
function saveRepetitionHistory(history) {
  const historyPath = path.join(path.dirname(__dirname), '.image-pool-history.json');
  
  try {
    // Keep only last 20 images per format to avoid bloat
    Object.keys(history).forEach(format => {
      if (Array.isArray(history[format]) && history[format].length > 20) {
        history[format] = history[format].slice(-20);
      }
    });
    
    history.lastUpdate = new Date().toISOString();
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8');
  } catch (error) {
    console.log('   ⚠️  Could not save repetition history');
  }
}

/**
 * Select random images from pool and/or project images
 */
function selectRandomImages(projectImages, aspectRatio, config, channelPath = null) {
  const randomImages = config.randomImages || false;
  const imageCount = config.imageCount || null;
  const useSharedPool = config.useSharedPool !== undefined ? config.useSharedPool : 'auto';
  const useChannelPool = config.useChannelPool !== undefined ? config.useChannelPool : 'auto';
  
  // If random selection not enabled, return all project images
  if (!randomImages) {
    return projectImages;
  }
  
  // Default aspect ratio if not specified
  if (!aspectRatio) {
    aspectRatio = '16:9';
    console.log(`   ⚠️  No aspect ratio specified, defaulting to 16:9`);
  }
  
  let availableImages = [];
  let poolImages = [];
  let formatKey = '';
  
  // Determine if we should use channel pool (priority over global pool)
  const shouldUseChannelPool = channelPath && (
    useChannelPool === true ||
    useChannelPool === 'prefer' ||
    useChannelPool === 'mix' ||
    (useChannelPool === 'auto' && projectImages.length === 0)
  );
  
  // Determine if we should use global pool (fallback)
  const shouldUseGlobalPool = !shouldUseChannelPool && (
    useSharedPool === true || 
    useSharedPool === 'prefer' || 
    useSharedPool === 'mix' ||
    (useSharedPool === 'auto' && projectImages.length === 0)
  );
  
  // Load pool images if needed
  if (shouldUseChannelPool) {
    // Try channel pool first - aspect ratio specific
    const channelPoolBasePath = path.join(channelPath, 'image-pool');
    
    // Map aspect ratios to folder names
    const aspectRatioFolderMap = {
      '16:9': 'landscape',
      '9:16': 'portrait',
      '4:5': 'instagram',
      '1:1': 'square'
    };
    
    const aspectFolder = aspectRatioFolderMap[aspectRatio] || 'landscape';
    
    // Try aspect-specific folder first (e.g., image-pool/landscape/)
    const aspectSpecificPath = path.join(channelPoolBasePath, aspectFolder);
    
    if (fs.existsSync(aspectSpecificPath)) {
      poolImages = getMediaFiles(aspectSpecificPath, CONFIG.imageFormats);
      formatKey = `channel_${path.basename(channelPath)}_${aspectFolder}`;
      
      console.log(`   🎲 Channel image pool (${aspectFolder}): ${poolImages.length} images available`);
    } else if (fs.existsSync(channelPoolBasePath)) {
      // Fallback to root image-pool folder (for backward compatibility)
      const rootPoolImages = getMediaFiles(channelPoolBasePath, CONFIG.imageFormats);
      
      // Check if there's a 'universal' subfolder
      const universalPath = path.join(channelPoolBasePath, 'universal');
      if (fs.existsSync(universalPath)) {
        poolImages = getMediaFiles(universalPath, CONFIG.imageFormats);
        formatKey = `channel_${path.basename(channelPath)}_universal`;
        console.log(`   🎲 Channel image pool (universal): ${poolImages.length} images available`);
      } else if (rootPoolImages.length > 0) {
        // Use root pool if it has images
        poolImages = rootPoolImages;
        formatKey = `channel_${path.basename(channelPath)}`;
        console.log(`   🎲 Channel image pool: ${poolImages.length} images available`);
      }
    }
    
    // Fallback to global pool if channel pool doesn't exist
    if (poolImages.length === 0 && config.fallbackToGlobalPool !== false) {
      const globalPoolPath = getImagePoolPath(aspectRatio);
      if (globalPoolPath) {
        poolImages = getMediaFiles(globalPoolPath, CONFIG.imageFormats);
        formatKey = path.basename(globalPoolPath);
        console.log(`   🎲 Global image pool: ${poolImages.length} images available (${formatKey})`);
      }
    }
  } else if (shouldUseGlobalPool) {
    // Use global pool
    const poolPath = getImagePoolPath(aspectRatio);
    
    if (poolPath) {
      const poolMap = { 'youtube': 'youtube', 'tiktok': 'tiktok', 'instagram': 'instagram', 'square': 'square', 'universal': 'universal' };
      formatKey = path.basename(poolPath);
      
      poolImages = getMediaFiles(poolPath, CONFIG.imageFormats);
      
      // Load history and filter out recently used images
      const history = loadRepetitionHistory();
      const recentlyUsed = history[formatKey] || [];
      
      // Filter pool images to avoid repetition
      const freshPoolImages = poolImages.filter(img => {
        const basename = path.basename(img);
        return !recentlyUsed.includes(basename);
      });
      
      // If we filtered out everything, use all pool images (reset)
      const finalPoolImages = freshPoolImages.length > 0 ? freshPoolImages : poolImages;
      
      console.log(`   🎲 Image pool: ${finalPoolImages.length} images available (${formatKey})`);
      if (freshPoolImages.length < poolImages.length) {
        console.log(`   📊 Filtered out ${poolImages.length - freshPoolImages.length} recently used images`);
      }
      
      poolImages = finalPoolImages;
    } else {
      console.log(`   ⚠️  No image pool found for ${aspectRatio}, using project images only`);
    }
  }
  
  // Build available images based on useSharedPool setting
  if (useSharedPool === true) {
    // Pool only
    availableImages = [...poolImages];
  } else if (useSharedPool === false) {
    // Project only
    availableImages = [...projectImages];
  } else if (useSharedPool === 'prefer') {
    // Project first, then pool to fill
    availableImages = [...projectImages, ...poolImages];
  } else if (useSharedPool === 'mix') {
    // Random mix of both
    availableImages = [...projectImages, ...poolImages];
  } else {
    // Auto: use pool if no project images, otherwise project
    availableImages = projectImages.length > 0 ? [...projectImages] : [...poolImages];
  }
  
  if (availableImages.length === 0) {
    console.log('   ⚠️  No images available for random selection');
    return [];
  }
  
  // Determine how many images to select
  const targetCount = imageCount || availableImages.length;
  const selectCount = Math.min(targetCount, availableImages.length);
  
  // Shuffle and select
  const shuffled = availableImages.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, selectCount);
  
  console.log(`   ✅ Selected ${selected.length} random images (requested: ${targetCount})`);
  
  // Track selected pool images to avoid repetition
  if (poolImages.length > 0 && formatKey) {
    const history = loadRepetitionHistory();
    const selectedPoolImages = selected
      .filter(img => poolImages.includes(img))
      .map(img => path.basename(img));
    
    if (selectedPoolImages.length > 0) {
      history[formatKey] = [...(history[formatKey] || []), ...selectedPoolImages];
      saveRepetitionHistory(history);
    }
  }
  
  return selected;
}

/**
 * Prepare project input files (copy to input folder)
 */
async function prepareProjectInput(project) {
  const inputFolder = CONFIG.inputFolder;
  
  // Clear input folder
  if (fs.existsSync(inputFolder)) {
    const files = fs.readdirSync(inputFolder);
    files.forEach(file => {
      fs.unlinkSync(path.join(inputFolder, file));
    });
  } else {
    fs.mkdirSync(inputFolder, { recursive: true });
  }
  
  // Copy voice
  fs.copyFileSync(project.voice, path.join(inputFolder, FILE_NAMES.VOICE));
  
  // Copy music if exists
  if (project.music) {
    fs.copyFileSync(project.music, path.join(inputFolder, FILE_NAMES.MUSIC));
  }
  
  // Copy subtitles if exists (preserve extension: .srt or .ass)
  if (project.subtitles) {
    const subExt = path.extname(project.subtitles);
    fs.copyFileSync(project.subtitles, path.join(inputFolder, `subtitles${subExt}`));
  }
  
  // Copy dual language subtitles if exist (preserve extensions)
  if (project.subtitlesTarget && project.subtitlesNative) {
    const targetExt = path.extname(project.subtitlesTarget);
    const nativeExt = path.extname(project.subtitlesNative);
    fs.copyFileSync(project.subtitlesTarget, path.join(inputFolder, `subtitles_target${targetExt}`));
    fs.copyFileSync(project.subtitlesNative, path.join(inputFolder, `subtitles_native${nativeExt}`));
  }
  
  // Auto-generate subtitles if they don't exist (batch mode)
  if (!project.subtitles && !project.subtitlesTarget) {
    const voicePath = path.join(inputFolder, 'voice.mp3');
    // Generate to PROJECT folder so it's found on next run (caching)
    const subtitlePath = path.join(project.path, 'subtitles.srt');
    // Use video-specific language if specified in config
    const languageOverride = project.config.language || null;
    const generatedPath = await generateSubtitlesWithAssemblyAI(voicePath, subtitlePath, languageOverride);
    
    // If generated, update project and copy to input
    if (generatedPath) {
      project.subtitles = generatedPath;
      fs.copyFileSync(generatedPath, path.join(inputFolder, 'subtitles.srt'));
    }
  }
  
  // Handle media files (images/videos) with optional random selection
  let mediaCount = 0;
  
  // Apply random selection for images if configured
  let selectedImages = project.images;
  const willUsePool = project.config.randomImages && 
                      (project.config.useSharedPool !== false || project.config.useChannelPool !== false);
  
  // Call selectRandomImages if:
  // 1. Has local images and randomImages enabled, OR
  // 2. No local images but will use pool (channel or shared)
  if (project.config.randomImages && (project.images.length > 0 || willUsePool)) {
    console.log('\n🎲 Random Image Selection:');
    selectedImages = selectRandomImages(
      project.images,
      project.config.aspectRatio || CONFIG.aspectRatio,
      project.config,
      project.channelPath || null  // Pass channel path for channel pool support
    );
  }
  
  // Copy selected images
  if (selectedImages.length > 0) {
    selectedImages.forEach((img, index) => {
      const ext = path.extname(img);
      fs.copyFileSync(img, path.join(inputFolder, `image_${String(index + 1).padStart(3, '0')}${ext}`));
      mediaCount++;
    });
  }
  
  // Copy videos (no random selection for videos yet)
  if (project.videos.length > 0) {
    project.videos.forEach((vid, index) => {
      const ext = path.extname(vid);
      fs.copyFileSync(vid, path.join(inputFolder, `video_${String(index + 1).padStart(3, '0')}${ext}`));
      mediaCount++;
    });
  }
  
  console.log(`\n📁 Prepared ${mediaCount} media files for processing`);
}

/**
 * Move output file to project folder
 */
async function moveOutputToProject(project) {
  const outputFolder = CONFIG.outputFolder;
  const finalVideo = path.join(outputFolder, 'final_video.mp4');
  
  if (!fs.existsSync(finalVideo)) {
    throw new Error('Output video not found');
  }
  
  // Create output subfolder for project
  const projectOutputFolder = path.join(outputFolder, 'batch', project.name);
  if (!fs.existsSync(projectOutputFolder)) {
    fs.mkdirSync(projectOutputFolder, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const outputFile = path.join(projectOutputFolder, `${project.name}_${timestamp}.mp4`);
  
  fs.renameSync(finalVideo, outputFile);
  
  return outputFile;
}

/**
 * Convert SRT to ASS format with proper style definitions
 */
function convertSRTtoASS(srtPath, style) {
  // Delegate to extracted subtitles module
  // Pass word-level timestamps if available for karaoke animation
  const words = CONFIG.transcript ? CONFIG.transcript.words : null;
  
  console.log(`\n   🔄 Converting SRT to ASS...`);
  console.log(`   📁 Input: ${path.basename(srtPath)}`);
  console.log(`   🎨 Animation style: ${style.animationStyle || 'none'}`);
  console.log(`   📊 Word timestamps: ${words ? words.length : 0}`);
  
  if (style.animationStyle === 'karaoke') {
    if (words && words.length > 0) {
      console.log(`   ✅ Karaoke mode: Using ${words.length} word timestamps`);
    } else {
      console.log(`   ⚠️  Karaoke mode selected but no word timestamps available`);
      console.log(`   💡 Tip: Word timestamps only available with auto-generated subtitles`);
    }
  }
  
  const result = convertSRTtoASSExternal(srtPath, style, CONFIG.videoWidth, CONFIG.videoHeight, colorToASS, words);
  if (result) {
    console.log(`   ✅ ASS file created: ${path.basename(result)}\n`);
  }
  return result;
}

/**
 * Get video duration using ffprobe
 */
function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      videoPath
    ]);

    let duration = '';
    ffprobe.stdout.on('data', data => {
      duration += data.toString();
    });

    ffprobe.on('close', code => {
      if (code !== 0) {
        reject(new Error('Failed to get video duration'));
      } else {
        resolve(parseFloat(duration.trim()));
      }
    });
  });
}

/**
 * Get audio duration using ffprobe
 */
function getAudioDuration(audioPath) {
  // Delegate to extracted audio module
  return getAudioDurationUtil(audioPath);
}

/**
 * Process video clip to match required duration
 * Trims if too long, loops if too short
 */
async function processVideoClip(videoPath, targetDuration, outputPath) {
  const videoDuration = await getVideoDuration(videoPath);
  
  return new Promise((resolve, reject) => {
    const args = ['-i', videoPath];
    
    // Apply scaling/padding to match output dimensions
    let videoFilter = '';
    if (CONFIG.useOriginalSize) {
      videoFilter = `fps=${CONFIG.fps}`;
    } else {
      videoFilter = `scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${CONFIG.fps}`;
    }
    
    if (videoDuration > targetDuration) {
      // Video is too long - trim it
      args.push('-t', targetDuration.toString());
      args.push('-vf', videoFilter);
    } else if (videoDuration < targetDuration) {
      // Video is too short - loop it
      const loopCount = Math.ceil(targetDuration / videoDuration);
      videoFilter = `loop=${loopCount}:1:0,${videoFilter},trim=0:${targetDuration},setpts=PTS-STARTPTS`;
      args.push('-vf', videoFilter);
    } else {
      // Perfect duration - just process
      args.push('-vf', videoFilter);
    }
    
    const encodingSettings = getEncodingSettings();
    args.push(
      '-c:v', 'libx264',
      '-preset', encodingSettings.preset,
      '-crf', encodingSettings.crf,
      '-pix_fmt', 'yuv420p',
      '-an', // No audio from video clips
      '-y',
      outputPath
    );
    
    const ffmpeg = spawn('ffmpeg', args);
    
    let errorOutput = '';
    ffmpeg.stderr.on('data', data => {
      errorOutput += data.toString();
    });
    
    ffmpeg.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Failed to process video clip: ${errorOutput}`));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Build animation filter based on selected effect
 */
function getAnimationFilter(imageDuration) {
  // Use lower FPS for animations to speed up processing
  const fps = CONFIG.animationFps;
  const framesPerImage = Math.floor(imageDuration * fps);
  
  // For animations, we need fixed dimensions (can't use iw/ih in s parameter)
  // If original size is selected, use the configured dimensions as fallback
  const width = CONFIG.useOriginalSize ? CONFIG.videoWidth : CONFIG.videoWidth;
  const height = CONFIG.useOriginalSize ? CONFIG.videoHeight : CONFIG.videoHeight;
  
  switch (CONFIG.animationEffect) {
    case 'zoom-in':
      // Ken Burns: Slow zoom in from 1.0x to 1.2x
      return `zoompan=z='min(1+on/${framesPerImage}*0.2,1.2)':d=${framesPerImage}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}:fps=${fps}`;
    
    case 'zoom-out':
      // Ken Burns: Slow zoom out from 1.2x to 1.0x
      return `zoompan=z='max(1.2-on/${framesPerImage}*0.2,1.0)':d=${framesPerImage}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}:fps=${fps}`;
    
    case 'pan-left':
      // Pan from left to right
      return `zoompan=z='1.3':d=${framesPerImage}:x='if(gte(on,1),x+2,iw/2-(iw/zoom/2))':y='ih/2-(ih/zoom/2)':s=${width}x${height}:fps=${fps}`;
    
    case 'pan-right':
      // Pan from right to left  
      return `zoompan=z='1.3':d=${framesPerImage}:x='if(gte(on,1),x-2,iw/2-(iw/zoom/2))':y='ih/2-(ih/zoom/2)':s=${width}x${height}:fps=${fps}`;
    
    case 'static':
    default:
      return null; // No animation
  }
}

/**
 * Create video from mixed media (images and videos) with even timing
 */
async function createVideoWithMediaFiles(mediaFiles, audioDuration, tempVideoPath) {
  const clipDuration = audioDuration / mediaFiles.length;
  
  // Count images and videos
  const imageCount = mediaFiles.filter(f => isImageFile(f)).length;
  const videoCount = mediaFiles.filter(f => isVideoFile(f)).length;
  
  console.log(`\n📊 Creating video with ${mediaFiles.length} clips`);
  if (imageCount > 0 && videoCount > 0) {
    console.log(`   ${imageCount} images + ${videoCount} videos`);
  } else if (videoCount > 0) {
    console.log(`   ${videoCount} video clips`);
  } else {
    console.log(`   ${imageCount} images`);
  }
  console.log(`⏱️  Each clip will display for ${clipDuration.toFixed(2)} seconds`);
  
  if (CONFIG.animationEffect !== 'static' && imageCount > 0) {
    console.log(`🎨 Applying ${CONFIG.animationEffect} animation to images`);
    console.log(`⚡ Using optimized settings: 24 fps, multi-threaded`);
  }

  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Process all media files into uniform clips
      console.log('\n🎬 Stage 1/2: Processing media clips');
      const tempClips = [];
      
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const clipPath = path.join(CONFIG.outputFolder, `temp_clip_${i}.mp4`);
        tempClips.push(clipPath);
        
        const clipSpinner = new Spinner(`Processing clip ${i + 1}/${mediaFiles.length}`);
        clipSpinner.start();
        
        if (isVideoFile(file)) {
          // Process video clip
          await processVideoClip(file, clipDuration, clipPath);
          clipSpinner.stop();
          console.log(`✅ Video ${i + 1}/${mediaFiles.length} complete`);
        } else {
          // Process image clip
          await new Promise((resolveClip, rejectClip) => {
            const clipArgs = [
              '-loop', '1',
              '-i', file,
              '-t', clipDuration.toString()
            ];
            
            // Add animation filter if enabled
            if (CONFIG.animationEffect !== 'static') {
              const animationFilter = getAnimationFilter(clipDuration);
              if (animationFilter) {
                clipArgs.push('-vf', animationFilter);
              }
            } else {
              // Static image - apply scaling/padding
              if (CONFIG.useOriginalSize) {
                clipArgs.push('-vf', `fps=${CONFIG.fps}`);
              } else {
                clipArgs.push('-vf', `scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${CONFIG.fps}`);
              }
            }
            
            const encodingSettings = getEncodingSettings();
            clipArgs.push(
              '-c:v', 'libx264',
              '-preset', encodingSettings.preset,
              '-crf', encodingSettings.crf,
              '-pix_fmt', 'yuv420p',
              '-y',
              clipPath
            );
            
            const clipFFmpeg = spawn('ffmpeg', clipArgs);
            
            let clipError = '';
            clipFFmpeg.stderr.on('data', data => {
              clipError += data.toString();
            });
            
            clipFFmpeg.on('close', code => {
              clipSpinner.stop();
              if (code !== 0) {
                console.log(`❌ Failed on clip ${i + 1}`);
                rejectClip(new Error(`Clip ${i + 1} failed`));
              } else {
                console.log(`✅ Image ${i + 1}/${mediaFiles.length} complete`);
                resolveClip();
              }
            });
          });
        }
      }
      
      // Step 2: Concatenate all clips
      console.log('\n🎬 Stage 2/2: Combining all clips');
      
      const concatListPath = path.join(CONFIG.outputFolder, 'concat_list.txt');
      const concatContent = tempClips.map(clip => `file '${clip}'`).join('\n');
      fs.writeFileSync(concatListPath, concatContent);
      
      const args = [
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath,
        '-c', 'copy', // Just copy, don't re-encode
        '-y',
        tempVideoPath
      ];
      
      const spinner = new Spinner('Combining clips');
      spinner.start();
      
      const ffmpeg = spawn('ffmpeg', args);
      
      let errorOutput = '';
      ffmpeg.stderr.on('data', data => {
        errorOutput += data.toString();
      });
      
      ffmpeg.on('close', code => {
        spinner.stop();
        
        // Clean up temp clips
        tempClips.forEach(clip => {
          if (fs.existsSync(clip)) fs.unlinkSync(clip);
        });
        if (fs.existsSync(concatListPath)) fs.unlinkSync(concatListPath);
        
        if (code !== 0) {
          console.log('❌ Failed to combine clips');
          reject(new Error(`FFmpeg concat failed: ${errorOutput}`));
        } else {
          console.log('✅ Video created successfully');
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Delay voiceover for image intro (when no background music)
 */
async function delayVoiceover(voicePath, duration, outputPath, introDelay) {
  // Delegate to extracted audio module
  return delayVoiceoverUtil(voicePath, duration, outputPath, introDelay);
}

/**
 * Mix voiceover with background music
 * @param {number} introDelay - Delay in seconds for voiceover (when image intro is present)
 */
async function mixAudioWithBackgroundMusic(voicePath, musicPath, duration, outputPath, introDelay = 0) {
  // Delegate to extracted audio module, passing current audio config
  return mixAudioWithBackgroundMusicUtil(
    voicePath,
    musicPath,
    duration,
    outputPath,
    introDelay,
    CONFIG.audio
  );
}

/**
 * Generate flowing (karaoke-style) subtitles with word-by-word reveal
 * @param {Array} words - Array of word objects from AssemblyAI with timing data
 * @param {string} outputPath - Path where to save ASS subtitle file
 * @param {Object} style - Subtitle style configuration
 */
function generateFlowingSubtitles(words, outputPath, style) {
  try {
    const videoWidth = CONFIG.videoWidth;
    const videoHeight = CONFIG.videoHeight;
    
    // Determine alignment and margins
    let alignment, marginV;
    if (style.alignment === 5) {
      alignment = 5;
      marginV = 0;
    } else if (style.alignment === 8) {
      alignment = 8;
      marginV = style.marginV;
    } else {
      alignment = 2;
      marginV = style.marginV;
    }
    
    // Convert colors
    const primaryColor = colorToASS(style.fontColor);
    const highlightColor = colorToASS(style.highlightColor || VIRAL_STYLE_SETTINGS['highlight'].highlightColor);
    const outlineColor = colorToASS(style.outlineColor);
    
    // Build ASS header
    let assContent = `[Script Info]
Title: Flowing Subtitles by YT-Machine
ScriptType: v4.00+
PlayResX: ${videoWidth}
PlayResY: ${videoHeight}

`;
    
    // Define two styles: Default (unhighlighted) and Highlight (currently spoken)
    assContent += `[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n`;
    assContent += `Style: Default,${style.fontFamily},${style.fontSize},${primaryColor},${primaryColor},${outlineColor},&H00000000,${style.bold ? -1 : 0},${style.italic ? -1 : 0},0,0,100,100,0,0,1,${style.outlineWidth},0,${alignment},0,0,${marginV},1\n`;
    assContent += `Style: Highlight,${style.fontFamily},${style.fontSize},${highlightColor},${highlightColor},${outlineColor},&H00000000,-1,${style.italic ? -1 : 0},0,0,100,100,0,0,1,${style.outlineWidth + 1},0,${alignment},0,0,${marginV},1\n\n`;
    
    assContent += `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
    
    // Group words into subtitle lines (max 10 words or 3 seconds per line)
    const lines = [];
    let currentLine = [];
    let lineStartTime = null;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!lineStartTime) lineStartTime = word.start;
      
      currentLine.push(word);
      
      // Create new line if: 10+ words, or 3+ seconds, or end of array
      const duration = word.end - lineStartTime;
      if (currentLine.length >= 10 || duration >= 3000 || i === words.length - 1) {
        lines.push({ words: currentLine, start: lineStartTime, end: word.end });
        currentLine = [];
        lineStartTime = null;
      }
    }
    
    // Generate ASS dialogue lines with word-by-word highlighting
    for (const line of lines) {
      const startTime = msToAssTime(line.start);
      const endTime = msToAssTime(line.end);
      
      // Build text with karaoke effect tags
      let text = '';
      for (let i = 0; i < line.words.length; i++) {
        const word = line.words[i];
        const duration = word.end - word.start;
        
        // \k tag creates karaoke effect: shows word in highlight color for duration
        // Duration in centiseconds (1cs = 10ms)
        const durationCs = Math.round(duration / 10);
        text += `{\\k${durationCs}}${word.text}`;
        
        // Add space between words (except last word)
        if (i < line.words.length - 1) {
          text += ' ';
        }
      }
      
      // Use Highlight style for karaoke effect
      assContent += `Dialogue: 0,${startTime},${endTime},Highlight,,0,0,0,,${text}\n`;
    }
    
    fs.writeFileSync(outputPath, assContent, 'utf-8');
    console.log(`   💾 Created flowing subtitle file with ${lines.length} lines`);
    
  } catch (error) {
    console.error(`   ⚠️  Failed to generate flowing subtitles: ${error.message}`);
    throw error;
  }
}

/**
 * Convert milliseconds to ASS timestamp format (H:MM:SS.CS)
 */
function msToAssTime(ms) {
  const totalSeconds = ms / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const centiseconds = Math.floor((totalSeconds % 1) * 100);
  
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

/**
 * Auto-generate subtitles from audio using AssemblyAI
 * @param {string} audioPath - Path to audio file (voice.mp3)
 * @param {string} outputPath - Path where to save subtitles.srt
 * @param {string} languageOverride - Optional language code (e.g., 'pt', 'en', 'es')
 * @returns {Promise<{srtPath: string, transcript: object}|null>} - Object with srtPath and transcript (null if error)
 */
async function generateSubtitlesWithAssemblyAI(audioPath, outputPath, languageOverride = null) {
  // Check if output file already exists (caching)
  if (fs.existsSync(outputPath)) {
    console.log(`   ℹ️  Subtitles already exist: ${path.basename(outputPath)} (skipping generation)`);
    console.log(`   💡 Note: Word-level timestamps not available (karaoke mode won't work)\n`);
    return { srtPath: outputPath, transcript: null };
  }
  
  // Check if API key is configured
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here' || apiKey === '' || apiKey.trim() === '') {
    console.log('   ⚠️  AssemblyAI API key not configured');
    console.log('   💡 Set ASSEMBLYAI_API_KEY in .env file for auto-subtitles\n');
    return null;
  }
  
  // Validate API key format (should start with certain characters)
  if (apiKey.trim().length < 10) {
    console.log('   ⚠️  AssemblyAI API key appears invalid (too short)');
    console.log('   💡 Check your API key in .env file\n');
    return null;
  }
  
  // Check if feature is enabled
  const enabled = process.env.AUTO_SUBTITLES_ENABLED !== 'false';
  if (!enabled) {
    return null;
  }
  
  let spinner = null;
  try {
    // Validate audio path is provided
    if (!audioPath) {
      console.log(`   ❌ No audio path provided\n`);
      return null;
    }
    
    // Validate audio file exists
    if (!fs.existsSync(audioPath)) {
      console.log(`   ❌ Audio file not found: ${audioPath}\n`);
      return null;
    }
    
    // Get absolute path (AssemblyAI SDK requires absolute paths)
    const absoluteAudioPath = path.isAbsolute(audioPath) ? audioPath : path.resolve(audioPath);
    
    // Determine language: priority = languageOverride > channel config > .env > default
    const language = languageOverride || 
                     CONFIG.subtitleLanguage || 
                     process.env.AUTO_SUBTITLES_LANGUAGE || 
                     'en';
    
    console.log('🎙️  Auto-generating subtitles with AssemblyAI...');
    console.log(`   🌍 Language: ${language} (${getLanguageName(language)})`);
    console.log(`   📁 Audio file: ${path.basename(absoluteAudioPath)}`);
    console.log(`   📂 Full path: ${absoluteAudioPath}`);
    
    const client = new AssemblyAI({
      apiKey: apiKey
    });
    
    spinner = new Spinner('Uploading and transcribing audio');
    spinner.start();
    
    // Upload and transcribe with absolute path (v4+ API uses transcribe method)
    // Note: All parameters must use snake_case for the JavaScript SDK
    const params = {
      audio: absoluteAudioPath,
      language_code: language
    };
    
    // Only enable disfluencies for English (not supported in other languages)
    if (language === 'en') {
      params.disfluencies = true;
    }
    
    const transcript = await client.transcripts.transcribe(params);
    
    spinner.stop();
    spinner = null;
    
    if (transcript.status === 'error') {
      console.log(`   ❌ Transcription failed: ${transcript.error}`);
      if (language !== 'en') {
        console.log(`   💡 Tip: Try setting language to '${language}' in channel config or .env\n`);
      }
      return null;
    }
    
    // Check if transcript is empty
    if (!transcript.text || transcript.text.trim() === '') {
      console.log(`   ❌ No speech detected in audio`);
      console.log(`   💡 Check: 1) Audio has speech, 2) Language is correct (current: ${language})\n`);
      return null;
    }
    
    // Convert to SRT format
    const srtContent = await client.transcripts.subtitles(transcript.id, 'srt');
    
    // Save to file
    fs.writeFileSync(outputPath, srtContent);
    
    console.log(`   ✅ Subtitles saved to: ${outputPath}`);
    console.log(`   📝 Words transcribed: ${transcript.words?.length || 0}`);
    console.log(`   ⏱️  Confidence: ${(transcript.confidence * 100).toFixed(1)}%`);
    console.log(`   🌍 Language detected: ${transcript.language_code || language}`);
    
    // Debug: Check if words have proper timing
    if (transcript.words && transcript.words.length > 0) {
      const firstWord = transcript.words[0];
      console.log(`   🔍 Sample word data: "${firstWord.text}" (${firstWord.start}ms - ${firstWord.end}ms)`);
    }
    console.log('');
    
    return { srtPath: outputPath, transcript };
    
  } catch (error) {
    if (spinner) {
      spinner.stop();
    }
    console.log(`   ❌ Failed to generate subtitles: ${error.message}`);
    if (error.stack) {
      console.log(`   🐛 Debug info: ${error.stack.split('\n')[1]?.trim()}`);
    }
    console.log('   💡 Continuing without auto-generated subtitles\n');
    return null;
  }
}

/**
 * Get language name from code
 */
function getLanguageName(code) {
  if (!code) return 'Unknown';
  const languages = {
    'en': 'English',
    'pt': 'Portuguese',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ru': 'Russian',
    'ar': 'Arabic',
    'hi': 'Hindi'
  };
  return languages[code] || code.toUpperCase();
}

/**
 * Convert video to different aspect ratio
 */
async function convertToAspectRatio(inputPath, outputPath, aspectRatio) {
  return new Promise((resolve, reject) => {
    let width, height;
    
    switch(aspectRatio) {
      case '16:9':
        width = 1920;
        height = 1080;
        break;
      case '9:16':
        width = 1080;
        height = 1920;
        break;
      case '1:1':
        width = 1080;
        height = 1080;
        break;
      default:
        width = 1920;
        height = 1080;
    }
    
    console.log(`📱 Converting to ${aspectRatio} (${width}x${height})...`);
    
    const encodingSettings = getEncodingSettings();
    const args = [
      '-i', inputPath,
      '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1`,
      '-c:v', 'libx264',
      '-preset', encodingSettings.preset,
      '-crf', encodingSettings.crf,
      '-c:a', 'copy',
      '-y',
      outputPath
    ];
    
    const ffmpeg = spawn('ffmpeg', args);
    
    let errorOutput = '';
    ffmpeg.stderr.on('data', data => {
      errorOutput += data.toString();
    });
    
    ffmpeg.on('close', code => {
      if (code !== 0) {
        console.log(`❌ Failed to convert to ${aspectRatio}`);
        reject(new Error(`FFmpeg failed: ${errorOutput}`));
      } else {
        console.log(`✅ ${aspectRatio} version created`);
        resolve(outputPath);
      }
    });
  });
}

/**
 * Detect and prepare intro/outro from channel or video folder
 * Priority: video folder > channel folder > global intros/ folder
 * Supports both videos and images (images show for 4s with fade)
 */
async function detectAndPrepareIntroOutro(videoFolder, channelFolder) {
  const introOutroConfig = {
    introPath: null,
    outroPath: null,
    hasIntro: false,
    hasOutro: false,
    isImageIntro: false  // Track if intro was originally an image
  };
  
  // Image and video extensions
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  
  // Helper to check if file is image
  const isImage = (file) => imageExts.some(ext => file.toLowerCase().endsWith(ext));
  const isVideo = (file) => videoExts.some(ext => file.toLowerCase().endsWith(ext));
  
  // Helper to convert image to 4s video with fade
  const convertImageToIntro = async (imagePath) => {
    const outputPath = path.join(CONFIG.outputFolder, 'temp_intro_from_image.mp4');
    
    return new Promise((resolve, reject) => {
      console.log('   Converting image intro to video (4s with fade)...');
      
      const args = [
        '-loop', '1',
        '-i', imagePath,
        '-t', '4',  // 4 seconds
        '-vf', `scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=3:d=1,fps=${CONFIG.fps}`,
        '-c:v', 'libx264',
        '-an',  // No audio - will be added to final video
        '-preset', 'fast',
        '-crf', '20',
        '-pix_fmt', 'yuv420p',
        '-y',
        outputPath
      ];
      
      const ffmpeg = spawn('ffmpeg', args);
      
      let errorOutput = '';
      ffmpeg.stderr.on('data', data => {
        errorOutput += data.toString();
      });
      
      ffmpeg.on('close', code => {
        if (code !== 0) {
          reject(new Error(`Failed to convert image intro: ${errorOutput}`));
        } else {
          console.log('   ✅ Image intro converted');
          resolve(outputPath);
        }
      });
    });
  };
  
  // 1. Check video folder for intro/outro
  if (videoFolder && fs.existsSync(videoFolder)) {
    const videoFiles = fs.readdirSync(videoFolder);
    
    // Look for intro file
    const introFile = videoFiles.find(f => 
      (f.toLowerCase().startsWith('intro.') || f.toLowerCase() === 'intro') && 
      (isImage(f) || isVideo(f))
    );
    
    if (introFile) {
      const introPath = path.join(videoFolder, introFile);
      
      if (isImage(introFile)) {
        introOutroConfig.introPath = await convertImageToIntro(introPath);
        introOutroConfig.hasIntro = true;
        introOutroConfig.isImageIntro = true;  // Mark as image intro
        console.log(`   ✅ Using intro image from video folder: ${introFile}`);
      } else {
        introOutroConfig.introPath = introPath;
        introOutroConfig.hasIntro = true;
        console.log(`   ✅ Using intro video from video folder: ${introFile}`);
      }
    }
    
    // Look for outro file
    const outroFile = videoFiles.find(f => 
      (f.toLowerCase().startsWith('outro.') || f.toLowerCase() === 'outro') && 
      isVideo(f)
    );
    
    if (outroFile) {
      introOutroConfig.outroPath = path.join(videoFolder, outroFile);
      introOutroConfig.hasOutro = true;
      console.log(`   ✅ Using outro from video folder: ${outroFile}`);
    }
  }
  
  // 2. If no video-level intro, check channel folder
  if (!introOutroConfig.hasIntro && channelFolder && fs.existsSync(channelFolder)) {
    const channelFiles = fs.readdirSync(channelFolder);
    
    const introFile = channelFiles.find(f => 
      (f.toLowerCase().startsWith('intro.') || f.toLowerCase() === 'intro') && 
      (isImage(f) || isVideo(f))
    );
    
    if (introFile) {
      const introPath = path.join(channelFolder, introFile);
      
      if (isImage(introFile)) {
        introOutroConfig.introPath = await convertImageToIntro(introPath);
        introOutroConfig.hasIntro = true;
        introOutroConfig.isImageIntro = true;  // Mark as image intro
        console.log(`   ✅ Using intro image from channel folder: ${introFile}`);
      } else {
        introOutroConfig.introPath = introPath;
        introOutroConfig.hasIntro = true;
        console.log(`   ✅ Using intro video from channel folder: ${introFile}`);
      }
    }
  }
  
  // 3. If no channel-level outro, check channel folder
  if (!introOutroConfig.hasOutro && channelFolder && fs.existsSync(channelFolder)) {
    const channelFiles = fs.readdirSync(channelFolder);
    
    const outroFile = channelFiles.find(f => 
      (f.toLowerCase().startsWith('outro.') || f.toLowerCase() === 'outro') && 
      isVideo(f)
    );
    
    if (outroFile) {
      introOutroConfig.outroPath = path.join(channelFolder, outroFile);
      introOutroConfig.hasOutro = true;
      console.log(`   ✅ Using outro from channel folder: ${outroFile}`);
    }
  }
  
  return introOutroConfig;
}

/**
 * Add intro and/or outro to video
 */
async function addIntroOutro(mainVideoPath, outputPath, introOutroFiles = null) {
  return new Promise((resolve, reject) => {
    // Check if we have intro/outro files from detection or config
    // Image intros are already converted to 4s videos, so treat them like video intros
    const hasIntro = introOutroFiles?.hasIntro || 
                     (CONFIG.introOutro.enabled && CONFIG.introOutro.introPath && 
                      (CONFIG.introOutro.mode === 'both' || CONFIG.introOutro.mode === 'intro'));
    const hasOutro = introOutroFiles?.hasOutro || 
                     (CONFIG.introOutro.enabled && CONFIG.introOutro.outroPath && 
                      (CONFIG.introOutro.mode === 'both' || CONFIG.introOutro.mode === 'outro'));
    
    // Skip concatenation if no intro/outro
    if (!hasIntro && !hasOutro) {
      // No intro/outro to concatenate - just copy the file
      fs.copyFileSync(mainVideoPath, outputPath);
      resolve(outputPath);
      return;
    }

    console.log('🎬 Adding intro/outro...');
    
    // Build concat file list
    const concatListPath = path.join(CONFIG.outputFolder, 'intro_outro_list.txt');
    let concatContent = '';
    
    // Add intro if available (image intros are already converted to videos)
    const introPath = introOutroFiles?.introPath || CONFIG.introOutro.introPath;
    if (hasIntro && introPath) {
      concatContent += `file '${introPath}'\n`;
    }
    
    // Add main video
    concatContent += `file '${mainVideoPath}'\n`;
    
    // Add outro if available (priority: detected files > config)
    const outroPath = introOutroFiles?.outroPath || CONFIG.introOutro.outroPath;
    if (hasOutro && outroPath) {
      concatContent += `file '${outroPath}'\n`;
    }
    
    fs.writeFileSync(concatListPath, concatContent);
    
    // Use filter_complex to handle potential audio/video length mismatches
    const encodingSettings = getEncodingSettings();
    
    // Build input args
    const inputArgs = [];
    if (hasIntro && introPath) {
      inputArgs.push('-i', introPath);
    }
    inputArgs.push('-i', mainVideoPath);
    if (hasOutro && outroPath) {
      inputArgs.push('-i', outroPath);
    }
    
    // Build filter_complex for concatenation
    // For image intros: concat video-only, audio will be added later
    const isImageIntro = introOutroFiles?.isImageIntro;
    let filterComplex = '';
    let inputIndex = 0;
    
    if (isImageIntro) {
      // Image intro has no audio - concat videos only, then add main audio
      const numVideoInputs = (hasIntro ? 1 : 0) + 1 + (hasOutro ? 1 : 0);
      let mainVideoIndex = 0;
      
      // Scale intro video
      if (hasIntro && introPath) {
        filterComplex += `[${inputIndex}:v]scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${CONFIG.fps}[v${inputIndex}];`;
        inputIndex++;
        mainVideoIndex = inputIndex;  // Main is next
      }
      
      // Scale main video
      filterComplex += `[${inputIndex}:v]scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${CONFIG.fps}[v${inputIndex}];`;
      inputIndex++;
      
      // Scale outro if present
      if (hasOutro && outroPath) {
        filterComplex += `[${inputIndex}:v]scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${CONFIG.fps}[v${inputIndex}];`;
        inputIndex++;
      }
      
      // Concat videos only (no audio)
      for (let i = 0; i < numVideoInputs; i++) {
        filterComplex += `[v${i}]`;
      }
      filterComplex += `concat=n=${numVideoInputs}:v=1:a=0[outv];`;
      
      // Use audio from main (51s: music 0-51s, voice 4-51s)
      // Pad with 4s silence at end to match total video duration (4s intro + 51s main = 55s)
      filterComplex += `[${mainVideoIndex}:a]apad=pad_dur=4,aformat=sample_fmts=fltp:sample_rates=44100[outa]`;
      
    } else {
      // Regular video intro with audio - concat normally
      const numInputs = (hasIntro ? 1 : 0) + 1 + (hasOutro ? 1 : 0);
      
      if (hasIntro && introPath) {
        filterComplex += `[${inputIndex}:v]scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${CONFIG.fps}[v${inputIndex}];`;
        filterComplex += `[${inputIndex}:a]aresample=44100[a${inputIndex}];`;
        inputIndex++;
      }
      
      filterComplex += `[${inputIndex}:v]scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${CONFIG.fps}[v${inputIndex}];`;
      filterComplex += `[${inputIndex}:a]aresample=44100[a${inputIndex}];`;
      inputIndex++;
      
      if (hasOutro && outroPath) {
        filterComplex += `[${inputIndex}:v]scale=${CONFIG.videoWidth}:${CONFIG.videoHeight}:force_original_aspect_ratio=decrease,pad=${CONFIG.videoWidth}:${CONFIG.videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${CONFIG.fps}[v${inputIndex}];`;
        filterComplex += `[${inputIndex}:a]aresample=44100[a${inputIndex}];`;
        inputIndex++;
      }
      
      for (let i = 0; i < numInputs; i++) {
        filterComplex += `[v${i}][a${i}]`;
      }
      filterComplex += `concat=n=${numInputs}:v=1:a=1[outv][outa]`;
    }
    
    const args = [
      ...inputArgs,
      '-filter_complex', filterComplex,
      '-map', '[outv]',
      '-map', '[outa]',
      '-c:v', 'libx264',
      '-preset', encodingSettings.preset,
      '-crf', encodingSettings.crf,
      '-c:a', 'aac',
      '-b:a', '192k',
      '-y',
      outputPath
    ];
    
    const ffmpeg = spawn('ffmpeg', args);
    
    let errorOutput = '';
    ffmpeg.stderr.on('data', data => {
      errorOutput += data.toString();
    });
    
    ffmpeg.on('close', code => {
      // Clean up concat list
      if (fs.existsSync(concatListPath)) {
        fs.unlinkSync(concatListPath);
      }
      
      if (code !== 0) {
        console.log('❌ Failed to add intro/outro');
        reject(new Error(`FFmpeg failed: ${errorOutput}`));
      } else {
        console.log('✅ Intro/outro added successfully');
        resolve(outputPath);
      }
    });
  });
}

/**
 * Get CTA overlay filter for FFmpeg
 * @param {number} videoDuration - Duration of video in seconds
 * @param {string} inputLabel - Input stream label (e.g., '[v0]' or '[0:v]')
 * @param {number} ctaInputIndex - Input index for CTA media (usually 2 when audio is input 1)
 * @param {boolean} isVideo - Whether CTA is a video (true) or image (false)
 */
function getCTAOverlayFilter(videoDuration, inputLabel = '[0:v]', ctaInputIndex = 2, isVideo = false) {
  if (!CONFIG.cta.enabled || !CONFIG.cta.imagePath) {
    return null;
  }
  
  // Calculate actual start time (handle negative values for "end of video")
  let startTime = CONFIG.cta.startTime;
  if (startTime < 0) {
    startTime = Math.max(0, videoDuration + startTime);
  }
  
  const endTime = startTime + CONFIG.cta.duration;
  
  // Position mapping (6 positions: left, middle, right × top, bottom)
  const positions = {
    'left-top': 'x=10:y=10',
    'middle-top': 'x=(W-w)/2:y=10',
    'right-top': 'x=W-w-10:y=10',
    'left-bottom': 'x=10:y=H-h-10',
    'middle-bottom': 'x=(W-w)/2:y=H-h-10',
    'right-bottom': 'x=W-w-10:y=H-h-10',
    // Legacy support
    'top-left': 'x=10:y=10',
    'top-right': 'x=W-w-10:y=10',
    'bottom-left': 'x=10:y=H-h-10',
    'bottom-right': 'x=W-w-10:y=H-h-10'
  };
  
  const position = positions[CONFIG.cta.position] || positions['right-bottom'];
  
  // Build overlay filter
  let ctaPrep = '';
  
  // NOTE: Fade effects are complex with FFmpeg overlay filter
  // Using instant show/hide for reliability
  // Future: Implement fade using pre-rendered CTA with transparency gradient
  
  if (isVideo) {
    // Video CTA: loop, trim, scale, set opacity
    ctaPrep = `[${ctaInputIndex}:v]loop=loop=-1:size=1000:start=0,trim=duration=${CONFIG.cta.duration},setpts=PTS-STARTPTS,scale=iw*${CONFIG.cta.scale}:-1,format=yuva420p,colorchannelmixer=aa=${CONFIG.cta.opacity}[cta]`;
  } else {
    // Image CTA: loop, scale, set opacity
    const frameCount = Math.ceil(CONFIG.cta.duration * 30); // 30fps
    ctaPrep = `[${ctaInputIndex}:v]loop=loop=${frameCount}:size=1:start=0,scale=iw*${CONFIG.cta.scale}:-1,format=yuva420p,colorchannelmixer=aa=${CONFIG.cta.opacity}[cta]`;
  }
  
  // Overlay with timing control
  // Note: Do NOT use shortest=1 as it will cut the main video to CTA duration!
  const overlayFilter = `${inputLabel}[cta]overlay=${position}:enable='between(t,${startTime},${endTime})'`;
  
  return `${ctaPrep};${overlayFilter}`;
}

/**
 * Combine video with audio and optionally subtitles
 */
async function combineVideoAudioSubtitles(tempVideoPath, audioPath, subtitlePath, outputPath, audioDuration) {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', tempVideoPath,
      '-i', audioPath
    ];
    
    // Add CTA image as input if enabled
    const hasCTA = CONFIG.cta.enabled && CONFIG.cta.imagePath;
    if (hasCTA) {
      args.push('-i', CONFIG.cta.imagePath);
    }

    // Get subtitle styling from CONFIG
    let style = CONFIG.subtitleStyle;
    
    // Adjust font size for aspect ratio (TikTok/Shorts need smaller subtitles)
    let fontSize = style.fontSize;
    let marginV = style.marginV;
    
    if (CONFIG.aspectRatio === '9:16') {
      // Reduce font size by 50% for vertical format (TikTok/Shorts)
      // Vertical videos need much smaller text due to narrow width
      fontSize = Math.round(style.fontSize * 0.5);
      // Adjust marginV for non-center positions (alignment 5 keeps marginV=0)
      if (style.alignment !== 5) {
        marginV = Math.round(marginV * 1.2); // Increase margin slightly
      }
      console.log(`📱 Adjusted subtitle size for TikTok/Shorts: ${style.fontSize} → ${fontSize}px`);
    } else if (CONFIG.aspectRatio === '4:5') {
      // Reduce font size by 30% for Instagram format
      fontSize = Math.round(style.fontSize * 0.7);
      console.log(`📱 Adjusted subtitle size for Instagram: ${style.fontSize} → ${fontSize}px`);
    }

    // Build video filter chain
    let videoFilters = [];
    
    // Add fade effects (use configured values)
    const fadeOutStart = Math.max(0, audioDuration - CONFIG.audio.voiceFadeOut);
    videoFilters.push(`fade=t=in:st=0:d=${CONFIG.audio.voiceFadeIn}`);
    videoFilters.push(`fade=t=out:st=${fadeOutStart}:d=${CONFIG.audio.voiceFadeOut}`);
    
    // Add subtitles - check for dual subtitle mode (language learning)
    const targetSubPath = path.join(CONFIG.inputFolder, CONFIG.languageLearning.targetFile);
    const nativeSubPath = path.join(CONFIG.inputFolder, CONFIG.languageLearning.nativeFile);
    
    if (CONFIG.languageLearning.enabled && CONFIG.languageLearning.dualSubtitles && 
        fs.existsSync(targetSubPath) && fs.existsSync(nativeSubPath)) {
      // DUAL SUBTITLE MODE (Language Learning)
      console.log('📝 Adding dual subtitles (language learning mode)...');
      
      // Adjust sizes for aspect ratio
      let targetSize = CONFIG.languageLearning.targetSize;
      let nativeSize = CONFIG.languageLearning.nativeSize;
      if (CONFIG.aspectRatio === '9:16') {
        // 50% reduction for TikTok/Shorts
        targetSize = Math.round(targetSize * 0.5);
        nativeSize = Math.round(nativeSize * 0.5);
      } else if (CONFIG.aspectRatio === '4:5') {
        // 30% reduction for Instagram
        targetSize = Math.round(targetSize * 0.7);
        nativeSize = Math.round(nativeSize * 0.7);
      }
      
      // Target language (top, larger, white)
      const targetMarginV = marginV + CONFIG.languageLearning.spacing + nativeSize;
      let targetStyle = `Alignment=2,FontSize=${targetSize},MarginV=${targetMarginV}`;
      targetStyle += `,FontName=${style.fontFamily}`;
      targetStyle += `,PrimaryColour=${colorToASS(CONFIG.languageLearning.targetColor)}`;
      targetStyle += `,OutlineColour=&H00000000,Outline=2,Bold=1`;
      
      // Add fontsdir if custom font is selected
      const fontsDirParam = style.fontPath ? `:fontsdir='${CONFIG.fontsFolder}'` : '';
      videoFilters.push(`subtitles=${targetSubPath}:force_style='${targetStyle}'${fontsDirParam}`);
      
      // Native language (below target, smaller, dimmer)
      let nativeStyle = `Alignment=2,FontSize=${nativeSize},MarginV=${marginV}`;
      nativeStyle += `,FontName=${style.fontFamily}`;
      nativeStyle += `,PrimaryColour=${colorToASS(CONFIG.languageLearning.nativeColor)}`;
      nativeStyle += `,OutlineColour=&H00000000,Outline=2`;
      
      videoFilters.push(`subtitles=${nativeSubPath}:force_style='${nativeStyle}'${fontsDirParam}`);
      
    } else if (subtitlePath && fs.existsSync(subtitlePath)) {
      // STANDARD SINGLE SUBTITLE MODE
      console.log('📝 Adding subtitles...');
      
      const ext = path.extname(subtitlePath).toLowerCase();
      
      // Check if user provided ASS file directly
      if (ext === '.ass') {
        console.log('   ✅ Using provided ASS file directly');
        videoFilters.push(`ass=${subtitlePath}`);
        
      } else if (ext === '.srt') {
        // SRT file - convert to ASS for center positioning, karaoke animation, or special effects
        
        if (style.alignment === 5 || style.animationStyle === 'karaoke') {
          // Convert to ASS for: center positioning, karaoke animation, or special effects
          const reason = style.animationStyle === 'karaoke' ? 'karaoke animation' : 
                        style.alignment === 5 ? 'center positioning' : 'special effects';
          console.log(`   🎯 Converting SRT to ASS for ${reason}...`);
          
          const adjustedStyle = {
            ...style,
            fontSize: fontSize,
            marginV: marginV
          };
          const assPath = convertSRTtoASS(subtitlePath, adjustedStyle);
          
          if (assPath && fs.existsSync(assPath)) {
            videoFilters.push(`ass=${assPath}`);
          } else {
            console.log('   ⚠️  ASS conversion failed, falling back to SRT method');
            // Fallback to standard SRT method using centralized styler
            const adjustedStyle = { ...style };
            const forceStyle = buildForceStyle(adjustedStyle, fontSize, 0, colorToASS);
            const fontsDirParam = style.fontPath ? `:fontsdir='${CONFIG.fontsFolder}'` : '';
            videoFilters.push(`subtitles=${subtitlePath}:force_style='${forceStyle}'${fontsDirParam}`);
          }
        } else {
        // Use standard force_style for top/bottom positions
        console.log(`   Position: alignment=${style.alignment}, marginV=${marginV}`);
        
        // Apply viral style enhancements
        let effectiveFontSize = fontSize;
        let effectiveOutlineWidth = style.outlineWidth;
        let effectiveFontColor = style.fontColor;
        
        if (style.viralStyle && style.viralStyle !== 'none') {
          console.log(`   🔥 Applying viral style: ${style.viralStyle}`);
          
          if (style.viralStyle === 'bold-pop') {
            effectiveFontSize = Math.round(fontSize * 1.15);  // Even larger
            effectiveOutlineWidth = 5;
          } else if (style.viralStyle === 'highlight') {
            effectiveFontColor = style.highlightColor || VIRAL_STYLE_SETTINGS['highlight'].highlightColor;
            effectiveOutlineWidth = 4;
          } else if (style.viralStyle === 'shadow-burst') {
            effectiveOutlineWidth = style.shadowStrength || 6;
            effectiveFontSize = Math.round(fontSize * 1.1);
          }
        }
        
        const adjustedStyle2 = { ...style, fontColor: effectiveFontColor, outlineWidth: effectiveOutlineWidth };
        let forceStyle = buildForceStyle(adjustedStyle2, effectiveFontSize, marginV, colorToASS);
        if (style.backgroundColor !== 'transparent' && style.backgroundColor.includes('@')) {
          const [color] = style.backgroundColor.split('@');
          const bgColor = colorToASS(color);
          forceStyle += `,BackColour=${bgColor},BorderStyle=4`;
        }
        const fontsDirParam = style.fontPath ? `:fontsdir='${CONFIG.fontsFolder}'` : '';
        videoFilters.push(`subtitles=${subtitlePath}:force_style='${forceStyle}'${fontsDirParam}`);
        }
      }
      
    } else if (fs.existsSync(targetSubPath)) {
      // STANDARD MODE with DUAL FILES (user selected standard mode but only dual files exist)
      console.log('📝 Adding subtitles (target language only)...');
      
      // For center positioning (alignment 5), convert SRT to ASS for better control
      if (style.alignment === 5) {
        console.log('   🎯 Using ASS format for center positioning...');
        const adjustedStyle = {
          ...style,
          fontSize: fontSize,
          marginV: marginV
        };
        const assPath = convertSRTtoASS(targetSubPath, adjustedStyle);
        
        if (assPath && fs.existsSync(assPath)) {
        } else {
          // Use standard force_style for top/bottom positions
          const adjustedStyle2 = { ...style, fontColor: style.fontColor, outlineWidth: style.outlineWidth };
          const forceStyle = buildForceStyle(adjustedStyle2, fontSize, marginV, colorToASS);
          
          // Add fontsdir if custom font is selected
          const fontsDirParam = style.fontPath ? `:fontsdir='${CONFIG.fontsFolder}'` : '';
          videoFilters.push(`subtitles=${targetSubPath}:force_style='${forceStyle}'${fontsDirParam}`);
        }
      }
    }
    
    // Combine video filters (no tpad - let FFmpeg extend naturally)
    if (hasCTA) {
      // Use complex filter for CTA overlay
      let complexFilter = '';
      
      if (videoFilters.length > 0) {
        // Apply video filters first, then CTA overlay
        // [0:v] -> video filters -> [v0] -> CTA overlay -> [vout]
        const ctaFilter = getCTAOverlayFilter(audioDuration, '[v0]', 2, CONFIG.cta.isVideo);
        complexFilter = `[0:v]${videoFilters.join(',')}[v0];${ctaFilter}[vout]`;
      } else {
        // Just CTA overlay on original video
        // [0:v] -> CTA overlay -> [vout]
        const ctaFilter = getCTAOverlayFilter(audioDuration, '[0:v]', 2, CONFIG.cta.isVideo);
        complexFilter = `${ctaFilter}[vout]`;
      }
      
      args.push('-filter_complex', complexFilter);
      args.push('-map', '[vout]');  // Map the final filtered video
      args.push('-map', '1:a');     // Map audio from second input
    } else {
      // No CTA - use simple video filter
      if (videoFilters.length > 0) {
        args.push('-vf', videoFilters.join(','));
      }
    }
    
    // Add audio fade effects (use configured values)
    const audioFadeOutStart = Math.max(0, audioDuration - CONFIG.audio.voiceFadeOut);
    args.push('-af', `afade=t=in:st=0:d=${CONFIG.audio.voiceFadeIn},afade=t=out:st=${audioFadeOutStart}:d=${CONFIG.audio.voiceFadeOut}`);

    const encodingSettings = getEncodingSettings();
    args.push(
      '-c:v', 'libx264',
      '-preset', encodingSettings.preset,
      '-crf', encodingSettings.crf,
      '-c:a', 'aac',
      '-b:a', '192k',
      '-t', audioDuration.toString(),  // Explicit duration to match audio
      '-y',
      outputPath
    );

    console.log('\n🎬 Stage 2/2: Final processing');
    console.log(`   Quality: ${encodingSettings.description} (preset: ${encodingSettings.preset}, crf: ${encodingSettings.crf})`);
    console.log('   Adding audio, fades, and subtitles...');
    
    const spinner = new Spinner('Combining audio and video');
    spinner.start();
    
    const ffmpeg = spawn('ffmpeg', args);

    let errorOutput = '';
    let lastProgress = '';
    
    ffmpeg.stderr.on('data', data => {
      const output = data.toString();
      errorOutput += output;
      
      // Extract progress from ffmpeg output
      const timeMatch = output.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
      if (timeMatch && timeMatch[1] !== lastProgress) {
        lastProgress = timeMatch[1];
        spinner.update(`Final processing - ${timeMatch[1]}`);
      }
    });

    ffmpeg.on('close', code => {
      spinner.stop();
      if (code !== 0) {
        console.log('❌ Failed to combine audio and video');
        reject(new Error(`FFmpeg failed: ${errorOutput}`));
      } else {
        console.log('✅ Final video created successfully');
        resolve();
      }
    });
  });
}

/**
 * Main function to generate the video
 */
async function generateVideo(skipPrompts = false, videoFolder = null, channelFolder = null) {
  const totalStartTime = Date.now();
  
  try {
    console.log('🚀 Starting video generation...\n');
    
    // Detect intro/outro from channel or video folders
    let introOutroFiles = null;
    if (videoFolder || channelFolder) {
      console.log('🎬 Checking for intro/outro files...');
      introOutroFiles = await detectAndPrepareIntroOutro(videoFolder, channelFolder);
      
      if (introOutroFiles.hasIntro && introOutroFiles.hasOutro) {
        if (introOutroFiles.isImageIntro) {
          console.log('   ✅ Image intro (4s) + outro will be added');
          console.log('   🎵 Music starts at 0:00, voiceover at 0:04\n');
        } else {
          console.log('   ✅ Video intro + outro will be added\n');
        }
      } else if (introOutroFiles.hasIntro) {
        if (introOutroFiles.isImageIntro) {
          console.log('   ✅ Image intro (4s) will be added');
          console.log('   🎵 Music starts at 0:00, voiceover at 0:04\n');
        } else {
          console.log('   ✅ Video intro will be added\n');
        }
      } else if (introOutroFiles.hasOutro) {
        console.log('   ✅ Outro will be added\n');
      } else {
        console.log('   ℹ️  No intro/outro found\n');
      }
    }

    // Only prompt if not in batch mode (when config is already set)
    if (!skipPrompts) {
      // Prompt user for aspect ratio
      await promptAspectRatio();
      
      // Prompt user for animation effect
      await promptAnimationEffect();
      
      // Prompt user for quality mode
      await promptQualityMode();
    }

    // Ensure output folder exists
    if (!fs.existsSync(CONFIG.outputFolder)) {
      fs.mkdirSync(CONFIG.outputFolder, { recursive: true });
    }

    // Get media files (images and videos) and audio
    console.log('📂 Scanning input folder...');
    const images = getFilesByExtension(CONFIG.inputFolder, CONFIG.imageFormats);
    const videos = getFilesByExtension(CONFIG.inputFolder, CONFIG.videoFormats);
    const allAudioFiles = getFilesByExtension(CONFIG.inputFolder, CONFIG.audioFormats);

    // Combine and sort media files (images + videos) by filename
    const mediaFiles = [...images, ...videos].sort();
    
    if (mediaFiles.length === 0) {
      throw new Error('No images or videos found in input folder');
    }

    // Check for voiceover and background music
    const voicePath = path.join(CONFIG.inputFolder, FILE_NAMES.VOICE);
    const musicPath = path.join(CONFIG.inputFolder, FILE_NAMES.MUSIC);
    const backgroundMusicPath = path.join(CONFIG.inputFolder, FILE_NAMES.BACKGROUND_MUSIC);
    
    // Determine which audio file to use as voiceover
    let audioPath;
    
    if (fs.existsSync(voicePath)) {
      // Prefer voice.mp3 (batch mode standard)
      audioPath = voicePath;
    } else {
      // Fallback to first audio file that's not background music
      const audioFiles = allAudioFiles.filter(file => {
        const basename = path.basename(file).toLowerCase();
        return basename !== 'background_music.mp3' && basename !== 'music.mp3';
      });
      
      if (audioFiles.length === 0) {
        throw new Error('No voiceover audio file found (looking for voice.mp3 or other .mp3/.wav files)');
      }
      
      audioPath = audioFiles[0];
    }
    
    // Determine if we have background music
    const hasBackgroundMusic = fs.existsSync(musicPath) || fs.existsSync(backgroundMusicPath);
    
    // Use music.mp3 if it exists, otherwise use background_music.mp3
    const actualMusicPath = fs.existsSync(musicPath) ? musicPath : backgroundMusicPath;
    console.log(`✅ Found ${images.length} images${videos.length > 0 ? ` + ${videos.length} videos` : ''}`);
    console.log(`✅ Found voiceover: ${path.basename(audioPath)}`);
    
    if (hasBackgroundMusic) {
      console.log(`✅ Found background music: ${path.basename(actualMusicPath)}`);
    }
    console.log('');

    // Get audio duration
    console.log('⏱️  Analyzing audio duration...');
    const audioDuration = await getAudioDuration(audioPath);
    console.log(`✅ Audio duration: ${audioDuration.toFixed(2)} seconds\n`);

    // Prompt for audio configuration (only in interactive mode)
    if (!skipPrompts) {
      // Prompt user for audio configuration
      await promptAudioConfig(hasBackgroundMusic);
    }
    
    // Check for subtitle files (standard or dual) - prefer .ass over .srt
    const subtitlePathASS = path.join(CONFIG.inputFolder, FILE_NAMES.SUBTITLES_ASS);
    const subtitlePathSRT = path.join(CONFIG.inputFolder, CONFIG.subtitleFile);
    let subtitlePath = subtitlePathSRT;
    if (fs.existsSync(subtitlePathASS) && fs.existsSync(subtitlePathSRT)) {
      // In interactive mode, prefer SRT so we can apply current style choices.
      // In batch (skipPrompts), prefer provided ASS.
      subtitlePath = !skipPrompts ? subtitlePathSRT : subtitlePathASS;
    } else if (fs.existsSync(subtitlePathASS)) {
      subtitlePath = subtitlePathASS;
    } else if (fs.existsSync(subtitlePathSRT)) {
      subtitlePath = subtitlePathSRT;
    }
    
    const targetSubPathASS = path.join(CONFIG.inputFolder, FILE_NAMES.SUBTITLES_TARGET_ASS);
    const targetSubPathSRT = path.join(CONFIG.inputFolder, CONFIG.subtitleFile);
    const targetSubPath = fs.existsSync(targetSubPathASS) ? targetSubPathASS : targetSubPathSRT;
    
    const nativeSubPathASS = path.join(CONFIG.inputFolder, FILE_NAMES.SUBTITLES_NATIVE_ASS);
    const nativeSubPathSRT = path.join(CONFIG.inputFolder, CONFIG.languageLearning.nativeFile);
    const nativeSubPath = fs.existsSync(nativeSubPathASS) ? nativeSubPathASS : nativeSubPathSRT;
    
    let hasStandardSubs = fs.existsSync(subtitlePath);
    const hasDualSubs = fs.existsSync(targetSubPath) && fs.existsSync(nativeSubPath);
    let words = null;

    // Auto-generate subtitles if they don't exist (optional feature)
    if (!hasStandardSubs && !hasDualSubs) {
      const outputSrtPath = path.join(CONFIG.inputFolder, 'subtitles.srt');
      const subtitleResult = await generateSubtitlesWithAssemblyAI(audioPath, outputSrtPath);
      if (subtitleResult && subtitleResult.srtPath) {
        CONFIG.subtitleFile = path.basename(subtitleResult.srtPath);
        CONFIG.transcript = subtitleResult.transcript; // Store for karaoke
        words = CONFIG.transcript ? CONFIG.transcript.words : null;
        hasStandardSubs = true;
      }
    } else if (hasStandardSubs && fs.existsSync(subtitlePathSRT)) {
      // SRT exists but ASS may be outdated - delete ASS so it gets regenerated with current style
      if (fs.existsSync(subtitlePathASS)) {
        fs.unlinkSync(subtitlePathASS);
        console.log('   🔄 Existing ASS file removed (will be regenerated with current style)');
      }
      console.log('   ℹ️  Using existing subtitles (no word timestamps for karaoke)');
      console.log('   💡 Tip: Delete subtitles.srt to regenerate with karaoke support\n');
    }
    
    // Prompt for font and subtitle style if ANY subtitles exist (only in interactive mode)
    if (!skipPrompts && (hasStandardSubs || hasDualSubs)) {
      await promptFontSelection();
      await promptSubtitleStyle();
    }
    
    // Check for dual subtitles (language learning mode) - only in interactive mode
    if (!skipPrompts) {
      await promptLanguageLearningMode();
    }
    
    // Check for intro/outro videos - only in interactive mode
    if (!skipPrompts) {
      await promptIntroOutro();
    }
    
    // Check for CTA overlays - only in interactive mode
    if (!skipPrompts) {
      await promptCTA();
    }
    
    // Prompt for export formats - only in interactive mode
    if (!skipPrompts) {
      await promptExportFormats();
    }

    // Validate runtime config and show summary (interactive only)
    if (!skipPrompts) {
      const { warnings } = validateAppConfig(CONFIG);
      warnings.forEach(w => console.log(`   ⚠️  Config: ${w}`));
      console.log('\n🧩 Summary of selected options:');
      console.log(`   • Aspect Ratio: ${CONFIG.useOriginalSize ? 'Original Size' : CONFIG.aspectRatio}`);
      console.log(`   • Animation: ${CONFIG.animationEffect}`);
      console.log(`   • Quality: ${CONFIG.qualityMode}`);
      if (CONFIG.subtitleStyle) {
        console.log(`   • Subtitles: ${CONFIG.subtitleStyle.fontColor}, size ${CONFIG.subtitleStyle.fontSize}, align ${CONFIG.subtitleStyle.alignment}, marginV ${CONFIG.subtitleStyle.marginV}`);
      }
      if (CONFIG.languageLearning?.enabled) {
        console.log('   • Language Learning: Enabled (dual subtitles)');
      }
      if (CONFIG.introOutro?.enabled) {
        console.log(`   • Intro/Outro: ${CONFIG.introOutro.mode}`);
      }
      if (CONFIG.cta?.enabled) {
        console.log(`   • CTA: ${CONFIG.cta.position}, start ${CONFIG.cta.startTime}s, duration ${CONFIG.cta.duration}s`);
      }
      if (CONFIG.exportFormats?.formats?.length > 1) {
        console.log(`   • Export Formats: ${CONFIG.exportFormats.formats.join(', ')}`);
      }
      console.log('');
    }

    // Calculate intro delay for audio mixing
    // Image intro needs delayed audio so music spans intro+main continuously
    let introDelay = 0;
    if (introOutroFiles?.hasIntro && introOutroFiles.isImageIntro) {
      introDelay = 4;  // Image intros are always 4 seconds
    }
    
    // Mix background music if available, with intro delay if needed
    let finalAudioPath = audioPath;
    
    if (hasBackgroundMusic) {
      console.log('🎵 Processing background music...');
      console.log(`   Voice: ${path.basename(audioPath)}`);
      console.log(`   Music: ${path.basename(actualMusicPath)}`);
      const mixedAudioPath = path.join(CONFIG.outputFolder, 'temp_audio_mixed.mp3');
      finalAudioPath = await mixAudioWithBackgroundMusic(
        audioPath,
        actualMusicPath,
        audioDuration,
        mixedAudioPath,
        introDelay  // Delay for intro
      );
      console.log('');
    } else if (introDelay > 0) {
      // No music but have image intro - delay voiceover
      console.log('🎵 Processing audio for image intro...');
      const delayedAudioPath = path.join(CONFIG.outputFolder, 'temp_audio_delayed.mp3');
      finalAudioPath = await delayVoiceover(
        audioPath,
        audioDuration,
        delayedAudioPath,
        introDelay
      );
      console.log('');
    }

    // Create temporary video from media files (images + videos)
    // Keep original duration - intro will be concatenated separately
    const tempVideoPath = path.join(CONFIG.outputFolder, 'temp_video.mp4');
    await createVideoWithMediaFiles(mediaFiles, audioDuration, tempVideoPath);

    // Show subtitle status
    if (fs.existsSync(subtitlePath)) {
      console.log(`✅ Found subtitle file: ${path.basename(subtitlePath)}`);
    } else {
      console.log(`⚠️  No subtitle file found (looking for: ${FILE_NAMES.SUBTITLES} or subtitles.ass)`);
      console.log('   Video will be generated without subtitles\n');
    }

    // Combine everything (main video with audio + subtitles)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const tempMainVideo = path.join(CONFIG.outputFolder, `temp_main_${timestamp}.mp4`);
    
    // Calculate actual audio duration (includes intro delay if present)
    const actualAudioDuration = audioDuration + introDelay;
    
    await combineVideoAudioSubtitles(
      tempVideoPath,
      finalAudioPath,
      subtitlePath,
      tempMainVideo,
      actualAudioDuration  // Use actual duration including intro delay
    );

    // Add intro/outro if detected
    const videoWithIntroOutro = path.join(CONFIG.outputFolder, `temp_with_intro_outro_${timestamp}.mp4`);
    await addIntroOutro(tempMainVideo, videoWithIntroOutro, introOutroFiles);
    
    // Multi-format export
    const outputFiles = [];
    
    if (CONFIG.exportFormats.formats.length === 1) {
      // Single format - just rename to final output
      const formatName = CONFIG.exportFormats.outputNames[CONFIG.exportFormats.formats[0]];
      const outputPath = path.join(CONFIG.outputFolder, `video_${formatName}_${timestamp}.mp4`);
      fs.renameSync(videoWithIntroOutro, outputPath);
      outputFiles.push({ path: outputPath, format: CONFIG.exportFormats.formats[0] });
    } else {
      // Multiple formats - convert each
      console.log('\n📦 Exporting multiple formats...');
      
      for (const format of CONFIG.exportFormats.formats) {
        const formatName = CONFIG.exportFormats.outputNames[format];
        const outputPath = path.join(CONFIG.outputFolder, `video_${formatName}_${timestamp}.mp4`);
        
        if (format === 'original' || format === CONFIG.aspectRatio || (CONFIG.useOriginalSize && format === 'original')) {
          // Original format or native format - just copy, no conversion
          fs.copyFileSync(videoWithIntroOutro, outputPath);
          if (format === 'original') {
            console.log(`✅ Original size - no conversion (${CONFIG.useOriginalSize ? 'custom dimensions' : CONFIG.aspectRatio})`);
          } else {
            console.log(`✅ ${format} (native format) - copied`);
          }
        } else {
          // Need to convert to different aspect ratio
          await convertToAspectRatio(videoWithIntroOutro, outputPath, format);
        }
        
        outputFiles.push({ path: outputPath, format });
      }
      
      // Clean up the temp file with intro/outro
      fs.unlinkSync(videoWithIntroOutro);
    }

    // Clean up temp files
    fs.unlinkSync(tempVideoPath);
    fs.unlinkSync(tempMainVideo);
    
    // Clean up mixed audio if it was created
    const mixedAudioPath = path.join(CONFIG.outputFolder, 'temp_audio_mixed.mp3');
    if (fs.existsSync(mixedAudioPath)) {
      fs.unlinkSync(mixedAudioPath);
    }
    
    // Clean up delayed audio if it was created
    const delayedAudioPath = path.join(CONFIG.outputFolder, 'temp_audio_delayed.mp3');
    if (fs.existsSync(delayedAudioPath)) {
      fs.unlinkSync(delayedAudioPath);
    }
    
    // Clean up temp intro image video if it was created
    const tempIntroImage = path.join(CONFIG.outputFolder, 'temp_intro_from_image.mp4');
    if (fs.existsSync(tempIntroImage)) {
      fs.unlinkSync(tempIntroImage);
    }

    // Calculate total time
    const totalTime = Math.floor((Date.now() - totalStartTime) / 1000);
    const totalMinutes = Math.floor(totalTime / 60);
    const totalSeconds = totalTime % 60;
    
    // Get file size of first output
    const stats = fs.statSync(outputFiles[0].path);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    logger.section('🎉 VIDEO GENERATION COMPLETE! 🎉');
    
    // Show all output files
    if (outputFiles.length === 1) {
      console.log(`\n📹 Output File: ${path.basename(outputFiles[0].path)}`);
      console.log(`📁 Location: ${CONFIG.outputFolder}`);
      console.log(`📊 File Size: ${fileSizeMB} MB`);
    } else {
      console.log(`\n📹 Output Files (${outputFiles.length} formats):`);
      outputFiles.forEach(file => {
        const stats = fs.statSync(file.path);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   • ${file.format}: ${path.basename(file.path)} (${sizeMB} MB)`);
      });
      console.log(`📁 Location: ${CONFIG.outputFolder}`);
    }
    
    console.log(`⏱️  Total Time: ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`);
    console.log(`\n✨ Settings:`);
    console.log(`   • Aspect Ratio: ${CONFIG.useOriginalSize ? 'Original Size' : CONFIG.aspectRatio}`);
    console.log(`   • Animation: ${CONFIG.animationEffect}`);
    if (videos.length > 0) {
      console.log(`   • Media: ${images.length} images + ${videos.length} videos (${mediaFiles.length} total)`);
    } else {
      console.log(`   • Images: ${images.length}`);
    }
    console.log(`   • Duration: ${audioDuration.toFixed(1)}s`);
    
    // Subtitle info
    if (CONFIG.languageLearning.enabled && CONFIG.languageLearning.dualSubtitles) {
      console.log(`   • Subtitles: Dual Language (Learning Mode 🌍)`);
    } else if (fs.existsSync(subtitlePath)) {
      console.log(`   • Subtitles: Yes`);
    } else {
      console.log(`   • Subtitles: No`);
    }
    
    // Intro/Outro info
    if (CONFIG.introOutro.enabled && CONFIG.introOutro.mode !== 'none') {
      console.log(`   • Intro/Outro: ${CONFIG.introOutro.mode}`);
    }
    
    // CTA info
    if (CONFIG.cta.enabled) {
      console.log(`   • CTA: Yes (${CONFIG.cta.position}, ${CONFIG.cta.startTime}s)`);
    }
    
    // Export formats info
    if (CONFIG.exportFormats.formats.length > 1) {
      console.log(`   • Formats: ${CONFIG.exportFormats.formats.join(', ')}`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Create a copy as final_video.mp4 for batch processing compatibility
    const finalVideoPath = path.join(CONFIG.outputFolder, 'final_video.mp4');
    fs.copyFileSync(outputFiles[0].path, finalVideoPath);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Tip: Check that ffmpeg is installed and all input files are valid\n');
    process.exit(1);
  }
}

/**
 * Process channel batch - select channel and process all videos
 */
async function processChannelBatch() {
  const channels = detectChannels();
  
  if (channels.length === 0) {
    console.log('📭 No channels found in channels/ folder');
    console.log('   Create a channel folder with channel.json to get started\n');
    console.log('   Example structure:');
    console.log('   channels/my-channel/');
    console.log('   ├── channel.json');
    console.log('   ├── image-pool/');
    console.log('   ├── music-pool/');
    console.log('   └── videos/\n');
    return;
  }
  
  // Show available channels
  console.log('📺 Available Channels:\n');
  channels.forEach((channel, index) => {
    const desc = channel.config.description || 'No description';
    console.log(`  ${index + 1}. ${channel.name} (${channel.videoCount} videos)`);
    console.log(`     ${desc}`);
  });
  console.log('');
  
  // Select channel
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`Select channel (1-${channels.length}): `, async (answer) => {
      rl.close();
      
      const choice = parseInt(answer.trim());
      if (isNaN(choice) || choice < 1 || choice > channels.length) {
        console.log('\n❌ Invalid selection\n');
        resolve();
        return;
      }
      
      const selectedChannel = channels[choice - 1];
      console.log(`\n✅ Selected: ${selectedChannel.name}\n`);
      
      // Load channel configuration
      try {
        const channelConfig = loadChannelConfig(selectedChannel.path);
        console.log(`📋 Channel Settings:`);
        console.log(`   Aspect Ratio: ${channelConfig.defaults?.aspectRatio || '16:9'}`);
        console.log(`   Animation: ${channelConfig.defaults?.animation || 'none'}`);
        console.log(`   Quality: ${channelConfig.defaults?.qualityMode || 'high'}`);
        if (channelConfig.defaults?.randomImages) {
          console.log(`   Random Images: ${channelConfig.defaults.imageCount || 'all'} per video`);
        }
        if (channelConfig.defaults?.randomMusic) {
          console.log(`   Random Music: From channel pool`);
        }
        console.log('');
        
        // Detect projects in channel
        const projects = detectChannelProjects(selectedChannel.path, channelConfig);
        
        if (projects.length === 0) {
          console.log('\n📭 No valid projects found in this channel');
          console.log('   Create video folders in channels/' + selectedChannel.name + '/videos/\n');
          resolve();
          return;
        }
        
        console.log(`\n📋 Found ${projects.length} valid project${projects.length > 1 ? 's' : ''}`);
        console.log(`${'='.repeat(60)}\n`);
        
        // Process all projects
        const results = {
          total: projects.length,
          successful: 0,
          failed: 0,
          details: []
        };
        
        for (let i = 0; i < projects.length; i++) {
          const project = projects[i];
          
          console.log(`${'='.repeat(60)}`);
          console.log(`📹 [${i + 1}/${projects.length}] Processing: ${project.name}`);
          console.log(`${'='.repeat(60)}\n`);
          
          const startTime = Date.now();
          
          try {
            // Prepare input files (copies to input folder)
            await prepareProjectInput(project);
            
            // Apply project-specific config overrides
            applyProjectConfig(project.config);
            
            // Generate the video (skip prompts - config already set)
            // Pass video and channel folders for intro/outro detection
            await generateVideo(true, project.path, selectedChannel.path);
            
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            
            // Move output to channel output folder
            const outputFolder = path.join(CONFIG.outputFolder, 'batch', selectedChannel.name, project.name);
            const outputPath = await moveOutputToProject({ ...project, outputFolder });
            
            results.successful++;
            results.details.push({
              project: project.name,
              status: 'success',
              output: outputPath,
              duration: duration
            });
            
            console.log(`\n✅ Success: ${project.name} (${duration}s)`);
            console.log(`   Output: ${outputPath}\n`);
            
          } catch (error) {
            results.failed++;
            results.details.push({
              project: project.name,
              status: 'failed',
              error: error.message
            });
            
            console.error(`\n❌ Failed: ${project.name}`);
            console.error(`   Error: ${error.message}\n`);
          }
        }
        
        // Print summary
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📊 Channel Batch Complete: ${selectedChannel.name}`);
        console.log(`${'='.repeat(60)}\n`);
        console.log(`Total Projects: ${results.total}`);
        console.log(`✅ Successful: ${results.successful}`);
        console.log(`❌ Failed: ${results.failed}\n`);
        
        if (results.successful > 0) {
          console.log(`📁 Output files in: output/batch/${selectedChannel.name}/`);
          results.details
            .filter(r => r.status === 'success')
            .forEach(r => {
              console.log(`   ✅ ${r.project} (${r.duration}s)`);
            });
          console.log('');
        }
        
        if (results.failed > 0) {
          console.log(`\n❌ Failed projects:`);
          results.details
            .filter(r => r.status === 'failed')
            .forEach(r => {
              console.log(`   ❌ ${r.project}: ${r.error}`);
            });
          console.log('');
        }
        
      } catch (error) {
        console.error(`\n❌ Error loading channel: ${error.message}\n`);
      }
      
      resolve();
    });
  });
}

/**
 * Main menu
 */
async function mainMenu() {
  console.log('\n🎬 YT-Machine - Video Generator\n');
  console.log('  1. Interactive Mode (create single video with prompts)');
  console.log('  2. Batch Processing - Select Channel');
  console.log('  3. Batch Processing - Legacy (batch-videos/ folder)');
  console.log('  4. Exit\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('Choose mode (1-4, Enter = 1): ', async (answer) => {
      rl.close();
      const choice = answer.trim() || '1';
      
      switch (choice) {
        case '1':
          console.log('\n✅ Interactive Mode\n');
          await generateVideo();
          break;
        
        case '2':
          console.log('\n✅ Batch Processing - Channel Mode\n');
          await processChannelBatch();
          break;
        
        case '3':
          console.log('\n✅ Batch Processing - Legacy Mode\n');
          await processBatchProjects();
          break;
        
        case '4':
          console.log('\n👋 Goodbye!\n');
          process.exit(0);
          break;
        
        default:
          console.log('\n❌ Invalid choice. Starting Interactive Mode...\n');
          await generateVideo();
      }
      
      resolve();
    });
  });
}

// Run the main menu
mainMenu();
