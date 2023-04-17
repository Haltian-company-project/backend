const mqtt = require('mqtt')
const fs = require('fs');
const { reverse } = require('dns');
const io = require('socket.io')(3000);
// connect to MQTT broker
const options = {host: 'a39cwxnxny8cvy.iot.eu-west-1.amazonaws.com',
                port: '8883',
                protocol: 'mqtt',
                rejectUnauthorized: false,
                key: fs.readFileSync('certificates/sales-cloudext-prfi00airmonitoring.key'),
                cert: fs.readFileSync('certificates/sales-cloudext-prfi00airmonitoring.pem')
                }

const client = mqtt.connect(options)
let reading;

// subscribe to a topic
client.on('connect', () => {
    console.log('Connected MQTT') 
  client.subscribe('cloudext/json/pr/fi/prfi00airmonitoring/#')
})



io.on("connection", socket => {
  // handle incoming messages
client.on('message', (topic, message) => {
  reading = JSON.parse(message.toString())
  reading['timestamp'] = new Date()
  console.log('Latest Reading', reading)

  socket.emit("readings", JSON.stringify(reading));
  console.log(`Received message on topic "${topic}"`)
  })

})

