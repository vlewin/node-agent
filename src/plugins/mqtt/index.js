const mqtt = require('mqtt')
const jmespath = require('jmespath')
const EVENT_HUB = require('../../event_hub')
const CONFIG = require('./config.json')


module.exports = {
  name: 'mqtt',

  transform(results) {
    console.log('PLUGIN: Transform result')
    return jmespath.search(results, CONFIG.path)
  },
  
  execute() {
    console.log('Connect to mqtt', CONFIG)
    const client  = mqtt.connect('mqtt://192.168.178.50')

    if(client.connected) {
      console.log('Client is connected!!!')
    }
 
    client.on('connect', function () {
      console.log("Connected")
      client.subscribe(CONFIG.topic, function (err) {
        if (err) {
          console.log('Error on sub')
        } else {
          console.log('Subscribed')
        }
      })
    })
     
    client.on('message', function (topic, message) {
      // message is Buffer
      // console.log(topic, message.toString())
      EVENT_HUB.emit('completed', { 
        jobId: topic, 
        results: module.exports.transform(JSON.parse(message.toString())) 
      })
    })
  },

  schedule () {
    return module.exports.execute()
  } 
}

// module.exports.schedule()