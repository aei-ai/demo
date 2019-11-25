# Demo
Sample code to demo aEi.ai functionality and API

# Steps to try the aEi.ai API
Assuming you would like to simulate a chat between two people:

**1. Open two instances of the index.html (in the `static` folder) in your browser,**

**2. In each of the pages, create a `conversejs.org` chat user as following:**

***NOTE:*** if you already have `conversejs.org` accounts, you can use them here and ignore registration steps.  

  - 2.1. In the chat UI, click on the `Create an Account` link,

  - 2.2. Enter `conversejs.org` in the `provider` text field,

  - 2.3. Click on the `Fetch Registration Form` button,

  - 2.4. Enter a `username` and `password` for the this user,

  - 2.5. Click on `Register` button,

***NOTE:*** users created in this step can be used later

Let's assume you have created two users with `user1@conversejs.org` and `user2@conversejs.org` usernames 

**3. If not automatically logged in, log in for both users in the chat UI,**

**4. In the chat UI of `user1@conversejs.org`, create a new `groupchat` by clicking on the `+` button,**

***NOTE:*** if you already have a `converse.js` groupchat, you can use that here.

  - 4.1. Select a groupchat name ending with `@conference.conversejs.org` such as `myaeitest@conference.conversejs.org`,

  - 4.2. Enter first part of username (`user1` in this example) as `Nikename` in corresponding field,

  - 4.3. Click on `Join` button,

**5. In the new opened widget, invite the other user to groupchat by entering her username (`user2@conversejs.org` in this example) in the `invite` text field and pressing `Enter`,**

**6. Click on `OK` button in the pop-up notice (you don't need to enter any messages),**

**7. Switch to the other browser page with `user2@conversejs.org` chat UI,**

**8. You should have received an invite from `user1!conversejs.org`. Click on `OK` button,**

**9. Enter first part of username (`user2` in this example) as `Nikename` in corresponding field,**

**10. Click on `Enter Groupchat` button,**

**11. Enter "`I am happy`" in chat UI of `user2@conversejs.org`,**

**12. Notice the update in affect model of `user2@conversejs.org` in available charts,**

**13. Switch to the other browser page with `user1@conversejs.org` chat UI,**

**14. Click on the `Refresh data` button,**

**15. Notice the update in affect model of `user1@conversejs.org` as result of other user's utterance,**

**16. Keep chatting between two users and watch the affect updates in charts.**


