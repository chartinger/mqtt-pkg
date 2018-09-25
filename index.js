const MQTT = require('mqtt')
const mosca = require("mosca")
const program = require('commander')

program
  .version('0.0.1')
  .command('broker')
  .option('-p, --port <n>', 'Port to listen to', parseInt)
  .action(function (cmd) {
    startServer()
  });
program
  .command('subscribe')
  .alias('sub')
  .option('-t, --topic <topic>', 'topic to subscribe to')
  .option('-h, --host <ip>', 'ip of the host running the broker')
  .action(function (cmd) {
    const host = cmd.host || 'mqtt://127.0.0.1'
    const topic = cmd.topic || 'DefaultTopic'
    const client = MQTT.connect(host)
    client.on('connect', () => {
      process.on('SIGINT', function() {
        client.end();
        console.log("Disconnecting");
        process.exit();
      });
      client.on('message', (topic, message, packet) => {
        console.log(`${topic}: ${message.toString()}`)
      })
      client.subscribe(topic)
    });
  });

program
  .command('publish <message>')
  .alias('pub')
  .option('-t, --topic <topic>', 'topic to subscribe to')
  .option('-h, --host <ip>', 'ip of the host running the broker')
  .option('-r, --retain', 'set retain flag')
  .action(function (message, cmd) {
    const host = cmd.host || 'mqtt://127.0.0.1'
    const topic = cmd.topic || 'DefaultTopic'
    const retain = !!cmd.retain
    console.log('Publishing "' + message + '" to topic "' + topic + '" on host "' + host + '" | retain: ' + retain)
    const client = MQTT.connect(host)
    client.publish(topic, message, { retain: retain }, function(error) { console.log(error)} )
    client.end()
  });

program
  .parse(process.argv);

function startServer() {
  const server = new mosca.Server({
    http: {
      port: 80 
    }
  });

  process.on('SIGINT', function() {
    server.close();
    console.log("Closing broker ...");
    process.exit();
  });
    
  server.on('ready', setup);	//on init it fires up setup()
  server.on('published', function (packet, client) {
    if (client) {
      console.log(`[${client.id}] ${packet.topic}: ${packet.payload.toString()}`)
    } else {
      console.log(`<broker> ${packet.topic}: ${packet.payload.toString()}`)
    }
  });

  function setup() {
    console.log('Mosca server is up and running')
  }
}