import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import MqttAdapter from '../../MqttAdapter'
import MqttCallback from '../../MqttCallback'
import QiscusSDK from '../../sdk/index'

function unsetPresence(state) {
  if(qiscus.selected) {
    const targetEmail = qiscus.selected.participants
      .find(target => target.email != qiscus.email);
    if(targetEmail) state.mqtt.unsubscribe(`u/+/s`);
  }
}
function setPresence(state, email) {
  // unset old presence, ambil email yang lama
  unsetPresence(state);
  state.mqtt.subscribe(`u/${email}/s`);
}

// Make vue aware of Vuex
Vue.use(Vuex)

// Create an object to hold the initial state when
// the app starts up
const mqttURL = "wss://mqtt.qiscus.com:1886/mqtt";
const state = {
  qiscus: QiscusSDK,
  selected: QiscusSDK.selected,
  windowStatus: false,
  participants: QiscusSDK.participants,
  plugins: QiscusSDK.plugins,
  // mqtt: new MqttAdapter("wss://mqtt.qiscus.com:1886", callbacks),
  mqtt: null,
  mqttData: {
    typing: ''
  },
  init: QiscusSDK.isInit,
  isLoadingComments: false,
  imageModalLink: '',
  imageModalOn: false,
  newCommentText: '',
}

// Create an object storing various mutations. We will write the mutation
const mutations = {
  ACTIVATE_MQTT(state) {
    state.mqtt = new MqttAdapter(mqttURL, MqttCallback, state.qiscus);
  },
  TOGGLE_DEV_MODE (state) {
    state.dev_mode = !state.dev_mode
  },
  CHANGE_ROOM (state, room) {
    state.selected = room
  },
  TOGGLE_CHAT_WINDOW (state) {
    state.windowStatus = !state.windowStatus
  },
  SUBSCRIBE_USER_CHANNEL(state) {
    state.mqtt.subscribe(`${state.qiscus.userData.token}/c`);
  },
  CHAT_TARGET (state, {email, options}) {
    state.mqttData.typing = '';
    // reset the state with new data
    state.windowStatus = true;
    state.selected = state.qiscus.selected;
    state.mqtt.unsubscribe(`${state.qiscus.userData.token}/c`);
    state.mqtt.subscribe(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/+/t`);
    state.mqtt.subscribe(`${state.qiscus.userData.token}/c`);
    state.mqttData.typing = '';

    // set presence, ambil email yang lama
    setPresence(state, email);
  },
  CHAT_GROUP (state, {id, oldSelected}) {
    unsetPresence(state);
    if(state.selected) {
      state.mqtt.unsubscribe(`r/${oldSelected.id}/${oldSelected.last_comment_topic_id}/+/t`);
      state.mqtt.unsubscribe(`r/${oldSelected.id}/${oldSelected.last_comment_topic_id}/+/t`);
    }
    state.windowStatus = true;
    state.selected = state.qiscus.selected;
    state.mqttData.typing = '';
    state.mqtt.subscribe(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/+/t`);
    state.mqtt.subscribe(`${state.qiscus.userData.token}/c`);
  },
  LOAD_COMMENTS (state, payload) {
    state.isLoadingComments = true;
    QiscusSDK.loadComments(payload.topic_id, payload.last_comment_id).then((response) => {
      state.isLoadingComments = false;
      state.selected = QiscusSDK.selected;
    }, (error) => {
      console.error('Error loading Comments', error);
      state.isLoadingComments = false;
    })
  },
  UPDATE_SELECTED (state) {
    state.selected = QiscusSDK.selected;
  },
  BACK_TO_HOME (state) {
    state.selected = null;
  },
  SUBMIT_COMMENT (state, payload) {
    state.selected = payload;
  },
  SET_TYPING (state, payload) {
    if(payload.topic.username == state.qiscus.email || payload.topic.room_id != state.selected.id) return
    // let's get the email of this payload
    const Participant = state.qiscus.selected.participants.find( (participant) => participant.email == payload.topic.username )
    const username = (Participant) ? Participant.username : payload.topic.username

    if(payload.message == 1){
      state.mqttData.typing = username;
    } else {
      state.mqttData.typing = '';
    }
  },
  SET_READ (state, payload) {
    state.mqtt.publish(`r/${payload.room_id}/${payload.id}/${state.qiscus.email}/d`, `${payload.id}:${payload.unique_id}`);
    state.mqtt.publish(`r/${payload.room_id}/${payload.id}/${state.qiscus.email}/r`, `${payload.id}:${payload.unique_id}`);
    state.selected = QiscusSDK.selected;
  },
  SET_DELIVERED(state, payload) {
    state.mqtt.publish(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/${state.qiscus.email}/d`, `${payload.id}:${payload.unique_id}`);
    state.selected = QiscusSDK.selected;
  },
  TOGGLE_INIT (state, payload) {
    state.init = !state.init
  },
  OPEN_IMAGE_MODAL (state, payload) {
    state.imageModalOn = true;
    state.imageModalLink = payload;
  },
  CLOSE_IMAGE_MODAL (state) {
    state.imageModalLink = '';
    state.imageModalOn = false;
  },
  SET_NEW_COMMENT_TEXT (state, payload) {
    state.newCommentText = payload;
  },
}

// Set the Getters
const getters = {
  triggerLabel: (state) => {
    if(!state.qiscus.isLogin) return `initializing qiscus widget ...`;
    if(state.qiscus.isLoading) return `loading chat data ...`;
    return 'Chat'
  }
}

window.vStore = null;
export default (function QiscusStoreSingleton() {
  if (!vStore) vStore = new Vuex.Store({
    state,
    mutations,
    getters,
    actions
  })
  return vStore;
})();
