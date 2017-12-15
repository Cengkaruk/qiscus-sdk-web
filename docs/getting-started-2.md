# Getting Started

In this section you will learn about:
1. Get Your APP ID
2. Configuration
  a. Defining container
  b. Initiating Qiscus Chat SDK
3. Authentication
4. Rendering Chat UI

## Get Your App ID

To start building app using Qiscus Web Chat SDK you need a key called APP ID.
This APP ID acts as identifier of your Application so that Qiscus can connect
your user to other users on the same APP ID. You can get your APP ID here.

You can find your APP ID on your Qiscus app dashboard. Here you can see the
picture as a reference.

![App ID Location](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/app-id.png "Your APP ID location")

> All users within the same qiscus application are able to communicate with
> each other, across all platforms. This means users using iOS, Android, web
> clients, etc. can all chat with one another. However, users in different
> Qiscus applications cannot talk to each other.

## Configuration

### Defining Container

Container is an element where qiscus Web Chat SDK feature will be rendered into.
To define container you need to include `<div id="qiscus-widget"></div>` tag
before closing body tag. Here's code example.
```html
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Document</title>
</head>
<body>
<!-- Append the snippet below, before closing body tag -->
</body>
</html>
```

Don't forget to save your file as HTML file.

> id value "qiscus-widget" is fixed. For now you cannot change it to anything
> else.

### Initiating Qiscus SDK

To configure Qiscus SDK, you need to include `qiscus-sdk.js` to your HTML file
that you created before (see [#defining container](#defining-container) section).
You can get `qiscus-sdk.js` file from Sample App or you can download it drectly
[here](https://github.com/qiscus/qiscus-sdk-web/releases/latest).
```html
<script src="path/to/qiscus-sdk.jq"></script>
```

To initiate your chat app using Qiscus Chat SDK, you need to include the APP ID
that you got from your dashboard. Inside this init function you can put more
"options" according what your app needs. For example, here we put an Event
Handler (`loginSuccessCallback`) which will return information after user
received a message (`userData`). You can, then, do something with that
information inside the Event Handler. You can learn more about Evenr Handler,
[here](/documentation/web/event-handler), in the next chapter. Here is the
sample code of how to initiate your APP ID and calling Event Handler:
```javascript
QiscusSDK.core.init({
  AppId: 'YOUR-APP-ID',
  options: {
    loginSuccessCallback: function (userData) {
      // Here you can do something about userData
    }
  }
})
```
> Please be noted that calling Event Handler is an options, not a mandatory
> thing to be included. You can still get your chat app and running without
> calling any of Event Handler.

## Authentication

### Setting User Information

After getting your APP ID, you need to do user authentication. You can do this
easily by calling `QiscusSDK.core.setUser()` function. This function is used
to login or register your user as well as setting and updating user profile.
Here is the example:
```javascript
QiscusSDK.core.setUser('sample@qiscus.com', 'userKey', 'Qiscus Demo', 'http://some-url.com/avatar.png');
```

Here is some note to understand about parameters inside setUser function:
*userID* (string, unique): A User identifier that will be used to identify
a user and used whenever another user need to chat with this user. It can
be anything, whether it is user's email, your user database index, etc. As long
as it is unique and a string.
*userKey* (string): userKey is used as for authentication purpose, so even if
a stranger knows your userId, he can not access the user data.
*username* (string): Username is used as a display name inside chat room.
*avatar_url* (string, optional): used to display user's avatar, fallback to
default avatar if not provided.

You can learn from the figure below to understand what really happened when
calling `setUser()` function:

![setUser Diagram](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/1511248335-Set+user.png "setUser Diagram")

## Rendering Chat UI

Final step, you need to render chat UI by calling render function.
```javascript
QiscusSDK.render();
```

That's all. If everything is done properly you will get something like this
![sdk screen](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/sdk-screen.png "SDK Screen")

The widget chat above appear and it seems inactive. This happened because you
have not set any target to chat with. But don't worry, the step-by-step guidance
to activate Chat Rooms will be explained in the next chapter (see Chat Rooms
section).

Here is the complete code.
<p data-height="265" data-theme-id="0" data-slug-hash="pWxQvJ" data-default-tab="html" data-user="qiscus" data-embed-version="2" data-pen-title="Qiscus Chat SDK Complete Code" class="codepen">See the Pen <a href="https://codepen.io/qiscus/pen/pWxQvJ/">Qiscus Chat SDK Complete Code</a> by Qiscus (<a href="https://codepen.io/qiscus">@qiscus</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


## Create Chat Rooms

*Chat Room* is a place where 2 or more users can chat each other. There are 2
type of Chat Room thatcan be created using Qiscus Chat SDK: 1-on-1 Chat Room
and Group Chat Room. For some cases, a room can be identified by room unique id
or room name. All activities under Qiscus Chat SDK is inside this Chat Room.
You can do whatever you need with the available chat features.

In this Room section you learn about:
1. Creating 1-on-1 Chat Room
2. Creating Group Room
3. Get Room List
4. Get Room ID

## 1-on-1 Chat Room

1-on-1 Chat Room is a room which contains only 2 participants. In this room,
users will always enter the same room to chat each other and load previous
conversations. Here is the code to create 1-on-1 Chat Room using Qiscus Chat SDK.

`QiscusSDK.core.UI.chatTarget('[userId]')`

Here is the complete example of how to put `chatTarget` function:
```javascript
QiscusSDK.core.init({
  AppId: 'YOUR-APP-ID',
  options: {
    loginSuccessCallback: function (userData) {
      QiscusSDK.core.UI.chatTarget('userId')
    }
  }
})
```

In the snippet above, we put chatTarget function inside an Event Handler called
`loginSuccessCallback` (read in the next chapter for more detail about
_Event Handler_), to enable chatting after user successfully logged into the app.

> Please be noted that you can put chatTarget function anywhere you like.
> Calling it inside an Event Handler is just an example.

When everything is done correctly, you will see Qiscus Chat UI as showed in the
figure below:
![1-on-1 Screen](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/1-on-1-screen.png "1-on-1 Screen")

In some cases, you may need to create a room, which enable you to always
entering a unique or different room even if you chat with the same user. This
can be useful when you need it for a specific case, for example customer
service chat app.
```javascript
QiscusSDK.core.UI.chatTarget('user@email.com', {
  distinctId: 'distinctId'
})
```

## Creating a Group Room

By creating group room you can have multiple users to chat inside specific room.
To create Group Chat Room you can do it like this:
```javascript
QiscusSDK.core.createGroupRoom(name, [userId1, userId2, userId3], { avatarURL: 'http://avatar_url.com/avatar.png' })
```

Those `userId1`, `userId2`, `userId3` will automatically be participants of
the group room.

## More About Room

After successfully created your room, you may need to do advance development
for your chat app. This may include invite more participant to your room, enter
to a specific room without invitation, and so forth. Hence, in this section
you will learn about the following things:
1. Get Room List, to get data of your user list, so that you can use that data
   to load specific room or many more.
2. Get Room ID, to enable you to open a room that you already created by passing
   room ID that is obtained by Get Room List.
3. Room Participant, to educate you about adding more participant to your room
   or adding more participant to your room or managing your user in your room.

### Get Room List

User will be able to participate in many rooms and our Chat SDK provide
functionality to list rooms which the user participate into. Here is how to get
the user's room list:
```javascript
QiscusSDK.core.loadRoomList(params): Promise<Array<Room>>
```

Where Room is an object as follow:
```json
{
  "id": 30524,
  "last_comment_id": 635013,
  "last_comment_message": "Hello there",
  "avatar": "",
  "name": "testGroup3",
  "comments": [],
  "count_notif": 0,
  "isLoaded": false,
  "unread_comments": [],
  "custom_title": null,
  "custom_subtitle": null,
  "options": "{}"
}
```

Here some parameters you should call with loadRoomList():
- *page* (number) on which set of data to be fetched
- *limit* (number, optional, default=100) limit on how many rooms data
to be fetched per page
- *show_participants* (boolean, optional, default=true) whether to list
participants of each rooms too

### Get Room By ID

After successfully get your room list, you may want to enter a specific room.
Remember that there are 2 type of rooms, 1-on-1 Chat Room and Group Room. You
can enter to 1-on-1 Chat Room by simply using `chatTarget(user)` by passing
`userId` to chat with a single user. However, in Group Chat Room, instead
of `userId`, you need to pass a `roomId` by using `chatGroup()` function. This
`roomId` can be obtained by loading room list, which has been explained in
the previous chapter.

Example:
```javascript
QiscusSDK.core.UI.chatGroup('room-id')
```

### Room Participant Management

In some cases, you may need to add additional participants into your room chat
or even removing any participant. Currently, Qiscus Chat SDK only allow you
to manage your users server to server. You cannot do it on you client app side.
Hence, we recommend to invite and remove user out of specific room through
our [SERVER API](https://www.qiscus.com/docs/restapi) for simplicity and
security reason. You can learn how to use Server API here.
