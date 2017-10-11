# Try Sample App

To make it easier for you to understand Qiscus Chat SDK, we provide
Sample Apps for Web SDK. Inside this sample you can see our Web SDK power,
try default feature, or UI Customization example. There are two option to try.
First, clone from our [repository](https://github.com/qiscus/qiscus-sdk-web-sample)
and play with sample at your local Computer to have more access to our code so
you can play with it locally but you will still need internet connection to
function properly. You can also play with the example at
[Codepen](sample-app-codepen-link)
for another live example.

In this section you will learn about:
- [Requirement](#requirement)
- [Cloning Sample App](#cloning-sample-app)
- [Try Sample App Online](#try-sample-app-online)

## Requirement

To run all of the sample code, you need to install [Git](git-scm.com) and
[NodeJS](nodejs.com). Git will be used to clone the repository so you can
play around with the code locally and NodeJS to install and resolve
dependencies used to run Sample App. You can refer to their respected page
to know how to install both.
- [git-scm.com](http://git-scm.com)
- [nodejs.org](http://nodejs.org)

## Cloning Sample App

You can download sample app directly from github at
[qiscus/qiscus-sdk-web-sample](http://github.com/qiscus/qiscus-sdk-web-sample) or
if you already install Git you can just clone directly from your command line
```bash
$ git clone https://www.github.com/qiscus/qiscus-sdk-web-sample
```
After cloning finished, you will need to create simple server to run the sample
app. In the example below, we use http-server from nodejs package manager as
http server to serve Sample App locally.
```bash
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
- [UI Customization](link-sample-ui-customization)

> If you inspect thoroughly, we split the sample files into different folders.
> To customize the example go through config folder and set your own configuration
there.

