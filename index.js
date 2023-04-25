const mongoose = require('mongoose');
const express = require('express');
//const router = express.Router();


// firebase
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('./config.js')

const app = express();

const mqtt = require('mqtt')
const fs = require('fs');
const { reverse } = require('dns');
const { userInfo } = require('os');
// const io = require('socket.io')(3000);
// connect to MQTT broker


const options = {host: 'a39cwxnxny8cvy.iot.eu-west-1.amazonaws.com',
                port: '8883',
                protocol: 'mqtt',
                rejectUnauthorized: false,
                key: fs.readFileSync('./certificates/private.key'),
                cert: fs.readFileSync('./certificates/private.pem')
}

const client = mqtt.connect(options)


client.on('connect', function () {
  console.log('Connected to MQTT broker');
});

client.subscribe('cloudext/json/pr/fi/prfi00airmonitoring/#', function (error) {
  if (error) {
    console.error('Error subscribing to topic:', error);
  } else {
  }
});

console.log('Subscribed to topic');

var readings = {
  'in': 0,
  'out': 0,
  'totalIn': 0,
  'totalOut': 0,
  'historicalIn': 0,
  'historicalOut': 0,
  'amountIn': 0,
  'carbonDioxide': 0,
  'tvoc': 0,
  'temp': 0,
  'humd': 0,
  'airp': 0,
};

// Handle incoming messages
client.on('message', function (topic, message) {
  
  var reading = JSON.parse(message);
  for (var key in reading) {
    readings[key] = reading[key];
  }
  readings['timestamp'] = new Date()
  // readings['date'] = new Date().toLocaleDateString();
  console.log(readings);

  const sensorData = db.collection('data')

  console.log(sensorData.get());
  sensorData.add(readings)
    .then(()=>{
        console.log('Data added to FireStore')
    })

});