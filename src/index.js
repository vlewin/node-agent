
console.log('Start agent')
const path = require('path')
const MODULES_PATH = path.join(__dirname, 'plugins')
const CONFIG = require('./config.json')
const SYNC_INTERVAL = CONFIG.runtime.interval
const EVENT_HUB = require('./event_hub')

CONFIG.plugins.forEach((name) => {
  console.log('*** Load plugin', name)
    const file = path.join(__dirname, './plugins/', name)
    console.log('File', file)
    module.exports[name] = require(file)
    console.log(module.exports)
    console.log('*** Found module:', name, 'in file:', file)
})

console.log('*** Loaded modules', module.exports)
// FIXME: Use in memory cache with TTL
// https://www.npmjs.com/package/node-cache

const main = async () => {
  const buffer = {}

  EVENT_HUB.on('completed', (stream) => {
    console.log('INFO:', stream.jobId, 'job completed!');
    buffer[stream.jobId] = stream.results
  });

  console.log('NOTE: Schedule the jobs')
  Object.values(module.exports).map((module) => module).map(r => r.schedule())

  console.log('INFO: Data sync check every', SYNC_INTERVAL/1000, 'seconds')
  setInterval(async () => {
    if(Object.keys(buffer).length) {
      console.log('NOTE: Send to API endpoint')
      console.log('INFO: Buffer', buffer)
    } else {
      console.warn('WARN: Insufficient data')
    }
  }, SYNC_INTERVAL)

}

main()
