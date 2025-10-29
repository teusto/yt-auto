export const logger = {
  section(title) {
    const line = '='.repeat(60);
    console.log('\n' + line);
    console.log(title);
    console.log(line);
  },
  info(msg) { console.log(msg); },
  success(msg) { console.log(`✅ ${msg}`); },
  warn(msg) { console.log(`⚠️  ${msg}`); },
  error(msg) { console.error(`❌ ${msg}`); }
};
