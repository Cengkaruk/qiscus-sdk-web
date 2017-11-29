
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
and functionalities easily. But before dive into it, there are essential basic
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
conversation list UI, for example, you need to create it your own. However,
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

### Qiscus Web Chat SDK

Mobile users increased year after years, but it doesn't mean we can forget
Web App user. There are always people who prefer to work using web apps rather
than mobile app, such as developers, who always code in front of computer,
customer service administrators or agent who always talk with customers
online.

Our Web Chat SDK, for now, supports Chrome 40+, Firefox 48+, and Microsoft Edge.
To start developing your Web App using our Qiscus Chat SDK, You can try our
sample app or you can read our Web Documentation for more details.

## Try Sample App

To meet your expectation, we suggest you to try our sample app. The sample app
is built with full functionalities, so that you can figure out the flow and
main activities of common chat apps. We provide you 2 option to start with the
sample app: Try sample app only and sample app with Backend.

## Try Sample App Only

To run all of the sample code, you need to install Git and NodeJS. Git will
be used to clone the repository so you can play around with the code locally.
NodeJS is needed to install and resolve dependencies to run the Sample App.
You can refer to their respected page for more detail installing them both.

You can download sample directly from out github [here](https://github.com/qiscus/qiscus-sdk-web-sample),
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

### Try Sample App With sample dashboard

If you have your own chat app, you may think how to handle your user. In this
case, we provide sample dashboard for user management. This sample dashboard
can help you to figure out how to work with Qiscus Server Api for more
advance functionalities. You can click [here](https://www.qiscus.com/documentation/rest/list-api)
to know more about Server API.

> Note: We assume that you already downloaded the sample app. The sample app
> will be needed to work together with the sample dashboard.

You can explore the sample dashboard [here](https://dashboard-sample.herokuapp.com)
to try it online, or you also can download the source code to deploy it locally or to
your own server.

To start trying sample dashboard on your end, you should do the following steps:
clone sample dashboard [here](https://github.com/qiscus/dashboard-sample),
or just copy the following code:
```bash
$ git clone https://github.com/qiscus/dashboard-sample.git
$ cd dashboard-sample
```

Before running the sample app on your local, first, you need to install
composer.
```bash
$ composer install
$ php -S localhost:8000
```

Now you have successfully run the sample dashboard. But please be noted that
the sample app is running using our App ID. If you want the sample dashboard
to be connected to your app with your own App ID, you need to change App ID
and Secret Key inside sample dashboard code. You can find your own App ID
and Secret Key in your own Qiscus SDK Dashboard.

If you are wondering how our sample app with dashboard worked, here some
ilustration:
![How Sample Work Illustration](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/1511248325-How+sample+work.png "How Sample Work Illustration")
