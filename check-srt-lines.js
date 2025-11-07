#!/usr/bin/env node

/**
 * Quick diagnostic tool to check SRT files for line issues
 * Usage: node check-srt-lines.js path/to/subtitles.srt
 */

import fs from 'fs';
import path from 'path';

const srtPath = process.argv[2];

if (!srtPath) {
  console.log('Usage: node check-srt-lines.js path/to/subtitles.srt');
  process.exit(1);
}

if (!fs.existsSync(srtPath)) {
  console.log(`❌ File not found: ${srtPath}`);
  process.exit(1);
}

console.log(`\n📄 Analyzing: ${path.basename(srtPath)}\n`);

const content = fs.readFileSync(srtPath, 'utf-8');
const blocks = content.split(/\n\n+/).filter(Boolean);

console.log(`📊 Total subtitle blocks: ${blocks.length}\n`);

let issues = 0;
let maxLines = 0;

blocks.forEach((block, index) => {
  const lines = block.split('\n');
  
  if (lines.length >= 3) {
    const timeLine = lines[1];
    const textLines = lines.slice(2);
    const lineCount = textLines.length;
    
    if (lineCount > maxLines) {
      maxLines = lineCount;
    }
    
    if (lineCount > 2) {
      issues++;
      if (issues <= 5) {
        console.log(`⚠️  Subtitle #${index + 1} has ${lineCount} lines:`);
        console.log(`   Time: ${timeLine}`);
        textLines.forEach((line, i) => {
          console.log(`   Line ${i + 1}: "${line}"`);
        });
        console.log('');
      }
    }
  }
});

console.log(`\n📈 Summary:`);
console.log(`   Total blocks: ${blocks.length}`);
console.log(`   Max lines in any subtitle: ${maxLines}`);
console.log(`   Subtitles with 3+ lines: ${issues}`);

if (issues > 0) {
  console.log(`\n💡 Recommendation:`);
  console.log(`   Your SRT file has ${issues} subtitle(s) with 3+ lines.`);
  console.log(`   The app will now automatically fix these, but you can also:`);
  console.log(`   1. Let the app handle it (automatic line limiting)`);
  console.log(`   2. Manually edit the SRT to split long subtitles into multiple shorter ones`);
  console.log(`   3. Use shorter subtitle text in general`);
} else {
  console.log(`\n✅ All subtitles have 2 or fewer lines!`);
}

console.log('');
