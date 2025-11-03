# 📦 YT-Machine - Installation Guide

**Complete step-by-step installation for beginners**

This guide will walk you through installing YT-Machine on your computer, even if you've never used the terminal before.

---

## 📋 What You'll Need

Before starting, make sure you have:
- A computer (Windows, Mac, or Linux)
- Internet connection
- About 30 minutes

---

## Step 1: Install Node.js

Node.js is the software that runs YT-Machine.

### Windows:

1. **Download Node.js:**
   - Go to https://nodejs.org/
   - Click the big green button that says "Download Node.js (LTS)"
   - Save the file

2. **Install Node.js:**
   - Double-click the downloaded file
   - Click "Next" through all the steps
   - Accept the license agreement
   - Keep all the default options
   - Click "Install"
   - Wait for it to finish
   - Click "Finish"

3. **Verify Installation:**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter
   - In the black window that opens, type:
     ```bash
     node --version
     ```
   - You should see something like `v18.17.0`
   - If you see a version number, Node.js is installed! ✅

### Mac:

1. **Download Node.js:**
   - Go to https://nodejs.org/
   - Click "Download Node.js (LTS)"
   - Save the file

2. **Install Node.js:**
   - Open the downloaded `.pkg` file
   - Click "Continue" through all the steps
   - Accept the license
   - Click "Install"
   - Enter your Mac password when asked
   - Click "Close" when done

3. **Verify Installation:**
   - Open "Terminal" (search for it in Spotlight)
   - Type:
     ```bash
     node --version
     ```
   - You should see something like `v18.17.0` ✅

### Linux (Ubuntu/Debian):

```bash
# Update package list
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verify installation
node --version
```

---

## Step 2: Install FFmpeg

FFmpeg is the video processing software YT-Machine uses.

### Windows:

1. **Download FFmpeg:**
   - Go to https://www.gyan.dev/ffmpeg/builds/
   - Download "ffmpeg-release-essentials.zip"

2. **Extract Files:**
   - Right-click the downloaded zip file
   - Click "Extract All"
   - Extract to `C:\ffmpeg`

3. **Add to PATH:**
   - Press `Windows Key`
   - Type "Environment Variables"
   - Click "Edit the system environment variables"
   - Click "Environment Variables" button
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Type: `C:\ffmpeg\bin`
   - Click "OK" on all windows
   - **Restart your computer**

4. **Verify Installation:**
   - Open Command Prompt (press `Windows Key + R`, type `cmd`)
   - Type:
     ```bash
     ffmpeg -version
     ```
   - You should see FFmpeg version info ✅

### Mac:

**Option 1: Using Homebrew (Recommended)**

1. **Install Homebrew (if not already installed):**
   - Open Terminal
   - Paste this command:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
   - Press Enter and wait

2. **Install FFmpeg:**
   ```bash
   brew install ffmpeg
   ```

3. **Verify Installation:**
   ```bash
   ffmpeg -version
   ```
   - You should see FFmpeg version info ✅

**Option 2: Download Manually**
- Go to https://evermeet.cx/ffmpeg/
- Download the latest version
- Extract and move to `/usr/local/bin`

### Linux (Ubuntu/Debian):

```bash
# Install FFmpeg
sudo apt update
sudo apt install ffmpeg

# Verify installation
ffmpeg -version
```

---

## Step 3: Download YT-Machine

### Option 1: Download ZIP (Easiest for Beginners)

1. **Download the Code:**
   - Go to the YT-Machine GitHub page
   - Click the green "Code" button
   - Click "Download ZIP"
   - Save the file

2. **Extract the ZIP:**
   - Right-click the downloaded file
   - Click "Extract All" (Windows) or "Unzip" (Mac)
   - Choose where to save it (e.g., `Documents/yt-machine`)
   - Remember this location!

### Option 2: Using Git (Recommended)

**First, install Git:**

**Windows:**
- Download from https://git-scm.com/download/win
- Install with default options

**Mac:**
- Git is usually pre-installed
- Or install via Homebrew: `brew install git`

**Linux:**
```bash
sudo apt install git
```

**Then clone the repository:**

1. **Open Terminal/Command Prompt**

2. **Navigate to where you want to save YT-Machine:**
   ```bash
   cd Documents
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/yt-machine.git
   cd yt-machine
   ```

---

## Step 4: Install YT-Machine Dependencies

Now we'll install all the software YT-Machine needs.

1. **Open Terminal/Command Prompt**

2. **Navigate to YT-Machine folder:**
   
   **Windows:**
   ```bash
   cd C:\Users\YourName\Documents\yt-machine
   ```
   
   **Mac/Linux:**
   ```bash
   cd ~/Documents/yt-machine
   ```
   
   💡 **Tip:** You can drag the folder into Terminal instead of typing the path!

3. **Install Dependencies:**
   ```bash
   npm install
   ```
   
   This will take 2-5 minutes. You'll see lots of text scrolling by - this is normal!
   
   When it's done, you'll see something like:
   ```
   added 245 packages in 3m
   ```

---

## Step 5: Set Up API Keys

YT-Machine needs API keys to generate subtitles and translations.

### Get AssemblyAI API Key (For Subtitles)

1. **Sign Up:**
   - Go to https://www.assemblyai.com/
   - Click "Start Free"
   - Create an account (free!)

2. **Get Your API Key:**
   - Log in to your dashboard
   - Click "API Keys" in the sidebar
   - Copy your API key

3. **Save the API Key:**
   - We'll use it in the next step

### Get DeepL API Key (For Translations - Optional)

1. **Sign Up:**
   - Go to https://www.deepl.com/pro-api
   - Click "Sign up for free"
   - Create an account

2. **Get Your API Key:**
   - Go to Account → API Keys
   - Copy your API key

### Configure Environment File

1. **Create Configuration File:**
   
   In the `yt-machine` folder, you'll see a file called `.env.example`
   
   **Windows:**
   ```bash
   copy .env.example .env
   ```
   
   **Mac/Linux:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the Configuration File:**
   
   Open the `.env` file with any text editor (Notepad, TextEdit, etc.)
   
   Replace the placeholder values with your actual API keys:
   
   ```bash
   # Required: AssemblyAI for subtitles
   ASSEMBLYAI_API_KEY=your-actual-assemblyai-key-here
   
   # Optional: DeepL for translations (Pro feature)
   PRO_TRANSLATIONS=false
   DEEPL_API_KEY=your-deepl-key-here
   DEEPL_API_FREE=true
   
   # Optional: Enable Timeline Pro feature
   PRO_TIMELINE=false
   ```
   
   **Example (with fake keys):**
   ```bash
   ASSEMBLYAI_API_KEY=abc123def456ghi789
   PRO_TRANSLATIONS=false
   DEEPL_API_KEY=
   PRO_TIMELINE=false
   ```

3. **Save the file**

---

## Step 6: Verify Installation

Let's make sure everything is working!

1. **Run the Test:**
   ```bash
   npm start
   ```

2. **What You Should See:**
   ```
   🎬 YT-Machine - Video Generator
   
   1. Interactive Mode (create single video with prompts)
   2. Batch Processing - Select Channel
   3. Batch Processing - Legacy (batch-videos/ folder)
   4. Exit
   
   Choose mode (1-4, Enter = 1):
   ```

3. **If You See This:**
   - ✅ **Installation Successful!**
   - Press `4` and Enter to exit for now

4. **If You See Errors:**
   - Check the [Troubleshooting](#troubleshooting) section below

---

## 🎉 Installation Complete!

You're ready to create videos! Here's what to do next:

1. **Read the Folder Structure Guide:**
   - [Folder Structure Guide](FOLDER_STRUCTURE.md)
   - Learn how to organize your content

2. **Create Your First Video:**
   - Follow the [Quick Start Guide](QUICK_START.md)
   - Or continue to [Folder Structure Guide](FOLDER_STRUCTURE.md)

3. **Set Up Channels (Optional):**
   - Read [Channel Setup Guide](CHANNEL_SETUP.md)
   - Great for managing multiple video series

---

## 🐛 Troubleshooting

### "node is not recognized" or "command not found"

**Problem:** Node.js is not installed or not in PATH

**Solution:**
1. Reinstall Node.js from https://nodejs.org/
2. Restart your computer
3. Try again

---

### "ffmpeg is not recognized" or "command not found"

**Problem:** FFmpeg is not installed or not in PATH

**Solution:**
1. Follow the FFmpeg installation steps again
2. Make sure you added it to PATH (Windows)
3. Restart your computer
4. Try again

---

### "npm install" fails with permission errors

**Mac/Linux:**
```bash
# Don't use sudo! Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Windows:**
- Run Command Prompt as Administrator
- Try `npm install` again

---

### "Cannot find module" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

### "ASSEMBLYAI_API_KEY is required"

**Problem:** API key not set in .env file

**Solution:**
1. Make sure you created `.env` file (not `.env.example`)
2. Add your AssemblyAI API key
3. Save the file
4. Try again

---

### Still Having Issues?

1. **Check the FAQ:** [FAQ.md](FAQ.md)
2. **Search existing issues:** GitHub Issues page
3. **Ask for help:** Create a new GitHub Issue with:
   - Your operating system
   - Error message (copy the full text)
   - What you were trying to do
   - Screenshots if possible

---

## 🔄 Updating YT-Machine

To update to the latest version:

**If you downloaded ZIP:**
1. Download the new ZIP
2. Extract to a new folder
3. Copy your `.env` file from the old folder
4. Run `npm install` in the new folder

**If you used Git:**
```bash
cd yt-machine
git pull
npm install
```

---

## 📦 System Information

**Installed Locations:**
- YT-Machine: Where you extracted/cloned it
- Node.js: 
  - Windows: `C:\Program Files\nodejs\`
  - Mac: `/usr/local/bin/node`
- FFmpeg:
  - Windows: `C:\ffmpeg\bin\`
  - Mac: `/usr/local/bin/ffmpeg`

**Data Folders:**
- Input: `yt-machine/input/`
- Output: `yt-machine/output/`
- Channels: `yt-machine/channels/`

---

## 🎯 Next Steps

✅ Installation complete!

**Continue to:**
- [Folder Structure Guide](FOLDER_STRUCTURE.md) - Learn how to organize your files
- [Quick Start Guide](QUICK_START.md) - Create your first video
- [Config Guide](CONFIG_GUIDE.md) - Customize your videos

---

**Questions?** Check the [FAQ](FAQ.md) or ask in GitHub Discussions!
