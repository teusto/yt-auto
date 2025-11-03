/**
 * Pro Features Configuration
 * Central registry for all premium features
 */

/**
 * Pro feature flags (evaluated at runtime)
 * Set to true to enable premium features
 */
export const PRO_FEATURES = {
  // Getters to evaluate at runtime (after dotenv loads)
  get TIMELINE() {
    return process.env.PRO_TIMELINE === 'true';
  },
  
  get TRANSLATIONS() {
    return process.env.PRO_TRANSLATIONS === 'true';
  },
  
  // Future pro features (placeholders)
  get ADVANCED_EFFECTS() {
    return process.env.PRO_ADVANCED_EFFECTS === 'true';
  },
  
  get AI_EDITING() {
    return process.env.PRO_AI_EDITING === 'true';
  },
  
  get BATCH_OPTIMIZATION() {
    return process.env.PRO_BATCH_OPTIMIZATION === 'true';
  }
};

/**
 * Check if pro features are enabled
 */
export function isProEnabled() {
  return Object.values(PRO_FEATURES).some(enabled => enabled);
}

/**
 * Check if a specific pro feature is enabled
 */
export function isFeatureEnabled(featureName) {
  return PRO_FEATURES[featureName] === true;
}

/**
 * Get list of enabled pro features
 */
export function getEnabledFeatures() {
  return Object.entries(PRO_FEATURES)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
}

/**
 * Pro feature metadata
 */
export const PRO_FEATURE_INFO = {
  TIMELINE: {
    name: 'Timeline/Scene System',
    description: 'Custom video segment ordering with scenes',
    version: '1.0.0',
    docs: '/docs/pro/TIMELINE.md'
  },
  TRANSLATIONS: {
    name: 'Multi-Language Translations',
    description: 'Translate subtitles to 31+ languages',
    version: '1.0.0',
    docs: '/docs/pro/TRANSLATIONS.md'
  },
  ADVANCED_EFFECTS: {
    name: 'Advanced Effects',
    description: 'Premium visual effects and transitions',
    version: 'Coming Soon',
    docs: '/docs/pro/EFFECTS.md'
  },
  AI_EDITING: {
    name: 'AI-Powered Editing',
    description: 'Intelligent content optimization',
    version: 'Coming Soon',
    docs: '/docs/pro/AI.md'
  }
};

/**
 * Display pro features status
 */
export function displayProStatus() {
  if (!isProEnabled()) {
    return;
  }
  
  console.log('\n✨ PRO FEATURES ENABLED ✨\n');
  const enabled = getEnabledFeatures();
  enabled.forEach(feature => {
    const info = PRO_FEATURE_INFO[feature];
    if (info) {
      console.log(`   ⭐ ${info.name}`);
      console.log(`      ${info.description}\n`);
    }
  });
}
