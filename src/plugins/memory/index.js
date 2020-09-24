const SystemInfo = require('systeminformation')
const jmespath = require('jmespath')

const NAME = 'memory'
const EVENT_HUB = require('../../event_hub')
const AGENT_CONFIG = require('../../config.json')
const CONFIG = AGENT_CONFIG.plugins[NAME]

module.exports = {
  name: NAME,

  transform: (results) => {
    return jmespath.search(results, CONFIG.path)
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

  schedule: () => {
    const interval = CONFIG ? CONFIG.interval : 20000
    console.log('PLUGIN: Schedule a memory check in', interval/1000, 'seconds')
    const intervalId = setInterval(() => {
      return module.exports.execute()
    }, interval)
  } 
}