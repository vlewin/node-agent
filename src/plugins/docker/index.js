const SystemInfo = require('systeminformation')

module.exports = {
  execute: () => {
    console.log('Collect docker infos')
    return SystemInfo.dockerContainers()
  },

  schedule: (config) => {
    const interval = config.interval || 60000
    console.log('PLUGIN: Schedule a docker check in', interval/1000, 'seconds')
    const intervalId = setInterval(() => {
      return module.exports.execute()
    }, interval)
  } 
}