const SystemInfo = require('systeminformation')

module.exports = {
  run: () => {
    console.log('NOTE: Collect battery stats')
    return {
      name: 'battery',
      promise: SystemInfo.battery()
    }
  } 
}