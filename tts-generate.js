#!/usr/bin/env node

/**
 * TTS Generate Command
 * Generate voice audio from scripts.csv
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { generateVoicesForChannel, parseScriptsCSV, generateVoiceForScript, updateScriptsCSV } from './src/tts.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment
config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Detect available channels
 */
function detectChannels() {
  const channelsFolder = path.join(__dirname, 'channels');
  
  if (!fs.existsSync(channelsFolder)) {
    return [];
  }
  
  const folders = fs.readdirSync(channelsFolder).filter(item => {
    const itemPath = path.join(channelsFolder, item);
    if (!fs.statSync(itemPath).isDirectory()) return false;
    if (item.startsWith('.')) return false;
    
    const channelConfigPath = path.join(itemPath, 'channel.json');
    return fs.existsSync(channelConfigPath);
  });
  
  return folders.map(folder => ({
    name: folder,
    path: path.join(channelsFolder, folder),
    hasScripts: fs.existsSync(path.join(channelsFolder, folder, 'scripts.csv'))
  }));
}

/**
 * Show interactive menu
 */
async function showInteractiveMenu(channelPath) {
  const scriptsCSVPath = path.join(channelPath, 'scripts.csv');
  
  if (!fs.existsSync(scriptsCSVPath)) {
    console.log(`\n❌ Scripts file not found: ${scriptsCSVPath}`);
    console.log(`\n💡 Create it with: npm run tts:init\n`);
    rl.close();
    return;
  }
  
  // Parse scripts
  const scripts = await parseScriptsCSV(scriptsCSVPath);
  const pending = scripts.filter(s => s.status === 'pending' || s.status === 'regenerate');
  const generated = scripts.filter(s => s.status === 'generated');
  const errors = scripts.filter(s => s.status === 'error');
  
  // Show header
  console.log(`\n🎙️  Azure TTS Generator - ${path.basename(channelPath)}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  console.log(`📄 Script file: scripts.csv`);
  console.log(`🗣️  Default voice: ${process.env.AZURE_TTS_DEFAULT_VOICE || 'Not configured'}\n`);
  
  console.log(`📊 Scripts Summary:`);
  console.log(`   📝 Total scripts: ${scripts.length}`);
  console.log(`   ⏳ Pending: ${pending.length} script(s)`);
  console.log(`   ✅ Generated: ${generated.length} script(s)`);
  if (errors.length > 0) {
    console.log(`   ❌ Errors: ${errors.length} script(s)`);
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // Show pending scripts
  if (pending.length > 0) {
    console.log(`⏳ Pending Scripts (${pending.length}):\n`);
    pending.forEach((script, index) => {
      const preview = script.script.substring(0, 60);
      console.log(`   ${index + 1}. ${script.video_id}`);
      console.log(`      "${preview}${script.script.length > 60 ? '...' : ''}"`);
      if (script.voice) {
        console.log(`      Voice: ${script.voice} | Language: ${script.language || 'default'}`);
      }
      console.log();
    });
  } else {
    console.log(`✅ No pending scripts!\n`);
  }
  
  // Show already generated (first 3)
  if (generated.length > 0) {
    console.log(`✅ Already Generated (${generated.length}):\n`);
    generated.slice(0, 3).forEach(script => {
      console.log(`   ✅ ${script.video_id} - Generated ${script.generated_at} (${script.audio_duration}s)`);
    });
    if (generated.length > 3) {
      console.log(`   ... and ${generated.length - 3} more`);
    }
    console.log();
  }
  
  // Show errors
  if (errors.length > 0) {
    console.log(`❌ Errors (${errors.length}):\n`);
    errors.forEach(script => {
      console.log(`   ⚠️  ${script.video_id} - ${script.notes || 'Unknown error'}`);
    });
    console.log();
  }
  
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // Menu
  if (pending.length > 0) {
    console.log(`Actions:`);
    console.log(`[1] Generate all pending (${pending.length} script${pending.length > 1 ? 's' : ''})`);
    console.log(`[2] Generate specific video`);
    if (errors.length > 0) {
      console.log(`[3] Retry failed scripts`);
    }
    console.log(`[0] Exit\n`);
    
    const choice = await question('Choose option: ');
    
    if (choice === '1') {
      // Generate all pending
      rl.close();
      console.log();
      await generateVoicesForChannel(channelPath, {
        defaultVoice: process.env.AZURE_TTS_DEFAULT_VOICE,
        defaultLanguage: process.env.AZURE_TTS_DEFAULT_LANGUAGE
      });
    } else if (choice === '2') {
      // Generate specific
      const videoId = await question('\nEnter video ID: ');
      rl.close();
      
      const script = scripts.find(s => s.video_id === videoId);
      if (!script) {
        console.log(`\n❌ Video ID not found: ${videoId}\n`);
      } else {
        console.log();
        const result = await generateVoiceForScript(channelPath, script, {
          defaultVoice: process.env.AZURE_TTS_DEFAULT_VOICE,
          defaultLanguage: process.env.AZURE_TTS_DEFAULT_LANGUAGE
        });
        
        // Update CSV
        if (result.success) {
          script.status = 'generated';
          script.audio_duration = result.duration.toString();
          script.generated_at = new Date().toISOString();
        } else {
          script.status = 'error';
          script.notes = result.error;
        }
        
        await updateScriptsCSV(scriptsCSVPath, scripts);
        console.log(`\n📝 CSV updated\n`);
      }
    } else if (choice === '3' && errors.length > 0) {
      // Retry errors
      rl.close();
      console.log(`\n🔄 Retrying failed scripts...\n`);
      
      // Set error scripts to pending
      errors.forEach(s => s.status = 'pending');
      await updateScriptsCSV(scriptsCSVPath, scripts);
      
      // Generate
      await generateVoicesForChannel(channelPath, {
        defaultVoice: process.env.AZURE_TTS_DEFAULT_VOICE,
        defaultLanguage: process.env.AZURE_TTS_DEFAULT_LANGUAGE
      });
    } else {
      console.log('\n👋 Exiting...\n');
      rl.close();
    }
  } else {
    console.log(`No pending scripts to generate.\n`);
    rl.close();
  }
}

/**
 * Main function
 */
async function main() {
  // Check credentials
  if (!process.env.AZURE_TTS_API_KEY || !process.env.AZURE_TTS_REGION) {
    console.log(`\n❌ Azure TTS not configured\n`);
    console.log(`Run setup first: npm run tts:setup\n`);
    rl.close();
    return;
  }
  
  // Parse command line args
  const args = process.argv.slice(2);
  const channelArg = args.find(arg => !arg.startsWith('--'));
  const force = args.includes('--force');
  const allPending = args.includes('--all-pending');
  
  // Detect channels
  const channels = detectChannels();
  
  if (channels.length === 0) {
    console.log(`\n❌ No channels found\n`);
    rl.close();
    return;
  }
  
  // If channel specified in args
  if (channelArg) {
    const channel = channels.find(c => c.name === channelArg);
    if (!channel) {
      console.log(`\n❌ Channel not found: ${channelArg}\n`);
      rl.close();
      return;
    }
    
    if (!channel.hasScripts) {
      console.log(`\n❌ No scripts.csv found for channel: ${channelArg}`);
      console.log(`\nCreate it with: npm run tts:init ${channelArg}\n`);
      rl.close();
      return;
    }
    
    rl.close();
    
    if (allPending) {
      console.log();
      await generateVoicesForChannel(channel.path, {
        force: force,
        defaultVoice: process.env.AZURE_TTS_DEFAULT_VOICE,
        defaultLanguage: process.env.AZURE_TTS_DEFAULT_LANGUAGE
      });
    } else {
      await showInteractiveMenu(channel.path);
    }
    
    return;
  }
  
  // Interactive channel selection
  console.log(`\n🎙️  Azure TTS Generator\n`);
  console.log(`📺 Available Channels:\n`);
  
  const channelsWithScripts = channels.filter(c => c.hasScripts);
  
  if (channelsWithScripts.length === 0) {
    console.log(`❌ No channels have scripts.csv files\n`);
    console.log(`Create one with: npm run tts:init [channel-name]\n`);
    rl.close();
    return;
  }
  
  channelsWithScripts.forEach((channel, index) => {
    console.log(`[${index + 1}] ${channel.name}`);
  });
  
  console.log(`[0] Exit\n`);
  
  const choice = await question('Select channel: ');
  const selectedIndex = parseInt(choice) - 1;
  
  if (selectedIndex >= 0 && selectedIndex < channelsWithScripts.length) {
    const selectedChannel = channelsWithScripts[selectedIndex];
    await showInteractiveMenu(selectedChannel.path);
  } else {
    console.log('\n👋 Exiting...\n');
    rl.close();
  }
}

// Run
main().catch(error => {
  console.error(`\n❌ Error: ${error.message}\n`);
  rl.close();
  process.exit(1);
});
