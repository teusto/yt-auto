import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { logger } from '../../utils/logger.js';

export function promptLanguageLearningMode(CONFIG) {
  return new Promise((resolve) => {
    // Check if dual subtitle files exist
    const targetPath = path.join(CONFIG.inputFolder, CONFIG.languageLearning.targetFile);
    const nativePath = path.join(CONFIG.inputFolder, CONFIG.languageLearning.nativeFile);
    const hasDualSubtitles = fs.existsSync(targetPath) && fs.existsSync(nativePath);

    if (!hasDualSubtitles) {
      // No dual subtitles available, skip
      resolve();
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    logger.info('🌍 Language Learning Mode:\n');
    logger.info('  Dual subtitle files detected!\n');
    logger.info('  1. Language Learning Mode (Show both languages)');
    logger.info('  2. Standard Mode (Show target language only)\n');

    rl.question('Enter your choice (1-2, or press Enter for Language Learning): ', (answer) => {
      const choice = answer.trim() || '1';

      switch (choice) {
        case '1':
          CONFIG.languageLearning.enabled = true;
          CONFIG.languageLearning.dualSubtitles = true;
          logger.success('Language Learning Mode enabled');
          logger.info(`   Target: ${CONFIG.languageLearning.targetFile}`);
          logger.info(`   Native: ${CONFIG.languageLearning.nativeFile}\n`);
          break;

        case '2':
          CONFIG.languageLearning.enabled = false;
          CONFIG.languageLearning.dualSubtitles = false;
          logger.success('Standard Mode - Target language only\n');
          break;

        default:
          CONFIG.languageLearning.enabled = true;
          CONFIG.languageLearning.dualSubtitles = true;
          logger.success('Language Learning Mode enabled (default)\n');
      }

      rl.close();
      resolve();
    });
  });
}
