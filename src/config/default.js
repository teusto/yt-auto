import {
  DEFAULT_VIDEO,
  FRAME_RATES,
  AUDIO_DEFAULTS,
  SUBTITLE_DEFAULTS,
  // ... all constants
} from './constants.js';

export function createDefaultConfig(basePath) {
  return {
    inputFolder: path.join(basePath, '../input'),
    outputFolder: path.join(basePath, '../output'),
    fontsFolder: path.join(basePath, '../fonts'),
    introsFolder: path.join(basePath, '../intros'),
    ctaFolder: path.join(basePath, '../cta'),
    videoWidth: DEFAULT_VIDEO.WIDTH,
    videoHeight: DEFAULT_VIDEO.HEIGHT,
    fps: FRAME_RATES.STANDARD,
    animationFps: FRAME_RATES.ANIMATION,
    imageFormats: FILE_FORMATS.IMAGE,
    videoFormats: FILE_FORMATS.VIDEO,
    audioFormats: FILE_FORMATS.AUDIO,
    fontFormats: FILE_FORMATS.FONT,
    subtitleFile: FILE_NAMES.SUBTITLES,
    aspectRatio: DEFAULT_VIDEO.ASPECT_RATIO,
    useOriginalSize: false,
    animationEffect: 'static',
    qualityMode: 'high',
    aspectRatios: VIDEO_DIMENSIONS,
    audio: {
      voiceVolume: AUDIO_DEFAULTS.VOICE_VOLUME,
      musicVolume: AUDIO_DEFAULTS.MUSIC_VOLUME,
      musicFadeIn: AUDIO_DEFAULTS.MUSIC_FADE_IN,
      musicFadeOut: AUDIO_DEFAULTS.MUSIC_FADE_OUT,
      voiceFadeIn: AUDIO_DEFAULTS.VOICE_FADE_IN,
      voiceFadeOut: AUDIO_DEFAULTS.VOICE_FADE_OUT
    },
    subtitleStyle: {
      fontFamily: SUBTITLE_DEFAULTS.FONT_FAMILY,
      fontPath: null,
      fontSize: SUBTITLE_DEFAULTS.FONT_SIZE,
      fontColor: SUBTITLE_DEFAULTS.FONT_COLOR,
      outlineColor: SUBTITLE_DEFAULTS.OUTLINE_COLOR,
      outlineWidth: SUBTITLE_DEFAULTS.OUTLINE_WIDTH,
      backgroundColor: SUBTITLE_DEFAULTS.BACKGROUND_COLOR,
      position: SUBTITLE_DEFAULTS.POSITION,
      marginV: SUBTITLE_DEFAULTS.MARGIN_V,
      alignment: SUBTITLE_ALIGNMENT.CENTER,
      bold: false,
      italic: false,
      lineSpacing: 0,
      animationStyle: 'none' // 'none' or 'karaoke'
    },
    subtitleLanguage: null,
    languageLearning: {
      enabled: false,
      dualSubtitles: false,
      targetFile: FILE_NAMES.SUBTITLES_TARGET,
      nativeFile: FILE_NAMES.SUBTITLES_NATIVE,
      targetSize: LANGUAGE_LEARNING.TARGET_SIZE,
      nativeSize: LANGUAGE_LEARNING.NATIVE_SIZE,
      targetColor: LANGUAGE_LEARNING.TARGET_COLOR,
      nativeColor: LANGUAGE_LEARNING.NATIVE_COLOR,
      spacing: LANGUAGE_LEARNING.SPACING
    },
    introOutro: {
      enabled: false,
      introPath: null,
      outroPath: null,
      mode: INTRO_OUTRO_MODES.NONE
    },
    cta: {
      enabled: false,
      imagePath: null,
      isVideo: false,
      position: CTA_DEFAULTS.POSITION,
      startTime: CTA_DEFAULTS.START_TIME,
      duration: CTA_DEFAULTS.DURATION,
      opacity: CTA_DEFAULTS.OPACITY,
      scale: CTA_DEFAULTS.SCALE
    },
    exportFormats: {
      formats: [DEFAULT_VIDEO.ASPECT_RATIO],
      outputNames: PLATFORM_FORMAT_MAP
    }
  };
}