const AWS = require('aws-sdk')
const Ajv = require('ajv')
const fs = require('fs-extra')
const { exec } = require('pkg')
const configSchema = require('./src/schemas/config.json')

const ajv = new Ajv({ 
  allErrors: true, 
  removeAdditional: true,
  useDefaults: process.env.NODE_ENV === 'development' 
})

const s3 = new AWS.S3({ 
  region: process.env.AWS_REGION || 'eu-central-1' 
})


const cleanup = async () => {
  console.log('NOTE: Remove previous build artifacts')
  return fs.remove('/tmp/build')
}

const prepare = async () => {
  console.log("NOTE: Copy all files to the tmp directory")
  // FIXME: Promise.all for faster copy process
  await fs.copy('src', '/tmp/build/src').then(() => {
    console.log('*** src is ready')
  })
  await fs.copy('node_modules', '/tmp/build/node_modules').then(() => {
    console.log('*** node_modules are ready')
  })

  return fs.copy('package.json', '/tmp/build/package.json')
}

const configure = async (payload) => {
  console.log("NOTE: Validate", typeof(payload), payload)
  const config = typeof(payload) === 'string' ? JSON.parse(payload) : payload
  const valid = ajv.validate(configSchema, config)
  if (!valid) {
    throw new Error(ajv.errorsText())
  }

  console.log('NOTE: Save config in /tmp/build/src/config.json folder', config)
  fs.writeFileSync('/tmp/build/src/config.json', JSON.stringify(config, null, 2));
}

const package = async (targetPath) => {
  console.log('NOTE: Package target and copy to path', targetPath)
  await exec(['/tmp/build/package.json', '--targets', 'node12-macos-x64', '--out-path', targetPath])
}

const upload = async (bucketName, agentName, agentFile) => {
  console.log('NOTE: Upload agent', agentName, agentFile)

  const data = fs.readFileSync(agentFile);
  const base64data = Buffer.from(data, 'binary')
  
  return s3.putObject({
    Bucket: bucketName,
    Key: agentName,
    Body: base64data
  }).promise()
}

const signUrl = async (bucketName, agentFile) => {
  console.log('NOTE: Prepare signed URL for agent', bucketName, agentFile)
  const params = {
    Bucket: bucketName, 
    Key: agentFile, 
    Expires: 60*15 
  }

  const url = await s3.getSignedUrlPromise('getObject', params);
  console.log('NOTE: The URL is', url); // expires in 60 seconds
  return url
}



const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json'
}

module.exports.handler = async (event) => {
  process.env.PKG_TARGET_PATH = '/tmp'
  process.env.PKG_CACHE_PATH = '/tmp'

  const targetPath = `${(process.env.PKG_TARGET_PATH || './bin')}`
  const agentFile = `${targetPath}/agent`
  const agentName = `agent-${new Date().getTime()}`
  const bucketName = 'vlewin-node-packager'
  const { body } = event

  try {
    console.log("INFO: Event", JSON.stringify(event))
    await cleanup()
    await prepare()
    await configure(body)
    await package(targetPath)
  
    if (fs.existsSync(agentFile)) {
      console.log('NOTE: Agent file exists.')
      await upload(bucketName, agentName, agentFile)
      const presignedUrl = await signUrl(bucketName, agentName)

      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ url: presignedUrl })
      }
    }
  } catch (err) {
    console.log('ERROR', err.message)

    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: "Something went wrong!" })
    }
  } finally {
    await cleanup()
  }
}

// const event = require('./serverless_packager.event.json')
// module.exports.handler(event)