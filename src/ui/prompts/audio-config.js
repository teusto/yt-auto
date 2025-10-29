import readline from 'readline';
import { logger } from '../../utils/logger.js';

export function promptAudioConfig(CONFIG, hasBackgroundMusic) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    logger.info('🎵 Audio Configuration:\n');
    logger.info('  Choose a preset or customize:\n');
    logger.info('  1. Default (Voice 100%, Music 35%)');
    logger.info('  2. Music Louder (Voice 100%, Music 50%)');
    logger.info('  3. Music Subtle (Voice 100%, Music 20%)');
    logger.info('  4. Voice Boost (Voice 120%, Music 30%)');
    logger.info('  5. Custom (Set your own levels)\n');

    rl.question('Enter your choice (1-5): ', (answer) => {
      const choice = answer.trim();

      switch (choice) {
        case '1':
          CONFIG.audio.voiceVolume = 1.0;
          CONFIG.audio.musicVolume = 0.35;
          logger.success('Default: Voice 100%, Music 35%\n');
          rl.close();
          resolve();
          break;

        case '2':
          CONFIG.audio.voiceVolume = 1.0;
          CONFIG.audio.musicVolume = 0.5;
          logger.success('Music Louder: Voice 100%, Music 50%\n');
          rl.close();
          resolve();
          break;

        case '3':
          CONFIG.audio.voiceVolume = 1.0;
          CONFIG.audio.musicVolume = 0.2;
          logger.success('Music Subtle: Voice 100%, Music 20%\n');
          rl.close();
          resolve();
          break;

        case '4':
          CONFIG.audio.voiceVolume = 1.2;
          CONFIG.audio.musicVolume = 0.3;
          logger.success('Voice Boost: Voice 120%, Music 30%\n');
          rl.close();
          resolve();
          break;

        case '5':
          // Custom configuration
          rl.question('Voice volume (0.5-2.0, default 1.0): ', (voiceVol) => {
            CONFIG.audio.voiceVolume = parseFloat(voiceVol) || 1.0;
            CONFIG.audio.voiceVolume = Math.max(0.5, Math.min(2.0, CONFIG.audio.voiceVolume));

            if (hasBackgroundMusic) {
              rl.question('Music volume (0.1-1.0, default 0.35): ', (musicVol) => {
                CONFIG.audio.musicVolume = parseFloat(musicVol) || 0.35;
                CONFIG.audio.musicVolume = Math.max(0.1, Math.min(1.0, CONFIG.audio.musicVolume));

                rl.question('Music fade in duration (0-5 seconds, default 2): ', (fadeIn) => {
                  CONFIG.audio.musicFadeIn = parseFloat(fadeIn) || 2;

                  rl.question('Music fade out duration (0-5 seconds, default 3): ', (fadeOut) => {
                    CONFIG.audio.musicFadeOut = parseFloat(fadeOut) || 3;
                    rl.close();
                    resolve();
                  });
                });
              });
            } else {
              rl.close();
              resolve();
            }
          });
          break;

        default:
          logger.warn('Invalid choice, using Default\n');
          CONFIG.audio.voiceVolume = 1.0;
          CONFIG.audio.musicVolume = 0.35;
          rl.close();
          resolve();
      }
    });
  });
}
