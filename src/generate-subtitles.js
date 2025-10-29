import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFolder = path.join(__dirname, '../input');

/**
 * Generate subtitles using ffmpeg's built-in speech recognition
 * or prepare for external tools like Whisper
 */
async function generateSubtitles() {
  console.log('🎤 Subtitle Generator\n');
  
  // Find audio file
  const files = fs.readdirSync(inputFolder);
  const audioFile = files.find(f => 
    ['.mp3', '.wav', '.m4a', '.aac'].includes(path.extname(f).toLowerCase())
  );

  if (!audioFile) {
    console.error('❌ No audio file found in input folder');
    console.log('\nPlease add an audio file first, then run this script again.\n');
    return;
  }

  const audioPath = path.join(inputFolder, audioFile);
  console.log(`✅ Found audio: ${audioFile}\n`);
  
  console.log('📝 Subtitle Generation Options:\n');
  console.log('This script helps you generate subtitles for your voiceover.\n');
  console.log('Option 1: Use Whisper AI (Recommended)');
  console.log('─────────────────────────────────────');
  console.log('1. Install Whisper:');
  console.log('   pip install openai-whisper\n');
  console.log('2. Generate subtitles:');
  console.log(`   whisper "${audioPath}" --output_format srt --output_dir "${inputFolder}" --model base\n`);
  console.log('3. Rename the generated .srt file to "subtitles.srt"\n');
  
  console.log('Option 2: Use Online Tools');
  console.log('─────────────────────────────');
  console.log('- Upload your audio to:');
  console.log('  • https://www.happyscribe.com/');
  console.log('  • https://www.descript.com/');
  console.log('  • https://subtitle-horse.com/');
  console.log('- Download the SRT file');
  console.log('- Save it as "subtitles.srt" in the input folder\n');
  
  console.log('Option 3: Create Manually');
  console.log('────────────────────────');
  console.log('- Copy example_subtitles.srt and rename to subtitles.srt');
  console.log('- Edit the timing and text to match your voiceover\n');
  
  console.log('Option 4: Extract audio to WAV (for better compatibility)');
  console.log('───────────────────────────────────────────────────────────');
  const wavPath = path.join(inputFolder, 'voiceover.wav');
  console.log(`Converting audio to WAV format for better compatibility...\n`);
  
  const ffmpeg = spawn('ffmpeg', [
    '-i', audioPath,
    '-acodec', 'pcm_s16le',
    '-ar', '16000',
    '-ac', '1',
    '-y',
    wavPath
  ]);

  ffmpeg.stderr.on('data', () => {
    // Suppress ffmpeg output
  });

  ffmpeg.on('close', code => {
    if (code === 0) {
      console.log(`✅ Audio converted to WAV: ${path.basename(wavPath)}`);
      console.log(`   You can use this file with Whisper for better results.\n`);
      console.log(`Command: whisper "${wavPath}" --output_format srt --output_dir "${inputFolder}" --model base\n`);
    } else {
      console.log('⚠️  Could not convert audio. Use the original file instead.\n');
    }
  });
}

generateSubtitles();
