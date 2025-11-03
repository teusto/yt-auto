/**
 * Timeline Schema
 * Defines valid timeline segment types and configurations
 */

/**
 * Segment types
 */
export const SEGMENT_TYPES = {
  SCENE: 'scene',           // Custom video/image scene
  INTRO: 'intro',           // Intro video
  OUTRO: 'outro',           // Outro video
  MAIN: 'main',             // Main content (generated from images/clips)
  PLACEHOLDER: 'placeholder' // Reserved space for dynamic content
};

/**
 * Timeline segment schema
 */
export const TIMELINE_SEGMENT_SCHEMA = {
  type: {
    required: true,
    validValues: Object.values(SEGMENT_TYPES),
    description: 'Type of segment'
  },
  
  // For 'scene' and 'main' types
  path: {
    required: false, // Required for 'scene' type, optional for 'main'
    type: 'string',
    description: 'Path to video or image file. For main: if provided, uses this file; if not, generates from random images'
  },
  
  name: {
    required: false,
    type: 'string',
    description: 'Descriptive name for the segment (used as marker for audio start/stop)'
  },
  
  duration: {
    required: false,
    type: 'number',
    min: 0,
    description: 'Duration in seconds (for images/placeholders/main with random images)'
  },
  
  mute: {
    required: false,
    type: 'boolean',
    default: false,
    description: 'Mute original audio (for video scenes)'
  },
  
  transition: {
    required: false,
    type: 'string',
    validValues: ['none', 'fade', 'fade-black'],
    default: 'none',
    description: 'Transition effect to next segment'
  },
  
  transitionDuration: {
    required: false,
    type: 'number',
    min: 0,
    max: 3,
    default: 0.5,
    description: 'Duration of transition effect (seconds)'
  }
};

/**
 * Timeline audio schema (optional global audio tracks)
 */
export const TIMELINE_AUDIO_SCHEMA = {
  voice: {
    path: {
      type: 'string',
      description: 'Path to voice/narration audio file'
    },
    startAt: {
      type: 'string',
      description: 'Scene name where voice should start (optional, default: start of timeline)'
    },
    volume: {
      type: 'number',
      min: 0,
      max: 1,
      default: 1.0,
      description: 'Voice volume (0.0 to 1.0)'
    }
  },
  music: {
    path: {
      type: 'string',
      description: 'Path to background music file'
    },
    startAt: {
      type: 'string',
      description: 'Scene name where music should start (optional, default: start of timeline)'
    },
    stopAt: {
      type: 'string',
      description: 'Scene name where music should stop (optional, default: end of timeline)'
    },
    volume: {
      type: 'number',
      min: 0,
      max: 1,
      default: 0.3,
      description: 'Music volume (0.0 to 1.0)'
    },
    fadeIn: {
      type: 'number',
      min: 0,
      default: 2.0,
      description: 'Fade in duration (seconds)'
    },
    fadeOut: {
      type: 'number',
      min: 0,
      default: 2.0,
      description: 'Fade out duration (seconds)'
    }
  }
};

/**
 * Example timeline configurations
 */
export const TIMELINE_EXAMPLES = {
  // Simple: Intro + Main + Outro
  basic: {
    segments: [
      { type: 'intro', path: 'intro.mp4' },
      { type: 'main' },
      { type: 'outro', path: 'outro.mp4' }
    ]
  },
  
  // With scenes
  withScenes: {
    segments: [
      { type: 'scene', path: 'scenes/opening.mp4', name: 'Opening', mute: false },
      { type: 'scene', path: 'scenes/title.jpg', name: 'Title Card', duration: 3 },
      { type: 'intro', path: 'intro.mp4' },
      { type: 'main' },
      { type: 'scene', path: 'scenes/cta.mp4', name: 'Call to Action' },
      { type: 'outro', path: 'outro.mp4' }
    ]
  },
  
  // With transitions
  withTransitions: {
    segments: [
      { 
        type: 'scene', 
        path: 'scenes/opening.mp4',
        transition: 'fade-black',
        transitionDuration: 1.0
      },
      { 
        type: 'main',
        transition: 'fade'
      },
      { type: 'outro', path: 'outro.mp4' }
    ]
  }
};

/**
 * Validate a timeline configuration
 */
export function validateTimelineConfig(timeline) {
  const errors = [];
  const warnings = [];
  
  if (!timeline || !timeline.segments) {
    errors.push('Timeline must have a "segments" array');
    return { valid: false, errors, warnings };
  }
  
  if (!Array.isArray(timeline.segments)) {
    errors.push('Timeline segments must be an array');
    return { valid: false, errors, warnings };
  }
  
  if (timeline.segments.length === 0) {
    errors.push('Timeline must have at least one segment');
    return { valid: false, errors, warnings };
  }
  
  // Check for at least one 'main' segment
  const hasMain = timeline.segments.some(seg => seg.type === 'main');
  if (!hasMain) {
    warnings.push('Timeline should include at least one "main" segment for generated content');
  }
  
  // Validate each segment
  timeline.segments.forEach((segment, index) => {
    const segmentPath = `segments[${index}]`;
    
    // Type validation
    if (!segment.type) {
      errors.push(`${segmentPath}: Missing required "type" field`);
      return;
    }
    
    if (!Object.values(SEGMENT_TYPES).includes(segment.type)) {
      errors.push(`${segmentPath}: Invalid type "${segment.type}". Must be one of: ${Object.values(SEGMENT_TYPES).join(', ')}`);
    }
    
    // Path validation for scene types
    if (segment.type === 'scene' && !segment.path) {
      errors.push(`${segmentPath}: "scene" type requires a "path" field`);
    }
    
    // Transition validation
    if (segment.transition && !['none', 'fade', 'fade-black'].includes(segment.transition)) {
      warnings.push(`${segmentPath}: Unknown transition "${segment.transition}"`);
    }
    
    // Duration validation
    if (segment.duration !== undefined) {
      if (typeof segment.duration !== 'number' || segment.duration < 0) {
        errors.push(`${segmentPath}: Duration must be a positive number`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
