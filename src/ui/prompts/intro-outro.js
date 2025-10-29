import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { logger } from '../../utils/logger.js';

export function detectIntroOutro(CONFIG) {
  if (!fs.existsSync(CONFIG.introsFolder)) {
    return { intros: [], outros: [] };
  }

  const files = fs.readdirSync(CONFIG.introsFolder);
  const videoFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return CONFIG.videoFormats.includes(ext);
  });

  const intros = videoFiles.filter(file => file.toLowerCase().includes('intro')).map(file => ({
    filename: file,
    path: path.join(CONFIG.introsFolder, file)
  }));

  const outros = videoFiles.filter(file => file.toLowerCase().includes('outro')).map(file => ({
    filename: file,
    path: path.join(CONFIG.introsFolder, file)
  }));

  return { intros, outros };
}

export function promptIntroOutro(CONFIG) {
  return new Promise((resolve) => {
    const { intros, outros } = detectIntroOutro(CONFIG);

    if (intros.length === 0 && outros.length === 0) {
      resolve();
      return;
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    logger.info('🎬 Intro/Outro:\n');
    if (intros.length > 0) {
      logger.info('  ✅ Found intro(s):');
      intros.forEach(intro => logger.info(`     - ${intro.filename}`));
    }
    if (outros.length > 0) {
      logger.info('  ✅ Found outro(s):');
      outros.forEach(outro => logger.info(`     - ${outro.filename}`));
    }

    logger.info('\n  Add to video?');
    logger.info('  1. Yes (intro + outro)');
    logger.info('  2. Intro only');
    logger.info('  3. Outro only');
    logger.info('  4. No\n');

    rl.question('Enter your choice (1-4, or press Enter for Yes): ', (answer) => {
      const choice = answer.trim() || '1';

      switch (choice) {
        case '1':
          CONFIG.introOutro.enabled = true;
          CONFIG.introOutro.introPath = intros.length > 0 ? intros[0].path : null;
          CONFIG.introOutro.outroPath = outros.length > 0 ? outros[0].path : null;
          CONFIG.introOutro.mode = 'both';
          logger.success('Intro and outro will be added\n');
          break;
        case '2':
          CONFIG.introOutro.enabled = true;
          CONFIG.introOutro.introPath = intros.length > 0 ? intros[0].path : null;
          CONFIG.introOutro.outroPath = null;
          CONFIG.introOutro.mode = 'intro';
          logger.success('Intro only will be added\n');
          break;
        case '3':
          CONFIG.introOutro.enabled = true;
          CONFIG.introOutro.introPath = null;
          CONFIG.introOutro.outroPath = outros.length > 0 ? outros[0].path : null;
          CONFIG.introOutro.mode = 'outro';
          logger.success('Outro only will be added\n');
          break;
        case '4':
          CONFIG.introOutro.enabled = false;
          CONFIG.introOutro.mode = 'none';
          logger.success('No intro/outro\n');
          break;
        default:
          CONFIG.introOutro.enabled = true;
          CONFIG.introOutro.introPath = intros.length > 0 ? intros[0].path : null;
          CONFIG.introOutro.outroPath = outros.length > 0 ? outros[0].path : null;
          CONFIG.introOutro.mode = 'both';
          logger.success('Intro and outro will be added (default)\n');
      }

      rl.close();
      resolve();
    });
  });
}
