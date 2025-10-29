#!/bin/bash

# YT-Machine Project Cleanup Script
# Removes unused files and folders

echo "🧹 YT-Machine Project Cleanup"
echo "=============================="
echo ""

# Confirm before proceeding
read -p "This will delete unused documentation and folders. Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo ""
echo "📋 Starting cleanup..."
echo ""

# Remove unused folders
echo "🗑️  Removing unused folders..."
rm -rf projects/ && echo "   ✅ Removed: projects/" || echo "   ⚠️  projects/ not found"
rm -rf templates/ && echo "   ✅ Removed: templates/" || echo "   ⚠️  templates/ not found"

# Remove bugfix documentation
echo ""
echo "🗑️  Removing bugfix documentation..."
rm -f BUGFIXES_AUDIO_SUBTITLES.md && echo "   ✅ Removed: BUGFIXES_AUDIO_SUBTITLES.md" || true
rm -f BUGFIX_ASPECT_RATIO_UNDEFINED.md && echo "   ✅ Removed: BUGFIX_ASPECT_RATIO_UNDEFINED.md" || true
rm -f BUGFIX_AUDIO_DURATION.md && echo "   ✅ Removed: BUGFIX_AUDIO_DURATION.md" || true
rm -f BUGFIX_DUAL_SUBTITLES.md && echo "   ✅ Removed: BUGFIX_DUAL_SUBTITLES.md" || true
rm -f BUGFIX_HANGING.md && echo "   ✅ Removed: BUGFIX_HANGING.md" || true
rm -f BUGFIX_PROJECT_DETECTION.md && echo "   ✅ Removed: BUGFIX_PROJECT_DETECTION.md" || true
rm -f CENTER_SUBTITLE_FIX.md && echo "   ✅ Removed: CENTER_SUBTITLE_FIX.md" || true
rm -f ASS_SUBTITLE_CENTER_FIX.md && echo "   ✅ Removed: ASS_SUBTITLE_CENTER_FIX.md" || true

# Remove CTA debugging documentation
echo ""
echo "🗑️  Removing CTA debugging documentation..."
rm -f CTA_3_SECOND_BUG_FIX.md && echo "   ✅ Removed: CTA_3_SECOND_BUG_FIX.md" || true
rm -f CTA_FADE_DEBUG.md && echo "   ✅ Removed: CTA_FADE_DEBUG.md" || true
rm -f CTA_FADE_EFFECTS.md && echo "   ✅ Removed: CTA_FADE_EFFECTS.md" || true
rm -f CTA_FADE_FINAL.md && echo "   ✅ Removed: CTA_FADE_FINAL.md" || true
rm -f CTA_FADE_LIMITATION.md && echo "   ✅ Removed: CTA_FADE_LIMITATION.md" || true
rm -f CTA_FIX_SUMMARY.md && echo "   ✅ Removed: CTA_FIX_SUMMARY.md" || true

# Remove redundant feature documentation
echo ""
echo "🗑️  Removing redundant feature documentation..."
rm -f FEATURE_BACKGROUND_MUSIC.md && echo "   ✅ Removed: FEATURE_BACKGROUND_MUSIC.md" || true
rm -f FEATURE_SUMMARY.md && echo "   ✅ Removed: FEATURE_SUMMARY.md" || true
rm -f IMPLEMENTATION_SUMMARY.md && echo "   ✅ Removed: IMPLEMENTATION_SUMMARY.md" || true
rm -f NEW_FEATURES_OCT2025.md && echo "   ✅ Removed: NEW_FEATURES_OCT2025.md" || true
rm -f WHATS_NEW.md && echo "   ✅ Removed: WHATS_NEW.md" || true
rm -f FINE_TUNING_IMPROVEMENTS.md && echo "   ✅ Removed: FINE_TUNING_IMPROVEMENTS.md" || true
rm -f PERFORMANCE_OPTIMIZATION.md && echo "   ✅ Removed: PERFORMANCE_OPTIMIZATION.md" || true
rm -f PROGRESS_INDICATORS.md && echo "   ✅ Removed: PROGRESS_INDICATORS.md" || true
rm -f PROJECT_OVERVIEW.md && echo "   ✅ Removed: PROJECT_OVERVIEW.md" || true

# Remove redundant guides
echo ""
echo "🗑️  Removing redundant guides..."
rm -f FONTS_GUIDE.md && echo "   ✅ Removed: FONTS_GUIDE.md" || true
rm -f FONT_FEATURE_SUMMARY.md && echo "   ✅ Removed: FONT_FEATURE_SUMMARY.md" || true
rm -f EFFECTS_GUIDE.md && echo "   ✅ Removed: EFFECTS_GUIDE.md" || true
rm -f ORIGINAL_SIZE_EXPORT.md && echo "   ✅ Removed: ORIGINAL_SIZE_EXPORT.md" || true

# Remove cleanup plan (itself)
echo ""
echo "🗑️  Removing cleanup plan..."
rm -f CLEANUP_PLAN.md && echo "   ✅ Removed: CLEANUP_PLAN.md" || true

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "   Removed: ~26 documentation files"
echo "   Removed: 2 unused folders"
echo "   Kept: Essential documentation and all functional code"
echo ""
echo "📚 Remaining Documentation:"
echo "   ✅ README.md"
echo "   ✅ QUICK_START_CHANNELS.md"
echo "   ✅ TESTING_CHECKLIST.md"
echo "   ✅ CHANNEL_PROFILES_IMPLEMENTATION.md"
echo "   ✅ VIDEO_TYPES_IMPLEMENTATION.md"
echo "   ✅ Feature guides (12 files)"
echo "   ✅ Status & planning docs (4 files)"
echo ""
echo "🎉 Project is now clean and organized!"
