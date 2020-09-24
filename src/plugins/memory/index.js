const SystemInfo = require('systeminformation')
const EVENT_HUB = require('../../event_hub')
const CONFIG = require('./config.json')

module.exports = {
  name: 'memory',

  transform: (results) => {
    console.log('PLUGIN: Transform result', results)
    return CONFIG.attributes.reduce((a, e) => {
        a[e] = results[e]
        return a
    }, {});
  },
      
  execute: async () => {
    console.log('PLUGIN: Collect memory infos')
    SystemInfo.mem().then((results) => {
      EVENT_HUB.emit('completed', { 
        jobId: 'memory', 
        results: module.exports.transform(results) 
      })
    })
  },

  schedule: (config) => {
    const interval = config ? config.interval : 20000
    console.log('PLUGIN: Schedule a memory check in', interval/1000, 'seconds')
    const intervalId = setInterval(() => {
      return module.exports.execute()
    }, interval)
  } 
}