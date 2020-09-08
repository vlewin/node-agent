const SystemInfo = require('systeminformation')

module.exports = {
  run: () => {
    console.log('NOTE: Collect system stats')
    return {
      name: 'system',
      promise: SystemInfo.system()
    }
  } 
}