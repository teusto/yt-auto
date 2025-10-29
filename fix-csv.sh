#!/bin/bash

# Fix the CSV by using the correct formatted SSML

# Read the formatted SSML (correct version)
SSML=$(cat channels/unwanted-visitors/formatted-ssml.txt)

# Create new CSV with correct data
cat > channels/unwanted-visitors/scripts.csv << 'EOF'
video_id,script,status,voice,language,speaking_rate,pitch,audio_duration,generated_at,notes
EOF

# Add the row with properly escaped SSML
echo "the-bone-collector-of-widows-hollow,\"$SSML\",pending,en-US-GuyNeural,en-US,1.0,0,0,,Full bone collector horror story" >> channels/unwanted-visitors/scripts.csv

echo "✅ CSV fixed!"
echo "   - Removed <voice> wrapper"
echo "   - Used correct SSML with single quotes"
echo "   - Set voice to en-US-GuyNeural (deep male voice for horror)"
