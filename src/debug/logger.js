/**
 * Debug Logger Module
 * Provides debug logging, temp file persistence, and receipt generation
 */

import fs from 'fs';
import path from 'path';

class DebugLogger {
  constructor() {
    this.enabled = false;
    this.receipt = {
      timestamp: new Date().toISOString(),
      mode: null,
      config: {},
      execution: {
        startTime: null,
        endTime: null,
        duration: null,
        steps: []
      },
      files: {
        input: [],
        output: [],
        temp: []
      },
      errors: []
    };
  }

  /**
   * Initialize debug mode from command line args or environment
   */
  init() {
    // Check for --debug flag or DEBUG env var
    this.enabled = process.argv.includes('--debug') || 
                   process.argv.includes('-d') ||
                   process.env.DEBUG === 'true' ||
                   process.env.DEBUG === '1';
    
    if (this.enabled) {
      console.log('\n🔍 DEBUG MODE ENABLED');
      console.log('   Temp files will be preserved');
      console.log('   Receipt will be generated\n');
      this.receipt.execution.startTime = new Date().toISOString();
    }
    
    return this.enabled;
  }

  /**
   * Check if debug mode is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Log debug message (only if debug enabled)
   */
  log(category, message, data = null) {
    if (!this.enabled) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    let output = `[${timestamp}] 🔍 ${category}: ${message}`;
    
    if (data) {
      output += `\n   ${JSON.stringify(data, null, 2).split('\n').join('\n   ')}`;
    }
    
    console.log(output);
  }

  /**
   * Record execution step
   */
  step(stepName, details = {}) {
    if (!this.enabled) return;
    
    this.receipt.execution.steps.push({
      timestamp: new Date().toISOString(),
      name: stepName,
      details
    });
    
    this.log('STEP', stepName, details);
  }

  /**
   * Record configuration
   */
  setConfig(config) {
    if (!this.enabled) return;
    
    // Deep clone to avoid circular references
    try {
      this.receipt.config = JSON.parse(JSON.stringify(config));
      this.log('CONFIG', 'Configuration recorded', {
        aspectRatio: config.aspectRatio,
        animation: config.animationEffect,
        quality: config.qualityMode,
        clips: config.clips
      });
    } catch (err) {
      this.log('CONFIG', 'Warning: Could not serialize full config', { error: err.message });
    }
  }

  /**
   * Set execution mode
   */
  setMode(mode) {
    if (!this.enabled) return;
    this.receipt.mode = mode;
    this.log('MODE', `Execution mode: ${mode}`);
  }

  /**
   * Record input file
   */
  addInputFile(filePath, metadata = {}) {
    if (!this.enabled) return;
    
    const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    this.receipt.files.input.push({
      path: filePath,
      size: stats ? stats.size : null,
      exists: !!stats,
      ...metadata
    });
  }

  /**
   * Record output file
   */
  addOutputFile(filePath, metadata = {}) {
    if (!this.enabled) return;
    
    const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    this.receipt.files.output.push({
      path: filePath,
      size: stats ? stats.size : null,
      exists: !!stats,
      ...metadata
    });
  }

  /**
   * Record temp file (for preservation)
   */
  addTempFile(filePath, description = '') {
    if (!this.enabled) return;
    
    const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    this.receipt.files.temp.push({
      path: filePath,
      description,
      size: stats ? stats.size : null,
      exists: !!stats
    });
    
    this.log('TEMP', `Preserved: ${description}`, { path: filePath });
  }

  /**
   * Record error
   */
  addError(error, context = '') {
    if (!this.enabled) return;
    
    this.receipt.errors.push({
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack
    });
    
    this.log('ERROR', `${context}: ${error.message}`);
  }

  /**
   * Determine if temp files should be preserved
   */
  shouldPreserveTempFiles() {
    return this.enabled;
  }

  /**
   * Generate and save receipt JSON
   */
  saveReceipt(outputFolder) {
    if (!this.enabled) return null;
    
    this.receipt.execution.endTime = new Date().toISOString();
    
    // Calculate duration
    const start = new Date(this.receipt.execution.startTime);
    const end = new Date(this.receipt.execution.endTime);
    this.receipt.execution.duration = `${((end - start) / 1000).toFixed(1)}s`;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
    const receiptPath = path.join(outputFolder, `debug_receipt_${timestamp}.json`);
    
    try {
      fs.writeFileSync(receiptPath, JSON.stringify(this.receipt, null, 2));
      console.log(`\n📋 Debug Receipt saved: ${receiptPath}`);
      return receiptPath;
    } catch (err) {
      console.error(`❌ Failed to save debug receipt: ${err.message}`);
      return null;
    }
  }

  /**
   * Print summary
   */
  printSummary() {
    if (!this.enabled) return;
    
    console.log('\n' + '='.repeat(60));
    console.log('🔍 DEBUG SUMMARY');
    console.log('='.repeat(60));
    console.log(`Mode: ${this.receipt.mode}`);
    console.log(`Steps: ${this.receipt.execution.steps.length}`);
    console.log(`Input files: ${this.receipt.files.input.length}`);
    console.log(`Output files: ${this.receipt.files.output.length}`);
    console.log(`Temp files preserved: ${this.receipt.files.temp.length}`);
    console.log(`Errors: ${this.receipt.errors.length}`);
    console.log(`Duration: ${this.receipt.execution.duration}`);
    console.log('='.repeat(60) + '\n');
  }
}

// Export singleton instance
const debugLogger = new DebugLogger();

// Convenience exports
export const init = () => debugLogger.init();
export const isEnabled = () => debugLogger.isEnabled();
export const log = (category, message, data) => debugLogger.log(category, message, data);
export const step = (stepName, details) => debugLogger.step(stepName, details);
export const setConfig = (config) => debugLogger.setConfig(config);
export const setMode = (mode) => debugLogger.setMode(mode);
export const addInputFile = (filePath, meta) => debugLogger.addInputFile(filePath, meta);
export const addOutputFile = (filePath, meta) => debugLogger.addOutputFile(filePath, meta);
export const addTempFile = (filePath, desc) => debugLogger.addTempFile(filePath, desc);
export const addError = (err, ctx) => debugLogger.addError(err, ctx);
export const shouldPreserveTempFiles = () => debugLogger.shouldPreserveTempFiles();
export const saveReceipt = (folder) => debugLogger.saveReceipt(folder);
export const printSummary = () => debugLogger.printSummary();

export { debugLogger };
export default debugLogger;
