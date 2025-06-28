function log(...args) {
  const time = new Date().toISOString();
  console.log(`[${time}]`, ...args);
}

module.exports = { log };
