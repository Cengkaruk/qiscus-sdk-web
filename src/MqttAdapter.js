import mqtt from 'mqtt';

export default class MqttAdapter {
  constructor(url, callbacks) {
    this.mqtt = mqtt.connect(url)
    this.mqtt.on('message', function(topic, message) {
      // set the message to readable string
      message = message.toString();
      topic = topic.split("/");
      // set event handler
      if(topic.length == 2) {
        // it's a comment message -> {token}/c
        qiscus.emit('newmessages', [JSON.parse(message)]);
      } else if(topic.length == 3) {
        // it's a user status message -> u/{user}/s
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
  }
  subscribe(topic) {
    this.mqtt.subscribe(topic);
  }
  unsubscribe(topic) {
    this.mqtt.unsubscribe(topic);
  }
  publish(topic, payload) {
    this.mqtt.publish(topic, payload);
  }
}