# mqtt-pkg
A single-file wrapper binary (win64) around Mosca MQTT Server and MQTT.js client for educational purposes

# Usage

Usage of the release-binary. When using from source replace `mqtt.exe` with `npm start` or `yarn start`

### Starting a broker

`mqtt.exe broker`

This will start a MQTT broker at port 1883 and a MQTT webservice on port 1884

### Subscribe to broker
`mqtt.exe subscribe -h mqtt://127.0.0.1 -t topic`

### Publish a message
`mqtt.exe publish -h mqtt://127.0.0.1 -t topic message`

