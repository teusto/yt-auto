/**
 * Azure TTS (Text-to-Speech) Integration
 * Generates voice audio from scripts in CSV files
 */

import fs from 'fs';
import path from 'path';
import sdk from 'microsoft-cognitiveservices-speech-sdk';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { config } from 'dotenv';
import { spawn } from 'child_process';
import { generateSpeechBatch } from './tts-batch.js';

// Load environment variables
config();

// Threshold for switching to batch API (characters)
const BATCH_API_THRESHOLD = 10000;

/**
 * Parse CSV script file
 */
async function parseScriptsCSV(csvPath) {
  return new Promise((resolve, reject) => {
    const scripts = [];
    
    if (!fs.existsSync(csvPath)) {
      reject(new Error(`CSV file not found: ${csvPath}`));
      return;
    }
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        scripts.push({
          video_id: row.video_id || row.id,
          script: row.script,
          status: row.status || 'pending',
          voice: row.voice || '',
          language: row.language || '',
          speaking_rate: row.speaking_rate || '1.0',
          pitch: row.pitch || '0',
          audio_duration: row.audio_duration || '0',
          generated_at: row.generated_at || '',
          notes: row.notes || ''
        });
      })
      .on('end', () => {
        resolve(scripts);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Update CSV with generation results
 */
async function updateScriptsCSV(csvPath, scripts) {
  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: 'video_id', title: 'video_id' },
      { id: 'script', title: 'script' },
      { id: 'status', title: 'status' },
      { id: 'voice', title: 'voice' },
      { id: 'language', title: 'language' },
      { id: 'speaking_rate', title: 'speaking_rate' },
      { id: 'pitch', title: 'pitch' },
      { id: 'audio_duration', title: 'audio_duration' },
      { id: 'generated_at', title: 'generated_at' },
      { id: 'notes', title: 'notes' }
    ]
  });
  
  await csvWriter.writeRecords(scripts);
}

/**
 * Get audio duration from file
 */
function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      audioPath
    ]);

    let duration = '';
    ffprobe.stdout.on('data', data => {
      duration += data.toString();
    });

    ffprobe.on('close', code => {
      if (code !== 0) {
        reject(new Error('Failed to get audio duration'));
      } else {
        resolve(Math.round(parseFloat(duration.trim())));
      }
    });
  });
}

/**
 * Generate speech using Azure TTS
 * Automatically uses Batch API for long scripts (>10K chars)
 */
async function generateSpeech(script, outputPath, voiceConfig) {
  const apiKey = process.env.AZURE_TTS_API_KEY;
  const region = process.env.AZURE_TTS_REGION;
  
  if (!apiKey || !region) {
    throw new Error('Azure TTS credentials not configured. Run: npm run tts:setup');
  }
  
  // Detect if script already contains SSML
  const isSSML = script.text.trim().startsWith('<speak');
  
  // Build SSML if needed
  let textToSpeak = script.text;
  let useSSML = isSSML;
  
  // Set voice
  const voice = voiceConfig.voice || process.env.AZURE_TTS_DEFAULT_VOICE || 'pt-BR-FranciscaNeural';
  
  if (!isSSML && (voiceConfig.speaking_rate !== '1.0' || voiceConfig.pitch !== '0')) {
    // Auto-generate SSML for rate/pitch control
    textToSpeak = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voiceConfig.language || 'pt-BR'}">
      <voice name="${voice}">
        <prosody rate="${voiceConfig.speaking_rate}" pitch="${voiceConfig.pitch}Hz">
          ${script.text}
        </prosody>
      </voice>
    </speak>`;
    useSSML = true;
  }
  
  // Check if script is too long for real-time API
  if (textToSpeak.length > BATCH_API_THRESHOLD) {
    console.log(`   📊 Script length: ${textToSpeak.length} chars - using Batch API`);
    
    // Use Batch Synthesis API for long scripts
    return await generateSpeechBatch(textToSpeak, outputPath, {
      description: `Long-form synthesis`,
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
      maxWaitTime: 600000, // 10 minutes
      pollInterval: 5000 // 5 seconds
    });
  }
  
  // Use real-time API for short scripts
  return new Promise((resolve, reject) => {
    // Create speech config
    const speechConfig = sdk.SpeechConfig.fromSubscription(apiKey, region);
    speechConfig.speechSynthesisVoiceName = voice;
    
    // Set output format (high quality MP3)
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;
    
    // Create audio config
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
    
    // Create synthesizer
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    
    // Synthesize speech
    if (useSSML) {
      synthesizer.speakSsmlAsync(
        textToSpeak,
        result => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            synthesizer.close();
            resolve({
              success: true,
              outputPath: outputPath,
              audioLength: result.audioDuration / 10000000 // Convert to seconds
            });
          } else {
            synthesizer.close();
            reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
          }
        },
        error => {
          synthesizer.close();
          reject(error);
        }
      );
    } else {
      synthesizer.speakTextAsync(
        textToSpeak,
        result => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            synthesizer.close();
            resolve({
              success: true,
              outputPath: outputPath,
              audioLength: result.audioDuration / 10000000
            });
          } else {
            synthesizer.close();
            reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
          }
        },
        error => {
          synthesizer.close();
          reject(error);
        }
      );
    }
  });
}

/**
 * Generate voice audio for a single script
 */
async function generateVoiceForScript(channelPath, scriptData, options = {}) {
  const videoFolder = path.join(channelPath, 'videos', scriptData.video_id);
  const voiceOutputPath = path.join(videoFolder, 'voice.mp3');
  
  // Create video folder if it doesn't exist (auto-folder creation)
  if (!fs.existsSync(videoFolder)) {
    console.log(`   📁 Creating folder: ${scriptData.video_id}/`);
    fs.mkdirSync(videoFolder, { recursive: true });
    
    // Create images subfolder
    const imagesFolder = path.join(videoFolder, 'images');
    fs.mkdirSync(imagesFolder, { recursive: true });
  }
  
  // Get voice configuration
  const voiceConfig = {
    voice: scriptData.voice || options.defaultVoice || process.env.AZURE_TTS_DEFAULT_VOICE,
    language: scriptData.language || options.defaultLanguage || process.env.AZURE_TTS_DEFAULT_LANGUAGE || 'pt-BR',
    speaking_rate: scriptData.speaking_rate || '1.0',
    pitch: scriptData.pitch || '0'
  };
  
  console.log(`\n🎙️  Generating: ${scriptData.video_id}`);
  console.log(`   🗣️  Voice: ${voiceConfig.voice}`);
  console.log(`   📝 Script: "${scriptData.script.substring(0, 50)}${scriptData.script.length > 50 ? '...' : ''}"`);
  
  try {
    // Generate speech
    const result = await generateSpeech(
      { text: scriptData.script },
      voiceOutputPath,
      voiceConfig
    );
    
    // Get actual audio duration
    const duration = await getAudioDuration(voiceOutputPath);
    
    console.log(`   ✅ Generated: voice.mp3 (${duration}s, ${(fs.statSync(voiceOutputPath).size / 1024 / 1024).toFixed(2)} MB)`);
    
    return {
      success: true,
      duration: duration,
      outputPath: voiceOutputPath
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate voices for all pending scripts in a channel
 */
async function generateVoicesForChannel(channelPath, options = {}) {
  const scriptsCSVPath = path.join(channelPath, 'scripts.csv');
  
  if (!fs.existsSync(scriptsCSVPath)) {
    throw new Error(`Scripts file not found: ${scriptsCSVPath}\nRun: npm run tts:init to create it.`);
  }
  
  console.log(`📄 Reading scripts from: ${path.basename(channelPath)}/scripts.csv\n`);
  
  // Parse CSV
  const scripts = await parseScriptsCSV(scriptsCSVPath);
  
  // Filter pending scripts (or all if force mode)
  const scriptsToGenerate = options.force 
    ? scripts 
    : scripts.filter(s => s.status === 'pending' || s.status === 'regenerate');
  
  if (scriptsToGenerate.length === 0) {
    console.log('✅ No pending scripts found. All scripts already generated!');
    console.log('   Use --force to regenerate all scripts.\n');
    return;
  }
  
  console.log(`📊 Found ${scriptsToGenerate.length} script(s) to generate:\n`);
  
  // Show what will be generated
  scriptsToGenerate.forEach((script, index) => {
    console.log(`   ${index + 1}. ${script.video_id} - "${script.script.substring(0, 40)}..."`);
  });
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // Generate each script
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < scriptsToGenerate.length; i++) {
    const script = scriptsToGenerate[i];
    
    console.log(`[${i + 1}/${scriptsToGenerate.length}]`);
    
    const result = await generateVoiceForScript(channelPath, script, options);
    
    // Update script data
    if (result.success) {
      script.status = 'generated';
      script.audio_duration = result.duration.toString();
      script.generated_at = new Date().toISOString();
      successCount++;
    } else {
      script.status = 'error';
      script.notes = result.error;
      errorCount++;
    }
    
    // Auto-update CSV after each generation
    await updateScriptsCSV(scriptsCSVPath, scripts);
  }
  
  // Summary
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`✅ Generation complete!`);
  console.log(`   Success: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount}`);
  }
  console.log(`\n📝 CSV updated: ${scriptsCSVPath}\n`);
}

/**
 * List available Azure voices for a language
 */
async function listAvailableVoices(languageCode = 'pt-BR') {
  const apiKey = process.env.AZURE_TTS_API_KEY;
  const region = process.env.AZURE_TTS_REGION;
  
  if (!apiKey || !region) {
    throw new Error('Azure TTS credentials not configured. Run: npm run tts:setup');
  }
  
  const speechConfig = sdk.SpeechConfig.fromSubscription(apiKey, region);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
  
  return new Promise((resolve, reject) => {
    synthesizer.getVoicesAsync(
      result => {
        if (result.reason === sdk.ResultReason.VoicesListRetrieved) {
          const voices = result.voices.filter(v => v.locale.startsWith(languageCode));
          synthesizer.close();
          resolve(voices);
        } else {
          synthesizer.close();
          reject(new Error('Failed to retrieve voices'));
        }
      },
      error => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}

/**
 * Create template CSV file
 */
function createTemplateCSV(channelPath) {
  const scriptsCSVPath = path.join(channelPath, 'scripts.csv');
  
  if (fs.existsSync(scriptsCSVPath)) {
    throw new Error(`Scripts file already exists: ${scriptsCSVPath}`);
  }
  
  const templateData = [
    {
      video_id: 'example-001',
      script: 'Pai celestial, nós viemos diante de Ti hoje com corações gratos. Pedimos Sua bênção sobre este dia.',
      status: 'pending',
      voice: '',
      language: '',
      speaking_rate: '1.0',
      pitch: '0',
      audio_duration: '0',
      generated_at: '',
      notes: 'Example script - edit or delete'
    }
  ];
  
  const csvWriter = createObjectCsvWriter({
    path: scriptsCSVPath,
    header: [
      { id: 'video_id', title: 'video_id' },
      { id: 'script', title: 'script' },
      { id: 'status', title: 'status' },
      { id: 'voice', title: 'voice' },
      { id: 'language', title: 'language' },
      { id: 'speaking_rate', title: 'speaking_rate' },
      { id: 'pitch', title: 'pitch' },
      { id: 'audio_duration', title: 'audio_duration' },
      { id: 'generated_at', title: 'generated_at' },
      { id: 'notes', title: 'notes' }
    ]
  });
  
  return csvWriter.writeRecords(templateData);
}

export {
  parseScriptsCSV,
  updateScriptsCSV,
  generateSpeech,
  generateVoiceForScript,
  generateVoicesForChannel,
  listAvailableVoices,
  createTemplateCSV
};
