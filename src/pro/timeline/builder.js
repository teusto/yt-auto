/**
 * Timeline Builder
 * Processes timeline segments and creates final video
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { SEGMENT_TYPES, validateTimelineConfig } from './schema.js';
import * as debug from '../../debug/logger.js';

/**
 * Timeline Builder Class
 */
export class TimelineBuilder {
  constructor(config, projectPath, outputFolder) {
    this.config = config;
    this.projectPath = projectPath;
    this.outputFolder = outputFolder;
    this.processedSegments = [];
  }

  /**
   * Build video from timeline
   */
  async build(timeline, mainContentCallback) {
    // Store timeline for use in concatenation
    this.timeline = timeline;
    
    debug.step('Building timeline', { segmentCount: timeline.segments.length });
    
    // Validate timeline
    const validation = validateTimelineConfig(timeline);
    if (!validation.valid) {
      throw new Error(`Timeline validation failed:\n${validation.errors.join('\n')}`);
    }
    
    // Show warnings
    validation.warnings.forEach(warning => {
      console.log(`   ⚠️  ${warning}`);
    });
    
    console.log(`\n🎬 Building Timeline with ${timeline.segments.length} segments\n`);
    
    debug.log('TIMELINE', 'Starting timeline build', {
      totalSegments: timeline.segments.length,
      segments: timeline.segments.map((s, i) => ({ index: i, type: s.type, name: s.name }))
    });
    
    // Process each segment
    for (let i = 0; i < timeline.segments.length; i++) {
      const segment = timeline.segments[i];
      console.log(`   📹 Segment ${i + 1}/${timeline.segments.length}: ${segment.type} (${segment.name || i.toString().padStart(3, '0')})`);
      
      debug.log('TIMELINE', `Processing segment ${i}`, {
        type: segment.type,
        path: segment.path,
        duration: segment.duration,
        name: segment.name
      });
      
      const processedSegment = await this.processSegment(segment, i, mainContentCallback);
      this.processedSegments.push(processedSegment);
      
      debug.log('TIMELINE', `Segment ${i} processed`, {
        type: processedSegment.type,
        outputPath: processedSegment.path,
        original: processedSegment.original
      });
    }
    
    console.log(`\n✅ All segments processed\n`);
    console.log(`   Total segments ready: ${this.processedSegments.length}\n`);
    
    debug.log('TIMELINE', 'All segments processed', {
      count: this.processedSegments.length,
      paths: this.processedSegments.map(s => s.path)
    });
    
    // Concatenate all segments
    console.log('🔗 Concatenating timeline segments...\n');
    const outputPath = await this.concatenateSegments();
    
    return outputPath;
  }

  /**
   * Process a single segment
   */
  async processSegment(segment, index, mainContentCallback) {
    switch (segment.type) {
      case SEGMENT_TYPES.SCENE:
        return await this.processSceneSegment(segment, index);
      
      case SEGMENT_TYPES.INTRO:
      case SEGMENT_TYPES.OUTRO:
        return await this.processIntroOutroSegment(segment, index);
      
      case SEGMENT_TYPES.MAIN:
        return await this.processMainSegment(segment, index, mainContentCallback);
      
      case SEGMENT_TYPES.PLACEHOLDER:
        return await this.processPlaceholderSegment(segment, index);
      
      default:
        throw new Error(`Unknown segment type: ${segment.type}`);
    }
  }

  /**
   * Process a scene segment (video or image)
   */
  async processSceneSegment(segment, index) {
    const segmentPath = this.resolvePath(segment.path);
    
    if (!fs.existsSync(segmentPath)) {
      throw new Error(`Scene file not found: ${segmentPath}`);
    }
    
    const ext = path.extname(segmentPath).toLowerCase();
    const isVideo = ['.mp4', '.mov', '.avi', '.mkv'].includes(ext);
    const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    
    if (!isVideo && !isImage) {
      throw new Error(`Unsupported scene file type: ${ext}`);
    }
    
    const outputPath = path.join(this.outputFolder, `timeline_segment_${index}.mp4`);
    
    if (isVideo) {
      // Process video scene
      return await this.processVideoScene(segmentPath, outputPath, segment);
    } else {
      // Process image scene
      return await this.processImageScene(segmentPath, outputPath, segment);
    }
  }

  /**
   * Process video scene
   */
  async processVideoScene(inputPath, outputPath, segment) {
    console.log(`      🎬 processVideoScene():`);
    console.log(`         Input: ${path.basename(inputPath)}`);
    if (segment.duration) {
      console.log(`         ✂️  Trimming to: ${segment.duration}s (using -t flag)`);
    } else {
      console.log(`         ℹ️  No trimming (using full input duration)`);
    }
    
    return new Promise((resolve, reject) => {
      const args = ['-i', inputPath];
      
      // Trim to duration if specified
      if (segment.duration) {
        args.push('-t', segment.duration.toString());
      }
      
      // Get target resolution from config
      const videoWidth = this.config.videoWidth || 1920;
      const videoHeight = this.config.videoHeight || 1080;
      console.log(`         Target resolution: ${videoWidth}x${videoHeight} (aspect: ${this.config.aspectRatio || 'unknown'})`);
      
      // Check if should mute original audio (add input BEFORE filters)
      if (segment.mute) {
        // Muted, add silent audio as second input
        args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100');
      }
      
      // Build filter chain
      const filters = [];
      
      // Scale and pad to target resolution
      filters.push(`scale=${videoWidth}:${videoHeight}:force_original_aspect_ratio=decrease,pad=${videoWidth}:${videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1`);
      
      // BAKE transition into this segment (same as standard generation)
      if (segment.transition && segment.transition !== 'none') {
        const transitionDuration = segment.transitionDuration || 0.5;
        
        if (segment.transition === 'fade' || segment.transition === 'fade-black') {
          // Fade in from black at start
          filters.push(`fade=t=in:st=0:d=${transitionDuration}:color=black`);
        }
      }
      
      args.push('-vf', filters.join(','));
      
      // Map streams
      if (segment.mute) {
        args.push('-map', '0:v:0', '-map', '1:a:0', '-shortest');
      }
      
      // Output settings
      args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p');
      
      if (!segment.mute) {
        // Keep original audio but ensure it's properly encoded
        args.push('-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2');
      } else {
        args.push('-c:a', 'aac', '-b:a', '192k');
      }
      
      args.push('-y', outputPath);
      
      const ffmpeg = spawn('ffmpeg', args);
      let errorOutput = '';
      
      ffmpeg.stderr.on('data', data => {
        errorOutput += data.toString();
      });
      
      ffmpeg.on('close', code => {
        if (code !== 0) {
          reject(new Error(`Failed to process video scene: ${errorOutput.substring(errorOutput.length - 500)}`));
        } else {
          debug.log('TIMELINE', 'Video scene processed', { path: outputPath });
          resolve({
            type: 'scene',
            path: outputPath,
            original: inputPath,
            duration: null // Will be detected during concatenation
          });
        }
      });
    });
  }

  /**
   * Process image scene
   */
  async processImageScene(inputPath, outputPath, segment) {
    const duration = segment.duration || 5; // Default 5 seconds
    
    console.log(`      📸 processImageScene():`);
    console.log(`         Duration requested: ${duration}s`);
    
    return new Promise((resolve, reject) => {
      const args = [
        '-loop', '1',
        '-i', inputPath,
        '-t', duration.toString()
      ];
      
      // Add silent audio for concatenation compatibility  
      // Use exact duration for audio to prevent extension (use d= not duration=)
      args.push('-f', 'lavfi', '-i', `anullsrc=channel_layout=stereo:sample_rate=44100:d=${duration}`);
      
      // Get target resolution from config
      const videoWidth = this.config.videoWidth || 1920;
      const videoHeight = this.config.videoHeight || 1080;
      console.log(`         Target resolution: ${videoWidth}x${videoHeight} (aspect: ${this.config.aspectRatio || 'unknown'})`);
      
      // Build filter chain
      const filters = [];
      
      // Scale and pad to target resolution
      filters.push(`scale=${videoWidth}:${videoHeight}:force_original_aspect_ratio=decrease,pad=${videoWidth}:${videoHeight}:(ow-iw)/2:(oh-ih)/2,setsar=1`);
      
      // BAKE transition into this segment (same as standard generation)
      if (segment.transition && segment.transition !== 'none') {
        const transitionDuration = segment.transitionDuration || 0.5;
        
        if (segment.transition === 'fade' || segment.transition === 'fade-black') {
          // Fade in from black at start
          filters.push(`fade=t=in:st=0:d=${transitionDuration}:color=black`);
        }
      }
      
      args.push(
        '-vf', filters.join(','),
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-t', duration.toString(),  // Explicitly set output duration instead of relying on -shortest
        '-y', outputPath
      );
      
      const ffmpeg = spawn('ffmpeg', args);
      let errorOutput = '';
      
      ffmpeg.stderr.on('data', data => {
        errorOutput += data.toString();
      });
      
      ffmpeg.on('close', code => {
        if (code !== 0) {
          reject(new Error(`Failed to process image scene: ${errorOutput.substring(errorOutput.length - 500)}`));
        } else {
          debug.log('TIMELINE', 'Image scene processed', { path: outputPath, duration });
          resolve({
            type: 'scene',
            path: outputPath,
            original: inputPath,
            duration
          });
        }
      });
    });
  }

  /**
   * Process intro/outro segment
   */
  async processIntroOutroSegment(segment, index) {
    const segmentPath = this.resolvePath(segment.path);
    
    console.log(`      ${segment.type} path: ${segmentPath}`);
    
    if (!fs.existsSync(segmentPath)) {
      console.error(`      ❌ ${segment.type} file not found: ${segmentPath}`);
      throw new Error(`${segment.type} file not found: ${segmentPath}`);
    }
    
    // Check if timeline has audio config - if yes, mute intro/outro
    const hasTimelineAudio = this.timeline.audio && (this.timeline.audio.voice || this.timeline.audio.music);
    const processSegment = { ...segment };
    
    if (hasTimelineAudio) {
      // Timeline will handle audio globally - mute this segment
      processSegment.mute = true;
      console.log(`      Muting ${segment.type} (timeline has audio config)`);
    }
    
    // Process intro/outro to match target resolution
    const outputPath = path.join(this.outputFolder, `timeline_${segment.type}_${index}.mp4`);
    await this.processVideoScene(segmentPath, outputPath, processSegment);
    
    debug.log('TIMELINE', `${segment.type} segment processed`, { path: outputPath, muted: hasTimelineAudio });
    return {
      type: segment.type,
      path: outputPath,
      original: segmentPath,
      duration: null
    };
  }

  /**
   * Process main content segment
   */
  async processMainSegment(segment, index, mainContentCallback) {
    // Check if specific path is provided
    if (segment.path) {
      console.log('      Using provided main content path...');
      const mainPath = this.resolvePath(segment.path);
      
      if (!fs.existsSync(mainPath)) {
        throw new Error(`Main content file not found: ${mainPath}`);
      }
      
      // Check if it's video or image
      const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mainPath);
      const outputPath = path.join(this.outputFolder, `timeline_main_${index}.mp4`);
      
      if (isVideo) {
        // Process as video scene
        return await this.processVideoScene(mainPath, outputPath, segment);
      } else {
        // Process as image scene
        return await this.processImageScene(mainPath, outputPath, segment);
      }
    } else {
      // Generate from random images - calculate duration from audio if timeline has audio config
      console.log('      Generating main content from random images...');
      
      if (!mainContentCallback) {
        throw new Error('Main content callback not provided and no path specified');
      }
      
      // Calculate main duration from audio if timeline audio is configured
      let calculatedMainDuration = null;
      const hasTimelineAudio = this.timeline.audio && (this.timeline.audio.voice || this.timeline.audio.music);
      
      if (hasTimelineAudio && !segment.duration) {
        calculatedMainDuration = await this.calculateMainDuration(index);
        console.log(`      Calculated main duration: ${calculatedMainDuration.toFixed(1)}s (from audio length)`);
      }
      
      // Call the main content generation (existing video generation logic)
      // Pass calculated duration through CONFIG if needed
      const mainVideoPath = await mainContentCallback(calculatedMainDuration);
      
      if (!fs.existsSync(mainVideoPath)) {
        throw new Error('Main content generation failed');
      }
      
      // Process main video to normalize resolution
      console.log('      Normalizing main content...');
      const outputPath = path.join(this.outputFolder, `timeline_main_${index}.mp4`);
      
      const shouldMuteMain = hasTimelineAudio;
      
      if (shouldMuteMain) {
        console.log('      Muting main (timeline has audio config)');
      }
      
      // Trim to calculated duration if specified
      const segmentForProcessing = { mute: shouldMuteMain };
      if (calculatedMainDuration) {
        segmentForProcessing.duration = calculatedMainDuration;
      }
      
      await this.processVideoScene(mainVideoPath, outputPath, segmentForProcessing);
      
      debug.log('TIMELINE', 'Main content processed', { path: outputPath, calculatedDuration: calculatedMainDuration });
      return {
        type: 'main',
        path: outputPath,
        original: mainVideoPath,
        duration: calculatedMainDuration
      };
    }
  }

  /**
   * Calculate main duration based on voice/audio length
   * Logic: Voice must play completely. Main fills the gap between segments that play during voice time.
   */
  async calculateMainDuration(mainIndex) {
    const audioConfig = this.timeline.audio;
    
    // Get voice duration (voice is primary, must play completely)
    let voiceDuration = 0;
    
    if (audioConfig.voice) {
      const voicePath = this.resolvePath(audioConfig.voice.path);
      if (fs.existsSync(voicePath)) {
        voiceDuration = await this.getAudioDuration(voicePath);
        console.log(`      Voice duration: ${voiceDuration.toFixed(1)}s`);
      }
    }
    
    if (voiceDuration === 0) {
      // Fallback to music if no voice
      if (audioConfig.music) {
        const musicPath = this.resolvePath(audioConfig.music.path);
        if (fs.existsSync(musicPath)) {
          voiceDuration = await this.getAudioDuration(musicPath);
          console.log(`      Music duration: ${voiceDuration.toFixed(1)}s (no voice, using music)`);
        }
      }
    }
    
    if (voiceDuration === 0) {
      throw new Error('No audio found to calculate main duration');
    }
    
    // Find when voice starts
    let voiceStartTime = 0;
    const startAtMarker = audioConfig.voice?.startAt || audioConfig.music?.startAt;
    
    // Find the index where voice starts
    let voiceStartIndex = 0;
    if (startAtMarker) {
      for (let i = 0; i < this.timeline.segments.length; i++) {
        const seg = this.timeline.segments[i];
        if (seg.name === startAtMarker || seg.type === startAtMarker) {
          voiceStartIndex = i;
          console.log(`      Voice starts at: segment "${seg.name || seg.type}" (index ${i})`);
          break;
        }
      }
    } else {
      console.log(`      Voice starts at: 0.0s (beginning)`);
    }
    
    // Calculate duration of segments that occur DURING voice time (from voice start to voice end)
    // These segments eat into the voice duration, so main fills the remaining time
    let segmentsDuringVoice = 0;
    
    for (let i = 0; i < this.timeline.segments.length; i++) {
      const seg = this.timeline.segments[i];
      
      // Skip main segment (that's what we're calculating)
      if (i === mainIndex || seg.type === 'main') {
        continue;
      }
      
      // Check if this segment is before voice starts
      if (i < voiceStartIndex) {
        // Segment is before voice starts, don't count it
        console.log(`      Segment "${seg.name || seg.type}" (index ${i}): BEFORE voice (skipped)`);
        continue;
      }
      
      // This segment is AT or AFTER voice start, so it's during voice time
      if (seg.duration) {
        segmentsDuringVoice += seg.duration;
        console.log(`      Segment "${seg.name || seg.type}" (index ${i}): ${seg.duration}s (during voice)`);
      } else {
        console.log(`      Segment "${seg.name || seg.type}" (index ${i}): NO DURATION in config (skipped)`);
      }
    }
    
    console.log(`      ─────────────────────────────────────────`);
    console.log(`      Total segments during voice: ${segmentsDuringVoice.toFixed(1)}s`);
    console.log(`      Voice needs: ${voiceDuration.toFixed(1)}s`);
    console.log(`      ─────────────────────────────────────────`);
    
    // Calculate main duration to fill the voice time
    // Main duration = voice duration - segments that play during voice
    const mainDuration = voiceDuration - segmentsDuringVoice;
    
    console.log(`      ✅ CALCULATION: ${voiceDuration.toFixed(1)}s - ${segmentsDuringVoice.toFixed(1)}s = ${mainDuration.toFixed(1)}s`);
    console.log(`      ✅ Main duration to return: ${mainDuration.toFixed(1)}s`);
    console.log(`      ─────────────────────────────────────────\n`);
    
    if (mainDuration <= 0) {
      console.warn(`      ⚠️  Calculated main duration is ${mainDuration.toFixed(1)}s`);
      console.warn(`      ⚠️  Voice (${voiceDuration.toFixed(1)}s) is shorter than segments (${segmentsDuringVoice.toFixed(1)}s)`);
      console.warn(`      ⚠️  Using minimum 1s for main, voice will play completely, video will extend beyond voice`);
      return 1;
    }
    
    return mainDuration;
  }

  /**
   * Get audio duration using ffprobe
   */
  async getAudioDuration(audioPath) {
    return new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        audioPath
      ]);
      
      let output = '';
      ffprobe.stdout.on('data', data => {
        output += data.toString();
      });
      
      ffprobe.on('close', code => {
        if (code === 0 && output.trim()) {
          const duration = parseFloat(output.trim());
          resolve(duration);
        } else {
          reject(new Error(`Failed to get audio duration for ${audioPath}`));
        }
      });
    });
  }

  /**
   * Process placeholder segment
   */
  async processPlaceholderSegment(segment, index) {
    // Create a blank video placeholder
    const duration = segment.duration || 3;
    const outputPath = path.join(this.outputFolder, `timeline_placeholder_${index}.mp4`);
    
    return new Promise((resolve, reject) => {
      const args = [
        '-f', 'lavfi',
        '-i', 'color=c=black:s=1920x1080',
        '-t', duration.toString(),
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-y', outputPath
      ];
      
      const ffmpeg = spawn('ffmpeg', args);
      
      ffmpeg.on('close', code => {
        if (code !== 0) {
          reject(new Error('Failed to create placeholder'));
        } else {
          resolve({
            type: 'placeholder',
            path: outputPath,
            duration
          });
        }
      });
    });
  }

  /**
   * Concatenate processed segments
   * Transitions are already baked into segments, so we just concat
   */
  async concatenateSegments() {
    const outputPath = path.join(this.outputFolder, 'timeline_output.mp4');
    
    // Check if timeline has audio configuration
    const hasTimelineAudio = this.timeline.audio && (this.timeline.audio.voice || this.timeline.audio.music);
    
    // If we need timeline audio, calculate segment timings BEFORE concatenation
    // (so files aren't cleaned up yet)
    let segmentTimings = null;
    if (hasTimelineAudio) {
      console.log('   📊 Calculating segment timings...\n');
      segmentTimings = await this.calculateSegmentTimings();
      debug.log('TIMELINE', 'Segment timings calculated', segmentTimings);
    }
    
    // Always use simple concat - transitions are baked into segments
    const videoPath = await this.concatenateSimple(outputPath);
    
    if (hasTimelineAudio) {
      console.log('\n🎵 Applying timeline audio...\n');
      return await this.applyTimelineAudio(videoPath, segmentTimings, this.subtitlePath);
    }
    
    return videoPath;
  }

  /**
   * Simple concatenation without transitions (fast copy - segments already normalized)
   */
  async concatenateSimple(outputPath) {
    console.log('   Using fast concatenation...\n');
    
    const concatListPath = path.join(this.outputFolder, 'timeline_concat_list.txt');
    const concatList = this.processedSegments
      .map(seg => `file '${path.basename(seg.path)}'`)
      .join('\n');
    
    console.log(`   📝 Concat list (${this.processedSegments.length} files):`);
    this.processedSegments.forEach((seg, i) => {
      console.log(`      ${i + 1}. ${seg.type}: ${path.basename(seg.path)}`);
    });
    console.log('');
    
    fs.writeFileSync(concatListPath, concatList);
    debug.addTempFile(concatListPath, 'Timeline concat list');
    
    debug.log('TIMELINE', 'Concatenation list created', {
      files: this.processedSegments.map(s => s.path),
      listContent: concatList
    });
    
    return new Promise((resolve, reject) => {
      const args = [
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath,
        '-c', 'copy',  // Fast copy - no re-encoding needed
        '-y', outputPath
      ];
      
      const ffmpeg = spawn('ffmpeg', args);
      let errorOutput = '';
      
      ffmpeg.stderr.on('data', data => {
        errorOutput += data.toString();
      });
      
      ffmpeg.on('close', code => {
        if (code !== 0) {
          console.error('❌ FFmpeg concatenation failed');
          console.error('Error:', errorOutput.substring(errorOutput.length - 1000));
          debug.log('TIMELINE', 'Concatenation failed', { error: errorOutput });
          reject(new Error(`Timeline concatenation failed: ${errorOutput.substring(errorOutput.length - 500)}`));
          return;
        }
        
        console.log('✅ Timeline video created successfully\n');
        console.log(`   Output: ${path.basename(outputPath)}\n`);
        
        debug.log('TIMELINE', 'Concatenation successful', {
          output: outputPath,
          segmentCount: this.processedSegments.length
        });
        
        // Cleanup temp files
        if (!debug.shouldPreserveTempFiles()) {
          this.processedSegments.forEach(seg => {
            if (seg.type !== 'intro' && seg.type !== 'outro' && fs.existsSync(seg.path)) {
              fs.unlinkSync(seg.path);
            }
          });
          if (fs.existsSync(concatListPath)) {
            fs.unlinkSync(concatListPath);
          }
        } else {
          this.processedSegments.forEach((seg, i) => {
            debug.addTempFile(seg.path, `Timeline segment ${i + 1} (${seg.type})`);
          });
        }
        
        resolve(outputPath);
      });
    });
  }


  /**
   * Apply timeline-level audio (voice + music) with markers and subtitles
   */
  async applyTimelineAudio(videoPath, segmentTimings, subtitlePath = null) {
    const audioConfig = this.timeline.audio;
    
    console.log('   📊 Segment timings:');
    segmentTimings.forEach(seg => {
      console.log(`      ${seg.name || seg.type}: ${seg.start.toFixed(1)}s - ${seg.end.toFixed(1)}s (${seg.duration.toFixed(1)}s)`);
    });
    console.log('');
    
    // Prepare audio sources
    const audioInputs = [];
    const filterParts = [];
    let inputIndex = 0;
    
    // Get total video duration (needed for trimming audio)
    const totalVideoDuration = segmentTimings[segmentTimings.length - 1].end;
    
    // Input 0: video (silent)
    audioInputs.push('-i', videoPath);
    
    // Voice track
    let voiceStartTime = 0;
    if (audioConfig.voice) {
      const voicePath = this.resolvePath(audioConfig.voice.path);
      if (!fs.existsSync(voicePath)) {
        throw new Error(`Voice file not found: ${voicePath}`);
      }
      
      audioInputs.push('-i', voicePath);
      inputIndex++;
      
      // Calculate start time from marker
      if (audioConfig.voice.startAt) {
        const marker = segmentTimings.find(s => s.name === audioConfig.voice.startAt);
        if (marker) {
          voiceStartTime = marker.start;
          console.log(`   🎤 Voice starts at: ${voiceStartTime.toFixed(1)}s (${audioConfig.voice.startAt})`);
        }
      } else {
        console.log(`   🎤 Voice starts at: 0.0s (beginning)`);
      }
      
      // Calculate max voice duration (from start to video end)
      const maxVoiceDuration = totalVideoDuration - voiceStartTime;
      
      // Trim voice to video duration and delay to start at marker
      let voiceFilter = `[${inputIndex}:a]`;
      voiceFilter += `atrim=0:${maxVoiceDuration},`;  // Trim first
      voiceFilter += `adelay=${Math.floor(voiceStartTime * 1000)}|${Math.floor(voiceStartTime * 1000)}[voice]`;  // Then delay
      
      filterParts.push(voiceFilter);
      console.log(`   🎤 Voice trimmed to: ${maxVoiceDuration.toFixed(1)}s (max duration from start to video end)`);
    }
    
    // Music track
    let musicStartTime = 0;
    let musicStopTime = null;
    if (audioConfig.music) {
      const musicPath = this.resolvePath(audioConfig.music.path);
      if (!fs.existsSync(musicPath)) {
        throw new Error(`Music file not found: ${musicPath}`);
      }
      
      audioInputs.push('-i', musicPath);
      inputIndex++;
      
      const volume = audioConfig.music.volume || 0.25;
      
      // Calculate start time from marker
      if (audioConfig.music.startAt) {
        const marker = segmentTimings.find(s => s.name === audioConfig.music.startAt);
        if (marker) {
          musicStartTime = marker.start;
          console.log(`   🎵 Music starts at: ${musicStartTime.toFixed(1)}s (${audioConfig.music.startAt})`);
        }
      }
      
      // Calculate stop time from marker
      // stopAt means "play through this segment" (stop at END of segment, not start)
      if (audioConfig.music.stopAt) {
        const marker = segmentTimings.find(s => s.name === audioConfig.music.stopAt || s.type === audioConfig.music.stopAt);
        if (marker) {
          musicStopTime = marker.end;  // Use END of segment, not start
          console.log(`   🎵 Music stops at: ${musicStopTime.toFixed(1)}s (end of ${audioConfig.music.stopAt})`);
        }
      } else {
        // No stopAt specified - play until end of video
        musicStopTime = totalVideoDuration;
        console.log(`   🎵 Music plays until end of video (${totalVideoDuration.toFixed(1)}s)`);
      }
      
      // Apply volume, delay, and trim
      let musicFilter = `[${inputIndex}:a]volume=${volume}`;
      
      // ALWAYS trim music to prevent extending video beyond calculated duration
      const musicDuration = musicStopTime - musicStartTime;
      musicFilter += `,atrim=0:${musicDuration}`;
      console.log(`   🎵 Music trimmed to: ${musicDuration.toFixed(1)}s (from ${musicStartTime.toFixed(1)}s to ${musicStopTime.toFixed(1)}s)`);
      
      // Delay music to start at marker
      musicFilter += `,adelay=${Math.floor(musicStartTime * 1000)}|${Math.floor(musicStartTime * 1000)}[music]`;
      
      filterParts.push(musicFilter);
    }
    
    // Mix audio tracks
    const audioTracks = [];
    if (audioConfig.voice) audioTracks.push('[voice]');
    if (audioConfig.music) audioTracks.push('[music]');
    
    if (audioTracks.length > 1) {
      // Mix and pad to video duration
      filterParts.push(`${audioTracks.join('')}amix=inputs=${audioTracks.length}:duration=longest,apad=whole_dur=${totalVideoDuration}[aout]`);
    } else if (audioTracks.length === 1) {
      // Pad to video duration
      filterParts.push(`${audioTracks[0]}apad=whole_dur=${totalVideoDuration}[aout]`);
    }
    
    const outputPath = path.join(this.outputFolder, 'timeline_with_audio.mp4');
    
    console.log(`   📏 Total video duration: ${totalVideoDuration.toFixed(1)}s\n`);
    
    // Calculate voice start offset for subtitles
    const voiceStartMarker = audioConfig.voice?.startAt;
    let subtitleOffset = 0;
    if (voiceStartMarker) {
      const marker = segmentTimings.find(s => s.name === voiceStartMarker || s.type === voiceStartMarker);
      if (marker) {
        subtitleOffset = marker.start;
        console.log(`   📝 Subtitle offset: ${subtitleOffset.toFixed(1)}s (synced with voice start at ${voiceStartMarker})\n`);
      }
    }
    
    return new Promise((resolve, reject) => {
      const args = [
        ...audioInputs,
        '-filter_complex', filterParts.join(';'),
        '-map', '0:v',
        '-map', '[aout]',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        // Don't use -shortest, let video play to end
        '-y', outputPath
      ];
      
      // Add subtitles if provided
      if (subtitlePath && fs.existsSync(subtitlePath)) {
        console.log(`   📝 Adding subtitles (synced with voice at ${subtitleOffset.toFixed(1)}s)\n`);
        
        // Need to re-encode video to burn in subtitles
        const outputWithSubtitles = path.join(this.outputFolder, 'timeline_final.mp4');
        
        // First, mix audio (original command)
        const ffmpegAudio = spawn('ffmpeg', args);
        let errorOutput = '';
        
        ffmpegAudio.stderr.on('data', data => {
          errorOutput += data.toString();
        });
        
        ffmpegAudio.on('close', code => {
          if (code !== 0) {
            console.error('❌ Timeline audio mixing failed');
            console.error('Error:', errorOutput.substring(errorOutput.length - 1000));
            reject(new Error(`Timeline audio mixing failed: ${errorOutput.substring(errorOutput.length - 500)}`));
            return;
          }
          
          console.log('✅ Timeline audio applied successfully\n');
          console.log('   📝 Burning in subtitles...\n');
          
          // Now add subtitles - they should already have correct timing from SRT
          const subtitleFilter = `subtitles=${subtitlePath.replace(/\\/g, '/').replace(/:/g, '\\\\:')}:force_style='Alignment=2,MarginV=60'`;
          
          const argsSubtitles = [
            '-i', outputPath,
            '-vf', subtitleFilter,
            '-c:a', 'copy',
            '-y', outputWithSubtitles
          ];
          
          const ffmpegSubtitles = spawn('ffmpeg', argsSubtitles);
          let subErrorOutput = '';
          
          ffmpegSubtitles.stderr.on('data', data => {
            subErrorOutput += data.toString();
          });
          
          ffmpegSubtitles.on('close', code => {
            if (code !== 0) {
              console.error('❌ Subtitle application failed');
              console.error('Error:', subErrorOutput.substring(subErrorOutput.length - 1000));
              reject(new Error(`Subtitle application failed: ${subErrorOutput.substring(subErrorOutput.length - 500)}`));
            } else {
              console.log('✅ Subtitles applied successfully\n');
              resolve(outputWithSubtitles);
            }
          });
        });
        
        return;
      }
      
      debug.log('TIMELINE', 'Audio mixing command', { args: args.join(' ') });
      
      const ffmpeg = spawn('ffmpeg', args);
      let errorOutput = '';
      
      ffmpeg.stderr.on('data', data => {
        errorOutput += data.toString();
      });
      
      ffmpeg.on('close', code => {
        if (code !== 0) {
          console.error('❌ Timeline audio mixing failed');
          console.error('Error:', errorOutput.substring(errorOutput.length - 1000));
          reject(new Error(`Timeline audio mixing failed: ${errorOutput.substring(errorOutput.length - 500)}`));
        } else {
          console.log('✅ Timeline audio applied successfully\n');
          resolve(outputPath);
        }
      });
    });
  }

  /**
   * Calculate timing for each segment in the timeline
   */
  async calculateSegmentTimings() {
    console.log(`\n   🔍 Calculating segment timings from actual files...\n`);
    
    const timings = [];
    let currentTime = 0;
    
    for (let i = 0; i < this.processedSegments.length; i++) {
      const segment = this.processedSegments[i];
      const segmentConfig = this.timeline.segments[i];
      
      // Get duration from ffprobe
      console.log(`      Segment ${i}: ${path.basename(segment.path)}`);
      const duration = await this.getVideoDuration(segment.path);
      console.log(`         ffprobe duration: ${duration.toFixed(2)}s`);
      console.log(`         Timing: ${currentTime.toFixed(1)}s → ${(currentTime + duration).toFixed(1)}s\n`);
      
      timings.push({
        index: i,
        type: segment.type,
        name: segmentConfig.name || segmentConfig.type,
        start: currentTime,
        end: currentTime + duration,
        duration: duration
      });
      
      currentTime += duration;
    }
    
    console.log(`   ✅ Total calculated video duration: ${currentTime.toFixed(2)}s\n`);
    
    return timings;
  }

  /**
   * Get video duration using ffprobe
   */
  async getVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
      // Check if file exists
      if (!fs.existsSync(videoPath)) {
        reject(new Error(`Video file not found: ${videoPath}`));
        return;
      }
      
      const ffprobe = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        videoPath
      ]);
      
      let output = '';
      let errorOutput = '';
      
      ffprobe.stdout.on('data', data => {
        output += data.toString();
      });
      
      ffprobe.stderr.on('data', data => {
        errorOutput += data.toString();
      });
      
      ffprobe.on('close', code => {
        if (code === 0 && output.trim()) {
          const duration = parseFloat(output.trim());
          if (isNaN(duration)) {
            reject(new Error(`Invalid duration from ffprobe for ${videoPath}: ${output}`));
          } else {
            resolve(duration);
          }
        } else {
          console.error(`❌ ffprobe failed for: ${path.basename(videoPath)}`);
          console.error(`   Exit code: ${code}`);
          console.error(`   Output: ${output}`);
          console.error(`   Error: ${errorOutput}`);
          reject(new Error(`Failed to get duration for ${videoPath}: ${errorOutput || 'Unknown error'}`));
        }
      });
      
      ffprobe.on('error', err => {
        reject(new Error(`Failed to spawn ffprobe: ${err.message}`));
      });
    });
  }

  /**
   * Resolve file path (relative to project or absolute)
   */
  resolvePath(filePath) {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    
    // Try project path first
    const projectRelative = path.join(this.projectPath, filePath);
    if (fs.existsSync(projectRelative)) {
      return projectRelative;
    }
    
    // Try as is
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    
    // Return project relative (will fail validation if doesn't exist)
    return projectRelative;
  }
}

/**
 * Create and build timeline
 */
export async function buildTimeline(timeline, mainContentCallback, projectPath, outputFolder, config = {}, subtitlePath = null) {
  const builder = new TimelineBuilder(config, projectPath, outputFolder);
  builder.subtitlePath = subtitlePath;
  return await builder.build(timeline, mainContentCallback);
}
