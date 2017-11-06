import mqtt from 'mqtt';
import {format} from 'date-fns';

export default class MqttAdapter {
  constructor(url, callbacks, context) {
    this.context = context;
    if(this.context.mqttURL) url = this.context.mqttURL;
    this.mqtt = mqtt.connect(url, {
      will: {
        topic: `u/${qiscus.userData.email}/s`,
        payload: `0`,
        retain: true
      }
    })
    this.mqtt.on('message', function(topic, message) {
      // set the message to readable string
      message = message.toString();
      topic = topic.split("/");
      // set event handler
      if(topic.length == 2) {
        // it's a comment message -> {token}/c
        QiscusSDK.core.emit('newmessages', [JSON.parse(message)]);
      } else if(topic.length == 3) {
        // it's a user status message -> u/{user}/s
        const presencePayload = message.split(":");
        if (presencePayload[1].length > 13) return;
        QiscusSDK.core.emit('presence', message);
      } else if(topic[0] == 'r' && topic[4] == 't') {
        // it's a typing message
        callbacks.typing({username:topic[3], room_id: topic[1]}, message)
      } else if(topic[0] == 'r' && topic[4] == 'r') {
        // it's a read event
        callbacks.read(topic[3], message);
      } else if(topic[0] == 'r' && topic[4] == 'd') {
        // it's a delivered event
        callbacks.delivered(topic[3], message);
      }
    })
    this.mqtt.on('offline', function() {
      // QiscusSDK.core.activateSync();
    })
  }
  subscribe(topic) {
    this.mqtt.subscribe(topic);
  }
  unsubscribe(topic) {
    this.mqtt.unsubscribe(topic);
  }
  publish(topic, payload, options = {}) {
    this.mqtt.publish(topic, payload, options);
  }
}