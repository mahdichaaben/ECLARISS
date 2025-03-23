// src/mqttClient.js
import mqtt from 'mqtt';

class MqttClient {
  constructor(brokerUrl, username, password, clientId) {
    this.brokerUrl = brokerUrl;
    this.username = username;
    this.password = password;
    this.clientId = clientId;
  }

  /**
   * Initializes the MQTT client and connects to the broker.
   */
  initialize() {
    if (this.client) {
      this.client.end();
    }

    this.client = mqtt.connect(this.brokerUrl, {
      username: this.username,
      password: this.password,
      clientId: this.clientId,
      protocol: 'wss',
      port: 8884,
      connectTimeout: 30 * 1000, // 30 seconds timeout for the connection
      keepalive: 60,
      clean: true,
      reconnectPeriod: 1000,
      rejectUnauthorized: false,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    this.client.on('message', (topic, message) => {
      console.log(`Received message '${message}' on topic '${topic}'`);
    });

    this.client.on('close', () => {
      console.log('MQTT connection closed');
    });
  }


  publishMessage(topic, message) {
    if (this.client) {
      this.client.publish(topic, message, { qos: 1 }, (err) => {
        if (err) {
          console.error('Publish error:', err);
        } else {
          console.log('Message published:', message);
        }
      });
    } else {
      console.error('MQTT client not initialized');
    }
  }


  subscribeToTopic(topic) {
    if (this.client) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscribe error:', err);
        } else {
          console.log('Subscribed to:', topic);
        }
      });
    } else {
      console.error('MQTT client not initialized');
    }
  }
}

export default MqttClient;
