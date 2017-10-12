# UI Customization

Tere are 2 level of UI customization, Basic and Advance Customization. For
Advance Customization, you need to possess enough understanding of CSS.

## Basic UI Customization

### View Mode

If you want to display your chat as a full width (not as widget), you can
set the `mode` to `wide` on `init` as a parameter, as figure below:
```javascript
QiscusSDK.core.init({
  AppId: 'YOUR_APP_ID',
  mode: 'wide',
  options: {}
})
```

Here what You will get.
![Wide Mode](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/view-mode-screen.png "Wide Mode")

### Remote Avatar

By default, you will see avatar beside chat bubble. If you want to remove
them, you can do it on the initiation process by setting avatar option. It has
`true` value, which will show the avatar, but you can set it to `false` to
remove the avatar.
```javascript
QiscusSDK.core.init({
  AppId: 'YOUR_APP_ID',
  options: {
    avatar: false
  }
})
```
Here what you will get by passing avatar parameter inside option brackets:
![Without Avatar](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/feature/docs/docs/images/no-avatar.png "No Avatar")

## Advance UI Customization
You can almost change everything you see on the chat UI by customization its
CSS. Here are main CSS selectors being use in Qiscus Chat SDK:

| CSS Properties      | Description                                |
|---------------------|--------------------------------------------|
| .qcw-trigger-button | Button for toggling the chat window        |
| .qcw-container      | Widget window wrapper div                  |
| .qcw-header         | Widget header containing active chat title |

> Please be noted that Qiscus Chat SDK CSS classes is prefixed with qcw-

There are more than just 3 properties that are unlisted in the table above.
You can find more customizable properties in the css file in the sample app,
which you can modify it as you like.

