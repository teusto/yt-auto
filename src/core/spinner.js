import { UI } from '../config/constants.js';

export class Spinner {
  constructor(message = 'Processing') {
    this.frames = UI.SPINNER_FRAMES;
    this.currentFrame = 0;
    this.message = message;
    this.interval = null;
    this.startTime = null;
  }

  start() {
    this.startTime = Date.now();
    this.currentFrame = 0;
    this.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      process.stdout.write(`\r${this.frames[this.currentFrame]} ${this.message}... [${timeStr}]`);
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, UI.SPINNER_INTERVAL);
  }

  update(message) {
    this.message = message;
  }

  stop(finalMessage = null) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      if (finalMessage) {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        process.stdout.write(`\r${finalMessage} [${timeStr}]\n`);
      } else {
        process.stdout.write('\r\x1b[K');
      }
    }
  }
}
