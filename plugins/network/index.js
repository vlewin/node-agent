const SystemInfo = require('systeminformation')

module.exports = {
  run: () => {
    console.log('NOTE: Collect network stats')
    return {
      name: 'network',
      promise: SystemInfo.networkStats()
    }
  } 
}