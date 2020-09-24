const mqtt = require('mqtt')
const jmespath = require('jmespath')

const NAME = 'mqtt'
const EVENT_HUB = require('../../event_hub')
const AGENT_CONFIG = require('../../config.json')
const CONFIG = AGENT_CONFIG.plugins[NAME]

module.exports = {
  name: NAME,

  transform(results) {
    console.log('PLUGIN: Transform result')
    return jmespath.search(results, CONFIG.path)
  },
  
  execute() {
    console.log('Connect to mqtt', CONFIG)
    const client  = mqtt.connect(`mqtt://${CONFIG.options.host}`)

    if(client.connected) {
      console.log('Client is connected!!!')
    }
 
    client.on('connect', () => {
      console.log("Connected")
      client.subscribe(CONFIG.options.topic, (err) => {
        if (err) {
          console.log('Error on sub')
        } else {
          console.log('Subscribed')
        }
      })
    })
     
    client.on('message', (topic, message) => {
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