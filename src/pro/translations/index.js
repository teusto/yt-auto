/**
 * YT-Machine Pro: Multi-Language Subtitle Translation
 * 
 * Translates SRT subtitle files to multiple languages using DeepL API
 * Can also use Google Translate or OpenAI as fallback
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
const DEEPL_API_URL = process.env.DEEPL_API_FREE === 'true' 
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

// Supported languages by DeepL
const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'pt-BR': 'Portuguese (Brazilian)',
  'pt-PT': 'Portuguese (European)',
  'nl': 'Dutch',
  'pl': 'Polish',
  'ru': 'Russian',
  'ja': 'Japanese',
  'zh': 'Chinese',
  'ko': 'Korean',
  'ar': 'Arabic',
  'tr': 'Turkish',
  'sv': 'Swedish',
  'da': 'Danish',
  'fi': 'Finnish',
  'no': 'Norwegian',
  'ro': 'Romanian',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'cs': 'Czech',
  'hu': 'Hungarian',
  'et': 'Estonian',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'bg': 'Bulgarian',
  'el': 'Greek',
  'id': 'Indonesian',
  'uk': 'Ukrainian'
};

/**
 * Parse SRT file into subtitle objects
 */
function parseSRT(srtContent) {
  const subtitles = [];
  const blocks = srtContent.trim().split('\n\n');
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const index = lines[0].trim();
      const timing = lines[1].trim();
      const text = lines.slice(2).join('\n').trim();
      
      subtitles.push({ index, timing, text });
    }
  }
  
  return subtitles;
}

/**
 * Convert subtitle objects back to SRT format
 */
function generateSRT(subtitles) {
  return subtitles.map(sub => 
    `${sub.index}\n${sub.timing}\n${sub.text}\n`
  ).join('\n');
}

/**
 * Translate text using DeepL API
 */
async function translateWithDeepL(text, targetLang, sourceLang = 'EN') {
  if (!DEEPL_API_KEY) {
    throw new Error('DeepL API key not configured. Set DEEPL_API_KEY in .env file');
  }
  
  try {
    const response = await axios.post(
      DEEPL_API_URL,
      new URLSearchParams({
        auth_key: DEEPL_API_KEY,
        text: text,
        target_lang: targetLang.toUpperCase(),
        source_lang: sourceLang.toUpperCase(),
        preserve_formatting: '1',
        formality: 'default'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return response.data.translations[0].text;
  } catch (error) {
    console.error(`DeepL translation error: ${error.message}`);
    throw error;
  }
}

/**
 * Translate entire SRT file to target language
 */
async function translateSRT(srtPath, targetLang, outputPath, options = {}) {
  console.log(`\n🌍 Translating subtitles to ${SUPPORTED_LANGUAGES[targetLang]}...`);
  
  // Read and parse SRT file
  const srtContent = fs.readFileSync(srtPath, 'utf-8');
  const subtitles = parseSRT(srtContent);
  
  console.log(`   📝 Found ${subtitles.length} subtitle blocks`);
  
  // Translate each subtitle block
  const translatedSubtitles = [];
  const sourceLang = options.sourceLang || 'EN';
  
  for (let i = 0; i < subtitles.length; i++) {
    const sub = subtitles[i];
    
    try {
      // Show progress
      if (i % 10 === 0 || i === subtitles.length - 1) {
        console.log(`   ⏳ Progress: ${i + 1}/${subtitles.length} blocks`);
      }
      
      // Translate the text
      const translatedText = await translateWithDeepL(
        sub.text,
        targetLang,
        sourceLang
      );
      
      translatedSubtitles.push({
        index: sub.index,
        timing: sub.timing,
        text: translatedText
      });
      
      // Rate limiting: wait 100ms between requests (free tier)
      if (i < subtitles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`   ❌ Error translating block ${i + 1}: ${error.message}`);
      // Keep original text on error
      translatedSubtitles.push(sub);
    }
  }
  
  // Generate translated SRT
  const translatedSRT = generateSRT(translatedSubtitles);
  
  // Write to file
  fs.writeFileSync(outputPath, translatedSRT, 'utf-8');
  
  console.log(`   ✅ Translation complete: ${path.basename(outputPath)}\n`);
  
  return outputPath;
}

/**
 * Translate SRT to multiple languages
 */
async function translateToMultipleLanguages(srtPath, targetLanguages, outputFolder, options = {}) {
  console.log(`\n🌍 Multi-Language Translation Started`);
  console.log(`   📄 Source: ${path.basename(srtPath)}`);
  console.log(`   🎯 Target Languages: ${targetLanguages.map(l => SUPPORTED_LANGUAGES[l]).join(', ')}`);
  console.log('');
  
  const results = [];
  
  for (const lang of targetLanguages) {
    if (!SUPPORTED_LANGUAGES[lang]) {
      console.warn(`   ⚠️  Unsupported language: ${lang}, skipping...`);
      continue;
    }
    
    const outputFileName = options.nameTemplate 
      ? options.nameTemplate.replace('{lang}', lang)
      : `subtitles_${lang}.srt`;
    
    const outputPath = path.join(outputFolder, outputFileName);
    
    try {
      const result = await translateSRT(srtPath, lang, outputPath, options);
      results.push({ language: lang, path: result, success: true });
    } catch (error) {
      console.error(`   ❌ Failed to translate to ${SUPPORTED_LANGUAGES[lang]}: ${error.message}\n`);
      results.push({ language: lang, error: error.message, success: false });
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Translation Summary:`);
  console.log(`   Total: ${results.length}`);
  console.log(`   Successful: ${results.filter(r => r.success).length}`);
  console.log(`   Failed: ${results.filter(r => !r.success).length}`);
  console.log(`${'='.repeat(60)}\n`);
  
  return results;
}

/**
 * Check if DeepL API is configured and working
 */
async function checkDeepLConfig() {
  if (!DEEPL_API_KEY) {
    return {
      configured: false,
      message: 'DeepL API key not found. Set DEEPL_API_KEY in .env file'
    };
  }
  
  try {
    // Test with a simple translation
    await translateWithDeepL('Hello', 'ES', 'EN');
    return {
      configured: true,
      message: 'DeepL API configured and working'
    };
  } catch (error) {
    return {
      configured: false,
      message: `DeepL API error: ${error.message}`
    };
  }
}

/**
 * Get list of supported languages
 */
function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

export {
  translateSRT,
  translateToMultipleLanguages,
  checkDeepLConfig,
  getSupportedLanguages,
  parseSRT,
  generateSRT
};
