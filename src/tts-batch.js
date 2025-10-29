/**
 * Azure Batch Synthesis API for long-form TTS
 * Handles scripts longer than 10,000 characters
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { spawn } from 'child_process';

config();

/**
 * Submit batch synthesis job
 */
async function submitBatchSynthesis(ssml, synthesisId, options = {}) {
  const apiKey = process.env.AZURE_TTS_API_KEY;
  const region = process.env.AZURE_TTS_REGION;
  
  if (!apiKey || !region) {
    throw new Error('Azure TTS credentials not configured');
  }
  
  const url = `https://${region}.api.cognitive.microsoft.com/texttospeech/batchsyntheses/${synthesisId}?api-version=2024-04-01`;
  
  const payload = {
    description: options.description || 'Batch synthesis',
    inputKind: 'SSML',
    inputs: [
      {
        content: ssml
      }
    ],
    properties: {
      outputFormat: options.outputFormat || 'audio-24khz-48kbitrate-mono-mp3',
      wordBoundaryEnabled: options.wordBoundaryEnabled || false,
      sentenceBoundaryEnabled: options.sentenceBoundaryEnabled || false,
      concatenateResult: false
      // decompressOutputFiles requires Azure Blob Storage - we'll handle ZIP extraction manually
    }
  };
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Batch synthesis submission failed: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

/**
 * Get batch synthesis status
 */
async function getBatchSynthesisStatus(synthesisId) {
  const apiKey = process.env.AZURE_TTS_API_KEY;
  const region = process.env.AZURE_TTS_REGION;
  
  const url = `https://${region}.api.cognitive.microsoft.com/texttospeech/batchsyntheses/${synthesisId}?api-version=2024-04-01`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get synthesis status: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Download batch synthesis results
 */
async function downloadBatchResults(resultsUrl, outputPath) {
  const apiKey = process.env.AZURE_TTS_API_KEY;
  
  const response = await fetch(resultsUrl, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to download results: ${response.status}`);
  }
  
  // Save ZIP file
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  
  return outputPath;
}

/**
 * Extract audio from ZIP
 */
async function extractAudioFromZip(zipPath, outputDir) {
  return new Promise((resolve, reject) => {
    const unzip = spawn('unzip', ['-o', zipPath, '-d', outputDir]);
    
    unzip.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Failed to extract ZIP: exit code ${code}`));
      } else {
        // Find the first .wav or .mp3 file
        const files = fs.readdirSync(outputDir);
        const audioFile = files.find(f => f.match(/^\d+\.(wav|mp3)$/));
        
        if (!audioFile) {
          reject(new Error('No audio file found in ZIP'));
        } else {
          resolve(path.join(outputDir, audioFile));
        }
      }
    });
    
    unzip.on('error', reject);
  });
}

/**
 * Get audio duration
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
 * Poll for batch synthesis completion
 */
async function waitForCompletion(synthesisId, options = {}) {
  const maxWaitTime = options.maxWaitTime || 600000; // 10 minutes default
  const pollInterval = options.pollInterval || 5000; // 5 seconds
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const status = await getBatchSynthesisStatus(synthesisId);
    
    console.log(`   ⏳ Status: ${status.status}`);
    
    if (status.status === 'Succeeded') {
      return status;
    }
    
    if (status.status === 'Failed') {
      throw new Error(`Batch synthesis failed: ${JSON.stringify(status)}`);
    }
    
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error('Batch synthesis timed out');
}

/**
 * Generate speech using batch synthesis API
 * Main function for long-form audio generation
 */
async function generateSpeechBatch(ssml, outputPath, options = {}) {
  // Generate unique synthesis ID
  const synthesisId = `synthesis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`   🚀 Submitting batch synthesis: ${synthesisId}`);
  
  // Submit job
  const submission = await submitBatchSynthesis(ssml, synthesisId, options);
  console.log(`   ✅ Job submitted: ${submission.status}`);
  
  // Wait for completion
  console.log(`   ⏳ Waiting for completion...`);
  const result = await waitForCompletion(synthesisId, options);
  
  if (!result.outputs || !result.outputs.result) {
    throw new Error('No output URL in synthesis result');
  }
  
  console.log(`   📥 Downloading results...`);
  
  // Download ZIP
  const tempDir = path.dirname(outputPath);
  const zipPath = path.join(tempDir, `${synthesisId}.zip`);
  await downloadBatchResults(result.outputs.result, zipPath);
  
  console.log(`   📦 Extracting audio...`);
  
  // Extract audio
  const extractedAudio = await extractAudioFromZip(zipPath, tempDir);
  
  // Move to final output path
  if (extractedAudio !== outputPath) {
    fs.renameSync(extractedAudio, outputPath);
  }
  
  // Cleanup
  fs.unlinkSync(zipPath);
  
  // Get duration
  const duration = await getAudioDuration(outputPath);
  
  return {
    success: true,
    outputPath: outputPath,
    audioLength: duration
  };
}

export {
  submitBatchSynthesis,
  getBatchSynthesisStatus,
  downloadBatchResults,
  extractAudioFromZip,
  waitForCompletion,
  generateSpeechBatch
};
