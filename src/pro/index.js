/**
 * Pro Features Entry Point
 * Central registry for all premium features
 */

import { 
  PRO_FEATURES, 
  isProEnabled, 
  isFeatureEnabled,
  getEnabledFeatures,
  displayProStatus 
} from './config.js';

// Timeline System
import * as Timeline from './timeline/index.js';

// Translation System
import * as Translations from './translations/index.js';

/**
 * Initialize pro features
 */
export function initProFeatures() {
  if (isProEnabled()) {
    displayProStatus();
  }
}

/**
 * Export pro features modules
 */
export const ProFeatures = {
  Timeline,
  Translations,
  
  // Future features will be added here
  // AdvancedEffects: null,
  // AIEditing: null,
};

/**
 * Export configuration functions
 */
export {
  PRO_FEATURES,
  isProEnabled,
  isFeatureEnabled,
  getEnabledFeatures,
  displayProStatus
};

/**
 * Check if any pro feature is active in config
 */
export function hasProFeatures(config) {
  return Timeline.hasTimeline(config);
  // Add checks for other pro features here
}
