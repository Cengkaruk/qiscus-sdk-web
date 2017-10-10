# Chat Rooms

We call a room where, at least, 2 users can chat each other, is Chat Room. There
are 2 type of Chat Room that can be created using Qiscus SDK: 1-on-1 Chat
Room and Group Chat Room.

## Creating 1-on-1 Room Chat
1-on-1 Chat Room is a room which contains only 2 participants. In this room,
users will always enter the same room to chat each other and load
previous conversations.

Here is the example of how to start creating 1-on-1 Chat Room:
```javascript
QiscusSDK.core.init({
  AppId: 'YOUR_APP_ID',
  options: {
    loginSuccessCallback: function (userData) {
      QiscusSDK.core.UI.chatTarget('userID')
    }
  }
})
```

In the snippet above, we put `chatTarget` function inside an Event Handler
called `loginSuccessCallback`
(read [in the next chapter for more detail about Event Handler](link-event-handler)),
to enable chatting after user successfully logged into the app.

> Please be noted that you can put chatTarget function anywhere you like.
> Calling it inside on Event Handler is just an example.

When everything is done correctly, you will see Qiscus Chat UI as showed in
the figure below:
![sdk screen](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/sdk-screen.png "SDK Screen")

In some cases, you may need to create a room, which enable you to always
entering a unique or different
room event if you chat with the same user. This can be usefull when you need
it for specific case, for example customer service chat app.
```javascript
QiscusSDK.core.UI.chatTarget('user@email.com', {
  distinctId: 'uniqueId'
})
```

## Creating Group Room Chat

By creating group room you can have multiple users to chat inside specific room.
To create Group Chat Room you can do it like this:
```javascript
QiscusSDK.core.createGroupRoom(name, [userID1, userID2, userID3])
```
Those `userID1`, `userID2`, `userID3` will automatically be participants of
the group room.

## Get Room List

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

Here some parameters you should provide when calling `loadRoomList()`:
- *page* (number) on which set of data to be fetched
- *limit* (number, optional, default=100) limit on how many rooms data to be
  fetched per page.
- *show_participants* (boolean, optional, default=true) whether to list
  participants of each rooms too.

## Get Room By ID

After successfully get your room list, you may want to enter a specific room.
Remember that there are 2 type of rooms, 1-on-1 Chat Room and Group Room.
You can enter to 1-on-1 Chat Room by simply using `chatTarget(user)`
by passing userID to chat with a single user. However, In Group Chat Room,
instead of userID, you need to pass roomId by using `chatGroup()` function.
This roomID can be obtained by loading room list, which has been explained in
the previous chapter.

Example:
```javascript
QiscusSDK.core.UI.chatGroup('room_id')
```
