
# Introduction

With Qiscus Chat SDK (Software Development Kit), You can embed chat feature
inside your application quickly and easily without dealing with complexity
of real-time comunication infrastructure. We provide Chat UI that has been
designed and optimized for easy customization. So, you can modify the UI to
show off your branding identity, favorite color, or customize event.

## A Brief About Chat

Talking about chat app, you may figure out such messenger app like Whatsapp. You
might have familiar with the flow, how to start conversation, and do things,
like sharing image inside chat room. If you want to create chat app, for
customer service, for instance, Qiscus Chat SDK enable you to establish chat UI
and functionalities easily. But before diving into it, there are essential basic
knowledges you need to know about chat app.

### 3 Basic Flow of Chat App

In a chat app, to start a conversation, we usually choose person we want to
chat with, from a contact list. Then, we start conversation inside a chat room.
In a chat room, we can do things such as sharing images, sending emoji, sharing
contact, location, and many more. We can even know when a person is typing
or when our message has been read. If chatting is done, we can go back to
conversation list which display our conversations in the app. To make a chat
app with the described flow, we noticed that the most complex part is creating
chat room, which posses many features inside it. Hence, Qiscus Chat SDK provide
an easy way to create chat app without dealing with complexity of real-time
comunication infrastructure that resides inside a chat room.

## Qiscus Chat SDK and UI Components

![Qiscus Chat SDK](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/intro01.png "Qiscus Chat SDK")

In spite or real-time chat, Qiscus Chat SDK provides UI that can be customized
according to your needs. But please keep in mind that, by default, Qiscus
provides UI for chat room only. If you need to create contact list and
conversation list UI, for example, you need to create it on your own. However,
we provide essential data that you can get and utilize for your app.

## Qiscus Chat SDK Features

When you try our chat SDK, you will find the default built-in features such as:
- Private & group chat
- Typing indicator
- Delivery indicator
- Image and file attachment
- Online presence
- Read receipt
- Reply message
- Pending messages
- Emoji support

You also can access more advance and customizable features such as:
- Server side integration with Server API and Webhook
- Customize your user interface
- Embed bot engine in your app
- Enable push notification
- Export and import messages from your app

## Try Sample App

To meet your expectations, we suggest you try out our sample app. The sample app is built with full functionalities so that you can figure out the flow and main activities of common chat apps.  We provide you with two options to start with the sample app: 
1. Try Sample App only or
2. Try Sample App with Sample Dashboard

### Try Sample App Only

To run all of the sample code, you need to install Git and NodeJS. Git will
be used to clone the repository so you can play around with the code locally.
NodeJS is needed to install and resolve dependencies to run the Sample App.
You can refer to their respected page for more detail installing them both.

You can download the sample app directly from our [github](https://github.com/qiscus/qiscus-sdk-web-sample),
or if you already installed Git you can just clone directly from your command
line.
```bash
$ git clone https://github.com/qiscus/qiscus-sdk-web-sample.git
```

After cloning finished, you will need to create simple server to run the sample
app. In the example below, we use `http-server` from nodejs package manager
to server Sample App locally.
```bash
# Install http-server from npm globally
$ npm install http-server -g
# Choose folder and run Web SDK Sample
$ cd qiscus-sdk-web-sample
$ http-server
```
If you want your sample app running with your own APP ID, you can change it in file vars.js which is located at assets/js/vars.js.

### Try Sample App With sample dashboard

If you have your own chat app, you may be wondering how you can manage your users. In this case, we provide a sample dashboard for user management. This sample dashboard can help you to figure out how to work with Qiscus Server Api for more advanced functionalities. You can go to https://www.qiscus.com/documentation/rest/list-api to know more about Server API.

> Note: We assume that you already downloaded the sample app. The sample app
> will be needed to work together with the sample dashboard.

You can explore the sample dashboard http://dashboard-sample.herokuapp.com/login to try it online, or you also can download the source code to deploy it locally or to your own server.

To start trying the sample dashboard on your end, you should carry out the following steps:
Clone sample dashboard in our [github](https://github.com/qiscus/dashboard-sample), or just copy the following code.
```bash
git clone https://github.com/qiscus/dashboard-sample.git
cd dashboard-sample
```

Before running the sample app on your local machine, first, you need to install dependencies using composer.
```bash
composer install
php -S localhost:8000
```
> The sample dashboard provided Client API to enable your sample app getting list of users. This API is based on PHP and used Composer as its dependency manager. Thus, you need to have PHP and Composer installed to use the API.

Now you would have successfully run the sample dashboard. However, do note that the sample app is running using our `App ID`. If you want the sample dashboard to be connected to your app with your own App ID, you need to change it inside *.env file*. You can find your own App ID and Secret Key in your own [Qiscus SDK dashboard](https://www.qiscus.com/dashboard).

If you are wondering how our sample app with dashboard worked, here some
ilustration:
![How Sample Work Illustration](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/1511248325-How+sample+work.png "How Sample Work Illustration")

There are 2 Server API that are used inside Qiscus Sample Dashboard:

1. ```.qiscus.com/api/v2.1/rest/get_user_list``` to get list of users from Qiscus SDK database, and
2. ```.qiscus.com/api/v2/rest/login_or_register``` to enable user login or register via Sample Dashboard.

The Sample Dashboard called these APIs inside `main.js file`. To use these APIs, you need to pass your `APP ID` then set method and request parameter. 

To set method and request parameter, you can refer to [Get User List](https://www.qiscus.com/documentation/rest/list-api#get-user-list) and [Login and Register](https://www.qiscus.com/documentation/rest/list-api#login-or-register) in Server API Documentation.

```
//your-domain.com/api/contacts
Example: //dashboard-sample.herokuapp.com/api/contacts
```
You will get response as follow:
```JSON
{
   "results":{
      "meta":{
         "total_data":123,
         "total_page":6
      },
      "users":[
         {
            "avatar_url":"https:\/\/d1edrlpyc25xu0.cloudfront.net\/kiwari-prod\/image\/upload\/75r6s_jOHa\/1507541871-avatar-mine.png",
            "created_at":"2017-12-05T08:07:58.405896Z",
            "email":"sample@email.com",
            "id":452773,
            "name":"sample",
            "updated_at":"2017-12-05T08:07:58.405896Z",
            "username":"sample"
         }
      ]
   },
   "status":200
}
```
# Getting Started

## Requirement 

Qiscus Web Chat SDK, for now, supports Chrome 40+, Firefox 48+, and Microsoft Edge.
You will need to get our Web Chat SDK files from our CDN by including the Js and Css file.
**Qiscus SDK Js File**
```
https://qiscus-sdk.s3-ap-southeast-1.amazonaws.com/web/v2.5.9/qiscus-sdk.2.5.9.js
```
**Qiscus SDK Css File**
```
https://qiscus-sdk.s3-ap-southeast-1.amazonaws.com/web/v2.5.9/qiscus-sdk.2.5.9.css
```
## Get Your App ID

To start building app using Qiscus Web Chat SDK you need a key called `APP ID`.
This `APP ID` acts as identifier of your Application so that Qiscus can connect
your user to other users on the same `APP ID`. You can get your `APP ID` [here](https://www.qiscus.com/dashboard).

You can find your `APP ID` on your Qiscus app dashboard. Here you can see the
picture as a reference.

![App ID Location](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/app-id.png "Your APP ID location")

> All users within the same qiscus application are able to communicate with
> each other, across all platforms. This means users using iOS, Android, web
> clients, etc. can all chat with one another. However, users in different
> Qiscus applications cannot talk to each other.

## Authentication

To authenticate to SDK server, app needs to have user credential locally stored for further requests. The credential consists of a token that will identify a user in SDK server. When you want to disconnect from SDK server, terminating authentication will be done by clearing the stored credential. You can learn more about disconnecting from Qiscus Chat SDK in the next section. Qiscus SDK authentication can be done separately with your main app authentication, especially if your main app has functionality before the messaging features.

There are 2 type of authentication that you can opt to use: Client Authentication and Server Authentication.
Here some comparison to help you decide between the two options:

* Client Authentication can be done simply by providing `userID` and `userKey` through your client app. On the other hand, Server Authentication, the credential information is provided by your Server App. In this case, you need to prepare your own Backend. 
* The Client Authentication is easier to implement but Server Authentication is more secure.


### Configuration

To configure Qiscus Web Chat SDK, you need to include SDK files that you get from requirement section into your HTML file. Here is how to include your files:

```html
<!-- put on your head element of your HTML file -->
<link rel="stylesheet" href="path/to/qiscus-sdk.css">
<!-- put on before closing tag of body tag -->
<script src="path/to/qiscus-sdk.js"></script>
```
To initiate your chat app using Qiscus Chat SDK, you need to include the `APP ID` that you obtained from your dashboard. Inside this `init function`, you can put more "options" according to what your app needs. For example, here we put an Event Handler ( ```loginSuccessCallback```) which will return information after the user has received a message (`userData`). You can, then, do something with that information inside the Event Handler. You can learn more about [Event Handler](https://www.qiscus.com/documentation/web/advanced-section), in the next chapter. Here is the sample code of how to initiate your APP ID and calling Event Handler : 

```html
QiscusSDK.core.init({
  AppId: 'YOUR_APP_ID',
  options: {
    loginSuccessCallback: function (userData) {
      // Here you can do something about userData
    }
  }
});
```

>Please note that calling Event Handler is an option, not a mandatory thing to be included. You can still get your chat up and running without calling any of Event Handler. 

### Client Authentication

You can easily authenticate your user by calling `QiscusSDK.core.setUser()` function. This function is used to login or register your user as well as setting and updating user profiles. Here is an example⁠⁠⁠⁠ :

```html
QiscusSDK.core.setUser('sample@qiscus.com', 'userKey', 'Qiscus Demo' , ‘http://some-url.com/avatar.png’);
```
Below are some notes to understand parameters within the ```setUser()``` function: 

* **userID** (string, unique): A User identifier that will be used to identify a user and used whenever another user needs to chat with this user. It can be anything, whether it is the user's email address, your user database index, etc. as long as it is **unique** and a **string**. 
* **userKey** (string) : `userKey` is used as for authentication purposes, so even if a stranger knows your userId, he cannot access the user data. 
* **username** (string) : `Username` is used as a display name inside chat room. 
* **avatar_url** (string, optional) : used to display user’s avatar, and fallback to default avatar if not provided. 

You can learn from the figure below to understand what really happens when calling ```setUser()``` function :

![setUser Diagram](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/1511248335-Set+user.png "setUser Diagram")

## Create Chat Room

**Chat Room** is a place where 2 or more users can chat with one another**.** There are 2 types of Chat Rooms that can be created using Qiscus Chat SDK: `1-on-1 Chat Room` and `Group Chat Room`. For some cases, a room can be identified by the room's `unique id` or `room name`. All activities under Qiscus Chat SDK is inside this Chat Room. You can do whatever you need with the available chat features.

To start creating Chat Room you need to create a container first, then render the Chat UI. `Container` is an element where Qiscus Web SDK Chat feature will be rendered into. To define container, you need to include ```<div id="qiscus-widget"></div>``` tag before the closing body tag. Here’s an example: 

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel="stylesheet" href="path/to/qiscus-sdk.css">
</head>
<body>
  <!-- append the snippet below, before closing body tag -->
  <div id="qiscus-widget"></div>
  <script src="path/to/qiscus-sdk.js"></script>
  ...
</body>
</html>
```
Don’t forget to save your file as HTML file.

> id value “qiscus-widget” is fixed. For now you cannot change it to anything else.

After creating a container, you need to render Qiscus Chat UI by calling render function.
```html
QiscusSDK.render();
```

If everything is done properly you will get something like this
![sdk screen](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/sdk-screen.png "SDK Screen")

The widget chat above appear and it seems inactive. This happened because you
have not set any target to chat with. But don't worry, the step-by-step guidance
to activate Chat Rooms will be explained in the next chapter (see Chat Rooms
section).

Here is the complete code.
<p data-height="265" data-theme-id="0" data-slug-hash="pWxQvJ" data-default-tab="html" data-user="qiscus" data-embed-version="2" data-pen-title="Qiscus Chat SDK Complete Code" class="codepen">See the Pen <a href="https://codepen.io/qiscus/pen/pWxQvJ/">Qiscus Chat SDK Complete Code</a> by Qiscus (<a href="https://codepen.io/qiscus">@qiscus</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## 1-on-1 Chat Room

`1-on-1 Chat Room` is a room which contains only 2 participants. In this room,
users will always enter the same room to chat each other and load previous
conversations. Here is the code to create 1-on-1 Chat Room using Qiscus Chat SDK.

`QiscusSDK.core.UI.chatTarget('[userId]')`

The code will load chat room previously created with the intended participants or create a new one if there is no record of it. It will also trigger the widget to expand if it's in minimized mode.

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

In the snippet above, we put `chatTarget` function inside an Event Handler called
`loginSuccessCallback` (read in the next chapter for more detail about
_Event Handler_), to enable chatting after user successfully logged into the app.

> Please be noted that you can put chatTarget function anywhere you like.
> Calling it inside an Event Handler is just an example.

When everything is done correctly, you will see Qiscus Chat UI as showed in the
figure below:
![1-on-1 Screen](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/1-on-1-screen.png "1-on-1 Screen")


## Group Chat Room

By creating group room you can have multiple users to chat inside specific room.
To create Group Chat Room you can do it like this:

```javascript
QiscusSDK.core.createGroupRoom(name, [userId1, userId2, userId3], { avatarURL: 'http://avatar_url.com/avatar.png' })
```

Those `userId1`, `userId2`, `userId3` will automatically be participants of the group room.

The code above will emit a `group-room-created` event which we can make use of by creating a `groupRoomCreated` callback method passed as init options the same way we did with `loginSuccessCallback` in the previous section.

```javascript
QiscusSDK.core.init({
  AppId: 'YOUR-APP-ID',
  options: {
    loginSuccessCallback: function (userData) {
      QiscusSDK.core.UI.chatTarget('userId')
    },
    groupRoomCreatedCallback: function(room) {
      console.info('newly created room', room);
      // or QiscusSDK.core.UI.chatGroup(room.id) <- will be discussed later
    }
  }
})
```

## More About Rooms

After successfully creating your room, you may need to do advanced development for your chat app. This may include inviting more participant to your room, entering a specific room without invitation, and so on. Hence, in this section you will learn about the following things :

1. **Get Room List**, to get data of your user list so that you can use that data to load a specific room or many more.
2. **Enter to Existing Room**, to enable you to open a room that you have already created by passing a room ID that is obtained by Getting Room List.
3. **Participant Management**, to educate you on adding more participants to your room or managing users in your room.

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

### Enter Existing Room

After successfully getting your room list, you may want to enter a specific room.
Remember that there are 2 type of rooms, `1-on-1 Chat Room` and `Group Room`. You
can enter `1-on-1 Chat Room` by simply using `chatTarget(user)` then passing
`userId` to chat with a single user. However, in Group Chat Room, instead
of `userId`, you need to pass a `roomId` by using `chatGroup()` function. This
`roomId` can be obtained by loading room list, which has been explained in
the previous chapter.

Example:
```javascript
QiscusSDK.core.UI.chatGroup('room-id')
```

### Participant Management

In some cases, you may need to add additional participants into your room chat
or even removing any participant. Currently, Qiscus Chat SDK only allow you
to manage your users server to server. You cannot do it on you client app side.
Hence, we recommend to invite and remove user out of specific room through
our [SERVER API](https://www.qiscus.com/docs/restapi) for simplicity and
security reason. You can learn how to use Server API here.

## Enable Desktop Notification

By default, desktop notification feature is available on your web browser. To get notification, you need to enable browser notification on the browser pop-up.

Here's an example on how to display a desktop notification when the window is not on focus by using `newMessagesCallback` event handler:

```javascript
newMessagesCallback(message) {
  //  request permission if it is disabled
  if (Notification.permission !== "granted") Notification.requestPermission();
  // create the notification if only window is not focused
  if ( document.hasFocus() )) return
  // create the notification
  const notification = new Notification(`you get a chat from ${data[0].username}`, {
    icon: data[0].user_avatar,
    body: (data[0].message.startsWith('[file]'))
          ? 'File attached.'
          : data[0].message,
    });
  // add on click event handler, close the notif, focus the window
  notification.onclick = function () {
    notification.close();
    window.focus();
  }
```

You can learn more about Event Handler in the next section.
# Advance Section

## Server Authentication

Another option is to authenticate using `JSON Web Token` [(JWT)](https://jwt.io/). JSON Web Token contains your app account details which typically consists of a single string which contains information of two parts, Jose header and `JWT` claims set. 

The steps to authenticate with `JWT` goes like this:

1. The Client App request a nonce from Qiscus SDK server
2. Qiscus SDK Server will send Nonce to client app
3. Client App send user credentials and Nonce that is obtained from Qiscus SDK Server to Client app backend
4. The Client App backend will send the token to client app
5. The Client App send that token to Qiscus Chat SDK
6. Qiscus Chat SDK send Qiscus Account to Client app

<p align="center"><br/><img src="https://raw.githubusercontent.com/qiscus/qiscus-sdk-android/develop/screenshot/jwt.png" width="80%" /><br/></p>

You need to request `Nonce` from Qiscus Chat SDK Server. `Nonce` (Number Used Once) is a unique, randomly generated string used to identify a single request. Please be noted that a Nonce will expire in 10 minutes. So you need to implement your code to request JWT from your backend right after you got the returned Nonce. Here is how to authenticate to Qiscus Chat SDK using JWT :
```javascript
QiscusSDK.core.getNonce()
        .then((res) => {
        
        // your auth here ...
        // nonce = res.nonce


        }, err => this.setErrorMessage(`Failed getting auth nonce ${err}`));
```
The code above is a sample of method you can implement in your app. By calling `QiscusSDK.core.getNonce()`, you will request `Nonce` from Qiscus SDK server and a `Nonce` will be returned. If it is success, you can request `JWT` from your backend by sending `Nonce` you got from Qiscus SDK Server. 
When you got the `JWT Token`, you can pass that `JWT` to `QiscusSDK.core.verifyIdentityToken` method to allow Qiscus to authenticate your user and return user account through `QiscusSDK.core.setUserWithIdentityToken(Response)`, as shown in the code below :

```javascript
QiscusSDK.core.verifyIdentityToken(response.data.identity_token)
              .then((verifyResponse) => {
              
              QiscusSDK.core.setUserWithIdentityToken(verifyResponse);
              
   }, error => this.setErrorMessage(`Failed Signing In. ${error}`));
   ```

If you are wondering the full implementation of JWT authentication, here is the full code sample:

```javascript
QiscusSDK.core.getNonce()
        .then((res) => {
           // this is your API
          const data = {
            user: {
              app_id: __APP_ID__,
              phone_number: `${this.countryCode}${phone}`,
              passcode: this.passCode,
              nonce: res.nonce,
            },
          };
          axios.post(`${YOUR__API__}auth/verify`, data)
          .then((response) => {
            this.loader = false;
            QiscusSDK.core.verifyIdentityToken(response.data.identity_token)
              .then((verifyResponse) => {
                QiscusSDK.core.setUserWithIdentityToken(verifyResponse);
              }, error => this.setErrorMessage(`Failed Signing In. ${error}`));
          }, () => {
            this.loader = false;
            this.setErrorMessage('Failed Signing In.');
          });
        }, err => this.setErrorMessage(`Failed getting auth nonce ${err}`));
```

### Setting JOSE header and JWT Claim Set in your backend

When your backend returns a JWT after receiving Nonce from your client app, the JWT will be caught by client app and will be forwarded to Qiscus Chat SDK Server. In this phase, Qiscus Chat SDK Server will verify the JWT before returning Qiscus Account for your user. To allow Qiscus Chat SDK Server successfully recognize the JWT, you need to setup Jose Header and JWT claim set in your backend as follow :

**Jose Header :**
```
{
  "alg": "HS256",  // must be HMAC algorithm
  "typ": "JWT", // must be JWT
  "ver": "v2" // must be v2
}
```
**JWT Claim Set :**
```
{
  "iss": "QISCUS SDK APP ID", // your qiscus app id, can obtained from dashboard
  "iat": 1502985644, // current timestamp in unix
  "exp": 1502985704, // An arbitrary time in the future when this token should expire. In epoch/unix time. We encourage you to limit 2 minutes
  "nbf": 1502985644, // current timestamp in unix
  "nce": "nonce", // nonce string as mentioned above
  "prn": "YOUR APP USER ID", // your user identity such as email or id, should be unique and stable
  "name": "displayname", // optional, string for user display name
  "avatar_url": "" // optional, string url of user avatar
}
```
## UI Customization

Qiscus Chat SDK enable you to customize Chat UI as you like. You can modify
colors, change bubble chat design, modify Chat Header, and many more.
There are 2 level of UI customization, Basic and Advance Customization.
For advance customization, you need to posssess enough understanding of CSS.

### Basic UI Customization

#### View Mode

If you want to display your chat as a full width (not as widget), you can
set the mode to wide on init as a parameter, as illustrated in figure below:
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

### Custom Templates
You can provide your own templates for messages which have type of `custom` or `system_events`, the data needed for the template will be acquired from `message.payload` object.

You can define the template while initiating Qiscus Chat SDK.
```
QiscusSDK.core.init({
  AppId: ...,
  options: {},
  // the format is `payload.type`: html template
  // data is provided between curly brackets -> {payload.key.to.get}
  customTemplates: {
    'my-message-type': `<div class="my-message-template">{content.user.name}<strong>{content.user.email}</strong></div>`
  }
});
```

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
