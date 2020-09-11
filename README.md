# agent
## Example node agent packaged as a binary with plugins support 

### Setup
```bash
yarn package
```

### Packaging
```bash
yarn package
```

### Known issues and todo items
[ ] Packaged binary is around 55MB find a way to reduce it

# Project todo list:
[x] try https://github.com/nexe/nexe  
[x] try https://github.com/vercel/ncc   
[x] enable packaging in lambda function  
[x] upload to S3 bucket  
[x] return pre-signed URL with expiration set to X minutes  
[ ] create a bucket resource with serverless and pass to lambda function  
[x] allow agent configuration via API  
[ ] allow plugin configuration via API  
[ ] introduce new plugin type e.g. mqtt listener (MQTT2MQTTS bridge)  
[ ] introduce Websocket plugin (Websocket2MQTTS bridge)  
[ ] introduce Modbus plugin (Modbus2MQTTS bridge)  
[ ] create a command line tool with https://github.com/oclif/oclif and package it as a binary
