# Advance Section

## UI Customization

Qiscus Chat SDK enable you to customize Chat UI as you like. You can modify
colors, change bubble chat design, modify Chat Header, and many more.
There are 2 level of UI customization, Basic and Advance Customization.
For advance customization, you need to posssess enough understanding of CSS.

### Basic UI Customization

#### View Mode

If you want to display your chat as a full width (not as widget), you can
set the mode to wide on init as a parameter, as figure below:
```javascript
QiscusSDK.core.init({
  AppId: 'YOUR-APP-ID',
  mode: 'wide',
  options: {}
})
```

Here what you will get:
![Wide Mode](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/view-mode-screen.png "Wide Mode")

#### Remove Avatar

By default, you will see avatar beside chat bubble. If you want to remote them,
you can do it on the initiation process by setting avatar option. It has `true`
value, which will show the avatar, but you can set it to `false` to remove
the avatar.
```javascript
QiscusSDK.core.init({
  AppId: 'YOUR-APP-ID',
  options: {
    avatar: false
  }
})
```

Here what you will get by passing avatar parameter inside option brackets
![Without Avatar](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/no-avatar.png "No Avatar")

### Advance UI Customization

You can almost change everything you see on the chat UI by customizing it's CSS.
Here are main CSS selectors being use in Qiscus Chat SDK:

| CSS Properties      | Description                                |
|---------------------|--------------------------------------------|
| .qcw-trigger-button | Button for toggling the chat window        |
| .qcw-container      | Widget window wrapper div                  |
| .qcw-header         | Widget header containing active chat title |

> Please be noted that SDK css classess is prefixed with qcw-

There are more than just 3 properties that are unlisted in the table above. You
can find more customizable properties in the css file in the sample app, which
you can modify it as you like.

## Event Handler

An Event Handler is a callback routine that operates asynchronously and handles
inputs received into a program. Event Handlers are important in Qiscus because
it allows a client to react to any events happening in Qiscus Chat SDK.
For example, if a client wants to know any important events from server, such
as success login event, client's app can be notified by calling a specific
Event Handler. Client, then, can do things with data returned by the event.

In the previous section, during `Qiscus.init` (see [Configuration](/documentation/web/create-your-app#configuration) section), you
can put callbacks inside options as parameters that will be called when there's
event being triggered. You can see it inside options in the `Qiscus.core.init`
function when you initialize Qiscus Chat SDK.

Here are the complete Event Handlers list that are supported by
Qiscus Chat SDK. If you cannot find Event Handler that suit your need, you
can contact us at [contact.us@qiscus.com](mailto:contact.us@qiscus.com), so
that we can consider it for your need.
- [loginSuccessCallback](#loginsuccesscallback)
- [newMessageCallback](#newmesagescallback)
- [chatRoomCreatedCallback](#chatroomcreatedcallback)
- [groupRoomCreatedCallback](#grouproomcreatedcallback)
- [headerClickedCallback](#headerclickedcallback)
- [commentDeliveredCallback](#commentdeliveredcallback)
- [commentReadCallback](#commentreadcallback)

### loginSuccessCallback

`loginSuccessCallback` is called when user is successfully logged in to
Qiscus Chat SDk using `setUser` function. This Event Handler can be used either
to notify your user or do something inside your application. This Event Handler
return an object of the corresponding user data.
```javascript
/**
 * @params loginResponse {LoginResponse}
 */
loginSuccessCallback: function (loginResponse) {
  // Do everything you want here
}
```
Where `loginResponse` are an object as follow:
```json
{
  "results": {
    "user": {
      "app": {
        "code": "sdksample",
        "id": 947,
        "id_str": "947",
        "name": "sdksample"
      },
      "avatar": {
        "avatar": {
          "url": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png"
        }
      },
      "avatar_url": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png",
      "email": "guest2@gg.com",
      "id": 131322,
      "id_str": "131322",
      "last_comment_id": 837362,
      "last_comment_id_str": "837362",
      "pn_android_configured": false,
      "pn_ios_configured": false,
      "rtKey": "somestring",
      "token": "pUvsi0Djd2nO5PQZ0nAw",
      "username": "Guest 2"
    }
  },
  "status": 200
}
```

### newMesagesCallback

`newMessagesCallback` is called when there is new incoming message. This Event
Handler can be used either to notify your user using desktop notification, or
somethhing else. This Event handler returns data of incoming message.
```javascript
/**
 * @params message {Message}
 */
newMessagesCallback: function (message) {
  // Do everything you want here
}
```
Where message are an array of unread message as follow:
```json
[{
  "chat_type": "single",
  "comment_before_id": 827962,
  "comment_before_id_str": "827962",
  "disable_link_preview": false,
  "email": "customer-service@email.com",
  "id": 827963,
  "id_str": "827963",
  "message": "adf;lkjadsf",
  "payload": null,
  "room_avatar": "",
  "room_id": 30418,
  "room_id_str": "30418",
  "room_name": "Customer Service",
  "timestamp": "2017-09-29T10:51:25Z",
  "topic_id": 30418,
  "topic_id_str": "30418",
  "type": "text",
  "unique_temp_id": "bq1506682285227",
  "unix_nano_timestamp": 1506682285076080000,
  "unix_timestamp": 1506682285,
  "user_avatar": {
    "avatar": {
      "url": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png"
    }
  },
  "user_avatar_url": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png",
  "user_id": 131324,
  "user_id_str": "131324",
  "username": "Customer Service"
}]
```

### chatRoomCreatedCallback

`chatRoomCreated` is called when user successfully created a 1-on-1
Chat Room. This event handler can be used either to notify your user or
for analytics purpose. This event handler return data of created room.
```javascript
/**
 * @params room {Room}
 */
chatRoomCreatedCallback: function (room) {
  // Do everything you want here
}
```
Where room are an object of the corresponding room data
```json
{
  "room": {
    "id": 41710,
    "last_comment_id": 0,
    "last_comment_message": "",
    "last_comment_topic_id": 41710,
    "avatar": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png",
    "name": "aa",
    "participants": [
      {
        "avatar_url": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png",
        "email": "customer-service@email.com",
        "id": 131324,
        "id_str": "131324",
        "last_comment_read_id": 0,
        "last_comment_read_id_str": "0",
        "last_comment_received_id": 0,
        "last_comment_received_id_str": "0",
        "username": "Customer Service"
      },
      {
        "avatar_url": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png",
        "email": "aa@email.com",
        "id": 185243,
        "id_str": "185243",
        "last_comment_read_id": 0,
        "last_comment_read_id_str": "0",
        "last_comment_received_id": 0,
        "last_comment_received_id_str": "0",
        "username": "aa"
      }
    ],
    "topics": [],
    "comments": [],
    "isLoaded": false,
    "unread_comments": [],
    "custom_title": null,
    "custom_subtitle": null
  }
}
```

### groupRoomCreatedCallback

`groupRoomCreatedCallback` is called when user successfully created a group
room. This event handler can be used either to notify your user or for
analytics purpose. This event handler return data of the created
group room data.
```javascript
/**
 * @params room {GroupRoom}
 */
groupRoomCreatedCallback: function (room) {
  // Do everything you want here
}
```
Where room are an object of the corresponding group room data.
```json
{
  "id": 41714,
  "name": "group-room-name",
  "lastCommentId": 0,
  "lastCommentMessage": "",
  "lastTopicId": 41714,
  "avatarURL": "",
  "options": "{}",
  "participants": [
    {
      "id": 131324,
      "email": "customer-service@email.com",
      "username": "Customer Service",
      "avatarURL": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png"
    },
    {
      "id": 131326,
      "email": "guest3@gg.com",
      "username": "Guest 3",
      "avatarURL": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png"
    },
    {
      "id": 131322,
      "email": "guest2@gg.com",
      "username": "Guest 2",
      "avatarURL": "https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png"
    }
  ]
}
```

### headerClickedCallback

`headerClickedCallback` is called when user click header or area around
room name and room avatar. This event can be used either to show room detail,
or something else.
```javascript
headerClickedCallback: function () {
  // Do something when user click header area
}
```

### commentDeliveredCallback
`commentDeliveredCallback` event handler will be called when user's comment
has been delivered to it's participants. You can use this for analytics
purpose, user delivery receipt, etc. `commentDeliveredCallback` returns an
object of delivered message data.
```javascript
commentDeliveredCallback: function (comment) {
  // Do everything you want here
}
```

### commentReadCallback
`commentReadCallback` event handler will be called when user's comment has
been delivered and read by targeted user. You can use this for analytics
purpose, user delivery receipt, etc. `commentReadCallback` returns an
object of read message data.
```javascript
commentReadCallback: function (comment) {
  // Do everything you want here
}
```

When you put the code altogether, it will look like this:
```javascript
QiscusSDK.core.init({
  AppId: 'YOUR_APP_ID',
  options: {
    loginSuccessCallback: function (loginResponse) {},
    newMessageCallback: function (message) {},
    chatRoomCallback: function (chatRoom) {},
    groupRoomCreatedCallback: function (groupRoom) {},
    headerClickedCallback: function () {},
    commentDeliveredCallback: function (comment) {},
    commentReadCallback: function (comment) {}
  }
})
```
