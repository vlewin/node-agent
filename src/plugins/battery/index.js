const SystemInfo = require('systeminformation')
const jmespath = require('jmespath')

const NAME = 'battery'
const EVENT_HUB = require('../../event_hub')
const AGENT_CONFIG = require('../../config.json')
const CONFIG = AGENT_CONFIG.plugins[NAME]

module.exports = {
  name: NAME,

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

  schedule: () => {
    const interval = CONFIG ? CONFIG.interval : 20000
    console.log('PLUGIN: Schedule a battery check in', interval/1000, 'seconds')
    const intervalId = setInterval(() => {
      return module.exports.execute()
    }, interval)
  } 
}