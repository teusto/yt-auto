import readline from 'readline';
import { SUBTITLE_DEFAULTS } from '../../config/constants.js';
import { logger } from '../../utils/logger.js';

export function promptFontSelection(CONFIG, fonts) {
  return new Promise((resolve) => {
    if (!fonts || fonts.length === 0) {
      logger.info('ℹ️  No custom fonts found in fonts/ folder');
      logger.info(`   Using default font: ${SUBTITLE_DEFAULTS.FONT_FAMILY}\n`);
      CONFIG.subtitleStyle.fontFamily = SUBTITLE_DEFAULTS.FONT_FAMILY;
      CONFIG.subtitleStyle.fontPath = null;
      resolve();
      return;
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    logger.info('🔤 Select Font:\n');
    fonts.forEach((font, index) => {
      logger.info(`  ${index + 1}. ${font.displayName}`);
    });
    logger.info(`  ${fonts.length + 1}. Default (${SUBTITLE_DEFAULTS.FONT_FAMILY} - system font)\n`);

    rl.question(`Enter your choice (1-${fonts.length + 1}): `, (answer) => {
      const choice = parseInt(answer.trim());

      if (choice >= 1 && choice <= fonts.length) {
        const selectedFont = fonts[choice - 1];
        CONFIG.subtitleStyle.fontFamily = selectedFont.displayName;
        CONFIG.subtitleStyle.fontPath = selectedFont.path;
        logger.success(`Font selected: ${selectedFont.displayName}\n`);
      } else if (choice === fonts.length + 1) {
        CONFIG.subtitleStyle.fontFamily = SUBTITLE_DEFAULTS.FONT_FAMILY;
        CONFIG.subtitleStyle.fontPath = null;
        logger.success(`Default font selected: ${SUBTITLE_DEFAULTS.FONT_FAMILY}\n`);
      } else {
        logger.warn('Invalid choice, using first font\n');
        CONFIG.subtitleStyle.fontFamily = fonts[0].displayName;
        CONFIG.subtitleStyle.fontPath = fonts[0].path;
      }

      rl.close();
      resolve();
    });
  });
}
