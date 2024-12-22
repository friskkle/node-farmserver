const net = require('net');
const express = require('express');
const fs = require('fs');
const path = require('node:path');
const cors = require('cors');

function calculateChecksum(dataBuffer) {
    // Replace this with your custom checksum calculation logic
    // For simplicity, we'll calculate the sum of all bytes
    return dataBuffer.reduce((acc, byte) => acc + byte, 0);
  }

const app = express();
app.use(cors());
const port = 3001
const currentDir = path.dirname(path.dirname(__filename))
const temperaturePath = path.join(currentDir, 'data/P-1_data_temperature.dat');
const humidityPath = path.join(currentDir, 'data/P-1_data_humidity.dat');
const lightPath = path.join(currentDir, 'data/P-1_data_light.dat');

// Obtain the temperature data
const temperatureFile = fs.readFileSync(temperaturePath, 'utf-8')
const temperatureString = temperatureFile.toString();
const temperatureData = temperatureString.split('\n')

// Obtain the humidity data
const humidityFile = fs.readFileSync(humidityPath, 'utf-8')
const humidityString = humidityFile.toString();
const humidityData = humidityString.split('\n')

// Obtain the light data
const lightFile = fs.readFileSync(lightPath, 'utf-8')
const lightString = lightFile.toString();
const lightData = lightString.split('\n')

const monitorData = {
    temperature: temperatureData,
    humidity: humidityData,
    light: lightData
}

const monitorString = JSON.stringify(monitorData, undefined, 4)

// Create a TCP server
app.get('/', (req, res) => {
    console.log('TCP client connected')

    const data = monitorString
  
    // Convert data to a Buffer
    const dataBuffer = Buffer.from(data);
  
    // Calculate checksum (you can customize this logic)
    const checksum = calculateChecksum(dataBuffer);
  
    // Calculate the total length of the packet (4 bytes for length, data length, 4 bytes for checksum)
    const packetLength = 4 + dataBuffer.length + 4;
  
    // Create a buffer for the packet
    const packet = Buffer.alloc(packetLength);
  
    // Write the length as the first 4 bytes
    packet.writeUInt32BE(dataBuffer.length, 0);
  
    // Write the data after the length
    dataBuffer.copy(packet, 4);
  
    // Write the checksum after the data
    packet.writeUInt32BE(checksum, 4 + dataBuffer.length);
    console.log(packetLength)

    // Set the appropriate HTTP headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', packetLength);
    res.status(200).send(packet);
  });

  // Start the server
  app.listen(port, () => {
    console.log(`HTTP server is listening on port ${port}`);
  });
