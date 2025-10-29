INPUT FOLDER
============

Place your content files here:

1. MEDIA FILES (required - at least 1 image or video)
   - Images: .jpg, .jpeg, .png, .webp, .gif
   - Videos: .mp4, .mov, .avi, .webm, .mkv, .flv
   - Can mix images AND videos in same project! 
   - All media will be displayed evenly across the audio duration
   - Videos longer than allocated time are trimmed
   - Videos shorter than allocated time are looped
   - Name your files in order (e.g., 01-intro.jpg, 02-action.mp4, 03-outro.jpg)
   - One voiceover audio file
   - Supported formats: .mp3, .wav, .m4a, .aac
   - Can be any name EXCEPT "background_music.mp3"
   - This is your main voice/narration

2. BACKGROUND MUSIC (optional - NEW!)
   - Must be named: background_music.mp3
   - This is a SEPARATE file from your voiceover
   - Will be mixed at 35% volume (65% lower than voiceover)
   - Automatically adapts to voiceover length (loops or trims)
   - Supported formats: .mp3, .wav, .m4a, .aac
   
   IMPORTANT: You need TWO audio files:
   - voiceover.mp3 (or any name except background_music.mp3)
   - background_music.mp3 (for background music)

4. SUBTITLES (optional)
   - Must be named: subtitles.srt
   - Standard SRT format
   - See example_subtitles.srt for format reference

5. DUAL SUBTITLES - LANGUAGE LEARNING (optional - NEW! 🌍)
   - For language teaching videos
   - Create TWO subtitle files:
     * subtitles_target.srt (target language - learning)
     * subtitles_native.srt (native language - translation)
   - Both shown simultaneously on screen
   - See example_subtitles_target.srt and example_subtitles_native.srt
   - Perfect for storytelling-based language teaching!

After adding your files, run:
  npm start

Your video will be generated in the output folder!
