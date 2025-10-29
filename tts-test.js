#!/usr/bin/env node

/**
 * TTS Test Command
 * Test Azure voice with sample text
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { generateSpeech } from './src/tts.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  // Check credentials
  if (!process.env.AZURE_TTS_API_KEY || !process.env.AZURE_TTS_REGION) {
    console.log(`\n❌ Azure TTS not configured\n`);
    console.log(`Run setup first: npm run tts:setup\n`);
    rl.close();
    return;
  }
  
  const args = process.argv.slice(2);
  
  // Parse args
  let testText;
  let voiceName = process.env.AZURE_TTS_DEFAULT_VOICE || 'pt-BR-FranciscaNeural';
  
  // Check for --voice flag
  const voiceIndex = args.indexOf('--voice');
  if (voiceIndex !== -1 && args[voiceIndex + 1]) {
    voiceName = args[voiceIndex + 1];
  }
  
  // Get test text (everything that's not a flag)
  const textArgs = args.filter(arg => !arg.startsWith('--') && arg !== voiceName);
  testText = textArgs.join(' ');
  
  // Interactive mode if no text provided
  if (!testText) {
    console.log(`\n🎙️  Test Azure Voice\n`);
    console.log(`Current default voice: ${voiceName}\n`);
    
    const changeVoice = await question('Use different voice? (yes/no) [no]: ');
    if (changeVoice.toLowerCase() === 'yes' || changeVoice.toLowerCase() === 'y') {
      voiceName = await question('Enter voice name: ');
    }
    
    console.log(`\nEnter test text (or press Enter for default):\n`);
    testText = await question('> ') || 'Olá, esta é uma oração de teste. Que Deus abençoe este dia com paz e amor.';
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`🗣️  Voice: ${voiceName}`);
  console.log(`📝 Text: "${testText}"\n`);
  console.log(`⏳ Generating audio...\n`);
  
  // Create temp file
  const tempDir = path.join(__dirname, '.temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const tempFile = path.join(tempDir, `test-${Date.now()}.mp3`);
  
  try {
    const result = await generateSpeech(
      { text: testText },
      tempFile,
      {
        voice: voiceName,
        language: voiceName.split('-').slice(0, 2).join('-'), // Extract language code
        speaking_rate: '1.0',
        pitch: '0'
      }
    );
    
    console.log(`✅ Audio generated successfully!\n`);
    console.log(`📁 Saved to: ${tempFile}`);
    console.log(`⏱️  Duration: ~${Math.round(result.audioLength)}s\n`);
    console.log(`You can play it with:`);
    console.log(`   ffplay ${tempFile}`);
    console.log(`   or`);
    console.log(`   vlc ${tempFile}\n`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
  } catch (error) {
    console.log(`❌ Failed to generate audio: ${error.message}\n`);
    
    if (error.message.includes('voice')) {
      console.log(`💡 Tip: List available voices with: npm run tts:voices\n`);
    }
  }
  
  rl.close();
}

main().catch(error => {
  console.error(`\n❌ Error: ${error.message}\n`);
  rl.close();
  process.exit(1);
});
