# Try Sample App

To make it easier for you to understand Qiscus Chat SDK, we provide
Sample Apps for Web SDK. Inside this sample you can see our Web SDK power,
try default feature, or UI Customization example. There are two option to try.
First, clone from our [repository](sample-app-repo-link) and play with
sample at your local Computer to have more access to our code so you can play
with it locally but you will still need internet connection to function
properly. You can also play with the example at [Codepen](sample-app-codepen-link)
for another live example.

In this section you will learn about:
- [Requirement](##requirement)
- [Cloning Sample App](##cloning-sample-app)
- [Try Sample App Online](##try-sample-app-online)
- [Experimenting on Sample App](##experimenting-on-sample-app)

## Requirement

To run all of the sample code, you need to Install [Git](git-link)
and [NodeJS](nodejs-link). Git will be used to clone the repository so you can
play around with the code locally and Node JS to install and resolve
dependencies used to run sample App. You can refer to their respected page to
know how to install both.
- [git-scm.com](http://git-scm.com)
- [nodejs.com](http://nodejs.com)

## Cloning Sample App

You can download sample app directly from github at
[qiscus/web-sdk-sample-js](http://github.com/qiscus/web-sdk-sample-js) or
if you already install Git you can just clone directly from your command line
```
$ git clone https://www.github.com/qiscus/web-sdk-sample-js.git
```
After cloning finished, You need to have a simple server to serve example file
so you can play with it. In this example we use `http-server` from nodejs
package manager
```
# Install http-server from npm globally
$ npm install http-server -g

# Choose folder and run Web SDK Sample
$ cd web-sdk-sample-js/default-SDK-usage
$ http-server
```

There are 4 folders inside Web SDK sample App: default-SDK-usage,
Chat-with-chat-list, Event, UI-customization.

## Try Sample App Online

Well, we knew some people do not have time to setup everything on their laptop
or desktop. That's why we also provide online sample. You can check it from the
list below.
- [Default SDK Usage](link-sample-default-sdk-usage)
- [Chat with Chat list](link-sample-chat-with-chat-list)
- [Event Example](link-sample-event-example)
- [UI Customization](link-sample-ui-customization)

## Experimenting on Sample App

If you inspect thoroughly, we split the sample files into different folders.
To customize the example go through config folder and set your own configuration
there.

CSS files are located in assets folders, go to _variables.less to customize
default values for colors, fonts, etc.
