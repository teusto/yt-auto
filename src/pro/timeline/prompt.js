/**
 * Timeline Interactive Prompt
 * User-friendly interface for configuring timeline in interactive mode
 */

import readline from 'readline';
import { SEGMENT_TYPES, TIMELINE_EXAMPLES } from './schema.js';
import { logger } from '../../utils/logger.js';

/**
 * Prompt user for timeline configuration
 */
export function promptTimeline() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    logger.info('\n🎬 Timeline/Scene System (PRO)\n');
    logger.info('Create custom video sequences with multiple segments.\n');
    logger.info('  1. Use Timeline (custom segment ordering)');
    logger.info('  2. Skip (use standard video generation)\n');

    rl.question('Choose option (1-2, Enter = 2): ', (answer) => {
      const choice = answer.trim() || '2';

      if (choice === '1') {
        logger.success('Timeline Mode Enabled\n');
        promptTimelineSegments(rl, resolve);
      } else {
        logger.success('Standard Mode\n');
        rl.close();
        resolve(null); // No timeline
      }
    });
  });
}

/**
 * Prompt for timeline segments
 */
function promptTimelineSegments(rl, resolve) {
  logger.info('📋 Timeline Segment Options:\n');
  logger.info('  Available segment types:');
  logger.info('    • scene - Custom video or image');
  logger.info('    • intro - Intro video');
  logger.info('    • main - Generated content (images/clips)');
  logger.info('    • outro - Outro video\n');
  
  logger.info('  Example templates:');
  logger.info('    1. Basic: intro → main → outro');
  logger.info('    2. With Scenes: scene → intro → main → scene → outro');
  logger.info('    3. Custom: Build your own\n');

  rl.question('Choose template (1-3, Enter = 1): ', (answer) => {
    const choice = answer.trim() || '1';

    let timeline;
    switch (choice) {
      case '2':
        timeline = buildWithScenesTemplate(rl, resolve);
        break;
      case '3':
        timeline = buildCustomTimeline(rl, resolve);
        break;
      default:
        timeline = {
          segments: [
            { type: 'intro', path: 'intro.mp4' },
            { type: 'main' },
            { type: 'outro', path: 'outro.mp4' }
          ]
        };
        logger.success('Basic template selected\n');
        rl.close();
        resolve(timeline);
    }
  });
}

/**
 * Build timeline with scenes template
 */
function buildWithScenesTemplate(rl, resolve) {
  logger.info('\n📝 Building timeline with scenes...\n');
  logger.info('Default structure:');
  logger.info('  1. Opening scene (scenes/opening.mp4)');
  logger.info('  2. Title card (scenes/title.jpg, 3s)');
  logger.info('  3. Intro (intro.mp4)');
  logger.info('  4. Main content (generated)');
  logger.info('  5. CTA scene (scenes/cta.mp4)');
  logger.info('  6. Outro (outro.mp4)\n');

  rl.question('Use this structure? (Y/n): ', (answer) => {
    const useDefault = !answer.trim() || answer.trim().toLowerCase() === 'y';
    
    rl.close();
    
    if (useDefault) {
      resolve({
        segments: [
          { type: 'scene', path: 'scenes/opening.mp4', name: 'Opening', mute: false },
          { type: 'scene', path: 'scenes/title.jpg', name: 'Title Card', duration: 3 },
          { type: 'intro', path: 'intro.mp4' },
          { type: 'main' },
          { type: 'scene', path: 'scenes/cta.mp4', name: 'Call to Action' },
          { type: 'outro', path: 'outro.mp4' }
        ]
      });
    } else {
      resolve({
        segments: [
          { type: 'intro', path: 'intro.mp4' },
          { type: 'main' },
          { type: 'outro', path: 'outro.mp4' }
        ]
      });
    }
  });
}

/**
 * Build custom timeline interactively
 */
function buildCustomTimeline(rl, resolve) {
  logger.info('\n🛠️  Custom Timeline Builder\n');
  logger.info('For complex timelines, we recommend editing the config file directly.');
  logger.info('See docs/pro/TIMELINE.md for examples.\n');
  
  logger.info('Quick custom options:');
  logger.info('  1. Main content only');
  logger.info('  2. Main + Intro');
  logger.info('  3. Main + Outro');
  logger.info('  4. Full (Intro + Main + Outro)\n');

  rl.question('Choose (1-4, Enter = 4): ', (answer) => {
    const choice = answer.trim() || '4';
    
    let segments = [];
    
    switch (choice) {
      case '1':
        segments = [{ type: 'main' }];
        break;
      case '2':
        segments = [
          { type: 'intro', path: 'intro.mp4' },
          { type: 'main' }
        ];
        break;
      case '3':
        segments = [
          { type: 'main' },
          { type: 'outro', path: 'outro.mp4' }
        ];
        break;
      default:
        segments = [
          { type: 'intro', path: 'intro.mp4' },
          { type: 'main' },
          { type: 'outro', path: 'outro.mp4' }
        ];
    }
    
    rl.close();
    resolve({ segments });
  });
}

/**
 * Display timeline summary
 */
export function displayTimelineSummary(timeline) {
  if (!timeline || !timeline.segments) return;
  
  console.log('\n📋 Timeline Summary:\n');
  timeline.segments.forEach((segment, index) => {
    const icon = getSegmentIcon(segment.type);
    const name = segment.name || segment.type;
    const details = getSegmentDetails(segment);
    console.log(`   ${index + 1}. ${icon} ${name}${details}`);
  });
  console.log('');
}

/**
 * Get icon for segment type
 */
function getSegmentIcon(type) {
  const icons = {
    scene: '🎬',
    intro: '🎭',
    outro: '👋',
    main: '📹',
    placeholder: '⬜'
  };
  return icons[type] || '📄';
}

/**
 * Get segment details string
 */
function getSegmentDetails(segment) {
  const details = [];
  
  if (segment.path) {
    details.push(`"${segment.path}"`);
  }
  
  if (segment.duration) {
    details.push(`${segment.duration}s`);
  }
  
  if (segment.transition && segment.transition !== 'none') {
    details.push(`→ ${segment.transition}`);
  }
  
  return details.length > 0 ? ` - ${details.join(', ')}` : '';
}
