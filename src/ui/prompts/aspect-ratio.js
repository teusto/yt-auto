import readline from 'readline';
import { logger } from '../../utils/logger.js';

export function promptAspectRatio(CONFIG) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    logger.info('📐 Video Format:\n');
    logger.info('  1. YouTube (16:9 landscape)');
    logger.info('  2. TikTok/Shorts (9:16 vertical)');
    logger.info('  3. Original size (no resize)\n');

    rl.question('Choose format (1-3, Enter = 1): ', (answer) => {
      rl.close();
      const choice = answer.trim() || '1';

      if (choice === '2') {
        CONFIG.aspectRatio = '9:16';
        CONFIG.videoWidth = 1080;
        CONFIG.videoHeight = 1920;
        CONFIG.useOriginalSize = false;
        logger.success('TikTok/Shorts (9:16)\n');
      } else if (choice === '3') {
        CONFIG.useOriginalSize = true;
        logger.success('Original size\n');
      } else {
        CONFIG.aspectRatio = '16:9';
        CONFIG.videoWidth = 1920;
        CONFIG.videoHeight = 1080;
        CONFIG.useOriginalSize = false;
        logger.success('YouTube (16:9)\n');
      }

      resolve();
    });
  });
}
