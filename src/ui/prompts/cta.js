import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { CTA_DEFAULTS, CTA_POSITIONS } from '../../config/constants.js';
import { logger } from '../../utils/logger.js';

export function detectCTA(CONFIG) {
  if (!fs.existsSync(CONFIG.ctaFolder)) {
    return [];
  }

  const files = fs.readdirSync(CONFIG.ctaFolder);
  const ctaFormats = ['.png', '.jpg', '.jpeg', '.mp4', '.mov', '.webm', '.gif'];

  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ctaFormats.includes(ext);
  }).map(file => {
    const ext = path.extname(file).toLowerCase();
    const isVideo = ['.mp4', '.mov', '.webm', '.gif'].includes(ext);
    return {
      filename: file,
      path: path.join(CONFIG.ctaFolder, file),
      isVideo
    };
  });
}

export function promptCTA(CONFIG) {
  return new Promise((resolve) => {
    const ctas = detectCTA(CONFIG);

    if (ctas.length === 0) {
      resolve();
      return;
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    logger.info('📢 Call-to-Action:\n');
    logger.info(`  ✅ Found: ${ctas[0].filename} ${ctas[0].isVideo ? '(animated)' : '(image)'}`);

    rl.question('\n  Add CTA? (y/n, Enter = yes): ', (answer) => {
      const addCTA = !answer.trim() || answer.trim().toLowerCase() === 'y';

      if (!addCTA) {
        CONFIG.cta.enabled = false;
        logger.success('No CTA\n');
        rl.close();
        resolve();
        return;
      }

      CONFIG.cta.enabled = true;
      CONFIG.cta.imagePath = ctas[0].path;
      CONFIG.cta.isVideo = ctas[0].isVideo;
      CONFIG.cta.duration = CTA_DEFAULTS.DURATION;

      logger.info('\n  📍 CTA Position:');
      logger.info('  1. Left-Top     2. Middle-Top     3. Right-Top');
      logger.info('  4. Left-Bottom  5. Middle-Bottom  6. Right-Bottom');

      rl.question('\n  Choose position (1-6, Enter = 6): ', (posAnswer) => {
        const positionMap = {
          '1': CTA_POSITIONS.LEFT_TOP,
          '2': CTA_POSITIONS.MIDDLE_TOP,
          '3': CTA_POSITIONS.RIGHT_TOP,
          '4': CTA_POSITIONS.LEFT_BOTTOM,
          '5': CTA_POSITIONS.MIDDLE_BOTTOM,
          '6': CTA_POSITIONS.RIGHT_BOTTOM
        };

        const posChoice = posAnswer.trim() || '6';
        CONFIG.cta.position = positionMap[posChoice] || CTA_DEFAULTS.POSITION;

        rl.question('\n  ⏱️  When to show? (1=Start at 5s, 2=End of video, Enter=1): ', (timeAnswer) => {
          const timeChoice = timeAnswer.trim() || '1';

          if (timeChoice === '2') {
            CONFIG.cta.startTime = -CTA_DEFAULTS.DURATION; // last N seconds
            logger.success(`CTA: ${CONFIG.cta.position}, last ${CTA_DEFAULTS.DURATION}s ${ctas[0].isVideo ? '🎬' : '🖼️'}\n`);
          } else {
            CONFIG.cta.startTime = CTA_DEFAULTS.START_TIME;
            logger.success(`CTA: ${CONFIG.cta.position}, at ${CTA_DEFAULTS.START_TIME}-${CTA_DEFAULTS.START_TIME + CTA_DEFAULTS.DURATION}s ${ctas[0].isVideo ? '🎬' : '🖼️'}\n`);
          }

          rl.close();
          resolve();
        });
      });
    });
  });
}
