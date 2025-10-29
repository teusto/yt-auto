# 📝 How to Format SSML for CSV

## 🎯 Quick Steps

### 1. Save Your SSML to a File

Save your full SSML (the one you sent) to:
```
channels/unwanted-visitors/input-ssml.xml
```

**Make sure to include the entire SSML!** (I only saved a portion as example)

---

### 2. Run the Formatting Script

```bash
cd /home/teusto/yt-machine

# Format the SSML
node format-ssml-for-csv.js \
  channels/unwanted-visitors/input-ssml.xml \
  channels/unwanted-visitors/formatted-ssml.txt
```

**Output:**
```
📖 Reading SSML from: channels/unwanted-visitors/input-ssml.xml
🔧 Formatting SSML for CSV...
✅ Formatted SSML saved to: channels/unwanted-visitors/formatted-ssml.txt
📏 Length: 45230 characters
```

---

### 3. Copy the Formatted SSML

```bash
# View the formatted SSML
cat channels/unwanted-visitors/formatted-ssml.txt

# Or copy to clipboard (if you have xclip)
cat channels/unwanted-visitors/formatted-ssml.txt | xclip -selection clipboard
```

---

### 4. Add to CSV

Open `scripts.csv` and add:

```csv
video_id,script,status
bone-collector-001,"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><prosody rate='slow' pitch='-2st'>What would you do<break time='800ms'/> if you found...</prosody></speak>",pending
```

**⚠️ Important:**
- Wrap entire SSML in double quotes `"`
- SSML uses single quotes `'` (already fixed by script)
- Must be on **ONE LINE** (no line breaks)

---

## 🔧 What the Script Does

**Fixes applied automatically:**

1. ✅ Removes `<?xml version="1.0"?>` declaration
2. ✅ Removes HTML comments `<!-- ... -->`
3. ✅ Changes `"` to `'` in attributes
4. ✅ Removes all line breaks (`\n`)
5. ✅ Removes extra whitespace

**Before (Your SSML):**
```xml
<?xml version="1.0"?>
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">

<!-- Opening Hook -->
<prosody rate="slow" pitch="-2st">
What would you do<break time="800ms"/> if you found...
</prosody>

</speak>
```

**After (CSV-ready):**
```xml
<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><prosody rate='slow' pitch='-2st'>What would you do<break time='800ms'/> if you found...</prosody></speak>
```

---

## 📊 Full CSV Example

```csv
video_id,script,status,voice,language,speaking_rate,pitch,audio_duration,generated_at,notes
bone-collector-001,"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><prosody rate='slow' pitch='-2st'>What would you do<break time='800ms'/> if you found a human skeleton<break time='1s'/> hanging by strings<break time='800ms'/> of human hair?</prosody><break time='1.5s'/><prosody rate='medium' volume='loud'>In nineteen eighty-two,<break time='600ms'/> deep inside an abandoned West Virginia coal mine,<break time='1s'/> they found <emphasis level='strong'>forty-four</emphasis> of them.</prosody></speak>",pending,en-US-GuyNeural,en-US,1.0,0,0,,Full bone collector story
```

---

## ✅ Verification

After adding to CSV, verify:

```bash
# Check the CSV is valid
head -n 2 channels/unwanted-visitors/scripts.csv
```

**Should show:**
- Header row
- Your video row with SSML (wrapped in quotes, no line breaks)

---

## 🚀 Generate the Voice

```bash
npm run tts:generate unwanted-visitors
```

---

## 🎨 Alternative: Manual Formatting

**If script doesn't work, do manually:**

1. **Remove XML declaration:**
   - Delete `<?xml version="1.0"?>`

2. **Remove comments:**
   - Delete all `<!-- ... -->` blocks

3. **Change quotes:**
   - Find: `="`
   - Replace: `='`
   - Find: `"`
   - Replace: `'`

4. **Remove line breaks:**
   - Find: `\n` or newlines
   - Replace: ` ` (single space)

5. **Copy to CSV:**
   - Wrap in double quotes
   - Paste into CSV

---

## 💡 Tips

### Keep Original

Keep `input-ssml.xml` with nice formatting for editing. Use script to generate CSV version when ready.

### Test Short Version First

Before using the full 50k character script, test with a shorter version:

```csv
video_id,script,status
test-001,"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><prosody rate='slow'>Test audio</prosody></speak>",pending
```

### Voice Selection

For horror stories, consider:
- `en-US-GuyNeural` - Deep, authoritative male
- `en-US-DavisNeural` - Calm, narrative male
- `en-US-JasonNeural` - Casual male storyteller
- `en-US-TonyNeural` - News anchor style

Test with:
```bash
npm run tts:voices en-US
```

---

## 📏 Length Warning

Your SSML is **very long** (~50,000 characters). This will generate a **long audio file** (possibly 30-60 minutes).

**Consider splitting into parts:**

```csv
video_id,script,status
bone-collector-part1,"<speak>...first 15 minutes...</speak>",pending
bone-collector-part2,"<speak>...next 15 minutes...</speak>",pending
bone-collector-part3,"<speak>...final part...</speak>",pending
```

---

## ✅ Ready!

1. ✅ Save full SSML to `input-ssml.xml`
2. ✅ Run `node format-ssml-for-csv.js ...`
3. ✅ Copy output to CSV
4. ✅ Generate: `npm run tts:generate`

**Your formatted SSML will be CSV-ready!** 🎉
