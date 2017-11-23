
# Try Sample App

To understand Qiscus Chat SDK easier, we provide some Sample Apps. Inside these
samples, you can see our how Qiscus Chat SDK can power your app. You can
directly try some default feature or UI customization. To start with the sample
apps, you can clone from
[repository](https://github.com/qiscus/qiscus-sdk-web-sample) or try the
[live samples](#try-sample-app-online) online via codepen.

In this section you will learn about:
- [Requirement](#requirement)
- [Cloning Sample App](#cloning-sample-app)
- [Try Sample App Online](#try-sample-app-online)

## Requirement
To run all of the sample code, you need to install [Git](http://git-scm.com) and
[NodeJS](http://nodejs.org). Git will be used to clone the repository so you
can play around with the code locally. NodeJS is needed to install and resolve
dependencies to run the Sample App. You can refer to their respected page
for more detail installing them both.
- [git-scm.com](http://git-scm.com)
- [nodejs.org](http://nodejs.org)

## Cloning Sample App
You can download sample directly from our github at
[qiscus/qiscus-sdk-web-sample](http://github.com/qiscus/qiscus-sdk-web-sample)
or if you already installed Git you can just clone directly from your
command line.
```bash
$ git clone https://github.com/qiscus/qiscus-sdk-web-sample.git
```
After cloning finished, you will need to create simple server to run the sample
app. In the example below, we use http-server from nodejs package manager to
serve Sample App locally.
```bash
# Install http-server from npm globally
$ npm install http-server -g
# Choose folder and run Web SDK Sample
$ cd qiscus-sdk-web-sample
$ http-server
```

## Try sample App Online
If You are too busy to clone and do steps above, you can simply try
the sample app online. You can check the sample app from the list below:
- [Default SDK Usage](https://codepen.io/desertlion/pen/MmdRBd)
- [UI Customization](https://codepen.io/desertlion/pen/VWgrQE)

> If you inspect thoroughly, we split the sample files into different folders.
> To customize the example go through config folder and set your own
> configuratiuon there.
