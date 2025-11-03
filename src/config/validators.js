/**
 * Config Validators
 * Uses enhanced validation with schema-based rules
 */

import { 
  validateChannelConfig as enhancedValidateChannel,
  validateProjectConfig as enhancedValidateProject,
  applyPreset,
  listPresets,
  generateExampleConfig
} from './enhanced-validator.js';
import * as debug from '../debug/logger.js';

/**
 * Validate channel config with enhanced validation
 */
export function validateChannelConfig(channelConfig) {
  debug.step('Validating channel config');
  
  // Apply preset if specified
  let config = channelConfig;
  if (channelConfig.preset) {
    config = applyPreset(channelConfig);
  }
  
  // Run enhanced validation
  const result = enhancedValidateChannel(config);
  
  // Log to debug
  if (result.hasIssues()) {
    debug.log('VALIDATION', 'Channel config issues found', {
      errors: result.errors.length,
      warnings: result.warnings.length
    });
  }
  
  // Return legacy format for backward compatibility
  return {
    warnings: result.warnings.map(w => w.message),
    errors: result.errors.map(e => e.message),
    result,  // Include full result for enhanced features
    config   // Return potentially preset-applied config
  };
}

/**
 * Validate project config with enhanced validation
 */
export function validateProjectConfig(projectConfig) {
  debug.step('Validating project config');
  
  // Apply preset if specified
  let config = projectConfig;
  if (projectConfig.preset) {
    config = applyPreset(projectConfig);
  }
  
  // Run enhanced validation
  const result = enhancedValidateProject(config);
  
  // Log to debug
  if (result.hasIssues()) {
    debug.log('VALIDATION', 'Project config issues found', {
      errors: result.errors.length,
      warnings: result.warnings.length
    });
  }
  
  // Return legacy format for backward compatibility
  return {
    warnings: result.warnings.map(w => w.message),
    errors: result.errors.map(e => e.message),
    result,  // Include full result
    config   // Return potentially preset-applied config
  };
}

/**
 * Validate runtime app config (basic checks only)
 */
export function validateAppConfig(CONFIG) {
  const warnings = [];
  
  // Basic runtime checks
  if (CONFIG.subtitleStyle.marginV < 0) {
    warnings.push('subtitleStyle.marginV should not be negative.');
  }
  
  return { warnings };
}

// Export enhanced validator functions for direct use
export { 
  applyPreset,
  listPresets,
  generateExampleConfig
};

// Also export enhanced versions with different names
export {
  enhancedValidateChannel as validateChannelConfigEnhanced,
  enhancedValidateProject as validateProjectConfigEnhanced
};
