#!/usr/bin/env node

/**
 * TTS Setup Command
 * Configure Azure TTS credentials
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import sdk from 'microsoft-cognitiveservices-speech-sdk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testVoice(apiKey, region, voice, testText) {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(apiKey, region);
    speechConfig.speechSynthesisVoiceName = voice;
    
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    
    synthesizer.speakTextAsync(
      testText,
      result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          synthesizer.close();
          resolve(true);
        } else {
          synthesizer.close();
          reject(new Error(`Test failed: ${result.errorDetails}`));
        }
      },
      error => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}

async function main() {
  console.log(`\n🎙️  Azure TTS Setup\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  console.log(`Step 1: Get Azure Speech Service Credentials\n`);
  console.log(`1. Visit: https://portal.azure.com`);
  console.log(`2. Create a "Speech Service" resource`);
  console.log(`3. Copy the API key and region\n`);
  
  // Get API key
  const apiKey = await question('Enter Azure TTS API Key: ');
  
  if (!apiKey || apiKey.trim() === '') {
    console.log(`\n❌ API key is required\n`);
    rl.close();
    return;
  }
  
  // Get region
  const region = await question('Enter Azure Region (e.g., brazilsouth, eastus): ');
  
  if (!region || region.trim() === '') {
    console.log(`\n❌ Region is required\n`);
    rl.close();
    return;
  }
  
  console.log(`\n⏳ Testing credentials...\n`);
  
  // Test credentials
  try {
    await testVoice(apiKey.trim(), region.trim(), 'pt-BR-FranciscaNeural', 'Olá, teste de configuração.');
    console.log(`✅ Credentials valid!\n`);
  } catch (error) {
    console.log(`❌ Credentials test failed: ${error.message}\n`);
    console.log(`Please check your API key and region.\n`);
    rl.close();
    return;
  }
  
  // Select default voice
  console.log(`Step 2: Select Default Voice\n`);
  console.log(`Common Portuguese (Brazilian) voices:\n`);
  console.log(`[1] pt-BR-FranciscaNeural (Female, warm, clear)`);
  console.log(`[2] pt-BR-AntonioNeural (Male, professional)`);
  console.log(`[3] pt-BR-LeilaNeural (Female, mature)`);
  console.log(`[4] pt-BR-DonatoNeural (Male, authoritative)`);
  console.log(`[5] Custom voice name\n`);
  
  const voiceChoice = await question('Choose default voice [1]: ') || '1';
  
  const voices = {
    '1': 'pt-BR-FranciscaNeural',
    '2': 'pt-BR-AntonioNeural',
    '3': 'pt-BR-LeilaNeural',
    '4': 'pt-BR-DonatoNeural'
  };
  
  let defaultVoice;
  if (voiceChoice === '5') {
    defaultVoice = await question('Enter voice name: ');
  } else {
    defaultVoice = voices[voiceChoice] || 'pt-BR-FranciscaNeural';
  }
  
  // Save to .env
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }
  
  // Update or add Azure TTS config
  const newConfig = `
# Azure TTS Configuration
AZURE_TTS_API_KEY=${apiKey.trim()}
AZURE_TTS_REGION=${region.trim()}
AZURE_TTS_DEFAULT_VOICE=${defaultVoice}
AZURE_TTS_DEFAULT_LANGUAGE=pt-BR
`;
  
  // Remove existing Azure TTS config if present
  envContent = envContent.replace(/# Azure TTS Configuration[\s\S]*?(?=\n#|\n\n|$)/g, '');
  
  // Add new config
  envContent += newConfig;
  
  fs.writeFileSync(envPath, envContent.trim() + '\n');
  
  console.log(`\n✅ Configuration saved to .env\n`);
  console.log(`Default voice: ${defaultVoice}\n`);
  
  // Test voice
  console.log(`Step 3: Test Voice\n`);
  
  const testText = 'Olá, esta é uma oração de teste. Que Deus abençoe este dia.';
  console.log(`Testing with: "${testText}"\n`);
  console.log(`⏳ Generating audio...\n`);
  
  try {
    await testVoice(apiKey.trim(), region.trim(), defaultVoice, testText);
    console.log(`✅ Voice test successful!\n`);
  } catch (error) {
    console.log(`⚠️  Voice test failed: ${error.message}`);
    console.log(`You can still use the service, but check the voice name.\n`);
  }
  
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`✅ Setup complete!\n`);
  console.log(`Next steps:`);
  console.log(`1. Create scripts.csv: npm run tts:init [channel-name]`);
  console.log(`2. Generate voices: npm run tts:generate\n`);
  
  rl.close();
}

main().catch(error => {
  console.error(`\n❌ Error: ${error.message}\n`);
  rl.close();
  process.exit(1);
});
