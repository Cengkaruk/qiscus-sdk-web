# SDK v.2.2.6
- Updated readme
- Fix message view doubled

# SDK v.2.2.5
- fix rendering issue in chat message
- fix emoji incorrectly rendered
- some minor ui refinement

# SDK v.1.7.2
- Add notification for SDK events
- Fix broken example when adding wide and widget mode

# SDK v.1.7.1
- Scrolling treshold converted to 170px instead of percentage base
- Fix issue with enter key creating new line when submitting comment
- ScrollToBottom button only showing up when out of treshold range

# SDK v.1.7.0
- Do Scroll but only when the scrollTop position doesn't exceed 90%
- Add scrollToBottom for UI method
- Add payload param to submit comment, so user can post custom comment type
- Add buttons comment type

# SDK v.1.6.1
- Change scrolling behavior so that load more comment working as expected
- Style refinement
- Omit link preview when no meta image attached

# SDK v.1.6.0
- Change behavior of `init` and `setUser`, now user need to init first then call setUser next.
- Disable markdown
- Change styling for comment

# SDK v.1.5.3
- Refine link preview Style
- Fix account linking displaying html, and show the button label based on payload
- Display time for children bubble message

# SDK v.1.5.2
- Add `setTitle` and `setSubTitle` method on `room` Object
- render unprocessed message while waiting for rendering process on message (link, image, etc)

# SDK v.1.5.1
- Fix styling issue when widget mode activated
- SDK now convert emoji shortname to unicode to support android and iOS
- SDK can now read unicode and convert it back to shortname
- Updated documentation

# SDK v.1.5.0
- Updating styling
- Add widget mode on initiation

# SDK v.1.4.8
- Editing Documentation
- Updating Example
- Change Attachment Styling

# SDK v.1.4.7
- Add support for account_linking comment type for bots
- Refining design bubble, colour, etc

# SDK v.1.4.6
- Add Loading indicator on chat window when loading new chat room
- fix issue with cant open file in new tab
- fix styling on emoji and links

# SDK v.1.4.5
- No submit comment if empty string
- Fix bad styling in attachment comment type

# SDK v.1.4.4
- Resize image with height exceeding 100% screen height
- Focus to textinput when changing group room

# SDK v.1.2.2
- Clicking image now open popup overlay instead of opening in new tab
- Group comments with the same `username`
- Add `read` and `delivered` state to comments
- Fix issue with double post
- Add documentation using docsify (check on NPM)
- Make 2 version of SDK files, Core Only Version and Core + Widget View version
