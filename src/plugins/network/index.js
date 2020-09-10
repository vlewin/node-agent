const SystemInfo = require('systeminformation')
const EVENT_HUB = require('../../event_hub')

module.exports = {
  transform: async (results) => {
    console.log('NOTE: Transform result')
    return CONFIG.attributes.reduce((a, e) => {
      a[e] = results[e]
      return a
    }, {});
  },
  
  execute: async () => {
    console.log('NOTE: Collect network infos')
    SystemInfo.networkStats().then((results) => {
      EVENT_HUB.emit('completed', { jobId: 'network', results })
    })
  },

  schedule: (config) => {
    const interval = config ? config.interval : 20000
    console.log('INFO: Schedule a network check in', interval/1000, 'seconds')
    const intervalId = setInterval(() => {
      return module.exports.execute()
    }, interval)
  } 
}