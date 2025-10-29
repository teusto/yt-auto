#!/usr/bin/env node

/**
 * Format SSML for CSV usage
 * 
 * Usage: node format-ssml-for-csv.js input.xml output.txt
 */

import fs from 'fs';

const inputFile = process.argv[2] || 'input-ssml.xml';
const outputFile = process.argv[3] || 'formatted-ssml.txt';

console.log(`📖 Reading SSML from: ${inputFile}`);

// Read the SSML file
let ssml = fs.readFileSync(inputFile, 'utf-8');

console.log('🔧 Formatting SSML for CSV...');

// 1. Remove XML declaration
ssml = ssml.replace(/<\?xml[^>]*\?>/g, '');

// 2. Remove HTML comments (<!-- ... -->)
ssml = ssml.replace(/<!--[\s\S]*?-->/g, '');

// 3. Change double quotes to single quotes in attributes
ssml = ssml.replace(/="([^"]*)"/g, "='$1'");

// 4. Remove all newlines and extra whitespace
ssml = ssml.replace(/\n/g, '');
ssml = ssml.replace(/\s+/g, ' ');
ssml = ssml.trim();

// Write formatted SSML
fs.writeFileSync(outputFile, ssml, 'utf-8');

console.log(`✅ Formatted SSML saved to: ${outputFile}`);
console.log(`📏 Length: ${ssml.length} characters`);
console.log('\n📋 To use in CSV:');
console.log('1. Copy the entire line from the output file');
console.log('2. In your CSV, use format:');
console.log('   video_id,"<entire_ssml_here>",status');
console.log('\n⚠️  Make sure to wrap in double quotes in CSV!');
