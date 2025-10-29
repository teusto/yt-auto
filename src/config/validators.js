import { VIDEO_DIMENSIONS, SUBTITLE_ALIGNMENT, QUALITY_MODES } from './constants.js';

export function validateChannelConfig(channelConfig) {
  const warnings = [];
  const errors = [];

  if (!channelConfig || typeof channelConfig !== 'object') {
    errors.push('Channel config is missing or invalid JSON.');
    return { warnings, errors };
  }

  const d = channelConfig.defaults || {};

  // Aspect ratio
  if (d.aspectRatio && !VIDEO_DIMENSIONS[d.aspectRatio]) {
    warnings.push(`Unknown aspectRatio '${d.aspectRatio}'. Expected one of: ${Object.keys(VIDEO_DIMENSIONS).join(', ')}`);
  }

  // FPS
  if (d.fps !== undefined && (typeof d.fps !== 'number' || d.fps <= 0)) {
    warnings.push('defaults.fps should be a positive number.');
  }

  // Quality mode
  if (d.qualityMode && ![QUALITY_MODES.DRAFT, QUALITY_MODES.HIGH].includes(d.qualityMode)) {
    warnings.push(`defaults.qualityMode '${d.qualityMode}' is not recognized. Use '${QUALITY_MODES.DRAFT}' or '${QUALITY_MODES.HIGH}'.`);
  }

  // Subtitle alignment
  if (d.subtitle && d.subtitle.alignment !== undefined) {
    const validAlignments = new Set(Object.values(SUBTITLE_ALIGNMENT));
    if (!validAlignments.has(d.subtitle.alignment)) {
      warnings.push(`defaults.subtitle.alignment '${d.subtitle.alignment}' is not valid. Use one of: ${[...validAlignments].join(', ')}`);
    }
  }

  return { warnings, errors };
}

export function validateProjectConfig(projectConfig) {
  const warnings = [];
  const errors = [];

  if (!projectConfig || typeof projectConfig !== 'object') {
    warnings.push('Project config missing or invalid JSON.');
    return { warnings, errors };
  }

  if (projectConfig.aspectRatio && !VIDEO_DIMENSIONS[projectConfig.aspectRatio]) {
    warnings.push(`aspectRatio '${projectConfig.aspectRatio}' is not recognized.`);
  }

  if (projectConfig.subtitle) {
    const s = projectConfig.subtitle;
    if (s.alignment !== undefined) {
      const validAlignments = new Set(Object.values(SUBTITLE_ALIGNMENT));
      if (!validAlignments.has(s.alignment)) {
        warnings.push(`subtitle.alignment '${s.alignment}' is not valid.`);
      }
    }
    if (s.fontSize !== undefined && (typeof s.fontSize !== 'number' || s.fontSize <= 0)) {
      warnings.push('subtitle.fontSize should be a positive number.');
    }
  }

  return { warnings, errors };
}

export function validateAppConfig(CONFIG) {
  const warnings = [];

  if (!VIDEO_DIMENSIONS[CONFIG.aspectRatio] && !CONFIG.useOriginalSize) {
    warnings.push(`Runtime aspectRatio '${CONFIG.aspectRatio}' unknown; using dimensions ${CONFIG.videoWidth}x${CONFIG.videoHeight}.`);
  }

  if (CONFIG.subtitleStyle.marginV < 0) {
    warnings.push('subtitleStyle.marginV should not be negative.');
  }

  return { warnings };
}
