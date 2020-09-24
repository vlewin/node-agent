
console.log('Start agent')
const path = require('path')
const MODULES_PATH = path.join(__dirname, 'plugins')
const EVENT_HUB = require('./event_hub')
// const fs = require('fs')


// fs.readdir(__dirname, function (err, files) {
//   //handling error
//   if (err) {
//       return console.log('Unable to scan directory: ' + err);
//   } 
//   //listing all files using forEach
//   files.forEach(function (file) {
//       // Do whatever you want to do with the file
//       console.log(file); 
//   });
// });

const CONFIG = require('./config.json')
const SYNC_INTERVAL = CONFIG.runtime.interval


CONFIG.plugins.forEach((name) => {
  const file = path.join(__dirname, './plugins/', name)
  module.exports[name] = require(file)
  console.log('*** Found module:', name, 'in file:', file)
})

console.log('*** Loaded modules', Object.keys(module.exports))
// FIXME: Use in memory cache with TTL
// https://www.npmjs.com/package/node-cache

const main = () => {
  const buffer = {}

  EVENT_HUB.on('completed', (stream) => {
    console.log('MAIN:', stream.jobId, 'job completed!');
    console.log(stream.results)
    buffer[stream.jobId] = stream.results
  });

  console.log('MAIN: Schedule the jobs')
  console.log('module.exports', module.exports)
  Object.values(module.exports).forEach((module) => {
    console.log('Schedule job for', module.name)
    module.schedule()
  })

  console.log('MAIN: Data sync check every', SYNC_INTERVAL/1000, 'seconds')
  setInterval(() => {
    if(Object.keys(buffer).length) {
      console.log('MAIN: Send to API endpoint')
      console.log('MAIN: Buffer', buffer)
    } else {
      console.warn('MAIN: Insufficient data')
    }
  }, SYNC_INTERVAL)

}

main()
