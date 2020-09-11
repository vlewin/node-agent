const SystemInfo = require('systeminformation')
const EVENT_HUB = require('../../event_hub')

module.exports = {
  execute: async () => {
    console.log('PLUGIN: Collect battery infos')
    SystemInfo.battery().then((results) => {
      EVENT_HUB.emit('completed', { jobId: 'battery', results })
    })
  },

  schedule: (config) => {
    const interval = config ? config.interval : 20000
    console.log('PLUGIN: Schedule a battery check in', interval/1000, 'seconds')
    const intervalId = setInterval(() => {
      return module.exports.execute()
    }, interval)
  } 
}