/**
 * Timeline System Entry Point
 * Exports all timeline functionality
 */

export { TimelineBuilder, buildTimeline } from './builder.js';
export { 
  SEGMENT_TYPES, 
  TIMELINE_SEGMENT_SCHEMA,
  TIMELINE_EXAMPLES,
  validateTimelineConfig 
} from './schema.js';
export { 
  promptTimeline, 
  displayTimelineSummary 
} from './prompt.js';

/**
 * Check if timeline is configured
 */
export function hasTimeline(config) {
  return config && config.timeline && config.timeline.segments && config.timeline.segments.length > 0;
}

/**
 * Get timeline from config or return null
 */
export function getTimeline(config) {
  if (!hasTimeline(config)) {
    return null;
  }
  return config.timeline;
}
