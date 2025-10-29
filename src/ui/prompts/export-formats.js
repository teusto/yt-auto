import readline from 'readline';
import { logger } from '../../utils/logger.js';

export function promptExportFormats(CONFIG) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    logger.info('📺 Export Multiple Formats?\n');
    logger.info('  1. No - Just ' + CONFIG.aspectRatio);
    logger.info('  2. Yes - Add TikTok (9:16)');
    logger.info('  3. Yes - All platforms (16:9 + 9:16 + 1:1)\n');

    rl.question('Choose (1-3, Enter = 1): ', (answer) => {
      const choice = answer.trim() || '1';

      if (choice === '2') {
        if (CONFIG.aspectRatio === '9:16') {
          CONFIG.exportFormats.formats = ['9:16', '16:9'];
          logger.success('TikTok + YouTube\n');
        } else {
          CONFIG.exportFormats.formats = [CONFIG.aspectRatio, '9:16'];
          logger.success(CONFIG.aspectRatio + ' + TikTok\n');
        }
      } else if (choice === '3') {
        CONFIG.exportFormats.formats = ['16:9', '9:16', '1:1'];
        logger.success('All 3 formats\n');
      } else {
        CONFIG.exportFormats.formats = [CONFIG.aspectRatio];
        logger.success('Single format: ' + CONFIG.aspectRatio + '\n');
      }

      rl.close();
      resolve();
    });
  });
}
