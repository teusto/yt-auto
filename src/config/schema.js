/**
 * Configuration Schema
 * Defines valid config structure, types, and values with helpful error messages
 */

import { 
  VIDEO_DIMENSIONS, 
  SUBTITLE_ALIGNMENT, 
  SUBTITLE_STYLES,
  QUALITY_MODES,
  ANIMATION_EFFECTS,
  PLATFORMS
} from './constants.js';

/**
 * Define valid config schema with type checking and validation rules
 */
export const CONFIG_SCHEMA = {
  // Channel Config Schema
  channel: {
    name: {
      type: 'string',
      required: true,
      description: 'Channel name'
    },
    description: {
      type: 'string',
      required: false,
      description: 'Channel description'
    },
    platform: {
      type: 'string',
      required: false,
      validValues: Object.values(PLATFORMS),
      default: 'youtube',
      description: 'Target platform (youtube, instagram, tiktok)'
    },
    defaults: {
      type: 'object',
      required: false,
      description: 'Default settings for all videos in this channel',
      schema: 'projectDefaults'  // Reference to projectDefaults schema
    }
  },

  // Project Defaults / Config Schema
  projectDefaults: {
    aspectRatio: {
      type: 'string',
      required: false,
      validValues: Object.keys(VIDEO_DIMENSIONS),
      default: '16:9',
      description: 'Video aspect ratio',
      examples: ['9:16 (TikTok/Reels)', '16:9 (YouTube)', '1:1 (Instagram)', '4:5 (Instagram)']
    },
    
    animation: {
      type: 'string',
      required: false,
      validValues: Object.values(ANIMATION_EFFECTS),
      default: 'static',
      description: 'Image animation effect',
      examples: ['static', 'zoom-in', 'zoom-out', 'pan-left', 'pan-right']
    },
    
    qualityMode: {
      type: 'string',
      required: false,
      validValues: [QUALITY_MODES.DRAFT, QUALITY_MODES.HIGH],
      default: QUALITY_MODES.HIGH,
      description: 'Encoding quality',
      examples: ['draft (faster)', 'high (better quality)']
    },
    
    fps: {
      type: 'number',
      required: false,
      min: 1,
      max: 60,
      default: 30,
      description: 'Frames per second'
    },
    
    randomImages: {
      type: ['number', 'boolean'],
      required: false,
      min: 0,
      default: false,
      description: 'Number of random images to select, or false to use all',
      examples: ['8 (select 8 random)', 'false (use all images)']
    },
    
    useChannelPool: {
      type: 'boolean',
      required: false,
      default: false,
      description: 'Use channel image pool instead of video folder images'
    },
    
    randomMusic: {
      type: 'boolean',
      required: false,
      default: false,
      description: 'Select random music from pool'
    },
    
    language: {
      type: 'string',
      required: false,
      default: 'en',
      description: 'Language code for auto-subtitles',
      examples: ['en', 'es', 'pt', 'fr', 'de']
    },
    
    subtitle: {
      type: 'object',
      required: false,
      description: 'Subtitle styling options',
      schema: {
        style: {
          type: 'string',
          required: false,
          validValues: Object.keys(SUBTITLE_STYLES).map(k => k.toLowerCase()),
          default: 'classic',
          description: 'Subtitle style preset',
          examples: ['classic', 'bold', 'yellow', 'minimal', 'modern', 'cinematic', 'shadow']
        },
        position: {
          type: 'string',
          required: false,
          validValues: ['bottom', 'center', 'top'],
          default: 'bottom',
          description: 'Subtitle position on screen'
        },
        fontSize: {
          type: 'number',
          required: false,
          min: 20,
          max: 200,
          default: 48,
          description: 'Font size in pixels'
        },
        fontColor: {
          type: 'string',
          required: false,
          default: 'white',
          description: 'Text color (e.g., "white", "yellow", "#FF0000")'
        },
        outlineWidth: {
          type: 'number',
          required: false,
          min: 0,
          max: 10,
          default: 2,
          description: 'Outline thickness in pixels'
        },
        shadowDepth: {
          type: 'number',
          required: false,
          min: 0,
          max: 10,
          default: 0,
          description: 'Shadow depth in pixels (0 = no shadow)'
        },
        bold: {
          type: 'boolean',
          required: false,
          default: false,
          description: 'Use bold font'
        }
      }
    },
    
    audio: {
      type: 'object',
      required: false,
      description: 'Audio mixing options',
      schema: {
        musicVolume: {
          type: 'number',
          required: false,
          min: 0,
          max: 1,
          default: 0.3,
          description: 'Background music volume (0.0 to 1.0)'
        },
        musicFadeIn: {
          type: 'number',
          required: false,
          min: 0,
          max: 10,
          default: 2,
          description: 'Music fade in duration (seconds)'
        },
        musicFadeOut: {
          type: 'number',
          required: false,
          min: 0,
          max: 10,
          default: 3,
          description: 'Music fade out duration (seconds)'
        },
        voiceFadeIn: {
          type: 'number',
          required: false,
          min: 0,
          max: 5,
          default: 0.5,
          description: 'Voice fade in duration (seconds)'
        },
        voiceFadeOut: {
          type: 'number',
          required: false,
          min: 0,
          max: 5,
          default: 0.5,
          description: 'Voice fade out duration (seconds)'
        }
      }
    },
    
    clips: {
      type: 'object',
      required: false,
      description: 'Clip pairing and transition options',
      schema: {
        mode: {
          type: 'string',
          required: false,
          validValues: ['single-audio', 'paired', 'auto'],
          default: 'auto',
          description: 'Audio-clip pairing mode'
        },
        transition: {
          type: 'string',
          required: false,
          validValues: ['none', 'fade-black'],
          default: 'none',
          description: 'Transition between clips'
        },
        fadeBlackDuration: {
          type: 'number',
          required: false,
          min: 0.1,
          max: 3,
          default: 0.3,
          description: 'Fade-to-black duration (seconds)'
        }
      }
    },
    
    cta: {
      type: 'object',
      required: false,
      description: 'Call-to-action overlay',
      schema: {
        enabled: {
          type: 'boolean',
          required: false,
          default: false,
          description: 'Enable CTA overlay'
        },
        position: {
          type: 'string',
          required: false,
          validValues: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          default: 'bottom-right',
          description: 'CTA position on screen'
        },
        startTime: {
          type: 'number',
          required: false,
          min: 0,
          default: 0,
          description: 'When to show CTA (seconds from start)'
        },
        duration: {
          type: 'number',
          required: false,
          min: 0,
          default: 0,
          description: 'CTA duration (0 = until end)'
        }
      }
    }
  }
};

/**
 * Common config presets for quick setup
 */
export const CONFIG_PRESETS = {
  'youtube-shorts': {
    name: 'YouTube Shorts',
    description: 'Optimized for YouTube Shorts (vertical)',
    config: {
      aspectRatio: '9:16',
      animation: 'zoom-in',
      qualityMode: 'high',
      randomImages: 8,
      subtitle: {
        style: 'bold',
        position: 'center',
        fontSize: 56
      },
      clips: {
        transition: 'fade-black',
        fadeBlackDuration: 0.3
      }
    }
  },
  
  'youtube-landscape': {
    name: 'YouTube Landscape',
    description: 'Standard YouTube horizontal videos',
    config: {
      aspectRatio: '16:9',
      animation: 'static',
      qualityMode: 'high',
      subtitle: {
        style: 'classic',
        position: 'bottom'
      }
    }
  },
  
  'instagram-reels': {
    name: 'Instagram Reels',
    description: 'Optimized for Instagram Reels',
    config: {
      aspectRatio: '9:16',
      animation: 'zoom-out',
      qualityMode: 'high',
      randomImages: 10,
      subtitle: {
        style: 'bold',
        position: 'center',
        fontSize: 52
      }
    }
  },
  
  'tiktok': {
    name: 'TikTok',
    description: 'Optimized for TikTok videos',
    config: {
      aspectRatio: '9:16',
      animation: 'zoom-in',
      qualityMode: 'high',
      randomImages: 8,
      subtitle: {
        style: 'bold',
        position: 'top',
        fontSize: 58
      },
      clips: {
        transition: 'fade-black',
        fadeBlackDuration: 0.2
      }
    }
  },
  
  'minimal': {
    name: 'Minimal',
    description: 'Simple, clean setup with essential options only',
    config: {
      aspectRatio: '16:9',
      animation: 'static',
      qualityMode: 'high',
      subtitle: {
        style: 'minimal'
      }
    }
  }
};

/**
 * Get validation rules for a specific field path
 */
export function getFieldSchema(schemaType, fieldPath) {
  let schema = CONFIG_SCHEMA[schemaType];
  if (!schema) return null;
  
  const parts = fieldPath.split('.');
  for (const part of parts) {
    schema = schema[part];
    if (!schema) return null;
    if (schema.schema && typeof schema.schema === 'string') {
      // Reference to another schema
      schema = CONFIG_SCHEMA[schema.schema];
    } else if (schema.schema && typeof schema.schema === 'object') {
      // Nested schema
      schema = schema.schema;
    }
  }
  
  return schema;
}

/**
 * Get all valid values for enum fields
 */
export function getValidValues(schemaType, fieldPath) {
  const schema = getFieldSchema(schemaType, fieldPath);
  return schema?.validValues || null;
}

/**
 * Get default value for a field
 */
export function getDefaultValue(schemaType, fieldPath) {
  const schema = getFieldSchema(schemaType, fieldPath);
  return schema?.default;
}
