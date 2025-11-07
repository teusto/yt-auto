import fs from 'fs';

/**
 * Split subtitle text into max N lines with intelligent word wrapping
 * @param {string} text - The subtitle text to split
 * @param {number} maxLines - Maximum number of lines (default: 2)
 * @param {number} maxCharsPerLine - Approximate max characters per line (default: 42)
 * @param {number} videoWidth - Video width in pixels (for adaptive sizing)
 * @param {number} fontSize - Font size (for adaptive sizing)
 * @returns {string} - Text with line breaks
 */
function splitSubtitleLines(text, maxLines = 2, maxCharsPerLine = 42, videoWidth = 1920, fontSize = 24) {
  // Adaptive character limit based on video width and font size
  // For narrow videos (9:16) or large fonts, reduce char limit AGGRESSIVELY
  // ASS renderer needs more safety buffer than expected
  
  // Base calculation with conservative multiplier
  // Use 0.40 for narrow videos (9:16), 0.48 for wider videos (16:9)
  const aspectRatio = videoWidth / 1920; // Relative to standard HD width
  const multiplier = aspectRatio < 0.7 ? 0.40 : 0.48; // More conservative for narrow videos
  
  const widthBasedChars = (videoWidth / fontSize) * multiplier;
  const effectiveMaxChars = Math.floor(Math.max(18, Math.min(widthBasedChars, maxCharsPerLine)));
  // Remove existing line breaks and clean up
  const cleanText = text.replace(/\\N/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  // If text is already short enough, return as-is
  if (cleanText.length <= effectiveMaxChars) {
    return cleanText;
  }
  
  // Split into words
  const words = cleanText.split(' ');
  
  if (maxLines === 1) {
    // Single line - truncate if too long
    if (cleanText.length > effectiveMaxChars) {
      return cleanText.substring(0, effectiveMaxChars - 3) + '...';
    }
    return cleanText;
  }
  
  // For 2 lines, try to split evenly
  if (maxLines === 2) {
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      // If we're on first line and it would be too long, start second line
      if (lines.length === 0 && testLine.length > effectiveMaxChars) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Single word is too long, split it anyway
          lines.push(word);
          currentLine = '';
        }
      }
      // If we're on second line and it would be too long, stop adding words
      else if (lines.length === 1 && testLine.length > effectiveMaxChars) {
        // Add current line and stop - remaining words are truncated
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = '';
        break;
      }
      else {
        currentLine = testLine;
      }
    }
    
    // Add the last line if we have one and haven't exceeded max lines
    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }
    
    // If we still only have one line but many words, force a split
    if (lines.length === 1 && words.length > 8) {
      const halfPoint = Math.ceil(words.length / 2);
      const line1 = words.slice(0, halfPoint).join(' ');
      const line2 = words.slice(halfPoint).join(' ');
      
      // If second line is still too long, truncate it
      if (line2.length > effectiveMaxChars * 1.2) {
        const truncatedLine2 = line2.substring(0, effectiveMaxChars);
        return `${line1}\\N${truncatedLine2}`;
      }
      
      return `${line1}\\N${line2}`;
    }
    
    // Ensure we never return more than 2 lines
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\\N');
    }
    
    return lines.join('\\N');
  }
  
  // For more than 2 lines (shouldn't happen with default config)
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length > effectiveMaxChars) {
      if (currentLine) {
        lines.push(currentLine);
      }
      if (lines.length >= maxLines) {
        break;
      }
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  
  // Enforce max lines limit strictly
  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join('\\N');
  }
  
  return lines.join('\\N');
}

/**
 * Convert SRT to ASS format with proper style definitions
 * This version is dependency-injected: caller provides dimensions and color converter.
 */
export function convertSRTtoASS(srtPath, style, videoWidth, videoHeight, colorToASS, words, maxLines) {
  const assPath = srtPath.replace('.srt', '.ass');

  try {
    if (!fs.existsSync(srtPath)) {
      throw new Error(`SRT not found: ${srtPath}`);
    }

    const srtContent = fs.readFileSync(srtPath, 'utf-8');
    const srtBlocks = srtContent.split(/\n\n+/).filter(Boolean);

    const subtitles = [];

    for (const block of srtBlocks) {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        const timeLine = lines[1];
        // Join all text lines and aggressively remove line breaks
        const text = lines.slice(2).join(' ').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();

        // 00:00:01,000 --> 00:00:03,000
        const [start, end] = timeLine.split('-->').map(s => s.trim());

        const formatTime = (timeStr) => {
          const [hms, ms] = timeStr.split(',');
          const parts = hms.split(':');
          return `${parts[0]}:${parts[1]}:${parts[2]}.${ms.substring(0, 2)}`;
        };

        const timeToMs = (timeStr) => {
          const [hms, ms] = timeStr.split(',');
          const [h, m, s] = hms.split(':').map(Number);
          return (h * 3600 + m * 60 + s) * 1000 + parseInt(ms);
        };

        subtitles.push({
          start: formatTime(start),
          end: formatTime(end),
          startMs: timeToMs(start),
          endMs: timeToMs(end),
          text
        });
      }
    }

    // Determine alignment and margins
    let alignment, marginV;
    if (style.alignment === 5) {
      alignment = 5;
      marginV = 0;
    } else if (style.alignment === 8) {
      alignment = 8;
      marginV = style.marginV;
    } else {
      alignment = 2;
      marginV = style.marginV;
    }

    // Colors
    const primaryColor = colorToASS(style.fontColor);
    const outlineColor = colorToASS(style.outlineColor);
    
    // For karaoke effect, use gray as secondary color so words appear to "light up"
    // Otherwise both colors are the same (no visible effect)
    const secondaryColor = style.animationStyle === 'karaoke' 
      ? '&H00808080'  // Gray color for unsung words
      : primaryColor; // Same as primary for standard subtitles
    
    // Shadow settings
    const shadowDepth = style.shadowDepth || 0;
    const shadowColor = style.shadowColor ? colorToASS(style.shadowColor) : '&H00000000';

    let assContent = `[Script Info]\n` +
      `Title: Generated by YT-Machine\n` +
      `ScriptType: v4.00+\n` +
      `PlayResX: ${videoWidth}\n` +
      `PlayResY: ${videoHeight}\n\n` +
      `[V4+ Styles]\n` +
      `Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n` +
      `Style: Default,${style.fontFamily},${style.fontSize},${primaryColor},${secondaryColor},${outlineColor},${shadowColor},${style.bold ? -1 : 0},${style.italic ? -1 : 0},0,0,100,100,0,0,1,${style.outlineWidth},${shadowDepth},${alignment},0,0,${marginV},1\n\n` +
      `[Events]\n` +
      `Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;

    // Apply max lines limit to subtitles
    const effectiveMaxLines = maxLines || 2; // Default to 2 lines if not specified
    let violationCount = 0; // Track subtitles that would exceed max lines
    
    if (style.animationStyle === 'karaoke' && words && words.length > 0) {
      // Karaoke style with word-level timestamps
      console.log(`   🎤 Generating karaoke subtitles with ${words.length} word timestamps`);
      for (const sub of subtitles) {
        // Filter words that overlap with this subtitle's time range
        // Include words that start before subtitle ends AND end after subtitle starts
        // Add small buffer (50ms) to catch words at boundaries
        const subWords = words.filter(w => 
          w.start < sub.endMs + 50 && w.end > sub.startMs - 50
        );
        
        if (subWords.length > 0) {
          let line = '';
          for (let i = 0; i < subWords.length; i++) {
            const word = subWords[i];
            const nextWord = subWords[i + 1];
            // Duration in centiseconds (1/100th of a second)
            const duration = nextWord ? (nextWord.start - word.start) / 10 : (word.end - word.start) / 10;
            // Use \kf for fill effect (more visible than \k)
            line += `{\\kf${Math.round(duration)}}${word.text} `;
          }
          // Apply line limiting even to karaoke
          const processedText = splitSubtitleLines(line.trim(), effectiveMaxLines, 42, videoWidth, style.fontSize);
          assContent += `Dialogue: 0,${sub.start},${sub.end},Default,,0,0,0,,${processedText}\n`;
        } else {
          // Fallback to full text if no words matched
          const processedText = splitSubtitleLines(sub.text, effectiveMaxLines, 42, videoWidth, style.fontSize);
          assContent += `Dialogue: 0,${sub.start},${sub.end},Default,,0,0,0,,${processedText}\n`;
        }
      }
    } else {
      // Standard line-by-line subtitles with line limiting
      for (const sub of subtitles) {
        const originalLineCount = sub.text.split(/\\N|\n/).length;
        let processedText = splitSubtitleLines(sub.text, effectiveMaxLines, 42, videoWidth, style.fontSize);
        let finalLineCount = processedText.split('\\N').length;
        
        // SAFETY CHECK: If we still have more than max lines, force truncate
        if (finalLineCount > effectiveMaxLines) {
          const lines = processedText.split('\\N').slice(0, effectiveMaxLines);
          processedText = lines.join('\\N');
          finalLineCount = lines.length;
          violationCount++;
          if (violationCount <= 3) {
            console.log(`   🔧 Force-truncated subtitle: "${sub.text.substring(0, 40)}..." (${originalLineCount} → ${finalLineCount} lines)`);
          }
        }
        // Track if we had to truncate
        else if (originalLineCount > effectiveMaxLines) {
          violationCount++;
          if (violationCount <= 3) {
            // Show first few violations for debugging
            console.log(`   ⚠️  Subtitle trimmed: "${sub.text.substring(0, 40)}..." (${originalLineCount} → ${finalLineCount} lines)`);
          }
        }
        
        assContent += `Dialogue: 0,${sub.start},${sub.end},Default,,0,0,0,,${processedText}\n`;
      }
    }
    
    if (effectiveMaxLines < 3) {
      // Calculate the adaptive char limit for display (matching the actual formula)
      const aspectRatio = videoWidth / 1920;
      const multiplier = aspectRatio < 0.7 ? 0.40 : 0.48;
      const adaptiveLimit = Math.floor((videoWidth / style.fontSize) * multiplier);
      console.log(`   📏 Limited subtitles to max ${effectiveMaxLines} line(s) for better readability`);
      console.log(`   📐 Video: ${videoWidth}x${videoHeight}, Font: ${style.fontSize}px → ${adaptiveLimit} chars/line (${aspectRatio < 0.7 ? 'narrow' : 'wide'} mode)`);
      if (violationCount > 0) {
        console.log(`   📊 Processed ${violationCount} subtitle(s) that exceeded ${effectiveMaxLines} lines`);
      }
    }

    fs.writeFileSync(assPath, assContent, 'utf-8');

    if (!fs.existsSync(assPath)) {
      throw new Error('ASS file was not created');
    }

    return assPath;
  } catch (error) {
    console.error(`   ⚠️  Failed to convert SRT to ASS: ${error.message}`);
    console.error(`   ⚠️  Stack: ${error.stack}`);
    return null;
  }
}
