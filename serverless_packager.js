const fs = require('fs')
const AWS = require('aws-sdk')
// const aws4  = require('aws4')
const { exec } = require('pkg')
const s3 = new AWS.S3({ 
  region: process.env.AWS_REGION || 'eu-central-1' 
})

const package = async (targetPath) => {
  console.log('NOTE: Package target and copy to path', targetPath)
  await exec(['./package.json', '--targets', 'node12-macos-x64', '--out-path', targetPath])
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
  const targetPath = process.env.PKG_TARGET_PATH || './bin'
  const agentFile = `${targetPath}/agent`
  const agentName = `agent-${new Date().getTime()}`
  const bucketName = 'vlewin-node-packager'
  
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

  return {
    statusCode: 500,
    headers: headers,
    body: JSON.stringify({ message: 'Packaging failed!' })
  }
}



// module.exports.handler()