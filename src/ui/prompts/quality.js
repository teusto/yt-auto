import readline from 'readline';
import { logger } from '../../utils/logger.js';

export function promptQualityMode(CONFIG) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    logger.info('⚡ Video Quality:\n');
    logger.info('  1. Draft (fast, lower quality - for testing)');
    logger.info('  2. High Quality (slower, best quality - for publishing)\n');

    rl.question('Choose quality (1-2, Enter = 2): ', (answer) => {
      rl.close();

      const choice = answer.trim() || '2';

      if (choice === '1') {
        CONFIG.qualityMode = 'draft';
        logger.success('Draft mode (3x faster)\n');
      } else {
        CONFIG.qualityMode = 'high';
        logger.success('High quality mode\n');
      }

      resolve();
    });
  });
}
