
const path = require('path')
const glob = require('glob')

// const MODULES_PATH = path.join(__dirname, 'plugins')

// glob.sync(MODULES_PATH + '/*.js').forEach((file) => {
//   var name = path.parse(file).base.replace('.js', '')
// 
//   if(config.plugins.includes(name)) {
//     module.exports[name] = require(file)
//     console.log('*** Found module:', name, 'in file:', file)
//   } else {
//     console.log('Not configured')
//   }
// })

const MODULES_PATH = path.join(__dirname, 'plugins')
const config = require('./config.json')
const { type } = require('os')
console.log(config)

config.plugins.forEach((name) => {
  console.log('*** Load plugin', name)
    const file = path.join(__dirname, './plugins/', name)
    console.log('File', file)
    module.exports[name] = require(file)
    console.log(module.exports)
    console.log('*** Found module:', name, 'in file:', file)
})

console.log('*** Loaded modules', module.exports)
const main = async () => {
  const executions = Object.values(module.exports).map((module) => module).map(r => r.run())
  console.log("executions", executions)

  const promises = executions.map(p => p.promise)
  const results = await Promise.all(promises)
  executions.forEach((execution, i) => {
    executions[i].result = results[i]
    delete executions[i].promise
  })

  console.log('Results:', executions)
  return executions
}

main()