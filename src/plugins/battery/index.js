const SystemInfo = require('systeminformation')
const jmespath = require('jmespath')
const EVENT_HUB = require('../../event_hub')
const CONFIG = require('./config.json')

module.exports = {
  name: 'battery',

  transform(results) {
    console.log('PLUGIN: Transform result')
    return jmespath.search(results, CONFIG.path)
  },

  execute: async () => {
    console.log('PLUGIN: Collect battery infos')
    SystemInfo.battery().then((results) => {
      EVENT_HUB.emit('completed', { 
        jobId: 'battery', 
        results: module.exports.transform(results) 
      })
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