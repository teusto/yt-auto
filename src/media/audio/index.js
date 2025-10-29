import { spawn } from 'child_process';
import { Spinner } from '../../core/spinner.js';
import { AUDIO_DEFAULTS } from '../../config/constants.js';

/**
 * Get audio duration using ffprobe
 */
export function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      audioPath
    ]);

    let output = '';
    ffprobe.stdout.on('data', data => {
      output += data.toString();
    });

    ffprobe.on('close', code => {
      if (code !== 0) {
        reject(new Error('Failed to get audio duration'));
      } else {
        resolve(parseFloat(output.trim()));
      }
    });
  });
}

/**
 * Delay voiceover for image intro (when no background music)
 */
export async function delayVoiceover(voicePath, duration, outputPath, introDelay) {
  return new Promise((resolve, reject) => {
    const totalDuration = duration + introDelay;
    const delayMs = Math.round(introDelay * 1000);
    
    const args = [
      '-i', voicePath,
      '-af', `adelay=${delayMs}|${delayMs}`,
      '-t', totalDuration.toString(),
      '-y',
      outputPath
    ];
    
    const spinner = new Spinner('Adding silence for image intro');
    spinner.start();
    
    const ffmpeg = spawn('ffmpeg', args);
    
    let errorOutput = '';
    ffmpeg.stderr.on('data', data => {
      errorOutput += data.toString();
    });
    
    ffmpeg.on('close', code => {
      spinner.stop();
      if (code !== 0) {
        console.log('❌ Failed to delay voiceover');
        reject(new Error(`Failed to delay voiceover: ${errorOutput}`));
      } else {
        console.log('✅ Voiceover delayed for image intro');
        resolve(outputPath);
      }
    });
  });
}

/**
 * Mix voiceover with background music
 * @param {number} introDelay - Delay in seconds for voiceover (when image intro is present)
 * @param {Object} audioConfig - { voiceVolume, musicVolume, musicFadeIn, musicFadeOut }
 */
export async function mixAudioWithBackgroundMusic(
  voicePath,
  musicPath,
  duration,
  outputPath,
  introDelay = 0,
  audioConfig = {}
) {
  return new Promise((resolve, reject) => {
    const voiceVol = audioConfig.voiceVolume ?? AUDIO_DEFAULTS.VOICE_VOLUME;
    const musicVol = audioConfig.musicVolume ?? AUDIO_DEFAULTS.MUSIC_VOLUME;
    const musicFadeIn = audioConfig.musicFadeIn ?? AUDIO_DEFAULTS.MUSIC_FADE_IN;
    const musicFadeOut = audioConfig.musicFadeOut ?? AUDIO_DEFAULTS.MUSIC_FADE_OUT;
    const totalDuration = duration + introDelay; // Total audio duration including intro
    const fadeOutStart = Math.max(0, totalDuration - musicFadeOut);
    
    let filterComplex;
    
    if (introDelay > 0) {
      // Delay voiceover by intro duration (in milliseconds), music starts at 00:00
      const delayMs = Math.round(introDelay * 1000);
      filterComplex = `[0:a]adelay=${delayMs}|${delayMs},volume=${voiceVol}[voice];
       [1:a]volume=${musicVol},aloop=loop=-1:size=2e+09,atrim=0:${totalDuration},afade=t=in:st=0:d=${musicFadeIn},afade=t=out:st=${fadeOutStart}:d=${musicFadeOut}[music];
       [voice][music]amix=inputs=2:duration=longest:dropout_transition=2[mixed]`;
      console.log(`   Delaying voiceover by ${introDelay}s for intro`);
    } else {
      // No intro delay - original behavior
      filterComplex = `[0:a]volume=${voiceVol}[voice];
       [1:a]volume=${musicVol},aloop=loop=-1:size=2e+09,atrim=0:${duration},afade=t=in:st=0:d=${musicFadeIn},afade=t=out:st=${fadeOutStart}:d=${musicFadeOut}[music];
       [voice][music]amix=inputs=2:duration=first:dropout_transition=2[mixed]`;
    }
    
    const args = [
      '-i', voicePath,
      '-i', musicPath,
      '-filter_complex',
      filterComplex,
      '-map', '[mixed]',
      '-t', totalDuration.toString(),  // Set output duration including intro
      '-y',
      outputPath
    ];

    const spinner = new Spinner('Mixing voiceover with background music');
    spinner.start();

    const ffmpeg = spawn('ffmpeg', args);

    let errorOutput = '';
    ffmpeg.stderr.on('data', data => {
      errorOutput += data.toString();
    });

    ffmpeg.on('close', code => {
      spinner.stop();
      if (code !== 0) {
        console.log('❌ Failed to mix audio');
        reject(new Error(`Audio mixing failed: ${errorOutput}`));
      } else {
        console.log('✅ Background music mixed successfully');
        resolve(outputPath);
      }
    });
  });
}
