const SystemInfo = require('systeminformation')
const EVENT_HUB = require('../../event_hub')
const CONFIG = require('./config.json')

module.exports = {
  transform: (results) => {
    console.log('NOTE: Transform result')
    return CONFIG.attributes.reduce((a, e) => {
      a[e] = results[e]
      return a
    }, {});
  },

  execute: async () => {
    console.log('NOTE: Collect system infos')
    SystemInfo.system().then((results) => {
      EVENT_HUB.emit('completed', { 
        jobId: 'system', 
        results: module.exports.transform(results) 
      })
    })
  },

  schedule: (config) => {
    const interval = CONFIG ? CONFIG.interval : 20000
    console.log('INFO: Schedule a system check in', interval/1000, 'seconds')
    const intervalId = setInterval(() => {
      return module.exports.execute()
    }, interval)
  } 
}