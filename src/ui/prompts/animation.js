import readline from 'readline';
import { logger } from '../../utils/logger.js';

export function promptAnimationEffect(CONFIG) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    logger.info('🎨 Image Animation:\n');
    logger.info('  1. None (static)');
    logger.info('  2. Zoom in (Ken Burns)');
    logger.info('  3. Zoom out\n');

    rl.question('Choose effect (1-3, Enter = 2): ', (answer) => {
      rl.close();

      const choice = answer.trim() || '2';

      if (choice === '1') {
        CONFIG.animationEffect = 'static';
        logger.success('Static\n');
      } else if (choice === '3') {
        CONFIG.animationEffect = 'zoom-out';
        logger.success('Zoom out\n');
      } else {
        CONFIG.animationEffect = 'zoom-in';
        logger.success('Zoom in (Ken Burns)\n');
      }

      resolve();
    });
  });
}
