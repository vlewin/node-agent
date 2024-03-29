# agent
## Example node agent packaged as an executable with plugins support 

### Install development dependencies
```bash
yarn
```

### Package agent
```bash
yarn package
```

### Start the agent
```bash
yarn start
```

### Known issues and todo items
[ ] Packaged binary is around 55MB in size find a way to reduce it

# Project todo list:
[x] try https://github.com/nexe/nexe  
[x] try https://github.com/vercel/ncc   
[x] enable packaging in the AWS Lambda function  
[x] enable upload to S3 bucket  
[x] generate pre-signed URL with expiration set to X minutes  
[x] enable agent configuration via API  
[x] enable plugins configuration via API  
[x] create a bucket resource with serverless and pass to lambda function  
[ ] sync config with a server via Sync API  
[ ] enable plugins configuration via UI - Svelte or Vue3.0  
[ ] push data to the configurable HTTPS endpoint  
[ ] push data using MQTTS to AWS IoT Core  
[ ] introduce new plugin type e.g. mqtt listener (MQTT2MQTTS bridge)  
[ ] introduce Websocket plugin e.g. (Websocket2MQTTS bridge)  
[ ] introduce Modbus plugin e.g. (Modbus2MQTTS bridge)  
[ ] introduce Wireless M-Bus plugin e.g. (W-MBus2MQTTS bridge)  
[ ] create a command line tool with https://github.com/oclif/oclif and package it as a binary
