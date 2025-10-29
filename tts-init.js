#!/usr/bin/env node

/**
 * TTS Init Command
 * Create template scripts.csv file for a channel
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { createTemplateCSV } from './src/tts.js';
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

async function main() {
  const args = process.argv.slice(2);
  const channelArg = args[0];
  
  const channels = detectChannels();
  
  if (channels.length === 0) {
    console.log(`\n❌ No channels found\n`);
    console.log(`Create a channel folder first in: channels/\n`);
    rl.close();
    return;
  }
  
  let selectedChannel;
  
  // If channel specified in args
  if (channelArg) {
    selectedChannel = channels.find(c => c.name === channelArg);
    if (!selectedChannel) {
      console.log(`\n❌ Channel not found: ${channelArg}\n`);
      console.log(`Available channels:`);
      channels.forEach(c => console.log(`  - ${c.name}`));
      console.log();
      rl.close();
      return;
    }
  } else {
    // Interactive selection
    console.log(`\n📄 Create scripts.csv Template\n`);
    console.log(`Select channel:\n`);
    
    channels.forEach((channel, index) => {
      const status = channel.hasScripts ? '✅ (already has scripts.csv)' : '';
      console.log(`[${index + 1}] ${channel.name} ${status}`);
    });
    
    console.log(`[0] Exit\n`);
    
    const choice = await question('Select channel: ');
    const selectedIndex = parseInt(choice) - 1;
    
    if (selectedIndex < 0 || selectedIndex >= channels.length) {
      console.log('\n👋 Exiting...\n');
      rl.close();
      return;
    }
    
    selectedChannel = channels[selectedIndex];
  }
  
  // Check if scripts.csv already exists
  if (selectedChannel.hasScripts) {
    console.log(`\n⚠️  scripts.csv already exists for channel: ${selectedChannel.name}`);
    const overwrite = await question('\nOverwrite? (yes/no) [no]: ');
    
    if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
      console.log('\n👋 Cancelled\n');
      rl.close();
      return;
    }
  }
  
  // Create template
  console.log(`\n📄 Creating scripts.csv for: ${selectedChannel.name}\n`);
  
  try {
    if (selectedChannel.hasScripts) {
      // Backup existing file
      const scriptsPath = path.join(selectedChannel.path, 'scripts.csv');
      const backupPath = path.join(selectedChannel.path, `scripts.csv.backup.${Date.now()}`);
      fs.copyFileSync(scriptsPath, backupPath);
      console.log(`📦 Backed up existing file to: ${path.basename(backupPath)}\n`);
    }
    
    await createTemplateCSV(selectedChannel.path);
    
    const scriptsPath = path.join(selectedChannel.path, 'scripts.csv');
    
    console.log(`✅ Created: ${scriptsPath}\n`);
    console.log(`Template contains one example script.\n`);
    console.log(`Next steps:`);
    console.log(`1. Edit the CSV file and add your scripts`);
    console.log(`2. Run: npm run tts:generate\n`);
    console.log(`CSV columns:`);
    console.log(`  - video_id: Video folder name (required)`);
    console.log(`  - script: Voice text (required)`);
    console.log(`  - status: pending, generated, error (auto-updated)`);
    console.log(`  - voice: Azure voice name (optional, uses default)`);
    console.log(`  - language: Language code (optional, uses default)`);
    console.log(`  - speaking_rate: 0.5-2.0 (optional, default: 1.0)`);
    console.log(`  - pitch: -10 to +10 Hz (optional, default: 0)`);
    console.log(`  - audio_duration: Auto-filled after generation`);
    console.log(`  - generated_at: Auto-filled timestamp`);
    console.log(`  - notes: Your notes\n`);
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`\n❌ ${error.message}\n`);
      console.log(`Use --force to overwrite or delete the file manually.\n`);
    } else {
      throw error;
    }
  }
  
  rl.close();
}

main().catch(error => {
  console.error(`\n❌ Error: ${error.message}\n`);
  rl.close();
  process.exit(1);
});
