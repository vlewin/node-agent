const SystemInfo = require('systeminformation')

module.exports = {
  run: () => {
    console.log('Collect docker infos')
    return SystemInfo.dockerContainers()
  } 
}