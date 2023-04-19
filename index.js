const mongoose = require('mongoose');
const express = require('express');
//const router = express.Router();

const app = express();

const mqtt = require('mqtt')
const fs = require('fs');
const { reverse } = require('dns');
const io = require('socket.io')(3000);
// connect to MQTT broker

const options = {host: 'a39cwxnxny8cvy.iot.eu-west-1.amazonaws.com',
                port: '8883',
                protocol: 'mqtt',
                rejectUnauthorized: false,
                key: fs.readFileSync('./certificates/sales-cloudext-prfi00airmonitoring.key'),
                cert: fs.readFileSync('./certificates/sales-cloudext-prfi00airmonitoring.pem')
}

const client = mqtt.connect(options)

var Smart = 'mongodb+srv://Chiry:Chiry50@cluster0.b7cjm6q.mongodb.net/Haltian?retryWrites=true&w=majority'

mongoose.connect(Smart);
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});

client.on('connect', function () {
  console.log('Connected to MQTT broker');
});

client.subscribe('cloudext/json/pr/fi/prfi00airmonitoring/#', function (error) {
  if (error) {
    console.error('Error subscribing to topic:', error);
  } else {
    console.log('Subscribed to topic');
  }
});

const dataSchema = new mongoose.Schema({
  data: Object
});

const User = mongoose.model('data', dataSchema);
// Handle incoming messages
client.on('message', function (topic, message) {
  console.log(JSON.parse(message))
  const user = new User( {data:JSON.parse(message)});
  user.save().then(() => console.log('inserted data'));
  //console.log('Received message on topic', topic, ':', message.toString());

});

let reading;





// const AirQuality = mongoose.model('AirQuality', dataSchema);


// subscribe to a topic
// client.on('connect', () => {
//     console.log('Connected MQTT') 
//   client.subscribe('cloudext/json/pr/fi/prfi00airmonitoring/#')
// })

// io.on("connection", socket => {
//   // handle incoming messages
//   console.log('listenning')
// client.on('message', (topic, message) => {
//   reading = JSON.parse(message.toString())
//   reading['timestamp'] = new Date()
//   console.log('Latest Reading', reading)

//   socket.emit("readings", JSON.stringify(reading));
//   console.log(`Received message on topic "${topic}"`)
//   })
// })



