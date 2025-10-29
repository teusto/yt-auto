#!/usr/bin/env node

/**
 * TTS Voices Command
 * List available Azure voices for a language
 */

import readline from 'readline';
import { listAvailableVoices } from './src/tts.js';
import { config } from 'dotenv';

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
  let languageCode = args.find(arg => !arg.startsWith('--'));
  
  if (!languageCode) {
    console.log(`\n🗣️  List Available Voices\n`);
    console.log(`Common language codes:`);
    console.log(`  pt-BR - Portuguese (Brazilian)`);
    console.log(`  en-US - English (US)`);
    console.log(`  es-ES - Spanish (Spain)`);
    console.log(`  es-MX - Spanish (Mexico)`);
    console.log(`  fr-FR - French`);
    console.log(`  de-DE - German`);
    console.log(`  it-IT - Italian\n`);
    
    languageCode = await question('Enter language code [pt-BR]: ') || 'pt-BR';
  }
  
  console.log(`\n⏳ Fetching voices for ${languageCode}...\n`);
  
  try {
    const voices = await listAvailableVoices(languageCode);
    
    if (voices.length === 0) {
      console.log(`❌ No voices found for language: ${languageCode}\n`);
      rl.close();
      return;
    }
    
    console.log(`✅ Found ${voices.length} voice(s):\n`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    // Group by gender
    const female = voices.filter(v => v.gender === 'Female');
    const male = voices.filter(v => v.gender === 'Male');
    
    if (female.length > 0) {
      console.log(`👩 Female Voices (${female.length}):\n`);
      female.forEach(voice => {
        console.log(`   ${voice.shortName}`);
        console.log(`   Name: ${voice.localName}`);
        console.log(`   Type: ${voice.voiceType}\n`);
      });
    }
    
    if (male.length > 0) {
      console.log(`👨 Male Voices (${male.length}):\n`);
      male.forEach(voice => {
        console.log(`   ${voice.shortName}`);
        console.log(`   Name: ${voice.localName}`);
        console.log(`   Type: ${voice.voiceType}\n`);
      });
    }
    
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    console.log(`To use a voice, add it to scripts.csv in the 'voice' column\n`);
    console.log(`Or set as default in .env: AZURE_TTS_DEFAULT_VOICE=voice-name\n`);
    
  } catch (error) {
    console.log(`❌ Failed to fetch voices: ${error.message}\n`);
  }
  
  rl.close();
}

main().catch(error => {
  console.error(`\n❌ Error: ${error.message}\n`);
  rl.close();
  process.exit(1);
});
