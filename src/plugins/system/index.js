const SystemInfo = require('systeminformation')
const EVENT_HUB = require('../../event_hub')
const CONFIG = require('./config.json')
const jmespath = require('jmespath')

module.exports = {
  name: 'system',

  log(message) {
    console.log(`>>> ${module.exports.name}: ${message}`)
  },
  
  transform: (results) => {
    return jmespath.search(results, CONFIG.path)
  },

  execute: () => {
    module.exports.log('Collect system infos')

    SystemInfo.system().then((results) => {
      EVENT_HUB.emit('completed', { 
        jobId: 'system', 
        results: module.exports.transform(results) 
      })
    })
  },

  schedule: (config) => {
    const interval = CONFIG ? CONFIG.interval : 20000
    module.exports.log(`Schedule check in ${interval/1000} seconds`)

    const intervalId = setInterval(() => {
      return module.exports.execute()
    }, interval)
  } 
}