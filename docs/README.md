# Introduction

> Qiscus Javascript SDK For Web

**qis**cus SDK helps you build Web Chat Application easy and fast. It uses **qis**cus server backend for the API.
There's two version of the SDK. The SDK Core Only version which you can use to build a custom chat app without opinionated view layer.
The other version is the one with `View` layer already integrated in it (in this case we're using VueJs, other view layer already on TODO list).
You can download all this files by navigating to the [release](https://github.com/qiscus/qiscus-sdk-web/releases) section.

# Installation and Usage

## SDK with Integrated Widget View
This version let you add a chat widget directly into your existing HTML web pages. 
You just need to include the javascript and css files from the build directory. 
And you also need to append `<div id="qiscus-widget"></div>` tag before closing body tag. Here's sample HTML:

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel="stylesheet" type="text/css" href="path/to/css/qiscus-sdk.css"> 
</head>
<body>
  <div id="qiscus-widget"></div>
  <script src="path/to/js/qiscus-sdk.js"></script>
  <script>
     qiscus.setUser('your@email.com', 'key', 'username');
     qiscus.init({AppId: 'dragongo'});
  </script>
</body>
</html>
```

The javascript file introduce a new global variable called `qiscus`. We'll use that to initiate our chat widget.

``` javascript
// Set Current User for the Chat Widget
qiscus.setUser('email@email.com', 'key', 'username');
// Init the widget
qiscus.init({AppId: 'dragongo'});
```

You can get `AppId` by requesting one from [sdk.qiscus.com](http://sdk.qiscus.com)

## SDK Core Only Version
Download the javascript file from the [release](https://github.com/qiscus/qiscus-sdk-web/releases) page, then include in your main `js` file.

```javascript
// in case you have support for ES6 Syntax else just use good 'ol require
import qiscus from 'path/to/qiscus-sdk-core.version_number'

qiscus.setUser('email@email.com','key','username');
qiscus.init({AppId: 'dragongo'});
```

![qiscus SDK demo](sdk.png)

# API

## Init Options
There are various options you can pass to init method. They are:

| option              	| required 	| description                                                                                                                                                                                      	|
|---------------------	|----------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| AppId               	| true     	| You can get this ID by contacting qiscus, this will be use to differentiate company or user using qiscus sdk                                                                                     	|
| newMessagesCallBack 	| false    	| You can pass callback that will be run whenever there's incoming new message. It only accept one parameter `function newMessagesCallBack ( data ) {    console.log('incoming data', data); } ` 	  |

## Core API
The SDK Core file gives us access to properties and methods that we can use to create our own custom chat app.
### Properties
#### `rooms`
return arrays of `Room` and also have this properties:
- `id` Room ID
- `last_comment_id` Last Comment ID of message received in this room
- `room_type` single or group type chat room
- `avatar` The avatar of the room
- `participants` users inside this room
- `name` Room name if any, if it is single type, room name is usually taken from `participants` name.
- `comments` list of comments inside this room

#### `selected`
return currently active chat room. You can list comments using this properties. e.g.: `qiscus.selected.comments`

#### `userData`
gives us info on currently logged in user.

#### `isLogin`
return boolean Whether the user has already logged in or not

#### `options`
return option object filled by user when logging in. User can fill anything in this options. See `init` method.

#### `isInit`
return boolean whether the application has been initted or not.

### Methods

#### `setUser ( email, key, username, avatar_url )`
- `email` email used by currently logged in user
- `key` secret key for current user
- `username` username to be displayed to other participant
- `avatar_url` user avatar, fallback to default avatar if not provided

#### `init ( config )`
the `config` param consist of:
- `AppId (required)` AppId for connecting to qiscus server, go to [sdk.qiscus.com](//sdk.qiscus.com) to get one
- `options (optional)` custom user generated data. e.g.: description, link to websites, etc. In options we also pass several optional callback in case we want to add custom functionality to the default behaviour when these events happens
  - `loginSuccessCallback`
  - `newMessagesCallback`
  - `commentDeliveredCallback`
  - `commentReadCallback`

#### `chatTarget ( email(s) )
create or load chat Room based on the email(s) provided and also set `qiscus.selected` property to this newly loaded or created room. If the there's more than one email provided, separate using `,`
Whenever this API Call succeeded, the SDK will emit an event of `chat-room-created` carrying data of room

#### `submitComment ( topicId, commentMessage, uniqueId )
- `topicId (required)` each room internally have topic id, for current active room you can through `qiscus.selected.last_comment_topic_id` or you can provide other room topic id.
- `commentMessage (required)` string message.
- `uniqueId (optional)` Unique ID for current message to be Submitted (usefull for differentiating visuals of already loaded comment and this new comment)

## UI API
If you're using the version with integrated view then you can communicate with the view layer using this API.

| API              	| how to use 	| description                                                                                                                                                                                      	|
|---------------------	|----------	|----------------------------------------------------------------------------	|
| UI.chatTarget            | `qiscus.UI.chatTarget('target@email.com')` | Have a chat with target email |
| UI.toggleChatWindow 	    | `qiscus.UI.toggleChatWindow()` | Toggle Chat Window Widget (maximize and minimize state) 	  |

## CSS Classes

The widget is built using vuejs and divided into several components. We also use fontawesome for the icon, so you can target fontawesome css class directly. You can change the appearance of the widget by using these css selectors below.

Widget components have namespaces of `qcw...`

| css properties | description |
|----- | ---- |
| .qcw-trigger-button | Button for toggling the chat window | 
| .qcw-container | Widget Window Wrapper div |
| .qcw-header | Widget Header containing active chat title |
| ul#messages__comments | Messages list container |
| .qcw-comment-form | Comment Form container |
| .qcw-comment-form textarea | Comment Text Input Field |
| .qcw-comment-form i | Comment Form icons (paperclip and paper-plane icon) | 
| .comment-form i | Comment Form icons (paperclip and paper-plane icon) | 
