#!/usr/bin/env node

/**
 * Channel Create Command
 * Create a new channel with folder structure and default configuration
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
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
 * Main function
 */
async function main() {
  console.log('\n🎬 YT-Machine - Channel Creator\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // 1. Channel Name
  let channelName = await question('📺 Channel name (lowercase-with-dashes): ');
  channelName = channelName.trim().toLowerCase().replace(/\s+/g, '-');
  
  if (!channelName) {
    console.log('\n❌ Channel name is required!\n');
    rl.close();
    return;
  }
  
  const channelsFolder = path.join(__dirname, 'channels');
  const channelPath = path.join(channelsFolder, channelName);
  
  // Check if channel exists
  if (fs.existsSync(channelPath)) {
    console.log(`\n❌ Channel "${channelName}" already exists!\n`);
    rl.close();
    return;
  }
  
  // 2. Description
  const description = await question('📝 Description: ');
  
  // 3. Platform
  console.log('\n🎯 Platform:');
  console.log('  1. YouTube');
  console.log('  2. TikTok');
  console.log('  3. Instagram');
  console.log('  4. Multi-platform');
  const platformChoice = await question('\nSelect (1-4): ');
  const platforms = { '1': 'youtube', '2': 'tiktok', '3': 'instagram', '4': 'multi-platform' };
  const platform = platforms[platformChoice] || 'youtube';
  
  // 4. Aspect Ratio
  console.log('\n📐 Default aspect ratio:');
  console.log('  1. 16:9 (Landscape - YouTube)');
  console.log('  2. 9:16 (Portrait - TikTok/Shorts)');
  console.log('  3. 1:1 (Square - Instagram)');
  const aspectChoice = await question('\nSelect (1-3): ');
  const aspects = { '1': '16:9', '2': '9:16', '3': '1:1' };
  const aspectRatio = aspects[aspectChoice] || '16:9';
  
  // 5. Language
  const language = await question('\n🌍 Language code (en, pt, es, fr): ') || 'en';
  
  // 6. Content Type
  console.log('\n🎬 Content type:');
  console.log('  1. Long-form videos (5+ min)');
  console.log('  2. Shorts/Clips (< 1 min)');
  console.log('  3. Podcast/Audio-focused');
  console.log('  4. Mixed content');
  const contentChoice = await question('\nSelect (1-4): ');
  
  // Configure defaults based on content type
  let defaults = getDefaultsByContentType(contentChoice, aspectRatio, language);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔧 Creating channel...\n');
  
  // Create folder structure
  createFolderStructure(channelPath);
  
  // Create channel.json
  createChannelConfig(channelPath, {
    name: channelName,
    description: description.trim() || `${channelName} content`,
    platform,
    defaults
  });
  
  // Create scripts.csv
  createScriptsCSV(channelPath);
  
  // Create README cheat sheet
  createCheatSheet(channelPath, channelName, platform, aspectRatio);
  
  // Create placeholder files
  createPlaceholderFiles(channelPath);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ Channel created successfully!\n');
  console.log(`📁 Location: channels/${channelName}/\n`);
  console.log(`📖 Read the quick start guide: channels/${channelName}/QUICK_START.md\n`);
  
  rl.close();
}

/**
 * Get defaults by content type
 */
function getDefaultsByContentType(choice, aspectRatio, language) {
  const baseDefaults = {
    aspectRatio,
    animation: 'none',
    qualityMode: 'high',
    language,
    randomImages: true,
    useChannelPool: true,
    fallbackToGlobalPool: true,
    randomMusic: true,
    useChannelMusicPool: true,
    subtitle: {
      style: 'minimal',
      position: 'bottom',
      fontSize: aspectRatio === '9:16' ? 24 : 32
    },
    audio: {
      musicVolume: 0.25,
      musicFadeIn: 2,
      musicFadeOut: 0.5,
      voiceFadeIn: 1,
      voiceFadeOut: 0.5
    },
    cta: {
      enabled: false
    },
    exportFormats: {
      enabled: false
    }
  };
  
  // Customize based on content type
  switch (choice) {
    case '1': // Long-form
      return {
        ...baseDefaults,
        imageCount: 8,
        animation: 'none',
        subtitle: {
          ...baseDefaults.subtitle,
          style: 'minimal'
        }
      };
    
    case '2': // Shorts
      return {
        ...baseDefaults,
        imageCount: 5,
        animation: 'zoom-in',
        aspectRatio: '9:16',
        subtitle: {
          style: 'bold',
          position: 'center',
          fontSize: 28
        },
        audio: {
          ...baseDefaults.audio,
          musicVolume: 0.35
        },
        cta: {
          enabled: true
        }
      };
    
    case '3': // Podcast
      return {
        ...baseDefaults,
        imageCount: 1,
        animation: 'static',
        randomImages: false,
        subtitle: {
          enabled: false
        },
        audio: {
          ...baseDefaults.audio,
          musicVolume: 0.15
        }
      };
    
    default: // Mixed
      return baseDefaults;
  }
}

/**
 * Create folder structure
 */
function createFolderStructure(channelPath) {
  const folders = [
    channelPath,
    path.join(channelPath, 'image-pool'),
    path.join(channelPath, 'music-pool'),
    path.join(channelPath, 'videos')
  ];
  
  folders.forEach(folder => {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`   📁 Created: ${path.basename(folder)}/`);
  });
}

/**
 * Create channel.json
 */
function createChannelConfig(channelPath, config) {
  const configPath = path.join(channelPath, 'channel.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('   📄 Created: channel.json');
}

/**
 * Create scripts.csv
 */
function createScriptsCSV(channelPath) {
  const csvPath = path.join(channelPath, 'scripts.csv');
  const headers = 'video_id,script,status,voice,language,speaking_rate,pitch,audio_duration,generated_at,notes\n';
  fs.writeFileSync(csvPath, headers);
  console.log('   📄 Created: scripts.csv');
}

/**
 * Create QUICK_START.md cheat sheet
 */
function createCheatSheet(channelPath, channelName, platform, aspectRatio) {
  const cheatSheet = `# 🚀 Quick Start - ${channelName}

## 📋 15-Line Cheat Sheet

### 1️⃣ Add Voice Scripts (Option A: Azure TTS)
\`\`\`bash
# Add scripts to scripts.csv
npm run tts:generate -- ${channelName}
\`\`\`

### 1️⃣ Add Voice Scripts (Option B: Manual)
\`\`\`bash
# Add MP3 files to videos/
mkdir videos/my-video
cp ~/voice.mp3 videos/my-video/voice.mp3
\`\`\`

### 2️⃣ Add Images (${aspectRatio} format recommended)
\`\`\`bash
cp ~/images/*.jpg image-pool/
\`\`\`

### 3️⃣ Add Background Music (Optional)
\`\`\`bash
cp ~/music/*.mp3 music-pool/
\`\`\`

### 4️⃣ Generate Videos
\`\`\`bash
npm start
# Select: Batch Processing > ${channelName}
\`\`\`

---

## 📁 Folder Structure

\`\`\`
${channelName}/
├── channel.json          # Channel settings
├── scripts.csv          # TTS scripts (if using Azure TTS)
├── image-pool/          # Add ${aspectRatio} images here
├── music-pool/          # Add background music here
└── videos/              # Video projects
    ├── video-001/
    │   ├── voice.mp3    # Required
    │   └── subtitles.srt # Optional
    └── video-002/
\`\`\`

---

## 🎯 Platform: ${platform}

${getPlatformTips(platform, aspectRatio)}

---

## ⚙️ Configuration

Edit \`channel.json\` to customize:
- Aspect ratio, animation, quality
- Subtitle style, position, font size
- Music volume, fade effects
- CTA overlays, export formats

---

## 🔧 Common Tasks

### Generate subtitles automatically
\`\`\`bash
npm run subtitles
\`\`\`

### Test TTS voices
\`\`\`bash
npm run tts:voices
\`\`\`

### Regenerate specific video
\`\`\`bash
# Delete output, then run batch processing
rm videos/my-video/output.mp4
npm start
\`\`\`

---

**Need help?** Check the main README.md or channel configuration guides!
`;

  const cheatSheetPath = path.join(channelPath, 'QUICK_START.md');
  fs.writeFileSync(cheatSheetPath, cheatSheet);
  console.log('   📖 Created: QUICK_START.md');
}

/**
 * Get platform-specific tips
 */
function getPlatformTips(platform, aspectRatio) {
  const tips = {
    youtube: `### YouTube Optimization
- Use 16:9 for regular videos
- Use 9:16 for Shorts
- Keep Shorts under 60 seconds
- Add chapters for long videos (10+ min)
- Enable subtitles for better SEO`,

    tiktok: `### TikTok Optimization
- Always use 9:16 aspect ratio
- Keep videos 15-60 seconds
- Hook viewers in first 3 seconds
- Use bold, center subtitles
- High music volume (0.35-0.45)`,

    instagram: `### Instagram Optimization
- Use 9:16 for Reels
- Use 1:1 for Feed posts
- Keep Reels under 90 seconds
- Vertical format performs best
- Add engaging captions`,

    'multi-platform': `### Multi-Platform Strategy
- Create in ${aspectRatio}, export multiple formats
- Enable exportFormats in channel.json
- Shorter is better (under 60s)
- Bold subtitles for mobile viewing
- Test content on each platform`
  };

  return tips[platform] || tips.youtube;
}

/**
 * Create placeholder files
 */
function createPlaceholderFiles(channelPath) {
  // Image pool README
  const imageReadme = `# Image Pool

Add your images here (${path.basename(channelPath)} format recommended).

- Supported: jpg, jpeg, png, webp, gif
- Recommended: 50+ images for variety
- Format: Match your channel's aspect ratio

Images will be randomly selected for videos unless you add them to specific video folders.
`;
  fs.writeFileSync(path.join(channelPath, 'image-pool', 'README.txt'), imageReadme);
  
  // Music pool README
  const musicReadme = `# Music Pool

Add background music here (optional).

- Supported: mp3, wav, m4a, aac
- Recommended: 5-10 tracks for variety
- Format: Instrumental, royalty-free

Music will be randomly selected and mixed at configured volume.
`;
  fs.writeFileSync(path.join(channelPath, 'music-pool', 'README.txt'), musicReadme);
  
  console.log('   📄 Created: README files');
}

// Run
main().catch(error => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
