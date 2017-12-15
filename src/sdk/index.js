/* global vStore, fetch */
import {EventEmitter} from 'events'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import remove from 'lodash/fp/remove'
import compose from 'lodash/fp/compose'
import reverse from 'lodash/fp/reverse'
import value from 'lodash/fp/value'
import reduce from 'lodash/fp/reduce'
import request from 'superagent'
import {distanceInWordsToNow, format} from 'date-fns'

import HttpAdapter from './adapters/http'
import UserAdapter from './adapters/user'
import RoomAdapter from './adapters/room'
import TopicAdapter from './adapters/topic'
import {GroupChatBuilder,scrollToBottom} from './utils'

export class qiscusSDK extends EventEmitter {

  constructor () {
    super()
    const self = this
    // Chat Related properties
    self.rooms = []
    self.room_name_id_map = {}
    self.selected = null
    self.pendingCommentId = 0
    self.last_received_comment_id = 0
    self.mqtt = null // I'll look into this later, basically we'll move mqtt from vuex to core
    self.mqttURL = null
    self.AppId = null
    self.chatmateStatus = ''

    // User Properties
    self.userData    = {}

    // Default options
    self.options     = {
      avatar: true,
      mode: 'widget',
    }
    self.extras = null;

    // SDK Configuration
    self.baseURL     = null
    self.HTTPAdapter = null
    self.isLogin     = false
    self.isLoading   = false
    self.isInit      = false
    self.isSynced    = false
    self.sync        = 'both' // possible values 'socket', 'http', 'both'

    // there's two mode, widget and wide
    self.mode        = 'widget'
    self.plugins     = []

    /**
     * This code below is wrapper for vStore object
     */
    self.UI = {
      chatTarget (email, options = {}) {
        if (!self.isInit) return
        vStore.dispatch('chatTarget', {email, options})
        .then(() => {
          const latestCommentId = qiscus.selected.last_comment_id;
          scrollToBottom(latestCommentId, 'core');
        })
      },
      chatGroup (id) {
        if (!self.isInit) return
        const oldSelected = Object.assign({}, QiscusSDK.core.selected)
        self.getRoomById(id)
        .then((response) => {
          vStore.dispatch('chatGroup', {id, oldSelected})
          .then(() => {
            const latestCommentId = qiscus.selected.last_comment_id;
            scrollToBottom(latestCommentId);
          })
        })
      },
      getOrCreateRoomByUniqueId (unique_id, name, avatar_url) {
        if (!self.isInit) return
        const oldSelected = Object.assign({}, QiscusSDK.core.selected)
        self.getOrCreateRoomByUniqueId(unique_id, name, avatar_url)
        .then((response) => {
          vStore.dispatch('chatGroup', {id:QiscusSDK.core.selected.id, oldSelected})
        })
      },
      getOrCreateRoomByChannel(channel, name, avatar_url) {
        self.UI.getOrCreateRoomByUniqueId(channel, name, avatar_url);
      },
      toggleChatWindow () {
        vStore.dispatch('toggleChatWindow')
      },
      scrollToBottom () {
        const latestCommentId = this.selected.comments[QiscusSDK.core.selected.comments.length-1].id
        const element = document.getElementById(latestCommentId)
        if(element) {
          element.scrollIntoView({block: 'end', behaviour: 'smooth'})
        }
      },
      gotoComment(comment) {
        if (!self.isInit) return
        const oldSelected = Object.assign({}, self.selected)
        self.getRoomById(comment.room_id)
        .then((response) => {
          vStore.dispatch('chatGroup', {id:comment.room_id, oldSelected, commentId: comment.id});
        })
      }
    }

    // ////////////////////////// EVENTS OBSERVERS /////////////////////////////
    /**
     * This event will be called when there's new post messages
     * If use pass a callback when initiating SDK, we'll call that function
     * @param {string} data - JSON Response from SYNC API
     * @return {void}
    */
    self.on('newmessages', function (data) {
      // let's convert the data into something we can use
      // first we need to make sure we sort this data out based on room_id
      map((comment) => {
        self.last_received_comment_id = (comment.id > self.last_received_comment_id) ? comment.id : self.last_received_comment_id;
        const theRoom = find({ id: comment.room_id })(self.rooms)
        if (theRoom != null) {
          theRoom.receiveComments([comment])
          if(self.selected.id === comment.room_id) {
            vStore.dispatch('setRead', comment)
          } else {
            vStore.dispatch('setDelivered', comment)
          }
          // update last_received_comment_id

          // update comment status, if only self.selected isn't null and it is the correct room
          if(self.selected && self.selected.id == comment.room_id) {
            self.userAdapter.updateCommentStatus(self.selected.id, comment.id, comment.id)
            .then( res => {
              self.sortComments()
            })
          }
        }
      })(data)
      if (self.options.newMessagesCallback) self.options.newMessagesCallback(data)
    })

    /**
     * This event will be called when login is sucess
     * Basically, it sets up necessary properties for qiscusSDK
     */
    self.on('login-success', function (response) {
      self.isLogin = true
      self.userData = response.user

      if (this.sync == 'http' || this.sync == 'both') this.activateSync.call(this);

      // now that we have the token, etc, we need to set all our adapters
      // /////////////// API CLIENT /////////////////
      self.HTTPAdapter  = new HttpAdapter(self.baseURL, self.AppId, self.email);
      self.HTTPAdapter.setToken(self.userData.token)

      // ////////////// CORE BUSINESS LOGIC ////////////////////////
      // this.messageAdapter   = new MessageAdapter(this.HTTPAdapters);
      self.userAdapter = new UserAdapter(self.HTTPAdapter)
      self.roomAdapter = new RoomAdapter(self.HTTPAdapter)
      self.topicAdapter = new TopicAdapter(self.HTTPAdapter)
      vStore.dispatch('activateMqtt');
      vStore.dispatch('subscribeUserChannel');
      if (self.options.loginSuccessCallback) self.options.loginSuccessCallback(response)
    })

    /**
     * Called when the comment has been delivered
     */
    self.on('comment-delivered', function (response) {
      if (self.options.commentDeliveredCallback) self.options.commentDeliveredCallback(response)
      // find comment with the id or unique id listed from response
      const commentToFind = find((comment) => {
        return comment.id === response.id ||
          comment.uniqueId === response.uniqueId
      })(self.selected.comments)
    })

    /**
     * Called when new chatroom has been created
     */
    self.on('chat-room-created', function (response) {
      self.isLoading = false
      if (self.options.chatRoomCreatedCallback) self.options.chatRoomCreatedCallback(response)
    })

    self.on('group-room-created', function (response) {
      self.isLoading = false
      if (self.options.groupRoomCreatedCallback) self.options.groupRoomCreatedCallback(response)
    })

    self.on('header-clicked', function (response) {
      if (self.options.headerClickedCallback) self.options.headerClickedCallback(response)
    })

    self.on('comment-read', function (response) {
      if (self.options.commentReadCallback) self.options.commentReadCallback(response)
    })

    self.on('login-error', function(error) {
      if (self.options.loginErrorCallback) self.options.loginErrorCallback(error);
    })

    self.on('presence', function(data) {
      const payload = data.split(":");
      QiscusSDK.core.chatmateStatus = (payload[0] == 1)
        ? 'Online'
        : `Last seen ${distanceInWordsToNow(Number(payload[1]))}`
      if (self.options.presenceCallback) self.options.presenceCallback(data);
    })
  }

  /**
  * Setting Up User Credentials for next API Request
  * @param {string} email - client email (will be used for login or register)
  * @param {string} key - client unique key
  * @param {string} username - client username
  * @param {string} avatar_url - the url for chat avatar (optional)
  * @return {void}
  */
  setUser (email, key, username, avatarURL) {
    this.email      = email
    this.key        = key
    this.username   = username
    this.avatar_url = avatarURL

    // Connect to Login or Register API
    this.connectToQiscus().then((response) => {
      if(response.status != 200) return this.emit('login-error', response.error)
      this.isInit = true
      this.emit('login-success', response.results)
    })
  }

  setUserWithIdentityToken(data) {
    if(!data || !'user' in data) return this.emit('login-error', data);
    this.email = data.user.email;
    this.key = data.identity_token;
    this.username = data.user.username;
    this.avatar_url = data.user.avatar_url;
    this.isInit = true;
    this.emit('login-success', data)
  }

  /**
  * Initializing the SDK, connect to Qiscus Server, the server will then
  * return User Data, we'll need this data for further API request
  * @param {object} options - Qiscus SDK Options
  * @return {void}
  */
  init (config) {
    // Let's initialize the app based on options
    if (config.options) this.options = Object.assign({}, this.options, config.options)
    if (!config.AppId) throw new Error('AppId Undefined')
    this.AppId = config.AppId;
    this.baseURL = `https://${config.AppId}.qiscus.com`
    if (config.baseURL) this.baseURL = config.baseURL;
    if (config.mqttURL) this.mqttURL = config.mqttURL;
    // setup how sdk will sync data: socket, http, both
    if (config.sync) this.sync = config.sync
    // setup how sdk will set the layout, widget or wide
    if (config.mode) this.mode = config.mode
    // initconfig for developer
    this.dev_mode = config.dev_mode || false
    // add plugins
    if (config.plugins && config.plugins.length>0) config.plugins.forEach(plugin => this.plugins.push(plugin))
  }

  connectToQiscus () {
    var formData = new FormData()
    formData.append('email', this.email)
    formData.append('password', this.key)
    formData.append('username', this.username)
    if (this.avatar_url) formData.append('avatar_url', this.avatar_url)

    return fetch(`${this.baseURL}/api/v2/sdk/login_or_register`, {
      method: 'POST',
      body: formData
    }).then((response) => response.json() , (err) => err)
  }

  disconnect () {
    this.isInit = false;
    this.userData = {};
    this.selected = null;
  }

  // Activate Sync Feature if `http` or `both` is chosen as sync value when init
  activateSync () {
    const self = this
    if (self.isSynced) return false;
    self.isSynced = true;
    window.setInterval(() => self.synchronize(), 7500);
  }

  /**
   * Chat with targetted email
   * @param email {string} - target chat email
   * @param options {object} - optional data sent to qiscus database
   * @param distinct_id {string | optional} - unique string to differentiate chat room with same target
   * @return <Room>
   */
  chatTarget (email, options = null) {
    const initialMessage = options.message
    const distinctId = options.distinctId
    // check if the room exists
    const self = this
    self.isLoading = true
    self.chatmateStatus = ''

    // make sure data already loaded first
    if (this.userData.length != null) return false

    // We need to get room id 1st, based on room_name_id_map
    const roomId = self.room_name_id_map[email] || null
    let room = find({ id: roomId })(self.rooms)
    if (room) {
      const isRoomExists = room.comments != null;
      if (isRoomExists) {
        room.last_comment_id = room.comments[room.comments.length-1].id
      } else {
        room.last_comment_id = -1;
      }
      self.selected = null
      self.selected = room
      // make sure we always get the highest value of last_received_comment_id
      self.last_received_comment_id = (self.last_received_comment_id < room.last_comment_id) ? room.last_comment_id : self.last_received_comment_id
      self.isLoading = false
      self.emit('chat-room-created', { room: room })
      // id of last comment on this room
      const last_comment = room.comments[room.comments.length-1];
      if (last_comment) self.updateCommentStatus(room.id, last_comment);
      return Promise.resolve(room)
    }

    // Create room
    return this.roomAdapter.getOrCreateRoom(email, options, distinctId)
      .then((response) => {
        room = new Room(response)
        self.room_name_id_map[email] = room.id
        self.last_received_comment_id = (self.last_received_comment_id < room.last_comment_id) ? room.last_comment_id : self.last_received_comment_id
        self.rooms.push(room)
        self.isLoading = false
        self.selected = room
        // id of last comment on this room
        const last_comment = room.comments[room.comments.length-1];
        if (last_comment) self.updateCommentStatus(room.id, last_comment);
        self.emit('chat-room-created', { room: room })

        if (!initialMessage) return room
        const topicId = room.id
        const message = initialMessage
        self.submitComment(topicId, message)
          .then(() => console.log('Comment posted'))
          .catch(err => {
            console.error('Error when submit comment', err)
          })
        return Promise.resolve(room)
      }, (err) => {
        console.error('Error when creating room', err)
        self.isLoading = false
        return Promise.reject(err)
      })

    return Promise
      .resolve(this.roomAdapter.getOrCreateRoom(email, options, distinctId))
      .then((res) => {
        room = new Room(res)
        self.room_name_id_map[email] = room.id
        self.last_received_comment_id = (self.last_received_comment_id < room.last_comment_id) ? room.last_comment_id : self.last_received_comment_id
        self.rooms.push(room)
        self.isLoading = false
        self.selected = room
        return room
      }, (err) => {
      })
      // Post initial comment
      .then((room) => {
        if (!initialMessage) return room
        const topicId = room.id
        const message = initialMessage
        self.submitComment(topicId, message)
          .then(() => console.log('Comment posted'))
          .catch(err => {
            console.error('Error when submit comment', err)
          })
        return room
      }, (err) => console.error('Error when posting comment', err))
      .catch((err) => console.error('Error when chatting target', err))
  }

  /**
   * Create group chat room
   * @param {string} name - Chat room name
   * @param {string[]} emails - Participant to be invited
   * @returns {Promise.<Room, Error>} - Room detail
   */
  createGroupRoom (name, emails, options = {}) {
    const self = this
    if (!this.isLogin) throw new Error('Please initiate qiscus SDK first')
    return new GroupChatBuilder(this.roomAdapter)
      .withName(name)
      .withOptions(options)
      .addParticipants(emails)
      .create()
      .then((res) => {
        self.emit('group-room-created', res)
        return Promise.resolve(res);
      })
  }

  /**
   * @param {int} id - Room Id
   * @return {Room} Room data
   */
  getRoomById (id) {
    const self = this
    self.isLoading = true;
    self.chatmateStatus = ''
    return self.roomAdapter.getRoomById(id)
      .then((response) => {
        // make sure the room hasn't been pushed yet
        let room
        let roomToFind = find({ id: id})(self.rooms)
        if (!roomToFind) {
          let roomData = response.results.room
          roomData.name = roomData.room_name
          roomData.room_type = 'group'
          roomData.comments = response.results.comments.reverse()
          room = new Room(roomData)
          self.room_name_id_map[room.name] = room.id
          self.rooms.push(room)
        } else {
          if(roomToFind.comments.length > 0) roomToFind.last_comment_id = roomToFind.comments[roomToFind.comments.length-1].id
          room = roomToFind
        }
        self.last_received_comment_id = (self.last_received_comment_id < room.last_comment_id) ? room.last_comment_id : self.last_received_comment_id
        self.selected = room || roomToFind
        self.isLoading = false
        // id of last comment on this room
        const last_comment = room.comments[room.comments.length-1];
        if (last_comment) self.updateCommentStatus(room.id, last_comment);
        // self.emit('group-room-created', self.selected)
      }, (error) => {
        console.error('Error getting room by id', error)
      })
  }

  /**
   * @param {int} id - Room Id
   * @param {string} room_name
   * @param {string} avatar_url
   * @return {Room} Room data
   */
  getOrCreateRoomByUniqueId (id, room_name, avatar_url) {
    const self = this
    self.isLoading = true;
    return self.roomAdapter.getOrCreateRoomByUniqueId(id, room_name, avatar_url)
      .then((response) => {
        // make sure the room hasn't been pushed yet
        let room
        let roomToFind = find({ id: id})(self.rooms)
        if (!roomToFind) {
          room = new Room(response)
          self.room_name_id_map[room.name] = room.id
          self.rooms.push(room)
        } else {
          room = roomToFind
        }
        self.last_received_comment_id = (self.last_received_comment_id < room.last_comment_id) ? room.last_comment_id : self.last_received_comment_id
        self.selected = room || roomToFind
        self.isLoading = false
        // self.emit('group-room-created', self.selected)
      }, (error) => {
        console.error('Error getting room by id', error)
      })
  }

  getOrCreateRoomByChannel(channel, name, avatar_url) {
    this.getOrCreateRoomByUniqueId(channel, name, avatar_url);
  }

  /**
   * Set read status for selected comment
   *
   * @param {int} room_id
   * @param {obj} comment
   * @memberof qiscusSDK
   */
  updateCommentStatus(room_id, comment) {
    const self = this;
    self.userAdapter.updateCommentStatus(room_id, comment.id, comment.id)
    .then( res => {
      self.sortComments()
    })
  }

  /**
   * This method let us get new comments from server
   * If comment count > 0 then we have new message
   */
  synchronize () {
    vStore.state.mqtt.publish(`u/${qiscus.userData.email}/s`, 1, {retain: true});
    this.userAdapter.sync(this.last_received_comment_id)
    .then((comments) => {
      if (comments.length > 0) this.emit('newmessages', comments)
    })
  }

  _addRoom (room) {
    // check 1st if we already have the room
    const theroom = this._getRoom(room.id)
    if (!theroom) this.rooms.push(room)
  }

  _getRoom (room_id) {
    return find({ id: room_id })(this.rooms)
  }

  _getRoomOfTopic (topic_id) {
    // TODO: This is expensive. We need to refactor
    // it using some kind map of topicId as the key
    // and roomId as its value.
    return find((room) =>
      find(topic => topic.id === topic_id)(room.topics)
    )(this.rooms)
  }

  selectRoom (room_id) {
    const room = this._getRoom(room_id)
    if (room.topics.length < 1) {
      // this room hasn't been loaded yet, let's load it
      return this.loadTopics(room_id).then((response) => {
        this.selected.room = room
        this.selected.topic = room.topics[0]
      })
    } else {
      this.selected.room = room
      this.selected.topic = room.topics[0]
      return new Promise((resolve, reject) => resolve(this.selected))
    }
  }

  selectTopic (topic_id) {
    let room = this.selected.room
    let topic = room.getTopic(topic_id)
    // check if messages has been loaded or not
    if (topic.comments.length < 1) {
      return this.loadComments(topic_id).then((response) => { this.selected.topic = topic })
    }
    this.selected.topic = topic
    return new Promise((resolve, reject) => resolve(topic))
  }

  loadTopics (room_id) {
    // note: when we load a topic, we also need to load its' message directly

    return this.roomAdapter.loadTopics(room_id)
    .then((response) => {
      // let's add this topics to rooms
      const room = this._getRoom(room_id)
      map(res => {
        let topic = new Topic(res)
        room.addTopic(new Topic(topic))
      })(response.topics)

      // now load the first topic messages
      let topic = room.topics[0]
      if (topic.comments.length < 1) {
        return this.loadComments(topic.id)
      } else {
        return new Promise((resolve, reject) => resolve(room.topics))
      }
    })
  }

  loadComments (topic_id, last_comment_id = 0) {
    const self = this;
    return self.topicAdapter.loadComments(topic_id, last_comment_id)
      .then((response) => {
        self.selected.receiveComments(response.reverse())
        self.sortComments()
        return new Promise((resolve, reject) => resolve(response))
      }, (error) => {
        console.error('Error loading comments', error)
        return new Promise(reject => reject(error));
      });
  }

  /**
   *
   * Step of submitting:
   * - we need to create a new comment object
   * - attach it with negative number id, and also the uniqueId, uniqueId is used
   *   to target this particular comment when there's response from server (sent, delivered state)
   * @param {Int} topicId - the topic id of comment to be submitted
   * @param {String} commentMessage - comment to be submitted
   * @return {Promise}
   */
  submitComment (topicId, commentMessage, uniqueId, type = 'text', payload) {
    var self = this
    var room = self._getRoomOfTopic(topicId)
    // set extra data, etc
    if (self.options.prePostCommentCallback) self.options.prePostCommentCallback(commentMessage);
    self.pendingCommentId--
    var pendingCommentDate = new Date()
    var commentData = {
      message: commentMessage,
      username_as: this.username,
      username_real: this.email,
      user_avatar_url: this.userData.avatar_url,
      id: self.pendingCommentId,
      type: type || 'text',
      timestamp: format(new Date())
    }
    if(type != 'text') commentData.payload = JSON.parse(payload)
    var pendingComment = self.prepareCommentToBeSubmitted(commentData)

    // push this comment unto active room
    if(type == 'reply') {
      // change payload for pendingComment
      // get the comment for current replied id
      var parsedPayload = JSON.parse(payload)
      var replied_message = self.selected.comments.find(cmt => cmt.id == parsedPayload.replied_comment_id)
      parsedPayload.replied_comment_message =
        (replied_message.type == 'reply') ? replied_message.payload.text
                                          : replied_message.message;
      parsedPayload.replied_comment_sender_username = replied_message.username_as
      pendingComment.payload = parsedPayload
    }
    self.selected.comments.push(pendingComment)

    const extrasToBeSubmitted = self.extras;
    return this.userAdapter.postComment(topicId, commentMessage, pendingComment.unique_id, type, payload, extrasToBeSubmitted)
    .then((res) => {
      // When the posting succeeded, we mark the Comment as sent,
      // so all the interested party can be notified.
      pendingComment.markAsSent()
      pendingComment.id = res.id
      pendingComment.before_id = res.comment_before_id
      return new Promise((resolve, reject) => resolve(self.selected))
    }, (err) => {
      pendingComment.markAsFailed()
      return new Promise((resolve, reject) => reject(err))
    })
  }

  resendComment(comment) {
    var self = this
    var room = self.selected
    var pendingCommentDate = new Date()
    var commentData = {
      message: comment.message,
      username_as: self.username,
      username_real: self.email,
      user_avatar: self.avatar_url,
      id: comment.id,
      unique_id: comment.unique_id
    }
    var pendingComment = QiscusSDK.core.selected.comments.find( cmtToFind => cmtToFind.id == comment.id )

    return this.userAdapter.postComment(QiscusSDK.core.selected.id, pendingComment.message, pendingComment.unique_id, comment.type, comment.payload)
    .then((res) => {
      // When the posting succeeded, we mark the Comment as sent,
      // so all the interested party can be notified.
      pendingComment.markAsSent()
      pendingComment.id = res.id
      pendingComment.before_id = res.comment_before_id
      return new Promise((resolve, reject) => resolve(self.selected))
    }, (err) => {
      pendingComment.markAsFailed()
      return new Promise((resolve, reject) => reject(err))
    })
  }

  prepareCommentToBeSubmitted (comment) {
    var commentToBeSubmitted, uniqueId
    commentToBeSubmitted = new Comment(comment)
    // We're gonna use timestamp for uniqueId for now.
    // "bq" stands for "Bonjour Qiscus" by the way.
    uniqueId = 'bq' + Date.now()
    if(comment.unique_id) uniqueId = comment.unique_id
    commentToBeSubmitted.attachUniqueId(uniqueId)
    commentToBeSubmitted.markAsPending()
    commentToBeSubmitted.isDelivered = false
    commentToBeSubmitted.isSent = false
    commentToBeSubmitted.isRead = false
    return commentToBeSubmitted
  }

  receiveComment (comment, uniqueId) {
    //  var room  = this._getRoomOfTopic(topicId);
    //  var topic = room.getTopic(topicId);
    if (uniqueId) {
      const commentWtUniqueId = find(comment => comment.unique_id === uniqueId)(this.selected.comments)
      // if uniqueId exist and comment id fake exist, it will delete fake comment
      if (commentWtUniqueId && comment.id > 0) {
        remove(cmt => cmt.unique_id === uniqueId)(this.selected.comments)
      }
    }

    // Add the comment.
    const Cmt = find({ id: comment.id })(this.selected.comments)
    if (!Cmt) this.selected.comments.push(comment)
    //  topic.addComment(comment);
    // Update unread count if necessary. That is, if these two
    // conditions are met:
    // 1. The Comment doesn't belong to the currently selected
    //    Topic. Because it doesn't makes sense to have unread
    //    Comments when the User is currently watching the
    //    Topic, does it?
    // 2. The Comment owner is not the current User. Because
    //    it doesn't make for the User to not read what he/she
    //    wrote.
    // if ( topic != this.selected.topic && comment.sender.email != this.email ) {
    //   topic.increaseUnreadCommentsCount();
    // }
    // If the topic is the currently selected Topic, then
    // we should reset the first unread Comment, because
    // it means that the user (most likely) already read
    // all the unread comments in the Topic.
    // if (topic == this.selected.topic) {
    //   topic.resetFirstUnreadComment();
    // }
    // Check if comment is uploadComment
    // It will not update the id --> if it updates the id it'll be the last room
    // if(!comment.isUploadComment){
    //   // Update last Topic ID and the last Comment ID of the Room if the
    //   // Comment is sent.
    //   if (comment.isSent) {
    //     room.setLastTopicAndComment(topicId, comment.id);
    //   }
    // }
    // Finally, let's make sure the Rooms stay sorted.
    //  this.sortRooms();
  };

  sortRooms () {
    this.rooms.sort(function (leftSideRoom, rightSideRoom) {
      return rightSideRoom.lastCommentId - leftSideRoom.lastCommentId
    })
  }

  sortComments () {
    this.selected.comments.sort(function (leftSideComment, rightSideComment) {
      if(rightSideComment.id < 0) return 0
      if(rightSideComment.id < leftSideComment.id) return 1
      if(rightSideComment.id > leftSideComment.id) return -1
      return 0
      // return leftSideComment.id - rightSideComment.id
    })
  }

  async loadRoomList (params = {}) {
    const rooms = await this.userAdapter.loadRoomList(params);
    return rooms.map(room => {
      room.last_comment_id = room.last_comment.id;
      room.last_comment_message = room.last_comment.message;
      room.last_comment_message_created_at = room.last_comment.timestamp;
      room.room_type = room.chat_type;
      return new Room(room)
    });
  }

  /**
   *
   * Search Qiscus Messages
   *
   * @param {any} [params={query,room_id,last_comment_id}]
   * @memberof qiscusSDK
   */
  async searchMessages(params = {}) {
    const messages = await this.userAdapter.searchMessages(params);
    return messages.map(message => {
      return new Comment(message);
    });
  }

  getNonce() {
    // request.set('qiscus_sdk_user_id', `${this.userId}`);
    // request.set('qiscus_sdk_to', `${this.token}`);
    console.log('getNonce ->', 'this.AppId ->', this.AppId)
    return request
    .post(`${this.baseURL}/api/v2/sdk/auth/nonce`)
    .send()
    .set('qiscus_sdk_app_id', `${this.AppId}`)
    .then(res => Promise.resolve(res.body.results),
        err => Promise.reject(err));
  }

  verifyIdentityToken(identity_token) {
    return request
      .post(`${this.baseURL}/api/v2/sdk/auth/verify_identity_token`)
      .send({identity_token})
      .set('qiscus_sdk_app_id', `${this.AppId}`)
      .then(res => Promise.resolve(res.body.results),
        err => Promise.reject(err));
  }

}

export class Room {
  constructor (roomData) {
    this.id = roomData.id
    this.last_comment_id = roomData.last_comment_id
    this.last_comment_message = roomData.last_comment_message
    this.last_comment_message_created_at = roomData.last_comment_message_created_at
    this.last_comment_topic_id = roomData.last_topic_id
    this.last_comment_topic_title = roomData.last_comment_topic_title
    this.avatar = roomData.room_avatar || roomData.avatarURL || roomData.avatar_url
    this.name = roomData.name || roomData.room_name
    this.room_type = roomData.room_type
    this.secret_code = roomData.secret_code
    this.participants = roomData.participants
    this.comments = []
    this.count_notif = roomData.count_notif || roomData.unread_count
    this.isLoaded = false
    this.unread_comments = []
    this.custom_title = null
    this.custom_subtitle = null
    this.options = roomData.options
    if(roomData.comments) this.receiveComments(roomData.comments)
  }

  setTitle ( title ) {
    this.custom_title = title
  }

  setSubTitle ( subtitle ) {
    this.custom_subtitle = subtitle
  }

  receiveComments (comments) {
    const currentCommentUniqueIds = this.comments.map(c => c.unique_id)
    const filteredComments = comments
      .filter(comment => {
        const commentId = comment.unique_temp_id ? comment.unique_temp_id : comment.id
        return currentCommentUniqueIds.indexOf(commentId) < 0;
      })
      .forEach(comment => {
        this.comments.push(new Comment(comment))
      });
  }

  countUnreadComments () {
    if (this.topics.length == 0) {
      // means that this is not loaded yet, just return the notif
      return this.count_notif
    } else {
      return compose(
        value,
        reduce((totalUnreadComment, unreadComment) => totalUnreadComment + unreadComment, 0),
        map(topic => topic.comment_unread)
      )(this.topics)
    }
  }

  getParticipants() {
    return this.participants.map(participant => participant.username);
  }

  getParticipant (participantEmail) {
    const existingParticipant = find({ email: participantEmail })(this.participants)

    if (existingParticipant) return existingParticipant
    return null
  }

  addParticipant (participant) {
    // get if there's existing participant, if any then push
    let participantToFind = this.getParticipant(participant.email)
    if (!participantToFind) this.participants.push(participant)
  }
}

/**
* Qiscus Base Comment Class
*/
function searchAndReplace(str, find, replace) {
  return str.split(find).join(replace);
}
function escapeHTML(text) {
  let comment;
  comment = searchAndReplace(text, '<', '&lt;');
  comment = searchAndReplace(comment, '>', '&gt;');
  return comment;
}

export class Comment {
  constructor (comment) {
    this.id                    = comment.id
    this.before_id             = comment.comment_before_id
    this.message               = escapeHTML(comment.message)
    this.username_as           = comment.username_as || comment.username
    this.username_real         = comment.username_real || comment.email
    this.date                  = format(comment.timestamp, 'YYYY-MM-DD')
    this.time                  = format(comment.timestamp, 'HH:mm A')
    this.unique_id             = comment.unique_temp_id || comment.unique_id
    this.avatar                = comment.user_avatar_url
    this.room_id               = comment.room_id
    this.extras                = comment.extras
    /* comment status */
    this.isPending             = false
    this.isFailed              = false
    this.isDelivered           = true
    this.isRead                = true
    this.isSent                = true
    this.attachment            = null
    this.payload               = comment.payload
    // manage comment type
    // if reply
    if(comment.type === 'reply') {
      comment.payload.replied_comment_message = escapeHTML(comment.payload.replied_comment_message);
      comment.payload.text = escapeHTML(comment.payload.text);
    }

    // supported comment type text, account_linking, buttons
    let supported_comment_type = [
      'text','account_linking','buttons','reply','system_event','card', 'custom',
      'contact_person', 'location', 'file_attachment'
    ];
    this.type = (supported_comment_type.indexOf(comment.type) >= 0) ? comment.type : 'text';
    this.subtype = (comment.type === 'custom') ? comment.payload.type : null;
  }
  isAttachment (message) {
    return (message.substring(0, '[file]'.length) == '[file]')
  }
  isImageAttachment (message) {
    return (this.isAttachment(message) && message.match(/\.(jpg|jpeg|gif|png)/i) != null)
  }
  attachUniqueId (unique_id) {
    this.unique_id = unique_id
  }
  getAttachmentURI (message) {
    if (!this.isAttachment(message)) return
    const messageLength = message.length
    const beginIndex = '[file]'.length
    const endIndex = messageLength - '[/file]'.length
    return message.substring(beginIndex, endIndex).trim()
  }
  setAttachment (attachment) {
    this.attachment = attachment
  }
  markAsPending () {
    this.isPending = true
  }
  markAsSent () {
    this.isSent = true
    this.isPending = false
    this.isFailed = false
  }
  markAsDelivered () {
    this.isSent = true
    this.isDelivered = true
  }
  markAsRead () {
    this.isPending = false
    this.isSent = true
    this.isDelivered = true
    this.isRead = true
  }
  markAsFailed () {
    this.isFailed = true
    this.isPending = false
  }
}

// this part is only for browsers, but we need to get around this part
// so that build tool not complaining
global.qiscus = null
export default (function QiscusStoreSingleton () {
  if (!qiscus) qiscus = new qiscusSDK()
  return qiscus
})()
