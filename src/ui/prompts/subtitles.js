import readline from 'readline';
import { SUBTITLE_DEFAULTS, SUBTITLE_ALIGNMENT, SUBTITLE_STYLES } from '../../config/constants.js';
import { logger } from '../../utils/logger.js';

export function promptSubtitleStyle(CONFIG) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    logger.info('📝 Subtitle Style:\n');
    logger.info('  1. Classic (white, bottom)');
    logger.info('  2. Bold (large, white)');
    logger.info('  3. Yellow (YouTube style)');
    logger.info('  4. Minimal (small, clean)');
    logger.info('  5. Cinematic (translucent background)\n');

    rl.question('Choose style (1-5, Enter = 1): ', (answer) => {
      const choice = answer.trim() || '1';

      switch (choice) {
        case '2':
          CONFIG.subtitleStyle.fontSize = 56;
          CONFIG.subtitleStyle.outlineWidth = 3;
          CONFIG.subtitleStyle.bold = true;
          CONFIG.subtitleStyle.fontColor = 'white';
          logger.success('Bold\n');
          break;

        case '3':
          CONFIG.subtitleStyle.fontColor = 'yellow';
          CONFIG.subtitleStyle.fontSize = 52;
          logger.success('Yellow\n');
          break;

        case '4':
          CONFIG.subtitleStyle.fontSize = 40;
          CONFIG.subtitleStyle.outlineWidth = 1;
          logger.success('Minimal\n');
          break;

        case '5':
          Object.assign(CONFIG.subtitleStyle, SUBTITLE_STYLES.CINEMATIC);
          logger.success('Cinematic\n');
          break;

        default:
          // Reset to classic defaults explicitly to avoid stale values
          CONFIG.subtitleStyle.fontFamily = SUBTITLE_DEFAULTS.FONT_FAMILY;
          CONFIG.subtitleStyle.fontSize = SUBTITLE_DEFAULTS.FONT_SIZE;
          CONFIG.subtitleStyle.fontColor = SUBTITLE_DEFAULTS.FONT_COLOR;
          CONFIG.subtitleStyle.outlineColor = SUBTITLE_DEFAULTS.OUTLINE_COLOR;
          CONFIG.subtitleStyle.outlineWidth = SUBTITLE_DEFAULTS.OUTLINE_WIDTH;
          CONFIG.subtitleStyle.backgroundColor = SUBTITLE_DEFAULTS.BACKGROUND_COLOR;
          CONFIG.subtitleStyle.bold = false;
          CONFIG.subtitleStyle.italic = false;
          CONFIG.subtitleStyle.lineSpacing = 0;
          logger.success('Classic\n');
      }

      logger.info('  📍 Subtitle Position:\n');
      logger.info('  1. Bottom (default)');
      logger.info('  2. Center / Middle');
      logger.info('  3. Top\n');

      rl.question('Choose position (1-3, Enter = 1): ', (posAnswer) => {
        const posChoice = posAnswer.trim() || '1';

        switch (posChoice) {
          case '2':
            CONFIG.subtitleStyle.position = 'center';
            CONFIG.subtitleStyle.alignment = SUBTITLE_ALIGNMENT.MIDDLE_CENTER;
            CONFIG.subtitleStyle.marginV = 0;
            logger.success('Center position\n');
            break;
          case '3':
            CONFIG.subtitleStyle.position = 'top';
            CONFIG.subtitleStyle.alignment = SUBTITLE_ALIGNMENT.TOP_CENTER;
            CONFIG.subtitleStyle.marginV = 50;
            logger.success('Top position\n');
            break;
          default:
            CONFIG.subtitleStyle.position = 'bottom';
            CONFIG.subtitleStyle.alignment = SUBTITLE_ALIGNMENT.CENTER;
            CONFIG.subtitleStyle.marginV = SUBTITLE_DEFAULTS.MARGIN_V;
            logger.success('Bottom position\n');
        }

        // After position, ask about animation
        logger.info('  🎤 Subtitle Animation:\n');
        logger.info('  1. None (standard)');
        logger.info('  2. Karaoke (word-by-word highlight)\n');

        rl.question('Choose animation (1-2, Enter = 1): ', (animAnswer) => {
          const animChoice = animAnswer.trim() || '1';
          if (animChoice === '2') {
            CONFIG.subtitleStyle.animationStyle = 'karaoke';
            logger.success('Karaoke animation enabled\n');
          } else {
            CONFIG.subtitleStyle.animationStyle = 'none';
            logger.success('No animation\n');
          }

          rl.close();
          resolve();
        });
      });
    });
  });
}
